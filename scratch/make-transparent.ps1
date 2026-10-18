Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Vara3542\.gemini\antigravity-ide\brain\3ddd7e0c-ccca-4bcc-a401-2141afd8b236\.user_uploaded\media_1792219892439.jpg"
$outPath = "d:\dumdum-delivery\public\logo.png"
$assetPath = "d:\dumdum-delivery\src\assets\logo.png"

$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
$w = $bmp.Width
$h = $bmp.Height

# Target background color (cream): R=254, G=252, B=237
$bgR = 254.0
$bgG = 252.0
$bgB = 237.0

# Create 32-bit ARGB bitmap
$transparentBmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Lock bits for fast processing
$rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
$srcData = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$dstData = $transparentBmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$srcScan0 = $srcData.Scan0
$dstScan0 = $dstData.Scan0
$stride = $srcData.Stride
$bytes = [Math]::Abs($stride) * $h

$srcBuffer = New-Object byte[] $bytes
$dstBuffer = New-Object byte[] $bytes

[System.Runtime.InteropServices.Marshal]::Copy($srcScan0, $srcBuffer, 0, $bytes)

# Find content bounding box at the same time
$minX = $w
$maxX = 0
$minY = $h
$maxY = 0

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $idx = ($y * $stride) + ($x * 4)
        $b = [double]$srcBuffer[$idx]
        $g = [double]$srcBuffer[$idx + 1]
        $r = [double]$srcBuffer[$idx + 2]

        # Calculate Euclidean distance to background cream color
        $dist = [Math]::Sqrt([Math]::Pow($r - $bgR, 2) + [Math]::Pow($g - $bgG, 2) + [Math]::Pow($b - $bgB, 2))

        # Alpha thresholding with smooth edge anti-aliasing
        # If distance < 18 -> completely transparent
        # If distance between 18 and 42 -> partial alpha for smooth edges
        # If distance >= 42 -> solid (alpha 255)
        $alpha = 0
        if ($dist -ge 42.0) {
            $alpha = 255
        } elseif ($dist -gt 18.0) {
            $alpha = [int](($dist - 18.0) / (42.0 - 18.0) * 255.0)
        } else {
            $alpha = 0
        }

        # If pixel is part of the graphic, update bounding box
        if ($alpha -gt 30) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }

        # Write to destination buffer (BGRA)
        $dstBuffer[$idx]     = [byte]$b
        $dstBuffer[$idx + 1] = [byte]$g
        $dstBuffer[$idx + 2] = [byte]$r
        $dstBuffer[$idx + 3] = [byte]$alpha
    }
}

[System.Runtime.InteropServices.Marshal]::Copy($dstBuffer, 0, $dstScan0, $bytes)

$bmp.UnlockBits($srcData)
$transparentBmp.UnlockBits($dstData)
$bmp.Dispose()

Write-Output "Content Bounding Box: minX=$minX, maxX=$maxX, minY=$minY, maxY=$maxY"

# Crop to tight content bounding box with a 16px aesthetic margin
$pad = 16
$cropX = [Math]::Max(0, $minX - $pad)
$cropY = [Math]::Max(0, $minY - $pad)
$cropW = [Math]::Min($w - $cropX, ($maxX - $minX) + ($pad * 2))
$cropH = [Math]::Min($h - $cropY, ($maxY - $minY) + ($pad * 2))

$cropRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
$finalBmp = $transparentBmp.Clone($cropRect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$transparentBmp.Dispose()

# Save as high-quality transparent PNG
$finalBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$finalBmp.Save($assetPath, [System.Drawing.Imaging.ImageFormat]::Png)
$finalBmp.Dispose()

Write-Output "Successfully generated transparent PNG logo at: $outPath"
