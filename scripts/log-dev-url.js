const { networkInterfaces } = require("os");

function getLocalNetworkIP() {
  const interfaces = networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    const nets = interfaces[name];
    if (!nets) continue;

    for (const net of nets) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }

  return null;
}

const port = process.env.PORT || 3000;
const lifecycleScript = process.env.npm_lifecycle_script || "";
const useHttps = lifecycleScript.includes("--experimental-https");
const protocol = useHttps ? "https" : "http";
const ip = getLocalNetworkIP();
if (ip) {
  console.log(`\n  Local:   ${protocol}://localhost:${port}`);
  console.log(`  Network: ${protocol}://${ip}:${port}\n`);
} else {
  console.log(`\n  Local: ${protocol}://localhost:${port}\n`);
}
