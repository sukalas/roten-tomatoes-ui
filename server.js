const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const dotenv = require("dotenv");
dotenv.config();

const PORT = 3000;

const MIME_TYPES = {
  default: "application/octet-stream",
  html: "text/html; charset=UTF-8",
  js: "application/javascript; charset=UTF-8",
  css: "text/css",
  png: "image/png",
  jpg: "image/jpg",
  gif: "image/gif",
  ico: "image/x-icon",
  svg: "image/svg+xml",
};

const STATIC_PATH = path.join(process.cwd(), "./src");

const toBool = [() => true, () => false];

const prepareFile = async (url) => {
  const paths = [STATIC_PATH, url];
  if (url.endsWith("/")) paths.push("index.html");
  const filePath = path.join(...paths);
  const pathTraversal = !filePath.startsWith(STATIC_PATH);
  const exists = await fs.promises.access(filePath).then(...toBool);
  const found = !pathTraversal && exists;
  const streamPath = found ? filePath : STATIC_PATH + "/404.html";
  const ext = path.extname(streamPath).substring(1).toLowerCase();
  const stream = fs.createReadStream(streamPath);
  return { found, ext, stream };
};

const server = http.createServer(async (req, res) => {
  const file = await prepareFile(req.url);
  const statusCode = file.found ? 200 : 404;
  const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
  res.writeHead(statusCode, { "Content-Type": mimeType });
  file.stream.pipe(res);
  console.log(`${req.method} ${req.url} ${statusCode}`);

  if (req.url === "/api/key" && req.method === "GET") {
    // set the status code, and content-type
    res.writeHead(200, { "Content-Type": "text/plain" });
    // send the data
    res.end(JSON.stringify(process.env.API_KEY));
  }
});

server.on("listening", () => {
  console.log(`ok, server is running at: http://127.0.0.1:${PORT}/`);
});

server.listen(PORT);
