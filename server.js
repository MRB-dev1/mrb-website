const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const loadLocalEnv = () => {
  const envPath = path.join(__dirname, ".env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const separator = trimmed.indexOf("=");

    if (separator === -1) {
      return;
    }

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
};

loadLocalEnv();

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
const SAFE_ROOT = path.resolve(ROOT);
const DATA_DIR = path.join(ROOT, "data");
const SUBMISSIONS_FILE = path.join(DATA_DIR, "inquiries.jsonl");

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
};

const sendJson = (res, status, payload) => {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  });
  res.end(JSON.stringify(payload));
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;

      if (body.length > 100_000) {
        reject(new Error("Body too large"));
        req.destroy();
      }
    });

    req.on("end", () => resolve(body));
    req.on("error", reject);
  });

const parseSubmission = (rawBody, contentType = "") => {
  if (contentType.includes("application/json")) {
    return JSON.parse(rawBody || "{}");
  }

  return Object.fromEntries(new URLSearchParams(rawBody));
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

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

const sendEmailIfConfigured = async (submission) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || "Robin@mrb.ink";

  if (!apiKey || !from) {
    return { sent: false, reason: "Email provider not configured" };
  }

  const lines = Object.entries(submission.fields).map(([key, value]) => `${key}: ${value}`);
  const submitterEmail = String(submission.fields.Email || "").trim();
  const adminEmail = await postResendEmail(apiKey, {
      from,
      to,
      subject: `MRB website inquiry - ${submission.fields.Form || "Contact"}`,
      text: lines.join("\n"),
  });

  let confirmationEmail = { sent: false, reason: "Submitter email missing" };

  if (isValidEmail(submitterEmail)) {
    confirmationEmail = await postResendEmail(apiKey, {
      from,
      to: submitterEmail,
      subject: "MRB received your inquiry",
      text: [
        `Hi ${submission.fields.Name || "there"},`,
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
  Object.entries(fields)
    .filter(([key, value]) => key !== "website" && String(value).trim())
    .slice(0, 12)
    .map(([key, value]) => ({
      name: key,
      value: String(value).slice(0, 1024),
      inline: false,
    }));

const sendDiscordIfConfigured = async (submission) => {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  const mentionRoleId = process.env.DISCORD_MENTION_ROLE_ID || "1496844933431037952";

  if (!webhookUrl) {
    return { sent: false, reason: "Discord webhook not configured" };
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
          title: `New MRB inquiry - ${submission.fields.Form || "Website inquiry"}`,
          color: 0xf7f7f2,
          fields: formatDiscordFields(submission.fields),
          footer: { text: `Submission ${submission.id}` },
          timestamp: submission.createdAt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Discord returned ${response.status}`);
  }

  return { sent: true };
};

const handleContact = async (req, res) => {
  try {
    const rawBody = await readBody(req);
    const fields = parseSubmission(rawBody, req.headers["content-type"] || "");

    if (fields.website) {
      return sendJson(res, 200, { ok: true });
    }

    const name = String(fields.Name || "").trim();
    const email = String(fields.Email || "").trim();
    const message = String(fields.Message || fields["Project summary"] || "").trim();

    if (!name || !isValidEmail(email) || !message) {
      return sendJson(res, 400, { ok: false, message: "Missing required fields" });
    }

    const submission = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ip: req.socket.remoteAddress,
      fields,
    };

    await fs.promises.mkdir(DATA_DIR, { recursive: true });
    await fs.promises.appendFile(SUBMISSIONS_FILE, `${JSON.stringify(submission)}\n`, "utf8");

    let emailResult = { sent: false };
    try {
      emailResult = await sendEmailIfConfigured(submission);
    } catch (error) {
      emailResult = { sent: false, reason: error.message };
    }

    let discordResult = { sent: false };
    try {
      discordResult = await sendDiscordIfConfigured(submission);
    } catch (error) {
      discordResult = { sent: false, reason: error.message };
    }

    sendJson(res, 200, {
      ok: true,
      id: submission.id,
      email: emailResult,
      discord: discordResult,
    });
  } catch (error) {
    sendJson(res, 500, { ok: false, message: "Could not process inquiry" });
  }
};

const serveStatic = (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = decodeURIComponent(requestUrl.pathname);
  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const filePath = path.resolve(ROOT, relativePath);

  if (filePath !== SAFE_ROOT && !filePath.startsWith(`${SAFE_ROOT}${path.sep}`)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=86400",
    });

    if (req.method === "HEAD") {
      res.end();
      return;
    }

    fs.createReadStream(filePath).pipe(res);
  });
};

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);

  if (requestUrl.pathname === "/api/contact" && req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    });
    res.end();
    return;
  }

  if (req.method === "POST" && requestUrl.pathname === "/api/contact") {
    handleContact(req, res);
    return;
  }

  if (req.method === "GET" || req.method === "HEAD") {
    serveStatic(req, res);
    return;
  }

  res.writeHead(405, { Allow: "GET, HEAD, POST" });
  res.end("Method not allowed");
});

server.listen(PORT, () => {
  console.log(`MRB site running at http://localhost:${PORT}`);
});
