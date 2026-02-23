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
const ip = getLocalNetworkIP();
if (ip) {
  console.log(`\n  Local:   http://localhost:${port}`);
  console.log(`  Network: http://${ip}:${port}\n`);
} else {
  console.log(`\n  Local: http://localhost:${port}\n`);
}
