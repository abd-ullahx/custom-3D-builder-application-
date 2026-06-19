<?php
/**
 * One-time setup script for cPanel - creates storage symlink
 * DELETE THIS FILE after running it once!
 */

$publicPath = __DIR__;
$storagePath = dirname(__DIR__) . '/storage/app/public';
$linkPath = $publicPath . '/storage';

echo "<pre style='font-family:monospace; font-size:14px; padding:20px;'>";
echo "=== Storage Link Setup ===\n\n";
echo "Storage source : $storagePath\n";
echo "Link target    : $linkPath\n\n";

// Check if storage source exists
if (!is_dir($storagePath)) {
    echo "❌ Source directory does not exist: $storagePath\n";
    echo "Please make sure storage/app/public/ exists on the server.\n";
    echo "</pre>";
    exit;
}

// If a real directory exists, remove it first
if (is_dir($linkPath) && !is_link($linkPath)) {
    echo "⚠️  Real directory found at $linkPath. Attempting to remove it...\n";
    
    // Recursively delete the directory
    function deleteDirectory($dir) {
        if (!is_dir($dir)) return true;
        $files = array_diff(scandir($dir), ['.', '..']);
        foreach ($files as $file) {
            $path = "$dir/$file";
            if (is_dir($path) && !is_link($path)) {
                deleteDirectory($path);
            } else {
                unlink($path);
            }
        }
        return rmdir($dir);
    }
    
    if (deleteDirectory($linkPath)) {
        echo "✅ Old directory removed successfully.\n\n";
    } else {
        echo "❌ Failed to remove directory. Please manually delete 'public/storage/' via cPanel File Manager, then visit this page again.\n";
        echo "</pre>";
        exit;
    }
}

// If symlink already exists
if (is_link($linkPath)) {
    echo "✅ Symlink already exists at $linkPath\n";
    echo "</pre>";
    exit;
}

// Create the symlink
echo "Creating symlink...\n";
if (symlink($storagePath, $linkPath)) {
    echo "✅ Symlink created successfully!\n\n";
    echo "👉 You can now upload images from the admin panel and they will be accessible.\n";
} else {
    echo "❌ symlink() function is disabled on this server.\n\n";
    echo "--- FALLBACK: Copying files instead ---\n";
    
    // Fallback: copy files from storage/app/public into public/storage
    mkdir($linkPath, 0755, true);
    
    function copyDirectory($src, $dst) {
        if (!is_dir($dst)) mkdir($dst, 0755, true);
        $files = array_diff(scandir($src), ['.', '..']);
        foreach ($files as $file) {
            $srcPath = "$src/$file";
            $dstPath = "$dst/$file";
            if (is_dir($srcPath)) {
                copyDirectory($srcPath, $dstPath);
            } else {
                copy($srcPath, $dstPath);
            }
        }
    }
    
    copyDirectory($storagePath, $linkPath);
    echo "✅ Files copied from storage/app/public → public/storage\n";
    echo "\n⚠️  NOTE: Since symlinks are disabled, newly uploaded images won't auto-appear.\n";
    echo "    You will need to use the 'Sync Storage' approach described below.\n";
}

echo "\n\n⚠️  SECURITY: Delete this file (create_storage_link.php) NOW!\n";
echo "</pre>";
