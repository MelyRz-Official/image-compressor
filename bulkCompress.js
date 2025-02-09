const sharp = require("sharp");
const fs = require("fs-extra");
const path = require("path");

// Define input and output directories
const inputDir = path.join(__dirname, "input_images");
const outputDir = path.join(__dirname, "output_images");

const processImages = async (currentInputDir, currentOutputDir) => {
  try {
    // Ensure the output directory exists
    await fs.ensureDir(currentOutputDir);

    // Read the contents of the current input directory
    const entries = await fs.readdir(currentInputDir);

    for (const entry of entries) {
      const inputPath = path.join(currentInputDir, entry);
      const outputPath = path.join(currentOutputDir, entry);

      const stats = await fs.lstat(inputPath);

      if (stats.isDirectory()) {
        // If the entry is a directory, recurse into it
        await processImages(inputPath, outputPath);
      } else if (stats.isFile() && /\.(jpg|jpeg|png)$/i.test(entry)) {
        // If the entry is a valid image file, process it
        console.log(`Processing: ${inputPath}`);

        await sharp(inputPath)
          .resize({ width: 1200 }) // Resize to a max width of 1200px
          .jpeg({ quality: 85 }) // Compress to 85% quality
          .toFile(outputPath);

        console.log(`✔ Saved: ${outputPath}`);
      }
    }
  } catch (err) {
    console.error(`❌ Error processing directory ${currentInputDir}:`, err);
  }
};

// Main function to process all images
const compressImages = async () => {
  console.log(`Starting processing...`);
  console.log(`Input Directory: ${inputDir}`);
  console.log(`Output Directory: ${outputDir}`);

  try {
    await processImages(inputDir, outputDir);
    console.log("✅ All images processed successfully!");
  } catch (err) {
    console.error("❌ Error:", err);
  }
};

// Run the script
compressImages();
