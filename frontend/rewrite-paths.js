import * as fs from "node:fs";
import { spawn } from "node:child_process";

let deployed_url;
let output = "";

// Run the deploy command interactively and capture output
const child = spawn("pnpx", ["wrangler", "pages", "deploy", "dist"], {
  stdio: ["inherit", "pipe", "inherit"],
});

child.stdout.on("data", (data) => {
  output += data.toString();
  process.stdout.write(data); // Echo output to user's terminal
});

child.on("error", (err) => {
  console.error("Deployment failed:", err.message);
  process.exit(1);
});

child.on("close", (code) => {
  if (code !== 0) {
    console.error("Deployment failed with exit code:", code);
    process.exit(code);
  }

  // Extract the last line and deployed URL
  const lines = output.trim().split("\n");
  const lastLine = lines[lines.length - 1];
  const urlMatch = lastLine.match(/https?:\/\/[^\s]+/);
  if (!urlMatch) {
    throw new Error("Could not find deployed URL in wrangler output.");
  }
  deployed_url = urlMatch[0].endsWith("/") ? urlMatch[0] : `${urlMatch[0]}/`;

  // Read the contents of the index.html file
  const indexPath = "dist/index.html";
  const indexContent = fs.readFileSync(indexPath, "utf8");
  // Replace the placeholder with the actual deployed URL
  const updatedContent = indexContent
    .replace(/href="\//g, `href="${deployed_url}`)
    .replace(/src="\//g, `src="${deployed_url}`);
  // Write the updated content back to the index.html file

  const outputPath = process.argv[process.argv.length - 1];
  fs.writeFileSync(outputPath, updatedContent, "utf8");
  // Log the success message
  console.log(
    `Deployed remotely and exported the file ${outputPath} with paths that point to ${deployed_url}`,
  );
});
