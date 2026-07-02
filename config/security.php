<?php

return [
    'csp' => [
        'enabled' => (bool) env('SECURITY_CSP_ENABLED', false),
        'policy' => env('SECURITY_CSP'),
    ],
    'hsts' => [
        'enabled' => (bool) env('SECURITY_HSTS_ENABLED', false),
    ],
];
