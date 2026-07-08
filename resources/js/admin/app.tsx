import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import './bootstrap';
import { appliedAdminTheme, applyAdminTheme, storedAdminTheme } from './theme';

const appName = import.meta.env.VITE_APP_NAME ?? 'Zarokha Wooden Arts';

applyAdminTheme(appliedAdminTheme() ?? storedAdminTheme() ?? 'dark');

createInertiaApp({
    title: (title) => `${title} | ${appName}`,
    resolve: (name) =>
        resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#8c6a44',
        showSpinner: false,
    },
});
