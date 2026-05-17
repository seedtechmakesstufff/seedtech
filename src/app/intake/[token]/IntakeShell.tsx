/* ── IntakeShell ──
 * The single layout primitive used by every intake view (form, review,
 * submitted summary). Renders a fixed sidebar on the left and a main column
 * on the right with a header / scrollable body / footer.
 *
 * Layout design — why this is robust:
 *   - The intake route's layout.tsx fixes the entire page to the viewport
 *     and locks html+body overflow. The shell uses `absolute inset-0` to
 *     exactly fill that fixed parent. No h-screen anywhere — that was the
 *     source of viewport-mismatch bugs in the previous implementation.
 *   - Sidebar and main are flex children that stretch to the parent's height
 *     automatically. They don't claim their own viewport-based heights.
 *   - The ONLY scrollable element is the body (`<section data-scroll>`).
 *     It uses `overscroll-behavior: contain` so trackpad / momentum scrolling
 *     cannot chain to ancestors.
 *   - For anchor navigation, the parent imperatively scrolls the body via
 *     the ref exposed in bodyRef — never `<a href="#x">`, which triggers
 *     the browser's own scroll machinery and can move the document.
 */
"use client";

import { forwardRef } from "react";
import type { ReactNode, Ref } from "react";

interface IntakeShellProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  bodyRef?: Ref<HTMLElement>;
}

export const IntakeShell = forwardRef<HTMLDivElement, IntakeShellProps>(function IntakeShell(
  { sidebar, header, children, footer, bodyRef },
  ref,
) {
  return (
    <div ref={ref} className="absolute inset-0 flex">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-gray-100 bg-white">
        {sidebar}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="shrink-0 border-b border-gray-100 bg-white">{header}</div>
        <section
          ref={bodyRef}
          data-scroll
          className="flex-1 overflow-y-auto"
          style={{ overscrollBehavior: "contain" }}
        >
          {children}
        </section>
        {footer && (
          <div className="shrink-0 border-t border-gray-100 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
});
