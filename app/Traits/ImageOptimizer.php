<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\File;

trait ImageOptimizer
{
    /**
     * Optimize an uploaded image, convert to WebP, resize if necessary, and save it.
     * Can save to standard public Storage disk or direct absolute/public paths.
     *
     * @param UploadedFile $file
     * @param string $destinationDirectory Absolute path (if $isStorage is false) or relative storage path (if $isStorage is true)
     * @param bool $isStorage If true, saves via Storage facade, else saves directly to absolute path
     * @param string $disk The Storage disk to use (only when $isStorage is true)
     * @param int $quality Compression quality (1-100)
     * @param int $maxWidth Max width to resize to
     * @return string Filename (if $isStorage is false) or relative path (if $isStorage is true)
     */
    protected function optimizeAndSave(
        UploadedFile $file,
        string $destinationDirectory,
        bool $isStorage = true,
        string $disk = 'public',
        int $quality = 80,
        int $maxWidth = 1200
    ): string {
        $realPath = $file->getRealPath();
        $info = @getimagesize($realPath);

        // If not a valid image, fallback to standard uploading to prevent errors
        if (!$info) {
            if ($isStorage) {
                return $file->store($destinationDirectory, $disk);
            }
            $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move($destinationDirectory, $fileName);
            return $fileName;
        }

        $mime = $info['mime'];
        $width = $info[0];
        $height = $info[1];

        // Create GD image resource based on mime type
        switch ($mime) {
            case 'image/jpeg':
            case 'image/jpg':
                $image = @imagecreatefromjpeg($realPath);
                break;
            case 'image/png':
                $image = @imagecreatefrompng($realPath);
                if ($image) {
                    imagealphablending($image, false);
                    imagesavealpha($image, true);
                }
                break;
            case 'image/gif':
                $image = @imagecreatefromgif($realPath);
                break;
            case 'image/webp':
                $image = @imagecreatefromwebp($realPath);
                break;
            default:
                $image = null;
        }

        if (!$image) {
            if ($isStorage) {
                return $file->store($destinationDirectory, $disk);
            }
            $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move($destinationDirectory, $fileName);
            return $fileName;
        }

        // Resize if it exceeds the maximum width
        if ($width > $maxWidth) {
            $newWidth = $maxWidth;
            $newHeight = (int) (($height / $width) * $newWidth);

            $resized = imagecreatetruecolor($newWidth, $newHeight);
            if ($mime === 'image/png' || $mime === 'image/gif' || $mime === 'image/webp') {
                imagealphablending($resized, false);
                imagesavealpha($resized, true);
                $transparent = imagecolorallocatealpha($resized, 0, 0, 0, 127);
                imagefill($resized, 0, 0, $transparent);
            }

            imagecopyresampled($resized, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
            imagedestroy($image);
            $image = $resized;
        }

        $fileName = time() . '_' . uniqid() . '.webp';

        if ($isStorage) {
            // Write to a temporary file
            $tempFile = tempnam(sys_get_temp_dir(), 'webp_opt');
            imagewebp($image, $tempFile, $quality);
            imagedestroy($image);

            // Put file via Laravel Storage disk
            $path = Storage::disk($disk)->putFileAs($destinationDirectory, new File($tempFile), $fileName);
            @unlink($tempFile);

            return $path;
        } else {
            // Ensure directory exists
            if (!file_exists($destinationDirectory)) {
                @mkdir($destinationDirectory, 0755, true);
            }
            $targetPath = rtrim($destinationDirectory, '/\\') . DIRECTORY_SEPARATOR . $fileName;

            imagewebp($image, $targetPath, $quality);
            imagedestroy($image);

            return $fileName;
        }
    }
}
