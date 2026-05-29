# Achievement Unlock UI – Plan and Research

## Problem
The current achievement-unlock presentation (full-screen blur + dim + centered card) feels heavy and inconsistent. Opacity/blur behavior and “instant” vs animated appearance have been hard to tune.

## Research Summary

### Apple / HIG
- **Minimize modality** – Use modal/overlay only when critical for attention or to complete a task.
- **Clear exit** – User should always know how to dismiss.
- **Simple and focused** – Achievement content should be short and clear.
- **Appropriate style** – Choose full-screen, sheet, or a lighter treatment based on how much interruption is justified.

### Common patterns (games, Duolingo, Memrise, Dribbble/Mobbin)
- **Full-screen overlay** – Used for “big” moments (e.g. Duolingo rewards); can feel heavy for small wins.
- **Sliding card / banner** – “Slide down or fade in from the top while pushing other content”; feels like celebration without fully blocking the screen.
- **Toast / inline banner** – Minimal: icon + title, auto-dismiss or tap to dismiss; least intrusive.
- **Content** – Celebration message, visual (badge/icon), short description, and a clear primary action (e.g. “Awesome!” or “View”).

### Technical (SwiftUI)
- Full-screen overlay with **blur**: `.fullScreenCover` is opaque by default; true translucent blur often needs `UIViewRepresentable` + `UIVisualEffectView`.
- **Sliding presentation**: `.transition(.move(edge: .top))` or `.move(edge: .bottom)` with `withAnimation` gives a clear, predictable animation.
- **Dismiss**: Use a single state (e.g. `recentlyUnlocked != nil`) and apply `.animation(_, value:)` so both appearance and disappearance animate.

## Recommended direction: Floating card from top (no full-screen dim)

**Why**
- Matches “slide down from top” and “celebration without disrupting” from research.
- Avoids blur/dim tuning and platform quirks; no full-screen modal feel.
- Content stays visible behind the card; focus is on the card itself.
- Single, simple animation: card moves in from top and out to top.

**Behavior**
1. When an achievement unlocks, a **single card** appears **under the safe area** (e.g. top padding from status bar / nav).
2. **No** full-screen backdrop (no blur, no dim). Background stays as-is.
3. **Transition**: card slides in from top (`.move(edge: .top)`), and on dismiss slides back up. Spring animation for a slight bounce.
4. **Dismiss**: Primary button “Awesome!”; optional **auto-dismiss** after ~4 seconds so it doesn’t sit forever.
5. **Layout**: Same content as today (icon, “Achievement Unlocked!”, title, description, button). Card keeps achievement color, shadow, and rounded corners so it still feels like a clear “moment.”

**Fallback**
- If we later want a more “modal” feel for a subset of achievements, we can introduce a second presentation style (e.g. sheet or full-screen) and choose by achievement type. First ship the floating card as the default.

## Implementation checklist

- [x] Replace full-screen overlay with a top-anchored floating card only (no `ZStack` with material/dim).
- [x] Use `.transition(.move(edge: .top))` and `.animation(.spring(response: 0.4, dampingFraction: 0.8), value:)` on the overlay so in/out both animate.
- [x] Keep `AchievementUnlockModal` content (icon, title, description, “Awesome!”) and styling (color, shadow, corners); remove backdrop.
- [x] Add auto-dismiss after 4s via `DispatchWorkItem` in `onAppear`; cancel in `onDisappear` and on button tap (view goes away).
- [x] Insights and Settings both use `.transition(.move(edge: .top))` and the same spring.
- [ ] Test on iPhone and Mac Catalyst (safe area, layout).
