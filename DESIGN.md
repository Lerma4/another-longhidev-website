# LonghiDev home design

This document describes the current implementation. The home takes composition cues from UMANO Design Studio: a centered light capsule navigation, a centered headline with a changing service label, and a large device preview below. Desktop uses a laptop frame; screens under 640px use a phone frame with layouts adapted to a vertical viewport. The layouts, text, colors, and interface concepts are original LonghiDev work.

The page is a visual demo for Italian businesses, professionals, and startups. It presents software development for management tools, ecommerce, and websites. Product names and interface data are fictional and labeled as concepts; no customer, testimonial, performance, or business outcome claims are made.

## Palette and type

The site uses the light `#f7f7f4` canvas with a `#f2e9ea` supporting field. Logo burgundy `#6b0911` is reserved for actions and selected details; logo gray `#545454` is used for secondary text. The device contains light product surfaces. The ecommerce preview keeps its own warm product styling, while the exhibition preview uses a locally generated gallery photograph. [`.impeccable/design.json`](.impeccable/design.json) records the implementation tokens and interactions.

Outfit Variable is self-hosted for body and interface text, giving the page a softer geometric and playful tone. Georgia is used for the exhibition title's italic emphasis. The supplied transparent LonghiDev logo is shown in the header.

## Layout and motion

The compact sticky header capsule contains the logo at left, `Lavoro` centered, and `cominciamo` at right. The hero has a static software development headline and a service term that rotates among management software, ecommerce, and websites. Below it, a laptop frame contains three compact HTML concept screens: a management dashboard, an ecommerce product page, and an art exhibition site.

Visitors can choose a screen with the visible buttons, horizontal swipe, or left and right arrow keys while the laptop is focused. The demo rotates slowly until the visitor makes a manual choice. It pauses when the laptop leaves view or the browser tab is hidden. Reduced-motion preferences disable autoplay and the changing-word animation; the controls remain available.

At narrow widths, the hero and phone use a natural content height, the navigation stays on one line, and screen controls retain 44px touch targets. Each phone view is a vertical layout; the phone screen scrolls vertically without blocking page scrolling. The form follows the hero and remains a compact second step.

## Local demo interactions

The `cominciamo` link opens a contact form with visible labels and native field validation. Submitting valid fields sends the request to the private contact intake through the site's server endpoint.

The ecommerce `Aggiungi al carrello` control increments a local count and changes its label to confirm the action. It is only an interface demo: it creates no order and stores no cart data.

## Accessibility and assets

The page uses Italian language metadata, semantic landmarks, a skip link, visible keyboard focus, and labeled concept screens. Inactive laptop views are removed from keyboard interaction with `inert`. The contact status and cart count use polite live regions. The static text gives screen-reader users the complete list of services.

The product photo and generated gallery photo are local assets. The supplied logo and self-hosted font files are local as well; the home has no animation library or remote media runtime.

## Current limits

The art exhibition, product shop, management tool, names, dates, and data are fictional concepts. The cart remains a local demonstration; the contact form submits actual inquiries.
