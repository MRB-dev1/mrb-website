const disposableDomains = require("./data/disposable-email-domains.json");

const SECURITY_FIELD_NAMES = new Set(["website", "cf-turnstile-response"]);

const disposableDomainSet = new Set(
  disposableDomains.map((domain) => String(domain).trim().toLowerCase()).filter(Boolean)
);

const DISPOSABLE_DOMAIN_HINT_PATTERN =
  /\b(10min|disposable|fakeinbox|getnada|guerrillamail|maildrop|mailinator|sharklasers|tempmail|throwaway|trashmail|yopmail)\b/i;

const ATTEMPT_WINDOW_MS = 10 * 60 * 1000;
const HARD_RATE_LIMIT = 8;
const attemptHistory = new Map();
const DEFAULT_BLOCKED_NAME_PATTERNS = ["robertbic"];

const buildBlockedNamePatterns = () => {
  const raw = String(process.env.BLOCKED_NAME_PATTERNS || "")
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

const normalizeEmailDomain = (email) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const atIndex = normalizedEmail.lastIndexOf("@");

  if (atIndex === -1) {
    return "";
  }

  return normalizedEmail.slice(atIndex + 1);
};

const filterVisibleFields = (fields) =>
  Object.fromEntries(
    Object.entries(fields).filter(([key, value]) => !SECURITY_FIELD_NAMES.has(key) && String(value).trim())
  );

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

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

const normalizeName = (name) => String(name || "").toLowerCase().replace(/[^a-z0-9]/g, "");

const isBlockedName = (name) => {
  const normalized = normalizeName(name);
  if (!normalized) {
    return false;
  }
  return buildBlockedNamePatterns().some((pattern) => pattern.test(normalized));
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

const getTurnstileConfig = (env = process.env) => {
  const siteKey = String(env.TURNSTILE_SITE_KEY || "").trim();
  const secretKey = String(env.TURNSTILE_SECRET_KEY || "").trim();

  return {
    enabled: Boolean(siteKey && secretKey),
    siteKey,
    secretKey,
  };
};

const verifyTurnstileToken = async ({ token, remoteIp, env = process.env }) => {
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

module.exports = {
  filterVisibleFields,
  findDisposableEmailDomain,
  getTurnstileConfig,
  isBlockedName,
  isRateLimited,
  isValidEmail,
  recordSubmissionAttempt,
  verifyTurnstileToken,
};
