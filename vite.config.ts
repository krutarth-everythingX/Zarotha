import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/public/app.css',
                'resources/js/public/app.ts',
                'resources/css/admin/app.css',
                'resources/js/admin/app.tsx',
            ],
            refresh: [
                'app/**',
                'bootstrap/**',
                'config/**',
                'resources/**',
                'routes/**',
            ],
        }),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@admin': fileURLToPath(new URL('./resources/js/admin', import.meta.url)),
            '@public': fileURLToPath(new URL('./resources/js/public', import.meta.url)),
        },
    },
    server: {
        host: '127.0.0.1',
        hmr: {
            host: '127.0.0.1',
        },
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
