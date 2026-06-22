<?php
declare(strict_types=1);

require __DIR__ . '/_bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['error' => 'Method not allowed'], 405);
}

$config = require_dashboard_role(['admin', 'publisher']);
$privateKey = imagekit_private_key($config);
$token = bin2hex(random_bytes(16));
$expire = (string)(time() + 600);
$signature = hash_hmac('sha1', $token . $expire, $privateKey);

json_response([
    'token' => $token,
    'expire' => (int)$expire,
    'signature' => $signature,
]);
