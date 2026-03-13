<?php
/**
 * G-Care CMS Authentication Gateway
 * This file handles GitHub OAuth for Decap CMS directly on your server.
 */

// GitHub App Credentials
$client_id = 'Iv23liLrsifJ4qrkBMdT';
$client_secret = 'be90c730dea9fd56ef29369682c33ed35c8a004d';

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
        // Return token to Decap CMS via postMessage
        echo "<!DOCTYPE html><html><body>
        <script>
            const token = '$token';
            const provider = 'github';
            // Send message back to the CMS opener window
            window.opener.postMessage(
                'authorization:github:success:' + JSON.stringify({token: token, provider: provider}),
                window.location.origin
            );
            // Optional: Close this popup
            setTimeout(() => window.close(), 1000);
        </script>
        <p style='font-family: sans-serif; text-align: center; margin-top: 50px;'>
            Success! Authenticated. Returning to dashboard...
        </p>
        </body></html>";
    } else {
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
