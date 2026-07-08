export type AdminTheme = "dark" | "light";

const LEGACY_ADMIN_THEME_STORAGE_KEY = "zarokha.admin.theme";
const ADMIN_THEME_STORAGE_PREFIX = "zarokha.admin.theme.";

export function isAdminTheme(value: unknown): value is AdminTheme {
    return value === "dark" || value === "light";
}

function themeStorageKey(userId?: number | null) {
    return userId ? `${ADMIN_THEME_STORAGE_PREFIX}${userId}` : LEGACY_ADMIN_THEME_STORAGE_KEY;
}

export function storedAdminTheme(userId?: number | null): AdminTheme | null {
    if (typeof window === "undefined") {
        return null;
    }

    const theme = window.localStorage.getItem(themeStorageKey(userId));

    return isAdminTheme(theme) ? theme : null;
}

export function applyAdminTheme(theme: AdminTheme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.adminTheme = theme;
    document.documentElement.style.colorScheme = theme;
}

export function appliedAdminTheme(): AdminTheme | null {
    const theme = document.documentElement.dataset.adminTheme;

    return isAdminTheme(theme) ? theme : null;
}

export function rememberAdminTheme(theme: AdminTheme, userId?: number | null) {
    window.localStorage.setItem(themeStorageKey(userId), theme);
    applyAdminTheme(theme);
}

export function initialAdminTheme(userId?: number | null, userTheme?: AdminTheme | null): AdminTheme {
    return storedAdminTheme(userId) ?? userTheme ?? storedAdminTheme() ?? "dark";
}
