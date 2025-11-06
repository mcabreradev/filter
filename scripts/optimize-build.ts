import { readdirSync, statSync, unlinkSync } from 'fs';
import { join } from 'path';

const buildDir = join(process.cwd(), 'build');

function getDirectorySize(dirPath: string): number {
  let size = 0;
  const files = readdirSync(dirPath);

  for (const file of files) {
    const filePath = join(dirPath, file);
    const stats = statSync(filePath);

    if (stats.isDirectory()) {
      size += getDirectorySize(filePath);
    } else {
      size += stats.size;
    }
  }

  return size;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function removeTestFiles(dirPath: string): number {
  let removed = 0;
  const files = readdirSync(dirPath);

  for (const file of files) {
    const filePath = join(dirPath, file);
    const stats = statSync(filePath);

    if (stats.isDirectory()) {
      removed += removeTestFiles(filePath);
    } else if (
      file.endsWith('.test.js') ||
      file.endsWith('.test.d.ts') ||
      file.endsWith('.spec.js') ||
      file.endsWith('.spec.d.ts')
    ) {
      unlinkSync(filePath);
      console.log(`  ✓ Removed: ${file}`);
      removed++;
    }
  }

  return removed;
}

function removeSourceMaps(dirPath: string): number {
  let removed = 0;
  const files = readdirSync(dirPath);

  for (const file of files) {
    const filePath = join(dirPath, file);
    const stats = statSync(filePath);

    if (stats.isDirectory()) {
      removed += removeSourceMaps(filePath);
    } else if (file.endsWith('.js.map') || file.endsWith('.d.ts.map')) {
      unlinkSync(filePath);
      console.log(`  ✓ Removed: ${file}`);
      removed++;
    }
  }

  return removed;
}

console.log('\n🔍 Analyzing build output...\n');

const initialSize = getDirectorySize(buildDir);
console.log(`📦 Initial build size: ${formatBytes(initialSize)}\n`);

console.log('🧹 Removing test files...');
const testFilesRemoved = removeTestFiles(buildDir);
console.log(`  ${testFilesRemoved} test files removed\n`);

console.log('🗺️  Removing source maps...');
const sourceMapsRemoved = removeSourceMaps(buildDir);
console.log(`  ${sourceMapsRemoved} source maps removed\n`);

const finalSize = getDirectorySize(buildDir);
const saved = initialSize - finalSize;
const percentage = initialSize > 0 ? ((saved / initialSize) * 100).toFixed(2) : '0';

console.log('✅ Optimization complete!');
console.log(`📦 Final build size: ${formatBytes(finalSize)}`);
console.log(`💾 Saved: ${formatBytes(saved)} (${percentage}%)\n`);
