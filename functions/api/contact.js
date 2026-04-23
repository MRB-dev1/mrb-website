const json = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
  });

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

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
  const to = env.CONTACT_TO_EMAIL || "hello@mrb.ink";

  if (!apiKey || !from) {
    throw new Error("Email provider not configured");
  }

  const lines = formatLines(fields);
  const submitterEmail = String(fields.Email || "").trim();
  const adminEmail = await postResendEmail(apiKey, {
    from,
    to,
    subject: `MRB website inquiry - ${fields.Form || "Contact"}`,
    text: lines.join("\n"),
  });

  let confirmationEmail = { sent: false, reason: "Submitter email missing" };

  if (isValidEmail(submitterEmail)) {
    confirmationEmail = await postResendEmail(apiKey, {
      from,
      to: submitterEmail,
      subject: "MRB received your inquiry",
      text: [
        `Hi ${fields.Name || "there"},`,
        "",
        "MRB has received your message. We will get back to you within 5h-48h.",
        "",
        "Summary:",
        lines.join("\n"),
        "",
        "If you need to add anything, reply to hello@mrb.ink.",
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
  Object.entries(fields)
    .filter(([key, value]) => key !== "website" && String(value).trim())
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
    "Access-Control-Allow-Methods": "POST, OPTIONS",
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

    if (!name || !isValidEmail(email) || !message) {
      return json({ ok: false, message: "Missing required fields" }, 400);
    }

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
