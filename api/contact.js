const {
  filterVisibleFields,
  findDisposableEmailDomain,
  getTurnstileConfig,
  isBlockedName,
  isRateLimited,
  isValidEmail,
  recordSubmissionAttempt,
  verifyTurnstileToken,
} = require("../contact-security");

const sendJson = (res, status, payload) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.end(JSON.stringify(payload));
};

const sendConfig = (res) => {
  const turnstile = getTurnstileConfig(process.env);

  sendJson(res, 200, {
    ok: true,
    turnstile: {
      enabled: turnstile.enabled,
      siteKey: turnstile.enabled ? turnstile.siteKey : "",
    },
  });
};

const parseBody = (req) =>
  new Promise((resolve, reject) => {
    let rawBody = "";

    req.on("data", (chunk) => {
      rawBody += chunk;

      if (rawBody.length > 100_000) {
        reject(new Error("Body too large"));
        req.destroy();
      }
    });

    req.on("end", () => {
      const contentType = req.headers["content-type"] || "";

      if (contentType.includes("application/json")) {
        resolve(JSON.parse(rawBody || "{}"));
        return;
      }

      resolve(Object.fromEntries(new URLSearchParams(rawBody)));
    });
    req.on("error", reject);
  });

const postResendEmail = async (apiKey, payload) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Email provider returned ${response.status}`);
  }

  return { sent: true };
};

const sendEmail = async (fields) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || "Robin@mrb.ink";

  if (!apiKey || !from) {
    throw new Error("Email provider not configured");
  }

  const visibleFields = filterVisibleFields(fields);
  const lines = Object.entries(visibleFields).map(([key, value]) => `${key}: ${value}`);
  const submitterEmail = String(visibleFields.Email || "").trim();
  const adminEmail = await postResendEmail(apiKey, {
      from,
      to,
      subject: `MRB website inquiry - ${visibleFields.Form || "Contact"}`,
      text: lines.join("\n"),
  });

  let confirmationEmail = { sent: false, reason: "Submitter email missing" };

  if (isValidEmail(submitterEmail)) {
    confirmationEmail = await postResendEmail(apiKey, {
      from,
      to: submitterEmail,
      subject: "MRB received your inquiry",
      text: [
        `Hi ${visibleFields.Name || "there"},`,
        "",
        "MRB has received your message. We will get back to you within 5h-48h.",
        "",
        "Summary:",
        lines.join("\n"),
        "",
        "If you need to add anything, reply to Robin@mrb.ink.",
        "",
        "MRB",
      ].join("\n"),
    });
  }

  return {
    sent: adminEmail.sent || confirmationEmail.sent,
    admin: adminEmail,
    confirmation: confirmationEmail,
  };
};

const formatDiscordFields = (fields) =>
  Object.entries(filterVisibleFields(fields))
    .slice(0, 12)
    .map(([key, value]) => ({
      name: key,
      value: String(value).slice(0, 1024),
      inline: false,
    }));

const sendDiscord = async (fields) => {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  const mentionRoleId = process.env.DISCORD_MENTION_ROLE_ID || "1496844933431037952";

  if (!webhookUrl) {
    throw new Error("Discord webhook not configured");
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: mentionRoleId ? `<@&${mentionRoleId}> New website inquiry needs review.` : undefined,
      username: "MRB Website",
      allowed_mentions: mentionRoleId ? { roles: [mentionRoleId] } : { parse: [] },
      embeds: [
        {
          title: `New MRB inquiry - ${fields.Form || "Website inquiry"}`,
          color: 0xf7f7f2,
          fields: formatDiscordFields(fields),
          timestamp: new Date().toISOString(),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Discord returned ${response.status}`);
  }

  return { sent: true };
};

module.exports = async (req, res) => {
  if (req.method === "GET") {
    sendConfig(res);
    return;
  }

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    sendJson(res, 405, { ok: false, message: "Method not allowed" });
    return;
  }

  try {
    const fields = await parseBody(req);

    if (fields.website) {
      sendJson(res, 200, { ok: true });
      return;
    }

    const name = String(fields.Name || "").trim();
    const email = String(fields.Email || "").trim();
    const message = String(fields.Message || fields["Project summary"] || "").trim();
    const requestIp = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress;
    const turnstile = getTurnstileConfig(process.env);

    if (!name || !isValidEmail(email) || !message) {
      sendJson(res, 400, { ok: false, message: "Missing required fields" });
      return;
    }

    if (isBlockedName(name)) {
      sendJson(res, 403, {
        ok: false,
        message: "This contact submission was blocked.",
      });
      return;
    }

    if (findDisposableEmailDomain(email)) {
      sendJson(res, 400, {
        ok: false,
        message: "Temporary or disposable email addresses are not accepted. Use your real email instead.",
      });
      return;
    }

    const rateLimit = isRateLimited({ ip: requestIp, email });
    if (rateLimit.limited) {
      recordSubmissionAttempt({ ip: requestIp, email });
      sendJson(res, 429, {
        ok: false,
        message: "Too many contact attempts from this connection. Please try again a bit later.",
      });
      return;
    }

    let turnstileResult = { success: true, skipped: true };
    try {
      turnstileResult = await verifyTurnstileToken({
        token: fields["cf-turnstile-response"],
        remoteIp: requestIp,
        env: process.env,
      });
    } catch (error) {
      sendJson(res, 502, {
        ok: false,
        message: "Could not verify the Cloudflare Turnstile check right now. Please try again.",
      });
      return;
    }

    if (turnstile.enabled && !turnstileResult.success) {
      sendJson(res, 400, {
        ok: false,
        message: "Please complete the Cloudflare Turnstile check before sending.",
        errors: turnstileResult["error-codes"] || [],
      });
      return;
    }

    recordSubmissionAttempt({ ip: requestIp, email });

    const results = await Promise.allSettled([sendEmail(fields), sendDiscord(fields)]);
    const emailResult =
      results[0].status === "fulfilled" ? results[0].value : { sent: false, reason: results[0].reason.message };
    const discordResult =
      results[1].status === "fulfilled" ? results[1].value : { sent: false, reason: results[1].reason.message };

    if (!emailResult.sent && !discordResult.sent) {
      throw new Error("No delivery method configured");
    }

    sendJson(res, 200, {
      ok: true,
      email: emailResult,
      discord: discordResult,
    });
  } catch (error) {
    sendJson(res, 500, {
      ok: false,
      message: "Could not process inquiry",
    });
  }
};
