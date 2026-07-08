export type AuthUser = {
    id: number;
    name: string;
    email: string;
    role: string;
    roleName?: string | null;
    is_active: boolean;
    avatar_path?: string | null;
    avatarUrl?: string | null;
    admin_theme?: "dark" | "light";
};

export type AppPageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    appName: string;
    auth: {
        user: AuthUser | null;
    };
    flash: {
        status: string | null;
    };
};

export type PaginationMeta = {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
    from: number | null;
    to: number | null;
};

export type Paginated<T> = {
    data: T[];
    meta: PaginationMeta;
};

export type SelectOption = {
    id: number | string;
    label: string;
};

export type PublishStatus = 'draft' | 'published' | 'archived';

export type MediaStatus = 'uploaded' | 'processed' | 'failed' | 'archived';

export type InquiryStatus = 'unread' | 'read' | 'replied' | 'archived';

export type ValidationErrors = Record<string, string>;
