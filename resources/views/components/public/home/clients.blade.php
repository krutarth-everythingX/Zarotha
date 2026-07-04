@props(['clients', 'title' => 'Our Clients', 'subtitle' => null])

@php
    $heading = trim((string) $title) ?: 'Our Clients';
    $intro = trim((string) ($subtitle ?? ''));
    $headingParts = preg_split('/\s+/', $heading);
    $lastWord = $headingParts ? array_pop($headingParts) : '';
    $leadingHeading = trim(implode(' ', $headingParts));
    $visibleClients = collect($clients ?? [])->filter(fn ($client) => $client->is_active ?? true)->values();
    $items = $visibleClients->isNotEmpty()
        ? $visibleClients
        : collect([(object) [
            'name' => config('app.name', 'Zarokha Wooden Arts'),
            'website_url' => null,
            'logoMedia' => null,
        ]]);
    $marqueeItems = collect();
    while ($marqueeItems->count() < max(10, $items->count())) {
        $marqueeItems = $marqueeItems->concat($items);
    }
    $marqueeItems = $marqueeItems->values();
@endphp

<section class="home-clients" aria-labelledby="home-clients-title">
    <div class="home-clients__inner">
        <div class="home-clients__heading">
            <h2 id="home-clients-title">
                @if ($leadingHeading !== '')
                    {{ $leadingHeading }} <strong>{{ $lastWord }}</strong>
                @else
                    <strong>{{ $lastWord }}</strong>
                @endif
            </h2>
            @if ($intro !== '')
                <p>{{ $intro }}</p>
            @endif
        </div>

        <div class="home-clients__marquee" aria-label="Client logos">
            <div class="home-clients__track">
                @foreach ([0, 1] as $copyIndex)
                    <div class="home-clients__group" @if ($copyIndex === 1) aria-hidden="true" @endif>
                    @foreach ($marqueeItems as $client)
                        @php
                            $logo = $client->logoMedia ?? null;
                            $image = $logo?->responsiveImage('220px');
                            $imageAlt = $logo?->alt_text ?: $client->name;
                            $websiteUrl = trim((string) ($client->website_url ?? ''));
                            $host = $websiteUrl !== '' ? parse_url($websiteUrl, PHP_URL_HOST) : null;
                            $externalLogoUrl = is_string($host) && $host !== ''
                                ? 'https://www.google.com/s2/favicons?domain='.urlencode(strtolower($host)).'&sz=128'
                                : null;
                            $initials = collect(preg_split('/\s+/', trim((string) $client->name)) ?: [])
                                ->filter()
                                ->take(2)
                                ->map(fn ($word) => mb_strtoupper(mb_substr($word, 0, 1)))
                                ->implode('');
                        @endphp

                        @if ($websiteUrl !== '')
                            <a class="home-clients__item" href="{{ $websiteUrl }}" target="_blank" rel="noopener noreferrer" aria-label="{{ $client->name }}" @if ($copyIndex === 1) tabindex="-1" @endif>
                                @if ($logo && $image && $image['src'])
                                    <img
                                        src="{{ $image['src'] }}"
                                        srcset="{{ $image['srcset'] }}"
                                        sizes="{{ $image['sizes'] }}"
                                        width="{{ $image['width'] }}"
                                        height="{{ $image['height'] }}"
                                        alt="{{ $imageAlt }}"
                                        loading="lazy"
                                    >
                                @elseif ($externalLogoUrl)
                                    <img src="{{ $externalLogoUrl }}" alt="{{ $client->name }}" loading="lazy">
                                @else
                                    <span class="home-clients__fallback">{{ $initials ?: $client->name }}</span>
                                @endif
                            </a>
                        @else
                            <div class="home-clients__item" role="img" aria-label="{{ $client->name }}">
                                @if ($logo && $image && $image['src'])
                                    <img
                                        src="{{ $image['src'] }}"
                                        srcset="{{ $image['srcset'] }}"
                                        sizes="{{ $image['sizes'] }}"
                                        width="{{ $image['width'] }}"
                                        height="{{ $image['height'] }}"
                                        alt="{{ $imageAlt }}"
                                        loading="lazy"
                                    >
                                @else
                                    <span class="home-clients__fallback">{{ $initials ?: $client->name }}</span>
                                @endif
                            </div>
                        @endif
                    @endforeach
                    </div>
                @endforeach
            </div>
        </div>
    </div>
</section>
