<header class="site-header" data-site-header>
    <!-- <div class="topbar">
        <span>{{ $contactInformation?->business_name ?: config('app.name') }}</span>
        <span>Inquiry-based handcrafted wooden decor catalogue</span>
    </div> -->
    @php
        $drawerSocialLinks = ($siteSettings?->show_social_links_on_hero ?? false)
            ? ($socialLinks ?? collect())->filter(function ($link) {
                return in_array(strtolower($link->platform_key ?? $link->platform), ['facebook', 'instagram'], true);
            })->sortBy(function ($link) {
                return ['facebook' => 0, 'instagram' => 1][strtolower($link->platform_key ?? $link->platform)] ?? 99;
            })->values()
            : collect();
    @endphp
    <button class="site-nav-backdrop" type="button" data-menu-backdrop aria-label="Close navigation"></button>
    <div class="nav-shell">
        <a href="{{ route('public.home') }}" class="brand" aria-label="{{ config('app.name') }} home">
            <span>{{ $siteSettings?->site_name ?? config('app.name') }}</span>
        </a>
        <button class="mobile-menu-button" type="button" data-menu-toggle aria-expanded="false" aria-controls="site-navigation" aria-label="Toggle navigation">
            <span></span>
        </button>
        <nav id="site-navigation" class="site-nav" data-site-nav aria-label="Primary navigation">
            <div class="site-nav__drawer-header">
                <span>ZAROKHA WOODEN ARTS</span>
                <button class="site-nav__close" type="button" data-menu-close aria-label="Close navigation">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
            </div>
            <a href="{{ route('public.home') }}" class="{{ request()->routeIs('public.home') ? 'is-active' : '' }}">Home</a>
            <a href="{{ route('public.products.index') }}" class="{{ request()->routeIs('public.products.*') ? 'is-active' : '' }}">Products</a>
            <a href="{{ route('public.pages.about') }}" class="{{ request()->routeIs('public.pages.about') ? 'is-active' : '' }}">About Us</a>
            <a href="{{ route('public.contact.show') }}" class="site-nav__mobile-link lg:hidden md:hidden {{ request()->routeIs('public.contact.*') ? 'is-active' : '' }}">Contact</a>

            <div class="site-nav__drawer-footer">
                @if ($contactInformation?->whatsapp_number)
                    <a class="site-nav__inquiry" href="https://wa.me/{{ preg_replace('/[^0-9]/', '', $contactInformation->whatsapp_number) }}?text={{ urlencode($contactInformation->whatsapp_text ?? '') }}" target="_blank" rel="noopener noreferrer" aria-label="Inquiry on WhatsApp">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                    </a>
                @endif

                @if ($drawerSocialLinks->isNotEmpty())
                    <div class="site-nav__socials" aria-label="Social links">
                        @foreach ($drawerSocialLinks as $link)
                            @php
                                $platform = strtolower($link->platform_key ?? $link->platform);
                                $platformName = ucfirst($platform);
                            @endphp
                            <a class="site-nav__social-link" href="{{ $link->url }}" target="_blank" rel="noopener noreferrer" aria-label="{{ $platformName }}">
                                @if ($platform === 'facebook')
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                                @else
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                                @endif
                            </a>
                        @endforeach
                    </div>
                @endif
            </div>
        </nav>
        <a class="nav-cta" href="{{ route('public.contact.show') }}">Contact</a>
    </div>
</header>
