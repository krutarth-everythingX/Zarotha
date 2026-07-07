document.documentElement.dataset.js = 'enabled';

const menuButton = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const siteNav = document.querySelector<HTMLElement>('[data-site-nav]');
const menuBackdrop = document.querySelector<HTMLButtonElement>('[data-menu-backdrop]');
const menuCloseButton = document.querySelector<HTMLButtonElement>('[data-menu-close]');

if (menuButton && siteNav) {
    siteNav.setAttribute('data-open', 'false');
    menuBackdrop?.setAttribute('data-open', 'false');

    const compactMenuQuery = window.matchMedia('(max-width: 1023px)');
    let closeMenuTimer: number | null = null;
    let menuOrigin: { x: number; y: number } | null = null;

    const isMobileMenu = () => (
        compactMenuQuery.matches
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

    compactMenuQuery.addEventListener('change', () => {
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

const revealItems = document.querySelectorAll<HTMLElement>('[data-scroll-reveal]');
if (revealItems.length > 0) {
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                });
            },
            { rootMargin: '0px 0px -12% 0px', threshold: 0.18 },
        );

        revealItems.forEach((item) => revealObserver.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add('is-visible'));
    }
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

document.querySelectorAll<HTMLElement>('[data-product-gallery]').forEach((gallery) => {
    const track = gallery.querySelector<HTMLElement>('[data-product-gallery-track]');
    const slides = Array.from(gallery.querySelectorAll<HTMLElement>('[data-product-gallery-slide]'));
    const previousButton = gallery.querySelector<HTMLButtonElement>('[data-product-gallery-prev]');
    const nextButton = gallery.querySelector<HTMLButtonElement>('[data-product-gallery-next]');
    const currentCount = gallery.querySelector<HTMLElement>('[data-product-gallery-current]');
    const thumbnailRail = gallery.querySelector<HTMLElement>('.product-purchase__thumbnails');
    const thumbnails = Array.from(gallery.querySelectorAll<HTMLButtonElement>('[data-product-gallery-thumb]'));

    if (!track || slides.length === 0) {
        return;
    }

    let activeIndex = 0;
    let touchStartX: number | null = null;

    const updateGallery = () => {
        track.style.transform = `translateX(-${activeIndex * 100}%)`;
        gallery.dataset.activeIndex = String(activeIndex);

        if (currentCount) {
            currentCount.textContent = String(activeIndex + 1);
        }

        thumbnails.forEach((thumbnail, index) => {
            thumbnail.setAttribute('aria-current', String(index === activeIndex));
        });

        const activeThumbnail = thumbnails[activeIndex];

        if (thumbnailRail && activeThumbnail) {
            const isHorizontalRail = thumbnailRail.scrollWidth > thumbnailRail.clientWidth;

            if (isHorizontalRail) {
                const railLeft = thumbnailRail.scrollLeft;
                const railRight = railLeft + thumbnailRail.clientWidth;
                const thumbnailLeft = activeThumbnail.offsetLeft;
                const thumbnailRight = thumbnailLeft + activeThumbnail.offsetWidth;

                if (thumbnailLeft < railLeft) {
                    thumbnailRail.scrollTo({ left: thumbnailLeft, behavior: 'smooth' });
                } else if (thumbnailRight > railRight) {
                    thumbnailRail.scrollTo({ left: thumbnailRight - thumbnailRail.clientWidth, behavior: 'smooth' });
                }
            } else {
                const railTop = thumbnailRail.scrollTop;
                const railBottom = railTop + thumbnailRail.clientHeight;
                const thumbnailTop = activeThumbnail.offsetTop;
                const thumbnailBottom = thumbnailTop + activeThumbnail.offsetHeight;

                if (thumbnailTop < railTop) {
                    thumbnailRail.scrollTo({ top: thumbnailTop, behavior: 'smooth' });
                } else if (thumbnailBottom > railBottom) {
                    thumbnailRail.scrollTo({ top: thumbnailBottom - thumbnailRail.clientHeight, behavior: 'smooth' });
                }
            }
        }
    };

    const goToSlide = (index: number) => {
        activeIndex = (index + slides.length) % slides.length;
        updateGallery();
    };

    previousButton?.addEventListener('click', () => {
        goToSlide(activeIndex - 1);
    });

    nextButton?.addEventListener('click', () => {
        goToSlide(activeIndex + 1);
    });

    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            goToSlide(index);
        });
    });

    gallery.addEventListener('touchstart', (event) => {
        if (event.touches.length !== 1) {
            touchStartX = null;
            return;
        }

        touchStartX = event.touches[0].clientX;
    }, { passive: true });

    gallery.addEventListener('touchend', (event) => {
        if (touchStartX === null || event.changedTouches.length === 0) {
            return;
        }

        const deltaX = event.changedTouches[0].clientX - touchStartX;
        touchStartX = null;

        if (Math.abs(deltaX) < 48) {
            return;
        }

        goToSlide(deltaX > 0 ? activeIndex - 1 : activeIndex + 1);
    }, { passive: true });

    updateGallery();
});

const inquiryModal = document.querySelector<HTMLElement>('[data-inquiry-modal]');
const inquiryOpenButtons = document.querySelectorAll<HTMLButtonElement>('[data-inquiry-open]');
const inquiryCloseButtons = document.querySelectorAll<HTMLButtonElement>('[data-inquiry-close]');

if (inquiryModal && inquiryOpenButtons.length > 0) {
    let inquiryReturnFocus: HTMLElement | null = null;

    const getInquiryFocusableItems = () => Array.from(
        inquiryModal.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
    ).filter((element) => element.offsetParent !== null);

    const openInquiryModal = (trigger?: HTMLElement) => {
        inquiryReturnFocus = trigger ?? null;
        inquiryModal.hidden = false;
        document.documentElement.classList.add('has-product-inquiry-open');
        requestAnimationFrame(() => {
            const focusTarget = inquiryModal.querySelector<HTMLElement>('input[name="name"]')
                ?? getInquiryFocusableItems()[0];
            focusTarget?.focus();
        });
    };

    const closeInquiryModal = () => {
        inquiryModal.hidden = true;
        document.documentElement.classList.remove('has-product-inquiry-open');
        inquiryReturnFocus?.focus();
        inquiryReturnFocus = null;
    };

    inquiryOpenButtons.forEach((button) => {
        button.addEventListener('click', () => openInquiryModal(button));
    });

    inquiryCloseButtons.forEach((button) => {
        button.addEventListener('click', closeInquiryModal);
    });

    if (!inquiryModal.hidden) {
        openInquiryModal();
    }

    document.addEventListener('keydown', (event) => {
        if (inquiryModal.hidden) {
            return;
        }

        if (event.key === 'Escape') {
            closeInquiryModal();
            return;
        }

        if (event.key === 'Tab') {
            const focusableItems = getInquiryFocusableItems();

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
}

const inquiryUploadViewer = (() => {
    const modal = document.createElement('div');
    modal.className = 'inquiry-upload-modal';
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');

    const dialog = document.createElement('div');
    dialog.className = 'inquiry-upload-modal__dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-label', 'File preview');

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'inquiry-upload-modal__close';
    closeButton.textContent = 'Close';

    const body = document.createElement('div');
    body.className = 'inquiry-upload-modal__body';

    dialog.append(closeButton, body);
    modal.appendChild(dialog);
    document.body.appendChild(modal);

    const close = () => {
        modal.hidden = true;
        modal.setAttribute('aria-hidden', 'true');
        body.replaceChildren();
        document.documentElement.classList.remove('has-inquiry-upload-modal-open');
    };

    const open = (file: File, url: string) => {
        body.replaceChildren();

        if (file.type.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = url;
            video.controls = true;
            video.autoplay = true;
            video.playsInline = true;
            body.appendChild(video);
        } else {
            const image = document.createElement('img');
            image.src = url;
            image.alt = file.name;
            body.appendChild(image);
        }

        modal.hidden = false;
        modal.setAttribute('aria-hidden', 'false');
        document.documentElement.classList.add('has-inquiry-upload-modal-open');
        closeButton.focus();
    };

    closeButton.addEventListener('click', close);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            close();
        }
    });
    document.addEventListener('keydown', (event) => {
        if (!modal.hidden && event.key === 'Escape') {
            close();
        }
    });

    return { open };
})();

document.querySelectorAll<HTMLElement>('[data-inquiry-upload]').forEach((upload) => {
    const input = upload.querySelector<HTMLInputElement>('[data-inquiry-upload-input]');
    const preview = upload.querySelector<HTMLElement>('[data-inquiry-upload-preview]');

    if (!input || !preview) {
        return;
    }

    let selectedFiles: File[] = [];
    const objectUrls = new Set<string>();

    const syncInputFiles = () => {
        const transfer = new DataTransfer();
        selectedFiles.forEach((file) => transfer.items.add(file));
        input.files = transfer.files;
    };

    const clearObjectUrls = () => {
        objectUrls.forEach((url) => URL.revokeObjectURL(url));
        objectUrls.clear();
    };

    const fileSizeLabel = (bytes: number) => {
        if (bytes >= 1024 * 1024) {
            return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        }

        return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    };

    const renderPreview = () => {
        clearObjectUrls();
        preview.replaceChildren();

        selectedFiles.forEach((file, index) => {
            const item = document.createElement('article');
            item.className = 'inquiry-upload__item';

            const mediaUrl = URL.createObjectURL(file);
            objectUrls.add(mediaUrl);

            const trigger = document.createElement('button');
            trigger.type = 'button';
            trigger.className = 'inquiry-upload__media';
            trigger.setAttribute('aria-label', `Preview ${file.name}`);
            trigger.addEventListener('click', () => {
                inquiryUploadViewer.open(file, mediaUrl);
            });

            if (file.type.startsWith('video/')) {
                const video = document.createElement('video');
                video.src = mediaUrl;
                video.muted = true;
                video.playsInline = true;
                video.preload = 'metadata';
                trigger.appendChild(video);
            } else {
                const image = document.createElement('img');
                image.src = mediaUrl;
                image.alt = file.name;
                trigger.appendChild(image);
            }

            item.appendChild(trigger);

            const details = document.createElement('div');
            details.className = 'inquiry-upload__item-details';

            const name = document.createElement('strong');
            name.textContent = file.name;
            details.appendChild(name);

            const meta = document.createElement('span');
            meta.textContent = fileSizeLabel(file.size);
            details.appendChild(meta);

            const actions = document.createElement('div');
            actions.className = 'inquiry-upload__item-actions';

            const viewButton = document.createElement('button');
            viewButton.type = 'button';
            viewButton.textContent = 'View';
            viewButton.addEventListener('click', () => {
                inquiryUploadViewer.open(file, mediaUrl);
            });
            actions.appendChild(viewButton);

            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', () => {
                selectedFiles = selectedFiles.filter((_, fileIndex) => fileIndex !== index);
                syncInputFiles();
                renderPreview();
            });
            actions.appendChild(removeButton);

            details.appendChild(actions);

            item.appendChild(details);
            preview.appendChild(item);
        });
    };

    input.addEventListener('change', () => {
        const incomingFiles = Array.from(input.files ?? []);

        if (incomingFiles.length === 0) {
            return;
        }

        const existingKeys = new Set(
            selectedFiles.map((file) => `${file.name}:${file.size}:${file.lastModified}`),
        );

        incomingFiles.forEach((file) => {
            const key = `${file.name}:${file.size}:${file.lastModified}`;

            if (!existingKeys.has(key)) {
                selectedFiles.push(file);
                existingKeys.add(key);
            }
        });

        syncInputFiles();
        renderPreview();
    });
});

const formatIndianDigits = (value: string) => {
    const digits = value.replace(/\D+/g, '').replace(/^0+(?=\d)/, '');

    if (digits === '') {
        return '';
    }

    if (digits.length <= 3) {
        return digits;
    }

    const lastThree = digits.slice(-3);
    let remaining = digits.slice(0, -3);
    const parts: string[] = [];

    while (remaining.length > 2) {
        parts.unshift(remaining.slice(-2));
        remaining = remaining.slice(0, -2);
    }

    if (remaining !== '') {
        parts.unshift(remaining);
    }

    return `${parts.join(',')},${lastThree}`;
};

document.querySelectorAll<HTMLInputElement>('input[name="budget_range_start"], input[name="budget_range_end"]').forEach((input) => {
    const applyBudgetFormat = () => {
        input.value = formatIndianDigits(input.value);
    };

    applyBudgetFormat();
    input.addEventListener('input', applyBudgetFormat);
    input.addEventListener('blur', applyBudgetFormat);
});

const inquirySubmitOverlay = document.querySelector<HTMLElement>('[data-inquiry-submit-overlay]');

document.querySelectorAll<HTMLFormElement>('[data-inquiry-submit-form]').forEach((form) => {
    let isSubmitting = false;

    form.addEventListener('submit', () => {
        if (isSubmitting) {
            return;
        }

        isSubmitting = true;
        inquirySubmitOverlay?.removeAttribute('hidden');
        inquirySubmitOverlay?.setAttribute('aria-hidden', 'false');
        form.setAttribute('aria-busy', 'true');

        const submitButtons = form.querySelectorAll<HTMLButtonElement>('button[type="submit"]');
        submitButtons.forEach((button) => {
            button.disabled = true;
        });
    });
});

const galleryRoot = document.querySelector<HTMLElement>('[data-products-gallery]');
const galleryFeed = document.querySelector<HTMLElement>('[data-products-feed]');
const gallerySentinel = document.querySelector<HTMLElement>('[data-products-sentinel]');
const galleryStatus = document.querySelector<HTMLElement>('[data-products-status]');
const galleryLoading = document.querySelector<HTMLElement>('[data-products-loading]');
const gallerySortForm = document.querySelector<HTMLFormElement>('[data-products-sort-form]');
const gallerySortInput = document.querySelector<HTMLInputElement>('[data-products-sort-input]');
const gallerySortMenu = document.querySelector<HTMLElement>('[data-products-sort-menu]');
const gallerySortToggle = document.querySelector<HTMLButtonElement>('[data-products-sort-toggle]');
const gallerySortCurrent = document.querySelector<HTMLElement>('[data-products-sort-current]');
const gallerySortOptions = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-products-sort-option]'));
const gallerySortOptionsPanel = document.querySelector<HTMLElement>('[data-products-sort-options]');
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

if (gallerySortForm && gallerySortInput && gallerySortMenu && gallerySortToggle && gallerySortOptionsPanel && gallerySortOptions.length > 0) {
    const closeGallerySort = () => {
        gallerySortToggle.setAttribute('aria-expanded', 'false');
        gallerySortOptionsPanel.hidden = true;
    };

    const openGallerySort = () => {
        gallerySortToggle.setAttribute('aria-expanded', 'true');
        gallerySortOptionsPanel.hidden = false;
    };

    const isGallerySortOpen = () => gallerySortToggle.getAttribute('aria-expanded') === 'true';

    const focusGallerySortOption = (index: number) => {
        const option = gallerySortOptions[index];

        if (option) {
            option.focus();
        }
    };

    gallerySortToggle.addEventListener('click', () => {
        if (isGallerySortOpen()) {
            closeGallerySort();
            return;
        }

        openGallerySort();
    });

    gallerySortToggle.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            openGallerySort();
            focusGallerySortOption(event.key === 'ArrowDown' ? 0 : gallerySortOptions.length - 1);
        }
    });

    gallerySortOptions.forEach((option, index) => {
        option.addEventListener('click', () => {
            const value = option.dataset.productsSortValue;

            if (!value) {
                return;
            }

            gallerySortInput.value = value;

            if (gallerySortCurrent) {
                gallerySortCurrent.textContent = option.textContent?.trim() ?? '';
            }

            gallerySortOptions.forEach((item) => {
                item.setAttribute('aria-selected', item === option ? 'true' : 'false');
            });

            closeGallerySort();
            gallerySortForm.requestSubmit();
        });

        option.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                closeGallerySort();
                gallerySortToggle.focus();
                return;
            }

            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                const nextIndex = event.key === 'ArrowDown'
                    ? (index + 1) % gallerySortOptions.length
                    : (index - 1 + gallerySortOptions.length) % gallerySortOptions.length;
                focusGallerySortOption(nextIndex);
                return;
            }

            if (event.key === 'Home' || event.key === 'End') {
                event.preventDefault();
                focusGallerySortOption(event.key === 'Home' ? 0 : gallerySortOptions.length - 1);
            }
        });
    });

    document.addEventListener('click', (event) => {
        if (!gallerySortMenu.contains(event.target as Node)) {
            closeGallerySort();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isGallerySortOpen()) {
            closeGallerySort();
            gallerySortToggle.focus();
        }
    });
}

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
                }, 3000);
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
