import { readdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to convert filename to proper export name
function getExportName(filename) {
  // Remove .model.js extension and convert to PascalCase
  const baseName = filename.replace(".model.js", "");

  return baseName;
}

// Dynamically import and export all models
const modelFiles = readdirSync(__dirname).filter(
  (file) => file.endsWith(".model.js") && file !== "index.js",
);

// Create exports object
const models = {};

// Import all models dynamically
for (const file of modelFiles) {
  const modulePath = `./${file}`;
  const module = await import(modulePath);
  const exportName = getExportName(file);
  models[exportName] = module.default;
}

// Also export the entire models object for convenience
export default models;
