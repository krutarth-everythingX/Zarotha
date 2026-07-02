document.documentElement.dataset.js = 'enabled';

const menuButton = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const siteNav = document.querySelector<HTMLElement>('[data-site-nav]');
const menuBackdrop = document.querySelector<HTMLButtonElement>('[data-menu-backdrop]');
const menuCloseButton = document.querySelector<HTMLButtonElement>('[data-menu-close]');

if (menuButton && siteNav) {
    siteNav.setAttribute('data-open', 'false');
    menuBackdrop?.setAttribute('data-open', 'false');

    const phoneHomepageQuery = window.matchMedia('(max-width: 767px)');
    let closeMenuTimer: ReturnType<typeof window.setTimeout> | null = null;
    let menuOrigin: { x: number; y: number } | null = null;

    const isMobileMenu = () => (
        phoneHomepageQuery.matches
    );

    const applyCircularRevealGeometry = (x: number, y: number) => {
        const radius = Math.ceil(Math.max(
            Math.hypot(x, y),
            Math.hypot(window.innerWidth - x, y),
            Math.hypot(x, window.innerHeight - y),
            Math.hypot(window.innerWidth - x, window.innerHeight - y),
        ));

        siteNav.style.setProperty('--menu-x', `${x}px`);
        siteNav.style.setProperty('--menu-y', `${y}px`);
        siteNav.style.setProperty('--reveal-radius', `${radius}px`);
    };

    const setCircularRevealGeometry = () => {
        const buttonRect = menuButton.getBoundingClientRect();
        menuOrigin = {
            x: buttonRect.left + (buttonRect.width / 2),
            y: buttonRect.top + (buttonRect.height / 2),
        };

        applyCircularRevealGeometry(menuOrigin.x, menuOrigin.y);
    };

    const syncClosedMenuState = () => {
        if (isMobileMenu()) {
            siteNav.setAttribute('aria-hidden', 'true');
            siteNav.setAttribute('inert', '');
        } else {
            siteNav.removeAttribute('aria-hidden');
            siteNav.removeAttribute('inert');
        }
    };

    syncClosedMenuState();

    const getFocusableMenuItems = () => Array.from(
        siteNav.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
    ).filter((element) => element.offsetParent !== null);

    const finishCloseMenu = (returnFocus: boolean) => {
        siteNav.setAttribute('data-open', 'false');
        siteNav.removeAttribute('data-closing');
        menuBackdrop?.setAttribute('data-open', 'false');
        menuButton.setAttribute('aria-expanded', 'false');
        document.documentElement.classList.remove('has-mobile-nav-open');
        syncClosedMenuState();

        if (returnFocus && isMobileMenu()) {
            menuButton.focus();
        }
    };

    const closeMenu = (returnFocus = true) => {
        if (closeMenuTimer) {
            window.clearTimeout(closeMenuTimer);
            closeMenuTimer = null;
        }

        if (!isMobileMenu()) {
            finishCloseMenu(returnFocus);
            return;
        }

        if (menuOrigin) {
            applyCircularRevealGeometry(menuOrigin.x, menuOrigin.y);
        } else {
            setCircularRevealGeometry();
        }
        siteNav.setAttribute('data-closing', 'true');
        siteNav.setAttribute('data-open', 'false');
        menuBackdrop?.setAttribute('data-open', 'false');
        menuButton.setAttribute('aria-expanded', 'false');

        closeMenuTimer = window.setTimeout(() => {
            closeMenuTimer = null;
            finishCloseMenu(returnFocus);
        }, 680);
    };

    const openMenu = () => {
        if (closeMenuTimer) {
            window.clearTimeout(closeMenuTimer);
            closeMenuTimer = null;
        }

        if (isMobileMenu()) {
            setCircularRevealGeometry();
        }

        siteNav.setAttribute('data-open', 'true');
        siteNav.removeAttribute('data-closing');
        menuButton.setAttribute('aria-expanded', 'true');

        if (isMobileMenu()) {
            siteNav.setAttribute('aria-hidden', 'false');
            siteNav.removeAttribute('inert');
            menuBackdrop?.setAttribute('data-open', 'true');
            document.documentElement.classList.add('has-mobile-nav-open');
            requestAnimationFrame(() => {
                getFocusableMenuItems()[0]?.focus();
            });
        }
    };

    menuButton.addEventListener('click', () => {
        const isOpen = siteNav.dataset.open === 'true';

        if (isOpen) {
            closeMenu();
            return;
        }

        openMenu();
    });

    menuCloseButton?.addEventListener('click', () => {
        closeMenu();
    });

    menuBackdrop?.addEventListener('click', () => {
        closeMenu();
    });

    siteNav.querySelectorAll<HTMLAnchorElement>('a').forEach((link) => {
        link.addEventListener('click', () => {
            if (isMobileMenu()) {
                closeMenu(false);
            }
        });
    });

    document.addEventListener('keydown', (event) => {
        if (siteNav.dataset.open !== 'true' || !isMobileMenu()) {
            return;
        }

        if (event.key === 'Escape') {
            closeMenu();
            return;
        }

        if (event.key === 'Tab') {
            const focusableItems = getFocusableMenuItems();

            if (focusableItems.length === 0) {
                return;
            }

            const firstItem = focusableItems[0];
            const lastItem = focusableItems[focusableItems.length - 1];

            if (event.shiftKey && document.activeElement === firstItem) {
                event.preventDefault();
                lastItem.focus();
                return;
            }

            if (!event.shiftKey && document.activeElement === lastItem) {
                event.preventDefault();
                firstItem.focus();
            }
        }
    });

    phoneHomepageQuery.addEventListener('change', () => {
        closeMenu(false);
    });

    window.addEventListener('resize', () => {
        if (siteNav.dataset.open === 'true' && isMobileMenu()) {
            setCircularRevealGeometry();
        }
    }, { passive: true });
}

const siteHeader = document.querySelector<HTMLElement>('.site-header');
if (siteHeader) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            siteHeader.classList.add('is-scrolled');
        } else {
            siteHeader.classList.remove('is-scrolled');
        }
    }, { passive: true });
}

const lightbox = document.querySelector<HTMLElement>('[data-lightbox]');
const lightboxImage = document.querySelector<HTMLImageElement>('[data-lightbox-image]');
const closeLightbox = document.querySelector<HTMLButtonElement>('[data-lightbox-close]');

document.querySelectorAll<HTMLButtonElement>('[data-lightbox-open]').forEach((button) => {
    button.addEventListener('click', () => {
        const image = button.querySelector<HTMLImageElement>('img');
        if (!lightbox || !lightboxImage || !image) {
            return;
        }

        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt;
        lightbox.hidden = false;
        closeLightbox?.focus();
    });
});

const hideLightbox = () => {
    if (lightbox) {
        lightbox.hidden = true;
    }
};

closeLightbox?.addEventListener('click', hideLightbox);
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        hideLightbox();
    }
});

document.querySelectorAll<HTMLElement>('[data-slider]').forEach((slider) => {
    const track = slider.querySelector<HTMLElement>('[data-slider-track]');
    const previousButton = slider.closest('section')?.querySelector<HTMLButtonElement>('[data-slider-prev]');
    const nextButton = slider.closest('section')?.querySelector<HTMLButtonElement>('[data-slider-next]');

    if (!track) {
        return;
    }

    const scrollStep = () => {
        const slide = track.firstElementChild as HTMLElement | null;

        if (!slide) {
            return track.clientWidth;
        }

        const styles = window.getComputedStyle(track);
        const gap = Number.parseFloat(styles.columnGap || styles.gap || '0');

        return slide.offsetWidth + gap;
    };

    previousButton?.addEventListener('click', () => {
        track.scrollBy({ left: -scrollStep(), behavior: 'smooth' });
    });

    nextButton?.addEventListener('click', () => {
        track.scrollBy({ left: scrollStep(), behavior: 'smooth' });
    });
});

const galleryRoot = document.querySelector<HTMLElement>('[data-products-gallery]');
const galleryFeed = document.querySelector<HTMLElement>('[data-products-feed]');
const gallerySentinel = document.querySelector<HTMLElement>('[data-products-sentinel]');
const galleryStatus = document.querySelector<HTMLElement>('[data-products-status]');
const galleryLoading = document.querySelector<HTMLElement>('[data-products-loading]');
const gallerySortSelect = document.querySelector<HTMLSelectElement>('[data-products-sort-select]');
const galleryTemplate = document.querySelector<HTMLTemplateElement>('[data-product-card-template]');

type GalleryProductImage = {
    src: string;
    srcset: string;
    sizes: string;
    width: number | null;
    height: number | null;
    alt: string;
};

type GalleryProduct = {
    id: number;
    name: string;
    url: string;
    image: GalleryProductImage | null;
};

type GalleryProductsResponse = {
    products: GalleryProduct[];
    pagination: {
        currentPage: number;
        hasMorePages: boolean;
        nextPageUrl: string | null;
        total: number;
    };
};

gallerySortSelect?.addEventListener('change', () => {
    gallerySortSelect.form?.submit();
});

if (galleryRoot && galleryFeed && gallerySentinel && galleryTemplate) {
    let nextPageUrl = galleryRoot.dataset.productsNextUrl ?? '';
    let hasMorePages = galleryRoot.dataset.productsHasMore === 'true';
    let isLoadingProducts = false;
    const seenProducts = new Set<number>(JSON.parse(galleryRoot.dataset.productsSeen ?? '[]') as number[]);
    let observer: IntersectionObserver | null = null;

    const setStatus = (message: string) => {
        if (galleryStatus) {
            galleryStatus.textContent = message;
        }
    };

    const setLoading = (loading: boolean) => {
        isLoadingProducts = loading;

        if (galleryLoading) {
            galleryLoading.hidden = !loading;
        }
    };

    const buildGalleryCard = (product: GalleryProduct) => {
        const fragment = galleryTemplate.content.cloneNode(true) as DocumentFragment;
        const article = fragment.querySelector<HTMLElement>('[data-product-card]');
        const link = fragment.querySelector<HTMLAnchorElement>('.products-gallery-item__link');
        const image = fragment.querySelector<HTMLImageElement>('.products-gallery-item__image');
        const fallback = fragment.querySelector<HTMLElement>('.products-gallery-item__fallback');
        const overlay = fragment.querySelector<HTMLElement>('.products-gallery-item__overlay');

        if (!article || !link || !image || !fallback || !overlay) {
            return null;
        }

        article.dataset.productId = String(product.id);
        link.href = product.url;
        link.setAttribute('aria-label', `View ${product.name}`);
        overlay.textContent = product.name;

        if (product.image) {
            image.src = product.image.src;
            image.srcset = product.image.srcset;
            image.sizes = product.image.sizes;
            image.alt = product.image.alt;
            image.loading = 'lazy';
            image.decoding = 'async';

            if (product.image.width) {
                image.width = product.image.width;
            }

            if (product.image.height) {
                image.height = product.image.height;
            }

            fallback.remove();
        } else {
            image.remove();
        }

        return fragment;
    };

    const appendProducts = (products: GalleryProduct[]) => {
        let appendedCount = 0;

        products.forEach((product) => {
            if (seenProducts.has(product.id)) {
                return;
            }

            const card = buildGalleryCard(product);

            if (!card) {
                return;
            }

            galleryFeed.appendChild(card);
            seenProducts.add(product.id);
            appendedCount += 1;
        });

        return appendedCount;
    };

    const stopLoading = (message = 'All products loaded.') => {
        hasMorePages = false;
        nextPageUrl = '';
        setLoading(false);
        setStatus(message);
        observer?.disconnect();
    };

    const loadMoreProducts = async () => {
        if (isLoadingProducts || !hasMorePages || nextPageUrl === '') {
            return;
        }

        setLoading(true);
        setStatus('Loading more products');

        try {
            const response = await fetch(nextPageUrl, {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const payload = (await response.json()) as GalleryProductsResponse;

            const appendedCount = appendProducts(payload.products) ?? 0;

            nextPageUrl = payload.pagination.nextPageUrl ?? '';
            hasMorePages = payload.pagination.hasMorePages && nextPageUrl !== '';

            if (!hasMorePages) {
                stopLoading('All products loaded.');
                return;
            }

            if (appendedCount === 0) {
                stopLoading('All products loaded.');
                return;
            }

            setLoading(false);
            setStatus('');
        } catch {
            setLoading(false);
            setStatus('More products could not load right now.');
            observer?.disconnect();
        }
    };

    if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    void loadMoreProducts();
                }
            },
            { rootMargin: '900px 0px' },
        );

        observer.observe(gallerySentinel);
    }
}

const quickInquiry = document.querySelector<HTMLElement>('.quick-inquiry');
if (quickInquiry) {
    const bannersJson = quickInquiry.dataset.inquiryBanners;
    if (bannersJson) {
        try {
            const banners = JSON.parse(bannersJson) as string[];
            if (banners.length > 1) {
                quickInquiry.style.transition = 'background-image 1s ease-in-out';
                let currentBannerIndex = 0;
                setInterval(() => {
                    currentBannerIndex = (currentBannerIndex + 1) % banners.length;
                    quickInquiry.style.setProperty('--section-bg-image', `url('${banners[currentBannerIndex]}')`);
                }, 5000);
            }
        } catch {
            // Ignored
        }
    }
}

const heroSlider = document.querySelector<HTMLElement>('[data-hero-slider]');
if (heroSlider) {
    const slides = heroSlider.querySelectorAll('.home-hero__media');
    const prevBtn = heroSlider.querySelector<HTMLButtonElement>('[data-hero-prev]');
    const nextBtn = heroSlider.querySelector<HTMLButtonElement>('[data-hero-next]');

    if (slides.length > 1) {
        let currentSlide = 0;
        let interval: ReturnType<typeof setInterval>;

        const showSlide = (index: number) => {
            slides[currentSlide].classList.remove('is-active');
            currentSlide = (index + slides.length) % slides.length;
            slides[currentSlide].classList.add('is-active');
        };

        const startInterval = () => {
            interval = setInterval(() => {
                showSlide(currentSlide + 1);
            }, 3000);
        };

        const resetInterval = () => {
            clearInterval(interval);
            startInterval();
        };

        prevBtn?.addEventListener('click', () => {
            showSlide(currentSlide - 1);
            resetInterval();
        });

        nextBtn?.addEventListener('click', () => {
            showSlide(currentSlide + 1);
            resetInterval();
        });

        startInterval();
    }
}
