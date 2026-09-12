// check-repo.ts — Check if GitHub repo exists and has the workflow
import { execSync } from "child_process";

const REPO = "afinalfirnando-source/my-video";

try {
  const result = execSync(`gh repo view ${REPO} --json name,defaultBranchRef,pushedAt -q '.name + " | branch: " + .defaultBranchRef.name'`, {
    encoding: "utf-8",
    stdio: "pipe",
  });
  console.log(`✅ Repo exists: ${result}`);

  // Check if workflow file exists
  try {
    const wf = execSync(`gh api repos/${REPO}/contents/.github/workflows/render-remotion.yml -q '.name' 2>/dev/null`, {
      encoding: "utf-8",
      stdio: "pipe",
    });
    console.log(`✅ Workflow file found: render-remotion.yml`);
  } catch {
    console.log("❌ Workflow file NOT found on GitHub");
  }

  // Check repo contents
  const contents = execSync(`gh api repos/${REPO}/contents/ -q '.[].name' 2>/dev/null`, {
    encoding: "utf-8",
    stdio: "pipe",
  });
  console.log(`\n📁 Repo root contents:`);
  console.log(contents || "(empty)");
} catch (error: any) {
  console.log(`❌ Repo ${REPO} not found or not accessible`);
  console.log("Error:", error.message);
}
