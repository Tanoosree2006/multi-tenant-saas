import http from "http";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Frontend running ✅");
});

server.listen(3000, "0.0.0.0", () => {
  console.log("✅ Frontend running on port 3000");
});
