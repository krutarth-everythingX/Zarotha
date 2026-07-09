import { createRoot, type Root } from 'react-dom/client';
import type { IconType } from 'react-icons';
import {
    FaFacebookF,
    FaGlobe,
    FaInstagram,
    FaLinkedinIn,
    FaPinterestP,
    FaWhatsapp,
    FaXTwitter,
    FaYoutube,
} from 'react-icons/fa6';

const iconMap: Record<string, IconType> = {
    facebook: FaFacebookF,
    instagram: FaInstagram,
    linkedin: FaLinkedinIn,
    pinterest: FaPinterestP,
    whatsapp: FaWhatsapp,
    x: FaXTwitter,
    youtube: FaYoutube,
};

const roots = new WeakMap<HTMLElement, Root>();

export function mountContactSocialIcons(): void {
    document.querySelectorAll<HTMLElement>('[data-social-icon]').forEach((element) => {
        const platform = element.dataset.socialIcon ?? '';
        const Icon = iconMap[platform] ?? FaGlobe;
        const root = roots.get(element) ?? createRoot(element);

        if (!roots.has(element)) {
            roots.set(element, root);
        }

        root.render(
            <Icon
                aria-hidden="true"
                focusable="false"
                className="contact-socials__react-icon"
            />,
        );
    });
}
