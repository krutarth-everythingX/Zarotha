<?php

namespace App\Support;

use DOMDocument;
use DOMElement;
use DOMNode;
use DOMText;

class HtmlSanitizer
{
    /**
     * @var array<string, array<int, string>>
     */
    private const ALLOWED_TAGS = [
        'a' => ['href', 'title', 'target', 'rel'],
        'blockquote' => [],
        'br' => [],
        'em' => [],
        'h1' => [],
        'h2' => [],
        'h3' => [],
        'h4' => [],
        'h5' => [],
        'h6' => [],
        'hr' => [],
        'li' => [],
        'ol' => [],
        'p' => [],
        'strong' => [],
        'ul' => [],
    ];

    public static function sanitize(?string $html): ?string
    {
        if ($html === null) {
            return null;
        }

        $html = trim($html);

        if ($html === '') {
            return null;
        }

        $document = new DOMDocument('1.0', 'UTF-8');
        $previous = libxml_use_internal_errors(true);
        $document->loadHTML(
            '<?xml encoding="utf-8" ?><body>'.$html.'</body>',
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD,
        );
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        /** @var DOMElement|null $body */
        $body = $document->getElementsByTagName('body')->item(0);

        if (! $body instanceof DOMElement) {
            return null;
        }

        self::sanitizeNode($body);

        $sanitized = '';

        foreach ($body->childNodes as $childNode) {
            $sanitized .= $document->saveHTML($childNode);
        }

        return trim($sanitized) !== '' ? trim($sanitized) : null;
    }

    private static function sanitizeNode(DOMNode $node): void
    {
        for ($child = $node->firstChild; $child !== null; $child = $next) {
            $next = $child->nextSibling;

            if ($child instanceof DOMText) {
                continue;
            }

            if (! $child instanceof DOMElement) {
                $node->removeChild($child);
                continue;
            }

            $tagName = strtolower($child->tagName);

            if (! array_key_exists($tagName, self::ALLOWED_TAGS)) {
                self::unwrapNode($child);
                continue;
            }

            self::sanitizeAttributes($child, self::ALLOWED_TAGS[$tagName]);
            self::sanitizeNode($child);
        }
    }

    /**
     * @param  array<int, string>  $allowedAttributes
     */
    private static function sanitizeAttributes(DOMElement $element, array $allowedAttributes): void
    {
        $attributesToRemove = [];

        foreach ($element->attributes as $attribute) {
            $attributeName = strtolower($attribute->nodeName);

            if (
                str_starts_with($attributeName, 'on')
                || ! in_array($attributeName, $allowedAttributes, true)
            ) {
                $attributesToRemove[] = $attribute->nodeName;
                continue;
            }

            if ($attributeName === 'href' && ! self::isSafeUrl($attribute->nodeValue)) {
                $attributesToRemove[] = $attribute->nodeName;
            }
        }

        foreach ($attributesToRemove as $attributeName) {
            $element->removeAttribute($attributeName);
        }

        if (strtolower($element->tagName) === 'a') {
            $target = strtolower((string) $element->getAttribute('target'));

            if ($target === '_blank') {
                $element->setAttribute('rel', 'noopener noreferrer');
            } else {
                $element->removeAttribute('target');
                $element->removeAttribute('rel');
            }
        }
    }

    private static function isSafeUrl(string $url): bool
    {
        $url = trim($url);

        if ($url === '') {
            return false;
        }

        if (
            str_starts_with($url, '/')
            || str_starts_with($url, '#')
            || str_starts_with($url, 'mailto:')
            || str_starts_with($url, 'tel:')
        ) {
            return true;
        }

        $scheme = strtolower((string) parse_url($url, PHP_URL_SCHEME));

        return in_array($scheme, ['http', 'https'], true);
    }

    private static function unwrapNode(DOMElement $element): void
    {
        $parent = $element->parentNode;

        if ($parent === null) {
            return;
        }

        while ($element->firstChild !== null) {
            $parent->insertBefore($element->firstChild, $element);
        }

        $parent->removeChild($element);
    }
}
