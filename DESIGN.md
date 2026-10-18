# LonghiDev home design

This document describes the current implementation. The home takes composition cues from UMANO Design Studio: a centered light capsule navigation, a centered headline with a changing service label, and a large device preview below. Desktop uses a laptop frame; screens under 640px use a phone frame with layouts adapted to a vertical viewport. The layouts, text, colors, and interface concepts are original LonghiDev work.

The page is a visual demo for Italian businesses, professionals, and startups. It presents software development for management tools, ecommerce, and websites. Product names and interface data are fictional and labeled as concepts; no customer, testimonial, performance, or business outcome claims are made.

## Palette and type

The site uses the light `#f7f7f4` canvas with a `#f2e9ea` supporting field. Logo burgundy `#6b0911` is reserved for actions and selected details; logo gray `#545454` is used for secondary text. The device contains light product surfaces. The ecommerce preview keeps its own warm product styling, while the exhibition preview uses a locally generated gallery photograph. [`.impeccable/design.json`](.impeccable/design.json) records the implementation tokens and interactions.

Outfit Variable is self-hosted for body and interface text, giving the page a softer geometric and playful tone. Georgia is used for the exhibition title's italic emphasis. The supplied transparent LonghiDev logo is shown in the header.

## Layout and motion

The compact sticky header capsule contains the logo at left, `Lavoro` centered, and `cominciamo` at right. The hero has a static software development headline and a service term that rotates among management software, ecommerce, and websites. Below it, a laptop frame contains three compact HTML concept screens: a management dashboard, an ecommerce product page, and an art exhibition site.

The device is a non-interactive HyperFrames composition, embedded with `@hyperframes/player` and driven by one paused GSAP timeline. It loops every 9 seconds, with roughly three seconds per service, coordinated screen transitions and scripted product details. There are no scene-selection controls, swipe gestures, or clickable demo actions. A discreet pause/resume control remains for accessibility. Playback stops offscreen or in a hidden tab; reduced-motion preferences show a still frame and the complete service list.

Desktop and mobile compositions share the device markup and timeline, with native canvases of 1120×680 and 390×720 respectively. Each is scaled proportionally by the player. On desktop and landscape tablets, the film is bounded by the viewport space remaining below the heading and above the pause control. Portrait tablets and phones retain a natural page height; small phone screens scroll the page rather than crop or excessively shrink the film. The service term uses a staggered letter-flip entrance synchronized to scene changes, with natural text width instead of a fixed reserved gap. The mobile film shows vertical phone layouts without internal scrolling. The form follows the hero and remains a compact second step.

## Local demo interactions

The `cominciamo` link opens a contact form with visible labels and native field validation. Submitting valid fields sends the request to the private contact intake through the site's server endpoint.

The ecommerce add-to-cart action is scripted on the film's timeline, not triggered by visitors. It creates no order and stores no cart data.

## Accessibility and assets

The page uses Italian language metadata, semantic landmarks, a skip link, and visible keyboard focus. The decorative player is inert and hidden from assistive technology; a static accessible description lists all three services. Contact feedback retains its polite live region.

The product photo, generated gallery photo, logo, font, player, and GSAP are served locally. HyperFrames runtime 0.8.171 is vendored from `@hyperframes/core` in `public/vendor/hyperframes/` with its MIT license; update that file deliberately alongside the player version. No remote CDN is required for playback.

## Current limits

The art exhibition, product shop, management tool, names, dates, and data are fictional concepts. The cart remains a local demonstration; the contact form submits actual inquiries.
