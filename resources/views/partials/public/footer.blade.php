<footer class="site-footer">
    <div class="footer-grid">
        <div>
            <p class="footer-brand">{{ $siteSettings?->site_name ?? config('app.name') }}</p>
            <p>Premium catalogue presentation for handcrafted wooden decor. Final business copy remains CMS-managed.</p>
        </div>
        <div>
            <h2>Explore</h2>
            <a href="{{ route('public.products.index') }}">Products</a>
            <a href="{{ route('public.pages.about') }}">About Us</a>
            <a href="{{ route('public.pages.craftsmanship') }}">Our Craftsmanship</a>
            <a href="{{ route('public.contact.show') }}">Contact</a>
        </div>
        <div>
            <h2>Categories</h2>
            @forelse ($footerCategories as $category)
                <a href="{{ route('public.products.index', ['category' => $category->slug]) }}">{{ $category->name }}</a>
            @empty
                <p>Categories will appear when added in CMS.</p>
            @endforelse
        </div>
        <div>
            <h2>Contact</h2>
            @if ($contactInformation?->show_phone && $contactInformation->phone_primary)
                <a href="tel:{{ $contactInformation->phone_primary }}">{{ $contactInformation->phone_primary }}</a>
            @endif
            @if ($contactInformation?->show_email && $contactInformation->email_primary)
                <a href="mailto:{{ $contactInformation->email_primary }}">{{ $contactInformation->email_primary }}</a>
            @endif
            @if ($contactInformation?->show_whatsapp && $contactInformation->whatsapp_number)
                <a href="https://wa.me/{{ preg_replace('/\D+/', '', $contactInformation->whatsapp_number) }}">WhatsApp inquiry</a>
            @endif
            <a href="{{ route('public.pages.privacy') }}">Privacy Policy</a>
            <a href="{{ route('public.pages.terms') }}">Terms and Conditions</a>
        </div>
    </div>
</footer>
