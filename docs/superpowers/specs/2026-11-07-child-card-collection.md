# Child card collection — approved design

The user approved the card-collection-book proposal on 2026-11-07. Keep the existing ledger, PIN protection, child themes, PNG stamps, and all three reward rules.

- A physical-looking large stamp sheet with layered paper edges, actual stamp thumbnails, a complete/growing sticker, and large previous/next controls replaces the visible fractional page counter. Accessible labels may retain exact page counts.
- Circle numbers occupy approximately 70–80% of circle height in a translucent theme color. Multi-digit numbers fit without clipping; stamps remain visible.
- Child controls have 56–64 px minimum target height, primary labels 20–24 px, supporting copy 16 px, large gaps, short verbs, image cues, and visible selection states.
- Closing any dialog returns focus to its original trigger without scrolling. Dialog chains preserve the initial origin. In-place child, stamp, theme, card, filter and parent actions preserve viewport and nested scroll positions. Real page navigation remembers each page's return position.
- Audit all dialogs, form submissions, automatic locking, keyboard focus and history filters. Do not claim actual browser testing when the required browser environment is unavailable.

## Follow-up browser review, 2026-11-07

- Move actual preview thumbnails to a sticky vertical rail beside the stamp sheet. Remove visible completion/growing labels, the encouragement eyebrow and the old bottom status section.
- Previous/next and theme controls display icons only, retaining accessible names. Put the theme palette directly after the current theme name.
- Phone grids always have at least five columns. On narrow phones preserve 56 px-high hit areas while drawing smaller true circles inside their available column width.
- Center empty-circle watermarks using zero letter spacing and tabular numerals. Filled circles render their PNG stamp without a visible numeral overlay.
- Preserve stable viewport/dialog behavior and all three reward modes.
