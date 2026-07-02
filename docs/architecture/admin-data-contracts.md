# Admin Data Contracts

## Contract Principles

- These contracts describe server-provided Inertia props.
- Shared shapes should stay stable across admin modules.
- Contracts reflect the implemented launch scope, which excludes Collections.
- Payloads should remain privacy-safe and avoid leaking unnecessary internal state.

## Shared Props

```ts
type SharedAdminProps = {
  appName: string;
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
      roleName?: string | null;
      is_active: boolean;
    } | null;
  };
  flash: {
    status: string | null;
  };
};
```

## Shared Utility Types

```ts
type PaginationMeta = {
  currentPage: number;
  perPage: number;
  total: number;
  lastPage: number;
  from: number | null;
  to: number | null;
};

type Paginated<T> = {
  data: T[];
  meta: PaginationMeta;
};

type SelectOption = {
  id: number | string;
  label: string;
};
```

## Dashboard

```ts
type DashboardProps = SharedAdminProps & {
  metrics: {
    products: number;
    publishedProducts: number;
    categories: number;
    mediaAssets: number;
    unreadInquiries: number;
  };
  recentActivity: Array<{
    id: number;
    action: string;
    summary: string | null;
    createdAt: string | null;
  }>;
};
```

## Categories

```ts
type CategoriesIndexProps = SharedAdminProps & {
  categories: Array<{
    id: number;
    name: string;
    slug: string;
    description: string | null;
    sortOrder: number;
    isActive: boolean;
    productCount: number;
  }>;
};
```

## Products

```ts
type ProductListItem = {
  id: number;
  name: string;
  slug: string;
  status: "draft" | "published" | "archived";
  sortOrder: number;
  isFeatured: boolean;
  isBestSelling: boolean;
  isLatest: boolean;
  publishedAt: string | null;
  updatedAt: string | null;
  category: {
    id: number;
    name: string;
    slug: string;
  } | null;
  featuredImage: {
    id: number;
    url: string;
    alt: string | null;
  } | null;
};

type ProductsIndexProps = SharedAdminProps & {
  filters: {
    search: string;
    status: string;
    category: string;
  };
  products: Paginated<ProductListItem>;
  categories: SelectOption[];
};

type ProductFormProps = SharedAdminProps & {
  mode: "create" | "edit";
  product: {
    id: number;
    name: string;
    slug: string;
    categoryId: number | null;
    shortDescription: string | null;
    fullDescription: string | null;
    dimensions: string | null;
    material: string | null;
    finish: string | null;
    weight: string | null;
    priceLabel: string | null;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    isFeatured: boolean;
    isBestSelling: boolean;
    isLatest: boolean;
    featuredMediaId: number | null;
    metaTitle: string | null;
    metaDescription: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImageMediaId: number | null;
    canonicalUrl: string | null;
    robotsIndex: boolean;
    robotsFollow: boolean;
  } | null;
  categories: SelectOption[];
  mediaOptions: Array<{
    id: number;
    label: string;
    previewUrl: string | null;
  }>;
};
```

## Product Gallery

```ts
type ProductGalleryProps = SharedAdminProps & {
  product: {
    id: number;
    name: string;
    slug: string;
    featuredMediaId: number | null;
  };
  gallery: Array<{
    id: number;
    mediaId: number;
    sortOrder: number;
    previewUrl: string | null;
    altText: string | null;
    caption: string | null;
    isFeatured: boolean;
  }>;
  mediaLibrary: Array<{
    id: number;
    label: string;
    previewUrl: string | null;
  }>;
};
```

## Media

```ts
type MediaIndexProps = SharedAdminProps & {
  filters: {
    search: string;
    status: string;
  };
  media: Paginated<{
    id: number;
    originalFilename: string;
    altText: string | null;
    caption: string | null;
    mimeType: string;
    bytes: number;
    width: number | null;
    height: number | null;
    status: "uploaded" | "processed" | "failed" | "archived";
    previewUrl: string | null;
    usageCount: number;
    createdAt: string | null;
  }>;
};
```

## Homepage And Banners

```ts
type HomepageEditProps = SharedAdminProps & {
  sections: Array<{
    id: number;
    key: string;
    title: string | null;
    body: string | null;
    ctaLabel: string | null;
    ctaUrl: string | null;
    isVisible: boolean;
    sortOrder: number;
    featuredProductIds: number[];
    featuredCategoryIds: number[];
    mediaAssetId: number | null;
  }>;
  productOptions: SelectOption[];
  categoryOptions: SelectOption[];
  mediaOptions: Array<{
    id: number;
    label: string;
    previewUrl: string | null;
  }>;
};

type BannersIndexProps = SharedAdminProps & {
  banners: Array<{
    id: number;
    title: string;
    body: string | null;
    ctaLabel: string | null;
    ctaUrl: string | null;
    sortOrder: number;
    isActive: boolean;
    desktopMediaId: number | null;
    mobileMediaId: number | null;
  }>;
  mediaOptions: Array<{
    id: number;
    label: string;
    previewUrl: string | null;
  }>;
};
```

## Fixed Pages And Settings

```ts
type PageEditorProps = SharedAdminProps & {
  page: {
    id: number;
    slug: string;
    pageKey: string;
    title: string;
    excerpt: string | null;
    body: string | null;
    status: "draft" | "published" | "archived";
    heroMediaId: number | null;
    metaTitle: string | null;
    metaDescription: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImageMediaId: number | null;
    canonicalUrl: string | null;
    robotsIndex: boolean;
    robotsFollow: boolean;
  };
  mediaOptions: Array<{
    id: number;
    label: string;
    previewUrl: string | null;
  }>;
};

type GeneralSettingsProps = SharedAdminProps & {
  settings: {
    siteName: string;
    businessName: string | null;
    logoMediaId: number | null;
    faviconMediaId: number | null;
    footerText: string | null;
  };
  mediaOptions: Array<{
    id: number;
    label: string;
    previewUrl: string | null;
  }>;
};

type ContactSettingsProps = SharedAdminProps & {
  settings: {
    email: string | null;
    phone: string | null;
    whatsapp: string | null;
    address: string | null;
    businessHours: string | null;
    inquiryHelperText: string | null;
    inquirySuccessMessage: string | null;
  };
};

type SeoSettingsProps = SharedAdminProps & {
  settings: {
    defaultMetaTitle: string | null;
    defaultMetaDescription: string | null;
    defaultOgImageMediaId: number | null;
    robotsIndex: boolean;
    robotsFollow: boolean;
  };
  mediaOptions: Array<{
    id: number;
    label: string;
    previewUrl: string | null;
  }>;
};
```

## Inquiries, Redirects, Users, And Activity

```ts
type InquiryListItem = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  status: "unread" | "read" | "replied" | "archived";
  product: {
    id: number;
    name: string;
    slug: string;
  } | null;
  assignedUser: {
    id: number;
    name: string;
  } | null;
  createdAt: string | null;
};

type InquiriesIndexProps = SharedAdminProps & {
  filters: {
    search: string;
    status: string;
    assignedUserId: string;
  };
  inquiries: Paginated<InquiryListItem>;
  assignableUsers: SelectOption[];
};

type InquiryShowProps = SharedAdminProps & {
  inquiry: InquiryListItem & {
    message: string;
    sourcePageKey: string | null;
    referrerUrl: string | null;
    activities: Array<{
      id: number;
      type: string;
      actorName: string | null;
      note: string | null;
      createdAt: string | null;
    }>;
  };
  assignableUsers: SelectOption[];
};

type RedirectsIndexProps = SharedAdminProps & {
  filters: {
    search: string;
  };
  redirects: Paginated<{
    id: number;
    sourcePath: string;
    targetPath: string;
    httpStatus: 301 | 302;
    sourceEntityType: "product" | "page" | "category" | "custom" | null;
    isActive: boolean;
  }>;
};

type UsersIndexProps = SharedAdminProps & {
  users: Paginated<{
    id: number;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    lastLoginAt: string | null;
  }>;
};

type ActivityIndexProps = SharedAdminProps & {
  activities: Paginated<{
    id: number;
    action: string;
    summary: string | null;
    actorName: string | null;
    createdAt: string | null;
  }>;
};
```

## Contract Rules

- Validation errors remain field-addressable and page-local.
- Flash messages stay lightweight and user-safe.
- Collection props and collection selectors are intentionally absent.
