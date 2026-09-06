import { execSync } from "child_process";
import { mkdirSync } from "fs";
import path from "path";

const OUTPUT_DIR = path.resolve("out");
mkdirSync(OUTPUT_DIR, { recursive: true });

const variations = [
  { title: "BREAKING NEWS", subtitle: "Corporate News Update", brandColor: "#EF4444", style: "corporate", backgroundColor: "#0F172A" },
  { title: "EXCLUSIVE", subtitle: "Market Reports", brandColor: "#10B981", style: "modern", backgroundColor: "#0F172A" },
  { title: "LIVE UPDATE", subtitle: "Breaking Now", brandColor: "#3B82F6", style: "minimal", backgroundColor: "#FFFFFF" },
  { title: "MARKET ALERT", subtitle: "Financial Update", brandColor: "#F59E0B", style: "corporate", backgroundColor: "#0F172A" },
  { title: "TECH INSIGHT", subtitle: "Weekly Roundup", brandColor: "#8B5CF6", style: "modern", backgroundColor: "#0F172A" },
];

let completed = 0;
for (const v of variations) {
  const slug = v.brandColor.replace("#", "").toLowerCase();
  const outPath = path.join(OUTPUT_DIR, `lowerc-third-${v.style}-${slug}.mov`);

  const inputProps = JSON.stringify({
    title: v.title,
    subtitle: v.subtitle,
    brandColor: v.brandColor,
    style: v.style,
    backgroundColor: v.backgroundColor,
  });

  try {
    execSync(
      `npx remotion render LowerThird "${outPath}" --codec=prores --props='${inputProps.replace(/'/g, "'\\''")}'`,
      {
        stdio: "inherit",
        cwd: process.cwd(),
      }
    );
    completed++;
    console.log(`\n✓ ${v.title} -> ${outPath} (${completed}/${variations.length})`);
  } catch (err) {
    console.error(`✗ Failed: ${v.title}`, err);
  }
}

console.log(`\nAll ${completed}/${variations.length} variations rendered to ${OUTPUT_DIR}`);
