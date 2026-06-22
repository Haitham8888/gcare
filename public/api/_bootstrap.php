<?php
declare(strict_types=1);

function load_config(): array
{
    $config = [];
    $file = __DIR__ . '/../admin/env.php';

    if (is_file($file)) {
        $loaded = require $file;
        if (is_array($loaded)) {
            $config = $loaded;
        }
    }

    foreach (['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'IMAGEKIT_PRIVATE_KEY'] as $key) {
        $value = getenv($key);
        if ($value !== false && $value !== '') {
            $config[$key] = $value;
        }
    }

    return $config;
}

function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function request_bearer_token(): string
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (!$header && function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $header = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }

    if (!preg_match('/^Bearer\s+(.+)$/i', trim($header), $matches)) {
        json_response(['error' => 'Unauthorized'], 401);
    }

    return $matches[1];
}

function require_config(array $config, string $key): string
{
    $value = trim((string)($config[$key] ?? ''));
    if ($value === '') {
        json_response(['error' => "Missing server config: {$key}"], 500);
    }

    return $value;
}

function require_dashboard_role(array $allowedRoles): array
{
    $config = load_config();
    $supabaseUrl = rtrim(require_config($config, 'SUPABASE_URL'), '/');
    $anonKey = require_config($config, 'SUPABASE_ANON_KEY');
    $token = request_bearer_token();

    $url = $supabaseUrl . '/rest/v1/profiles?select=id,role&id=eq.' . rawurlencode(jwt_subject($token)) . '&limit=1';
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'apikey: ' . $anonKey,
            'Authorization: Bearer ' . $token,
            'Accept: application/json',
        ],
        CURLOPT_TIMEOUT => 15,
    ]);

    $body = curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($body === false || $status < 200 || $status >= 300) {
        json_response(['error' => 'Unable to verify dashboard session', 'details' => $error], 401);
    }

    $rows = json_decode((string)$body, true);
    $role = is_array($rows) && isset($rows[0]['role']) ? (string)$rows[0]['role'] : '';
    if (!in_array($role, $allowedRoles, true)) {
        json_response(['error' => 'Forbidden'], 403);
    }

    return $config;
}

function jwt_subject(string $token): string
{
    $parts = explode('.', $token);
    if (count($parts) < 2) {
        json_response(['error' => 'Invalid token'], 401);
    }

    $payload = json_decode(base64url_decode($parts[1]), true);
    $sub = is_array($payload) ? (string)($payload['sub'] ?? '') : '';
    if ($sub === '') {
        json_response(['error' => 'Invalid token subject'], 401);
    }

    return $sub;
}

function base64url_decode(string $value): string
{
    $remainder = strlen($value) % 4;
    if ($remainder) {
        $value .= str_repeat('=', 4 - $remainder);
    }

    return (string)base64_decode(strtr($value, '-_', '+/'));
}

function imagekit_private_key(array $config): string
{
    return require_config($config, 'IMAGEKIT_PRIVATE_KEY');
}

function imagekit_request(string $method, string $url, string $privateKey, ?array $payload = null): array
{
    $ch = curl_init($url);
    $headers = [
        'Authorization: Basic ' . base64_encode($privateKey . ':'),
        'Accept: application/json',
    ];

    $options = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_TIMEOUT => 20,
    ];

    if ($payload !== null) {
        $headers[] = 'Content-Type: application/json';
        $options[CURLOPT_HTTPHEADER] = $headers;
        $options[CURLOPT_POSTFIELDS] = json_encode($payload, JSON_UNESCAPED_SLASHES);
    }

    curl_setopt_array($ch, $options);
    $body = curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    return [$status, $body, $error];
}
