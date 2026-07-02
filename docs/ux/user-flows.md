# User Flows

## Flow Principles

- Every major flow should keep the visitor one step away from discovery or inquiry.
- No flow should introduce ecommerce expectations such as cart or checkout.
- Instagram and Google Maps are excluded from current implementation flows unless approved later.

## Visitor Flow: Search Discovery To Product Inquiry

1. Visitor lands on Home, Collections, Products, or Product detail from search.
2. Visitor evaluates page relevance from heading, imagery, and metadata-aligned content.
3. Visitor navigates into Collections or Products.
4. Visitor opens a Product detail page.
5. Visitor reviews imagery and specifications.
6. Visitor submits product inquiry or opens WhatsApp.

## Visitor Flow: Collections-Led Discovery

1. Visitor enters Collections index from navigation or homepage.
2. Visitor chooses a collection card.
3. Visitor reviews collection context and associated products.
4. Visitor opens a Product detail page.
5. Visitor inquires or continues browsing related products.

## Visitor Flow: Product Search And Filter

1. Visitor opens Products index.
2. Visitor uses search, category, or collection filters.
3. Visitor reviews result count and product cards.
4. Visitor resets filters if zero results occur.
5. Visitor opens a Product detail page.

## Visitor Flow: General Contact

1. Visitor opens Contact from header, footer, or CTA.
2. Visitor reviews approved contact channels.
3. Visitor submits the form or uses phone, email, or WhatsApp.
4. Visitor receives submission confirmation or channel handoff.

## Visitor Flow: Recovery From 404

1. Visitor lands on an invalid route.
2. System shows a clear not-found page with recovery links.
3. Visitor returns to Home, Products, Collections, or Contact.

## Admin Flow: Product Publishing

1. Admin signs in.
2. Admin creates or edits a product record.
3. Admin assigns category and collections.
4. Admin uploads featured and gallery images.
5. Admin adds SEO data and editorial flags.
6. Admin publishes the product.

## Admin Flow: Homepage Curation

1. Admin signs in.
2. Admin opens homepage content management.
3. Admin edits section copy and ordering.
4. Admin selects collections or products for editorial sections.
5. Admin hides unused optional sections.
6. Admin saves publishing changes.

## Admin Flow: Inquiry Handling

1. Admin signs in.
2. Admin opens Inquiries.
3. Admin filters by status, source, or assignment.
4. Admin reviews the inquiry details.
5. Admin records notes, reply status, or assignment.
6. Admin exports or archives when appropriate.

## Flow-Level Error And Recovery Expectations

- Empty product searches should offer reset actions.
- Missing collection or product routes should return 404 rather than ambiguous fallback content.
- Form failures should preserve user confidence with clear messaging in later implementation.
- Hidden or unpublished content should disappear from public flows instead of exposing placeholder states.
