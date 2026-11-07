# UI interaction audit — 2026-11-07

Approved child-facing design: [spec](superpowers/specs/2026-11-07-child-card-collection.md).

## Verified by source audit and automated state/render tests

| Action/path | Expected location and focus behavior | Implementation |
| --- | --- | --- |
| Stamp details → 收好了 / close / Escape | Return to original circle at the same viewport | Shared closeModal → viewState.closeDialog |
| Modal replaced by another modal (PIN, child/reward edit, delete, help) | Preserve the first background trigger, not the replacement dialog button | Single dialog-origin snapshot |
| Parent setup/unlock, incorrect PIN, automatic locking | Render without scrolling; preserve active PIN input and dialog lock | capture/restore around render |
| Award or spend points, redeem a reward, save child/reward/PIN | Keep the initial viewport through async save and close; resolve replaced trigger | Stable attribute target + point-number fallback |
| Choose stamp or child | Preserve viewport and child-tab horizontal scroll | render snapshot + preventScroll focus |
| Change theme | Keep origin, modal position and selected card | shared mutate/render/close paths |
| Previous/next card or thumbnail | Keep the page still; reveal only the selected thumbnail within its vertical strip | container-only scrollTop |
| Reward mode filter | Same viewport and focus, no page navigation | render snapshot |
| History filter | Preserve selected filter, reserve list height, restore viewport | historyFilter + list minHeight + view state |
| Open rewards/history/settings, back to stamps | Restore previous position for that page and child; a new page starts at top | savePage/restorePage |
| Export backup, import failure | Shared modal origin and fixed background; errors stay in the dialog | shared backup dialog |
| Successful import | Deliberate return to home for the restored family | navigate('home') after closing |
| Add/remove children or rewards, start real family | Same shared modal and render protections; data rules unchanged | no custom focus/scroll escape paths |
| Tab / Shift-Tab | Remain inside dialog, focus without background scrolling | dialog focus trap |
| Mobile keyboard | No auto input focus on opening; fixed background and guarded frame restoration on close | focus dialog section; generation guard |

## Verification limits

No required cua_repl/browser-control tool is available in this environment. This audit is **not** a claim of physical-device, real-browser, touch, or visual regression testing. iOS keyboard viewport behavior and actual appearance still require manual browser/device verification. Simulated view-state tests verify the focus/scroll contract and all dialog route classes.

## Follow-up card review

The collection rail is sticky within the sheet row and scrolls vertically. Card selection preserves the page viewport and updates only the rail's scrollTop when needed. Previous/next controls and the inline palette retain accessible labels despite having no visible text. Five grid columns are preserved on all phone breakpoints; stamp-circle artwork stays circular within the touch target. Filled circles keep their accessible point number and detail action, but do not render a visible number overlay.
