<footer class="site-footer">
    <div class="site-footer__inner">
        <div class="footer-grid">
            <section class="site-footer__panel">
                <h2>About</h2>
                <p class="site-footer__about-copy">We shape custom wooden pieces for homes, studios, and hospitality spaces with calm materials and thoughtful detail.</p>
                @if (($socialLinks ?? collect())->isNotEmpty())
                    <div class="site-footer__socials">
                        @foreach (($socialLinks ?? collect())->take(4) as $link)
                            @php
                                $platform = strtolower($link->platform_key ?? $link->platform ?? 'social');
                                $platformName = ucfirst($platform);
                            @endphp
                            <a class="site-footer__social-link" href="{{ $link->url }}" target="_blank" rel="noopener noreferrer" aria-label="{{ $platformName }}">
                                @if ($platform === 'facebook')
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3a5 5 0 0 0-5 5v3H6v4h3v6h4v-6h3l1-4h-4V9a1 1 0 0 1 1-1Z"/></svg>
                                @elseif ($platform === 'instagram')
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z"/><path d="M17.5 6.5h.01"/></svg>
                                @elseif ($platform === 'pinterest')
                                    <svg class="site-footer__social-icon--brand" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.27 2 11.54c0 3.89 2.46 7.23 5.98 8.73-.08-.73-.16-1.86.03-2.66.17-.72 1.1-4.59 1.1-4.59s-.28-.55-.28-1.38c0-1.29.75-2.25 1.69-2.25.8 0 1.18.59 1.18 1.31 0 .79-.51 1.98-.77 3.09-.22.92.46 1.68 1.38 1.68 1.66 0 2.94-1.74 2.94-4.25 0-2.22-1.61-3.77-3.9-3.77-2.66 0-4.22 1.98-4.22 4.03 0 .8.31 1.65.7 2.12.08.09.09.17.06.27-.07.29-.23.94-.27 1.08-.04.18-.14.22-.32.13-1.2-.55-1.95-2.29-1.95-3.69 0-3 2.2-5.76 6.34-5.76 3.33 0 5.92 2.35 5.92 5.51 0 3.29-2.09 5.93-4.99 5.93-.98 0-1.89-.5-2.2-1.09l-.6 2.26c-.22.82-.8 1.84-1.19 2.46.9.27 1.85.41 2.83.41 5.52 0 10-4.27 10-9.54S17.52 2 12 2Z"/></svg>
                                @elseif (in_array($platform, ['twitter', 'x', 'x-twitter', 'twitter-x'], true))
                                    <svg class="site-footer__social-icon--brand" viewBox="0 0 24 24" aria-hidden="true"><path d="M13.9 10.47 21.35 2h-1.77l-6.46 7.35L7.96 2H2l7.82 11.14L2 22h1.77l6.84-7.78L16.08 22H22l-8.1-11.53Zm-2.42 2.75-.79-1.11L4.38 3.3h2.73l5.08 7.1.79 1.11 6.61 9.24h-2.73l-5.38-7.53Z"/></svg>
                                @elseif ($platform === 'linkedin')
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 1 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                                @else
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18"/><path d="M12 3a15 15 0 0 0 0 18"/></svg>
                                @endif
                            </a>
                        @endforeach
                    </div>
                @endif
            </section>

            <section class="site-footer__panel">
                <h2>Useful Links</h2>
                <nav class="site-footer__links" aria-label="Footer navigation">
                    <a href="{{ route('public.products.index') }}">Our Crafts</a>
                    <a href="{{ route('public.pages.about') }}">Our Journey</a>
                    <a href="{{ route('public.contact.show') }}">Connect With Us</a>
                </nav>
            </section>

            <section class="site-footer__panel">
                <h2>Contact</h2>
                <div class="site-footer__contact">
                    @if ($contactInformation?->address_primary)
                        <p>{{ $contactInformation->address_primary }}</p>
                    @endif
                    @if ($contactInformation?->email_primary)
                        <a class="site-footer__contact-link" href="mailto:{{ $contactInformation->email_primary }}">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v.4l-10 6.25L2 6.4V6a2 2 0 0 1 2-2Zm18 5.1-9.47 5.92a1 1 0 0 1-1.06 0L2 9.1V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9.1Z"/></svg>
                            <span>{{ $contactInformation->email_primary }}</span>
                        </a>
                    @endif
                    @if ($contactInformation?->phone_primary)
                        <a class="site-footer__contact-link" href="tel:{{ $contactInformation->phone_primary }}">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.52 19.52 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.63 2.62a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.46-1.29a2 2 0 0 1 2.11-.45c.84.3 1.72.51 2.62.63A2 2 0 0 1 22 16.92Z"/></svg>
                            <span>{{ $contactInformation->phone_primary }}</span>
                        </a>
                    @endif
                    @if ($contactInformation?->whatsapp_number)
                        <a class="site-footer__contact-link" href="https://wa.me/{{ preg_replace('/\D+/', '', $contactInformation->whatsapp_number) }}?text={{ urlencode($contactInformation->whatsapp_text ?? '') }}">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.6 14.1c-.2-.1-1.3-.6-1.5-.7s-.3-.1-.4.1-.6.7-.7.8-.2.1-.4 0a6.1 6.1 0 0 1-1.8-1.1 6.74 6.74 0 0 1-1.2-1.5c-.1-.2 0-.3.1-.4l.3-.3c.1-.1.1-.2.2-.3s0-.2 0-.3-.4-1.1-.6-1.5c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3s-.8.8-.8 1.9.8 2.1.9 2.2 1.6 2.4 3.9 3.3c.5.2 1 .4 1.4.5.6.2 1.1.2 1.5.1.5-.1 1.3-.5 1.5-1 .2-.5.2-1 .1-1.1s-.2-.1-.4-.2Z"/><path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A8 8 0 1 1 12 20Z"/></svg>
                            <span>WhatsApp</span>
                        </a>
                    @endif
                </div>
            </section>
        </div>

        <div class="site-footer__bottom">
            <p>All Rights Reserved {{ now()->year }}.</p>
            <div class="site-footer__legal">
                <a href="{{ route('public.pages.privacy') }}">Privacy Policy</a>
                <a href="{{ route('public.pages.terms') }}">Terms & Conditions</a>
            </div>
        </div>
    </div>
</footer>
