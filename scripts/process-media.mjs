import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const manifestPath = process.argv[2];

if (!manifestPath) {
    throw new Error('A media processing manifest path is required.');
}

const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));

await fs.mkdir(manifest.outputDirectory, { recursive: true });

const results = [];

for (const [key, variant] of Object.entries(manifest.variants)) {
    const filename = `${key}.webp`;
    const outputPath = path.join(manifest.outputDirectory, filename);
    const pipeline = sharp(manifest.source, {
        failOn: 'error',
        limitInputPixels: 80_000_000,
    }).rotate();

    if (variant.height) {
        pipeline.resize({
            width: variant.width,
            height: variant.height,
            fit: 'cover',
            withoutEnlargement: true,
        });
    } else {
        pipeline.resize({
            width: variant.width,
            withoutEnlargement: true,
        });
    }

    const info = await pipeline.webp({ quality: manifest.quality }).toFile(outputPath);
    const stats = await fs.stat(outputPath);

    results.push({
        key,
        filename,
        width: info.width,
        height: info.height,
        bytes: stats.size,
    });
}

process.stdout.write(JSON.stringify({ variants: results }));
