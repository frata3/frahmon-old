import fs from "fs";
import path from "path";

function fixImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixImports(fullPath);
    } else if (file.endsWith(".js")) {
      let content = fs.readFileSync(fullPath, "utf-8");
      const fixed = content.replace(/(import\s+.*?\s+from\s+['"])(\.\/.*?)(['"];?)/g, (match, p1, p2, p3) => {
        if (!p2.endsWith(".js")) {
          return p1 + p2 + ".js" + p3;
        }
        return match;
      }).replace(/(export\s+.*?\s+from\s+['"])(\.\/.*?)(['"];?)/g, (match, p1, p2, p3) => {
        if (!p2.endsWith(".js")) {
          return p1 + p2 + ".js" + p3;
        }
        return match;
      });
      if (content !== fixed) {
        fs.writeFileSync(fullPath, fixed, "utf-8");
        console.log(`Fixed imports in ${fullPath}`);
      }
    }
  }
}

// اجرا:
fixImports("./");
