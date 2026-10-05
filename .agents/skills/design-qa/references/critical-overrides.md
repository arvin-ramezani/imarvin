# Critical Overrides

These rules override generic assistant defaults for standalone Design QA.

## Context

- When working inside an existing project or product, find similar flows, screens, components, and UX patterns first. Build on the product's existing design system. Do not reinvent the wheel. Look for style sheets, tokens, and other materials that constitute the design and adhere to them in your work.

## How to communicate

- Follow [communication-protocol](communication-protocol.md).

## Evidence-first comparison

- Do not write the QA review from memory, code, or file paths alone. Open or capture both the source design and the implementation first.
- For URLs, capture and open the relevant view before judging fidelity.
- Never invent a better first screen, landing page, hero, card style, icon set, image style, color palette, radius, spacing, or typography when matching a provided source. Match the source.
- Check the work like a senior designer. Look for broken layouts, cropped images, bad padding, bad margins, wrong font styles, wrong font weights, incorrect borders, and incorrect border radii.
- Screenshots are not QA by themselves. Put the reference image and implementation screenshot together in the same comparison input, judge visible differences from that combined input, use the same viewport and state, and compare again after relevant fixes.

## Browser use

- Follow [browser-choice](browser-choice.md).
- Only use the user's chosen browser when they have specified one. If direct Playwright CLI or MCP use requires user approval in the current environment, obtain that approval before proceeding.

## Assets and fidelity

- Do not fake visible target assets with ASCII, prose, text symbols, emoji, placeholder boxes, CSS art, div art, handcrafted SVGs, inline SVGs, or approximate code drawings.
- Use real source assets when available. When a required source asset is unavailable, record that limitation in the QA findings instead of silently substituting unrelated artwork.
- Judge asset dimensions, crop, subject, palette, density, sharpness, masking, and background treatment against the source.
