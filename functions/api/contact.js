import disposableDomains from "../../data/disposable-email-domains.json";

const json = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    },
  });

const SECURITY_FIELD_NAMES = new Set(["website", "cf-turnstile-response"]);
const disposableDomainSet = new Set(
  disposableDomains.map((domain) => String(domain).trim().toLowerCase()).filter(Boolean)
);
const DISPOSABLE_DOMAIN_HINT_PATTERN =
  /\b(10min|disposable|getnada|guerrillamail|maildrop|mailinator|sharklasers|tempmail|throwaway|trashmail|yopmail)\b/i;
const ATTEMPT_WINDOW_MS = 10 * 60 * 1000;
const HARD_RATE_LIMIT = 8;
const attemptHistory = new Map();

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
const normalizeName = (name) => String(name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
const isBlockedName = (name) => {
  const rawName = String(name || "").trim();
  const normalizedName = normalizeName(rawName);

  return /robertbic/i.test(rawName) || /robertbic/i.test(normalizedName);
};

const filterVisibleFields = (fields) =>
  Object.fromEntries(
    Object.entries(fields).filter(([key, value]) => !SECURITY_FIELD_NAMES.has(key) && String(value).trim())
  );

const normalizeEmailDomain = (email) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const atIndex = normalizedEmail.lastIndexOf("@");

  if (atIndex === -1) {
    return "";
  }

  return normalizedEmail.slice(atIndex + 1);
};

const findDisposableEmailDomain = (email) => {
  const domain = normalizeEmailDomain(email);

  if (!domain) {
    return "";
  }

  const parts = domain.split(".");
  for (let index = 0; index < parts.length - 1; index += 1) {
    const candidate = parts.slice(index).join(".");
    if (disposableDomainSet.has(candidate)) {
      return candidate;
    }
  }

  return DISPOSABLE_DOMAIN_HINT_PATTERN.test(domain) ? domain : "";
};

const getTurnstileConfig = (env) => {
  const siteKey = String(env.TURNSTILE_SITE_KEY || "").trim();
  const secretKey = String(env.TURNSTILE_SECRET_KEY || "").trim();

  return {
    enabled: Boolean(siteKey && secretKey),
    siteKey,
    secretKey,
  };
};

const pruneAttemptHistory = (nowMs = Date.now()) => {
  attemptHistory.forEach((timestamps, key) => {
    const recent = timestamps.filter((timestamp) => nowMs - timestamp <= ATTEMPT_WINDOW_MS);

    if (recent.length) {
      attemptHistory.set(key, recent);
      return;
    }

    attemptHistory.delete(key);
  });
};

const getAttemptCount = (key, nowMs = Date.now()) => {
  if (!key) {
    return 0;
  }

  pruneAttemptHistory(nowMs);
  return attemptHistory.get(key)?.length || 0;
};

const recordSubmissionAttempt = ({ ip, email }, nowMs = Date.now()) => {
  const keys = [
    ip ? `ip:${String(ip).trim().toLowerCase()}` : "",
    email ? `email:${String(email).trim().toLowerCase()}` : "",
  ].filter(Boolean);

  pruneAttemptHistory(nowMs);
  keys.forEach((key) => {
    const timestamps = attemptHistory.get(key) || [];
    timestamps.push(nowMs);
    attemptHistory.set(key, timestamps);
  });
};

const isRateLimited = ({ ip, email }, nowMs = Date.now()) => {
  const ipAttempts = getAttemptCount(ip ? `ip:${String(ip).trim().toLowerCase()}` : "", nowMs);
  const emailAttempts = getAttemptCount(email ? `email:${String(email).trim().toLowerCase()}` : "", nowMs);

  return {
    limited: ipAttempts >= HARD_RATE_LIMIT || emailAttempts >= HARD_RATE_LIMIT,
    ipAttempts,
    emailAttempts,
  };
};

const verifyTurnstileToken = async ({ token, remoteIp, env }) => {
  const { enabled, secretKey } = getTurnstileConfig(env);

  if (!enabled) {
    return { success: true, skipped: true };
  }

  const normalizedToken = String(token || "").trim();

  if (!normalizedToken) {
    return {
      success: false,
      "error-codes": ["missing-input-response"],
    };
  }

  const body = new URLSearchParams({
    secret: secretKey,
    response: normalizedToken,
  });

  if (remoteIp) {
    body.set("remoteip", String(remoteIp));
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`Turnstile verification returned ${response.status}`);
  }

  return response.json();
};

const parseFields = async (request) => {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  const formData = await request.formData();
  return Object.fromEntries(formData.entries());
};

const formatLines = (fields) => Object.entries(fields).map(([key, value]) => `${key}: ${value}`);

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

const sendEmail = async (fields, env) => {
  const apiKey = env.RESEND_API_KEY;
  const from = env.CONTACT_FROM_EMAIL;
  const to = env.CONTACT_TO_EMAIL || "Robin@mrb.ink";

  if (!apiKey || !from) {
    throw new Error("Email provider not configured");
  }

  const visibleFields = filterVisibleFields(fields);
  const lines = formatLines(visibleFields);
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

const sendDiscord = async (fields, env) => {
  const webhookUrl = env.DISCORD_WEBHOOK_URL;
  const mentionRoleId = env.DISCORD_MENTION_ROLE_ID || "1496844933431037952";

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

export const onRequestOptions = async () => new Response(null, {
  status: 204,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  },
});

export const onRequestGet = async ({ env }) =>
  json({
    ok: true,
    turnstile: {
      enabled: getTurnstileConfig(env).enabled,
      siteKey: getTurnstileConfig(env).enabled ? getTurnstileConfig(env).siteKey : "",
    },
  });

export const onRequestPost = async ({ request, env }) => {
  try {
    const fields = await parseFields(request);

    if (fields.website) {
      return json({ ok: true });
    }

    const name = String(fields.Name || "").trim();
    const email = String(fields.Email || "").trim();
    const message = String(fields.Message || fields["Project summary"] || "").trim();
    const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "";
    const turnstile = getTurnstileConfig(env);

    if (!name || !isValidEmail(email) || !message) {
      return json({ ok: false, message: "Missing required fields" }, 400);
    }

    if (isBlockedName(name)) {
      return json(
        {
          ok: false,
          message: "This contact submission was blocked.",
        },
        403
      );
    }

    if (findDisposableEmailDomain(email)) {
      return json(
        {
          ok: false,
          message: "Temporary or disposable email addresses are not accepted. Use your real email instead.",
        },
        400
      );
    }

    const rateLimit = isRateLimited({ ip, email });
    if (rateLimit.limited) {
      recordSubmissionAttempt({ ip, email });
      return json(
        {
          ok: false,
          message: "Too many contact attempts from this connection. Please try again a bit later.",
        },
        429
      );
    }

    let turnstileResult = { success: true, skipped: true };
    try {
      turnstileResult = await verifyTurnstileToken({
        token: fields["cf-turnstile-response"],
        remoteIp: ip,
        env,
      });
    } catch (error) {
      return json(
        {
          ok: false,
          message: "Could not verify the Cloudflare Turnstile check right now. Please try again.",
        },
        502
      );
    }

    if (turnstile.enabled && !turnstileResult.success) {
      return json(
        {
          ok: false,
          message: "Please complete the Cloudflare Turnstile check before sending.",
          errors: turnstileResult["error-codes"] || [],
        },
        400
      );
    }

    recordSubmissionAttempt({ ip, email });

    const results = await Promise.allSettled([sendEmail(fields, env), sendDiscord(fields, env)]);
    const emailResult =
      results[0].status === "fulfilled" ? results[0].value : { sent: false, reason: results[0].reason.message };
    const discordResult =
      results[1].status === "fulfilled" ? results[1].value : { sent: false, reason: results[1].reason.message };

    if (!emailResult.sent && !discordResult.sent) {
      throw new Error("No delivery method configured");
    }

    return json({
      ok: true,
      email: emailResult,
      discord: discordResult,
    });
  } catch (error) {
    return json({ ok: false, message: "Could not process inquiry" }, 500);
  }
};
