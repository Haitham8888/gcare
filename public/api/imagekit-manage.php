<?php
declare(strict_types=1);

require __DIR__ . '/_bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Method not allowed'], 405);
}

$config = require_dashboard_role(['admin', 'publisher']);
$privateKey = imagekit_private_key($config);
$input = json_decode((string)file_get_contents('php://input'), true);
$action = is_array($input) ? (string)($input['action'] ?? '') : '';
$path = is_array($input) ? trim((string)($input['path'] ?? '')) : '';

if ($action !== 'deleteByPath' || $path === '' || strpos($path, 'static/') === 0) {
    json_response(['error' => 'Invalid request'], 400);
}

[$searchStatus, $searchBody, $searchError] = imagekit_request(
    'GET',
    'https://api.imagekit.io/v1/files?path=' . rawurlencode($path),
    $privateKey
);

if ($searchStatus < 200 || $searchStatus >= 300) {
    json_response(['error' => 'ImageKit search failed', 'details' => $searchError], 502);
}

$files = json_decode((string)$searchBody, true);
$fileId = is_array($files) && isset($files[0]['fileId']) ? (string)$files[0]['fileId'] : '';
if ($fileId === '') {
    json_response(['deleted' => false, 'reason' => 'not_found']);
}

[$deleteStatus, , $deleteError] = imagekit_request(
    'DELETE',
    'https://api.imagekit.io/v1/files/' . rawurlencode($fileId),
    $privateKey
);

if ($deleteStatus < 200 || $deleteStatus >= 300) {
    json_response(['error' => 'ImageKit delete failed', 'details' => $deleteError], 502);
}

json_response(['deleted' => true]);
