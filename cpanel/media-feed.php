<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$baseUrl = 'https://meladmedia.michaelkumsa.com';
$imagesDir = __DIR__ . '/images';
$videosDir = __DIR__ . '/videos';

function toTitle($filename) {
    $name = preg_replace('/\.[^.]+$/', '', $filename);
    $name = str_replace(array('-', '_'), ' ', $name);
    return ucwords(trim($name));
}

function listFilesByExt($dir, $exts) {
    $items = array();
    if (!is_dir($dir)) {
        return $items;
    }

    $files = scandir($dir);
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') {
            continue;
        }
        $fullPath = $dir . DIRECTORY_SEPARATOR . $file;
        if (!is_file($fullPath)) {
            continue;
        }
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if (!in_array($ext, $exts, true)) {
            continue;
        }
        $items[] = $file;
    }
    sort($items, SORT_NATURAL | SORT_FLAG_CASE);
    return $items;
}

$imageFiles = listFilesByExt($imagesDir, array('jpg', 'jpeg', 'png', 'webp'));
$videoFiles = listFilesByExt($videosDir, array('mp4', 'm4v', 'mov'));

$galleryItems = array();
foreach ($imageFiles as $index => $file) {
    $id = 'img_' . ($index + 1);
    $galleryItems[] = array(
        'id' => $id,
        'title' => toTitle($file),
        'image' => $baseUrl . '/images/' . rawurlencode($file)
    );
}

$onlineVideos = array();
foreach ($videoFiles as $index => $file) {
    $id = 'v' . ($index + 1);
    $nameNoExt = preg_replace('/\.[^.]+$/', '', $file);

    $poster = '';
    foreach (array('jpg', 'jpeg', 'png', 'webp') as $imgExt) {
        $posterCandidate = $imagesDir . DIRECTORY_SEPARATOR . $nameNoExt . '.' . $imgExt;
        if (is_file($posterCandidate)) {
            $poster = $baseUrl . '/images/' . rawurlencode($nameNoExt . '.' . $imgExt);
            break;
        }
    }

    $videoEntry = array(
        'id' => $id,
        'title' => toTitle($file),
        'url' => $baseUrl . '/videos/' . rawurlencode($file)
    );
    if ($poster !== '') {
        $videoEntry['poster'] = $poster;
    }
    $onlineVideos[] = $videoEntry;
}

echo json_encode(array(
    'galleryItems' => $galleryItems,
    'onlineVideos' => $onlineVideos
), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
