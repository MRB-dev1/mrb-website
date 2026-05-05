import disposableDomains from "../../data/disposable-email-domains.json";

const ALLOWED_ORIGINS = new Set([
  "https://mrb.ink",
  "https://www.mrb.ink",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

const SECURITY_FIELD_NAMES = new Set(["website", "cf-turnstile-response"]);
const BODY_BYTE_LIMIT = 100_000;
const ATTEMPT_WINDOW_MS = 10 * 60 * 1000;
const HARD_RATE_LIMIT = 8;
const RATE_LIMIT_KEY_PREFIX = "rl:";
const DEFAULT_BLOCKED_NAME_PATTERNS = ["robertbic"];

const disposableDomainSet = new Set(
  disposableDomains.map((domain) => String(domain).trim().toLowerCase()).filter(Boolean)
);
const DISPOSABLE_DOMAIN_HINT_PATTERN =
  /\b(10min|disposable|getnada|guerrillamail|maildrop|mailinator|sharklasers|tempmail|throwaway|trashmail|yopmail)\b/i;

const buildCorsHeaders = (request) => {
  const origin = request.headers.get("origin") || "";
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    Vary: "Origin",
  };
  if (ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
};

const json = (request, payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...buildCorsHeaders(request),
    },
  });

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

const normalizeName = (name) => String(name || "").toLowerCase().replace(/[^a-z0-9]/g, "");

const buildBlockedNamePatterns = (env) => {
  const raw = String(env.BLOCKED_NAME_PATTERNS || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  const sources = raw.length ? raw : DEFAULT_BLOCKED_NAME_PATTERNS;
  return sources
    .map((pattern) => {
      try {
        return new RegExp(pattern, "i");
      } catch (error) {
        return null;
      }
    })
    .filter(Boolean);
};

const isBlockedName = (name, patterns) => {
  const normalized = normalizeName(name);
  if (!normalized) {
    return false;
  }
  return patterns.some((pattern) => pattern.test(normalized));
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

const readKvAttempts = async (kv, identity) => {
  if (!kv || !identity) {
    return [];
  }

  const raw = await kv.get(`${RATE_LIMIT_KEY_PREFIX}${identity}`);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((value) => Number.isFinite(value)) : [];
  } catch (error) {
    return [];
  }
};

const writeKvAttempts = (kv, identity, timestamps) => {
  if (!kv || !identity) {
    return Promise.resolve();
  }

  return kv.put(`${RATE_LIMIT_KEY_PREFIX}${identity}`, JSON.stringify(timestamps), {
    expirationTtl: Math.ceil(ATTEMPT_WINDOW_MS / 1000),
  });
};

const buildIdentityKeys = ({ ip, email }) => {
  const keys = [];
  const ipKey = ip ? `ip:${String(ip).trim().toLowerCase()}` : "";
  const emailKey = email ? `email:${String(email).trim().toLowerCase()}` : "";
  if (ipKey) keys.push(ipKey);
  if (emailKey) keys.push(emailKey);
  return keys;
};

const checkRateLimit = async ({ kv, ip, email }, nowMs = Date.now()) => {
  if (!kv) {
    return { limited: false, snapshot: new Map(), kvAvailable: false };
  }

  const identities = buildIdentityKeys({ ip, email });
  const cutoff = nowMs - ATTEMPT_WINDOW_MS;

  const entries = await Promise.all(
    identities.map(async (identity) => {
      const raw = await readKvAttempts(kv, identity);
      const recent = raw.filter((timestamp) => timestamp > cutoff);
      return [identity, recent];
    })
  );

  const snapshot = new Map(entries);
  const limited = entries.some(([, recent]) => recent.length >= HARD_RATE_LIMIT);

  return { limited, snapshot, kvAvailable: true };
};

const recordRateLimitAttempt = async ({ kv, ip, email, snapshot }, nowMs = Date.now()) => {
  if (!kv) {
    return;
  }

  const identities = buildIdentityKeys({ ip, email });
  await Promise.all(
    identities.map((identity) => {
      const previous = snapshot.get(identity) || [];
      return writeKvAttempts(kv, identity, [...previous, nowMs]);
    })
  );
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

const readBoundedBody = async (request, maxBytes) => {
  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader) {
    const declared = Number(contentLengthHeader);
    if (Number.isFinite(declared) && declared > maxBytes) {
      const error = new Error("Body exceeds size limit");
      error.code = "BODY_TOO_LARGE";
      throw error;
    }
  }

  const reader = request.body?.getReader();
  if (!reader) {
    return "";
  }

  const chunks = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    total += value.byteLength;
    if (total > maxBytes) {
      try {
        await reader.cancel();
      } catch (error) {
        // Ignore cancel errors — the limit response is what matters.
      }
      const error = new Error("Body exceeds size limit");
      error.code = "BODY_TOO_LARGE";
      throw error;
    }
    chunks.push(value);
  }

  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder("utf-8").decode(merged);
};

const parseFields = async (request) => {
  const raw = await readBoundedBody(request, BODY_BYTE_LIMIT);
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return JSON.parse(raw || "{}");
  }

  return Object.fromEntries(new URLSearchParams(raw).entries());
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

export const onRequestOptions = async ({ request }) =>
  new Response(null, {
    status: 204,
    headers: buildCorsHeaders(request),
  });

export const onRequestGet = async ({ request, env }) => {
  const turnstile = getTurnstileConfig(env);
  return json(request, {
    ok: true,
    turnstile: {
      enabled: turnstile.enabled,
      siteKey: turnstile.enabled ? turnstile.siteKey : "",
    },
  });
};

export const onRequestPost = async ({ request, env }) => {
  try {
    let fields;
    try {
      fields = await parseFields(request);
    } catch (error) {
      if (error && error.code === "BODY_TOO_LARGE") {
        return json(request, { ok: false, message: "Submission too large" }, 413);
      }
      return json(request, { ok: false, message: "Invalid request body" }, 400);
    }

    if (fields.website) {
      return json(request, { ok: true });
    }

    const name = String(fields.Name || "").trim();
    const email = String(fields.Email || "").trim();
    const message = String(fields.Message || fields["Project summary"] || "").trim();
    const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "";
    const turnstile = getTurnstileConfig(env);
    const blockedPatterns = buildBlockedNamePatterns(env);

    if (!name || !isValidEmail(email) || !message) {
      return json(request, { ok: false, message: "Missing required fields" }, 400);
    }

    if (isBlockedName(name, blockedPatterns)) {
      return json(
        request,
        {
          ok: false,
          message: "This contact submission was blocked.",
        },
        403
      );
    }

    if (findDisposableEmailDomain(email)) {
      return json(
        request,
        {
          ok: false,
          message: "Temporary or disposable email addresses are not accepted. Use your real email instead.",
        },
        400
      );
    }

    const rateLimit = await checkRateLimit({ kv: env.RATE_LIMIT_KV, ip, email });
    if (rateLimit.limited) {
      await recordRateLimitAttempt({
        kv: env.RATE_LIMIT_KV,
        ip,
        email,
        snapshot: rateLimit.snapshot,
      });
      return json(
        request,
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
        request,
        {
          ok: false,
          message: "Could not verify the Cloudflare Turnstile check right now. Please try again.",
        },
        502
      );
    }

    if (turnstile.enabled && !turnstileResult.success) {
      return json(
        request,
        {
          ok: false,
          message: "Please complete the Cloudflare Turnstile check before sending.",
          errors: turnstileResult["error-codes"] || [],
        },
        400
      );
    }

    await recordRateLimitAttempt({
      kv: env.RATE_LIMIT_KV,
      ip,
      email,
      snapshot: rateLimit.snapshot,
    });

    const results = await Promise.allSettled([sendEmail(fields, env), sendDiscord(fields, env)]);
    const emailResult =
      results[0].status === "fulfilled" ? results[0].value : { sent: false, reason: results[0].reason.message };
    const discordResult =
      results[1].status === "fulfilled" ? results[1].value : { sent: false, reason: results[1].reason.message };

    if (!emailResult.sent && !discordResult.sent) {
      throw new Error("No delivery method configured");
    }

    return json(request, {
      ok: true,
      email: emailResult,
      discord: discordResult,
    });
  } catch (error) {
    return json(request, { ok: false, message: "Could not process inquiry" }, 500);
  }
};
