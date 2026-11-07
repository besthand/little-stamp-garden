# Child Card Collection Implementation Plan

> Implement directly in the current authorized session, using the executing-plans workflow. The user approved the design; no additional approval gate is needed.

**Goal:** Make the game resemble a child's collection of stamp cards and eliminate incidental viewport movement.

**Architecture:** Keep the existing static ES modules and ledger. Add a small UI-state module for focus/scroll/dialog state, and render a window of real card thumbnails from stampCardView. Use new raster paper/sticker assets and a scoped child-size stylesheet.

**Tech Stack:** Browser ES modules, IndexedDB, Web Crypto, CSS, Python Pillow, Node tests.

**Spec:** ../specs/2026-11-07-child-card-collection.md

## Global constraints

- No ledger migration, reward-rule changes, or removal of parent authorization.
- Preserve all four themes and PNG stamps. Child targets >=56 px, primary labels 20–24 px, supporting copy >=16 px.
- Publish the existing Site with its current audience and update the existing GitHub main branch without force.

## Review focus

- Opening, replacing and closing every dialog must preserve the original trigger and viewport, including after rerender.
- Multi-card boundaries and very large balances must not render unbounded thumbnail lists.
- Mobile layouts must keep circle targets >=56 px and fit multi-digit watermark numbers.
- Authentication and form submissions must preserve their focus and original location through rerenders.
- Filtering or shrinking content and automatic locking must not clamp the page unexpectedly.

## Task 1: Stable UI state

- [x] Add failing tests for dialog replacement/closing, rerendered triggers, viewport and horizontal-container preservation, and page return positions.
- [x] Implement dist/ui-state.js and integrate all focus/scroll paths in dist/app.js, including dialogs, render, actions, filters and auto-lock.
- [x] Run Node tests and syntax checks; audit every action and submit path.

## Task 2: Child collection book

- [x] Update render tests for thumbnails, completion/growing labels, bounded thumbnail rendering and no visible fractional page UI.
- [x] Generate PNG paper and sticker assets; render layered card sheet, actual stamp thumbnails and large card controls.
- [x] Apply the approved child typography, watermark numbers and touch targets across home, reward, theme and detail controls.
- [x] Verify ledger/reward tests and responsive CSS constraints; document browser verification limits.

## Task 3: Delivery

- [x] Update README; run npm test, npm run check, git diff --check.
- [ ] Push exact changes to GitHub and Sites; package matching static artifact and deploy to the existing Site.
- [ ] Confirm native deployment success and provide the URL.
