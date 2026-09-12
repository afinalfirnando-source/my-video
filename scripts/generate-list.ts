import { execSync } from "child_process";

const main = () => {
  console.log("\nListing all available compositions...\n");
  
  try {
    execSync("npx remotion compositions", { stdio: "inherit", cwd: process.cwd() });
  } catch (error) {
    console.error("Failed to list compositions");
    process.exit(1);
  }
};

main();
