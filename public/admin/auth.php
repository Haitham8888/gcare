<?php
/**
 * G-Care CMS Authentication Gateway
 * This file handles GitHub OAuth for Decap CMS directly on your server.
 */

// GitHub App Credentials
$client_id = 'Iv23liLrsifJ4qrkBMdT';
// نستخدم الـ Secret الموجود حالياً كاحتياطي، لكن الأفضل وضعه في ملف سري أونلاين
$client_secret = 'be90c730dea9fd56ef29369682c33ed35c8a004d';

// تأمين إضافي: ابحث عن ملف سري أونلاين لا يراه GitHub
if (file_exists('.env.php')) {
    $extra_secrets = include('.env.php');
    if (isset($extra_secrets['secret'])) {
        $client_secret = $extra_secrets['secret'];
    }
}

// Disable error reporting for cleaner output in production
error_reporting(0);

if (isset($_GET['code'])) {
    // Phase 2: User has authorized, now exchange code for access_token
    $code = $_GET['code'];
    
    $post_data = [
        'client_id' => $client_id,
        'client_secret' => $client_secret,
        'code' => $code
    ];

    $ch = curl_init('https://github.com/login/oauth/access_token');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post_data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);
    $response = curl_exec($ch);
    curl_close($ch);

    $data = json_decode($response, true);
    $token = $data['access_token'] ?? '';

    if ($token) {
        // Return token to Decap CMS via postMessage (Standard Format)
        $output = json_encode([
            'token' => $token,
            'provider' => 'github'
        ]);
        
        echo "<!DOCTYPE html><html><head><title>Authenticated</title></head><body>
        <div style='text-align:center; margin-top:50px; font-family:sans-serif;'>
            <h2 style='color: #059669;'>✓ Authenticated</h2>
            <p>Returning to dashboard, please wait...</p>
        </div>
        <script>
            (function() {
                // The expected message format for Decap CMS
                const message = 'authorization:github:success:' + '$output';
                
                // Send to parent window
                if (window.opener) {
                    window.opener.postMessage(message, '*');
                    
                    // Close this popup after a short delay
                    setTimeout(() => {
                        window.close();
                    }, 500);
                } else {
                    // Fail-safe: if opener is lost, try to redirect back
                    window.location.href = '../index.html';
                }
            })();
        </script>
        </body></html>";
    }
 else {
        echo "Authentication failed. Error: " . ($data['error_description'] ?? 'Unknown error');
    }
} else {
    // Phase 1: Redirect user to GitHub Login
    $state = bin2hex(random_bytes(16));
    $auth_url = "https://github.com/login/oauth/authorize?" . http_build_query([
        'client_id' => $client_id,
        'scope' => 'repo,user',
        'state' => $state
    ]);
    header("Location: $auth_url");
    exit;
}
