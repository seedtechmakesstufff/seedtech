"use client";

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StaggeredMenuChild {
  label: string;
  ariaLabel: string;
  link: string;
  onClick?: () => void;
}

export interface StaggeredMenuItem {
  label: string;
  ariaLabel: string;
  link: string;
  onClick?: () => void;
  children?: StaggeredMenuChild[];
}

export interface StaggeredMenuSocialItem {
  label: string;
  link: string;
}

export interface StaggeredMenuHandle {
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export interface StaggeredMenuProps {
  position?: "left" | "right";
  colors?: string[];
  items?: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  logoUrl?: string;
  logoAlt?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  changeMenuColorOnOpen?: boolean;
  closeOnClickAway?: boolean;
  isFixed?: boolean;
  showInternalToggle?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
}

// ─── CSS (outside component — avoids hydration mismatch) ──────────────────────

const SM_CSS = `
.staggered-menu-wrapper{position:relative;width:100%;height:100%;z-index:40;pointer-events:none}
.staggered-menu-wrapper.fixed-wrapper{position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:40;overflow:hidden}
.staggered-menu-header{position:absolute;top:0;left:0;width:100%;display:flex;align-items:center;justify-content:space-between;padding:1rem 1.5rem;background:transparent;pointer-events:none;z-index:20}
.staggered-menu-header>*{pointer-events:auto}
.sm-logo{display:flex;align-items:center;user-select:none}
.sm-logo-img{display:block;height:28px;width:auto;object-fit:contain}
.sm-toggle{position:relative;display:inline-flex;align-items:center;gap:0.4rem;background:transparent;border:none;cursor:pointer;color:#e9e9ef;font-weight:500;line-height:1;overflow:visible;font-size:0.875rem;letter-spacing:0.02em;padding:0.5rem 0}
.sm-toggle-textWrap{position:relative;display:inline-block;height:1em;overflow:hidden;white-space:nowrap;width:var(--sm-toggle-width,auto);min-width:var(--sm-toggle-width,auto)}
.sm-toggle-textInner{display:flex;flex-direction:column;line-height:1}
.sm-toggle-line{display:block;height:1em;line-height:1}
.sm-icon{position:relative;width:12px;height:12px;flex:0 0 12px;display:inline-flex;align-items:center;justify-content:center;will-change:transform}
.sm-icon-line{position:absolute;left:50%;top:50%;width:100%;height:2px;background:currentColor;border-radius:2px;transform:translate(-50%,-50%);will-change:transform}
.sm-prelayers{position:absolute;top:0;right:0;bottom:0;width:100%;pointer-events:none;z-index:5}
[data-position=left] .sm-prelayers{right:auto;left:0}
.sm-prelayer{position:absolute;top:0;right:0;height:100%;width:100%;transform:translateX(0)}
.staggered-menu-panel{position:absolute;top:0;right:0;width:100%;height:100%;background:#0a0a0f;display:flex;flex-direction:column;padding:5rem 2rem 2.5rem 2rem;overflow:hidden;z-index:10;pointer-events:auto}
[data-position=left] .staggered-menu-panel{right:auto;left:0}
.sm-pages{position:relative;flex:1;display:flex;overflow:hidden}
.sm-page{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;overflow-y:auto;will-change:transform}
.sm-panel-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0}
.sm-panel-itemWrap{position:relative;overflow:hidden;line-height:1}
.sm-panel-item{position:relative;color:#f8f8fa;font-weight:700;font-size:clamp(2rem,8vw,3.2rem);cursor:pointer;line-height:1.05;letter-spacing:-0.5px;text-transform:uppercase;transition:color 0.2s;display:inline-flex;align-items:center;gap:0.35em;text-decoration:none;padding:0.08em 0;border:none;background:transparent;width:100%}
.sm-panel-itemLabel{display:inline-block;will-change:transform;transform-origin:50% 100%}
.sm-panel-item:hover{color:var(--sm-accent,#40A660)}
.sm-panel-item-chevron{flex-shrink:0;opacity:0.4;transition:opacity 0.2s,transform 0.2s;margin-left:auto}
.sm-panel-item:hover .sm-panel-item-chevron{opacity:1;transform:translateX(4px)}
.sm-back-btn{display:inline-flex;align-items:center;gap:0.5rem;background:transparent;border:none;cursor:pointer;color:rgba(248,248,250,0.45);font-size:0.8rem;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;padding:0;margin-bottom:1.5rem;transition:color 0.2s}
.sm-back-btn:hover{color:#f8f8fa}
.sm-back-arrow{display:inline-block;transition:transform 0.2s}
.sm-back-btn:hover .sm-back-arrow{transform:translateX(-3px)}
.sm-sub-eyebrow{margin:0 0 0.75rem 0;font-size:0.7rem;font-weight:500;letter-spacing:0.15em;text-transform:uppercase;color:var(--sm-accent,#40A660)}
.sm-socials{margin-top:auto;padding-top:2rem;display:flex;flex-direction:column;gap:0.75rem}
.sm-socials-title{margin:0;font-size:0.875rem;font-weight:500;color:var(--sm-accent,#40A660);text-transform:uppercase;letter-spacing:0.1em}
.sm-socials-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:row;align-items:center;gap:1.25rem;flex-wrap:wrap}
.sm-socials-link{color:rgba(248,248,250,0.55);font-size:0.875rem;text-decoration:none;transition:color 0.2s}
.sm-socials-link:hover{color:#f8f8fa}
`;

// ─── Component ────────────────────────────────────────────────────────────────

export const StaggeredMenu = forwardRef<StaggeredMenuHandle, StaggeredMenuProps>(
  function StaggeredMenu(
    {
      position = "right",
      colors = ["#0c0c14", "#14141f"],
      items = [],
      socialItems = [],
      displaySocials = false,
      displayItemNumbering = false,
      className,
      logoUrl,
      logoAlt = "Logo",
      menuButtonColor = "#fff",
      openMenuButtonColor = "#fff",
      changeMenuColorOnOpen = false,
      accentColor = "#40A660",
      isFixed = true,
      showInternalToggle = true,
      closeOnClickAway = true,
      onMenuOpen,
      onMenuClose,
    },
    ref
  ) {
    // ── State ──────────────────────────────────────────────────────────────
    const [open, setOpen] = useState(false);
    const openRef = useRef(false);
    const [activeSub, setActiveSub] = useState<StaggeredMenuItem | null>(null);
    const [textLines, setTextLines] = useState<string[]>(["Menu", "Close"]);

    // ── GSAP refs ──────────────────────────────────────────────────────────
    const panelRef = useRef<HTMLDivElement | null>(null);
    const preLayersRef = useRef<HTMLDivElement | null>(null);
    const preLayerElsRef = useRef<HTMLElement[]>([]);
    const rootPageRef = useRef<HTMLDivElement | null>(null);
    const subPageRef = useRef<HTMLDivElement | null>(null);

    const plusHRef = useRef<HTMLSpanElement | null>(null);
    const plusVRef = useRef<HTMLSpanElement | null>(null);
    const iconRef = useRef<HTMLSpanElement | null>(null);
    const textInnerRef = useRef<HTMLSpanElement | null>(null);
    const textWrapRef = useRef<HTMLSpanElement | null>(null);

    const openTlRef = useRef<gsap.core.Timeline | null>(null);
    const closeTweenRef = useRef<gsap.core.Tween | null>(null);
    const spinTweenRef = useRef<gsap.core.Timeline | null>(null);
    const textCycleAnimRef = useRef<gsap.core.Tween | null>(null);
    const colorTweenRef = useRef<gsap.core.Tween | null>(null);
    const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
    const busyRef = useRef(false);
    const itemEntranceTweenRef = useRef<gsap.core.Tween | null>(null);

    // ── Init ──────────────────────────────────────────────────────────────
    useLayoutEffect(() => {
      const ctx = gsap.context(() => {
        const panel = panelRef.current;
        const preContainer = preLayersRef.current;
        const plusH = plusHRef.current;
        const plusV = plusVRef.current;
        const icon = iconRef.current;
        const textInner = textInnerRef.current;
        if (!panel || !plusH || !plusV || !icon || !textInner) return;

        const preLayers = preContainer
          ? (Array.from(preContainer.querySelectorAll(".sm-prelayer")) as HTMLElement[])
          : [];
        preLayerElsRef.current = preLayers;

        const offscreen = position === "left" ? -100 : 100;
        gsap.set([panel, ...preLayers], { xPercent: offscreen });
        gsap.set(plusH, { transformOrigin: "50% 50%", rotate: 0 });
        gsap.set(plusV, { transformOrigin: "50% 50%", rotate: 90 });
        gsap.set(icon, { rotate: 0, transformOrigin: "50% 50%" });
        gsap.set(textInner, { yPercent: 0 });
        if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });

        if (rootPageRef.current) gsap.set(rootPageRef.current, { xPercent: 0 });
        if (subPageRef.current) gsap.set(subPageRef.current, { xPercent: 100 });
      });
      return () => ctx.revert();
    }, [menuButtonColor, position]);

    // ── Build open timeline ───────────────────────────────────────────────
    const buildOpenTimeline = useCallback(() => {
      const panel = panelRef.current;
      const layers = preLayerElsRef.current;
      if (!panel) return null;

      openTlRef.current?.kill();
      if (closeTweenRef.current) {
        closeTweenRef.current.kill();
        closeTweenRef.current = null;
      }
      itemEntranceTweenRef.current?.kill();

      const rootPage = rootPageRef.current;
      const itemEls = rootPage
        ? (Array.from(rootPage.querySelectorAll(".sm-panel-itemLabel")) as HTMLElement[])
        : [];
      const socialTitle = panel.querySelector(".sm-socials-title") as HTMLElement | null;
      const socialLinks = Array.from(panel.querySelectorAll(".sm-socials-link")) as HTMLElement[];

      const layerStates = layers.map((el) => ({
        el,
        start: Number(gsap.getProperty(el, "xPercent")),
      }));
      const panelStart = Number(gsap.getProperty(panel, "xPercent"));

      if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
      if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
      if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

      const tl = gsap.timeline({ paused: true });

      layerStates.forEach((ls, i) => {
        tl.fromTo(
          ls.el,
          { xPercent: ls.start },
          { xPercent: 0, duration: 0.5, ease: "power4.out" },
          i * 0.07
        );
      });

      const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
      const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
      const panelDuration = 0.65;

      tl.fromTo(
        panel,
        { xPercent: panelStart },
        { xPercent: 0, duration: panelDuration, ease: "power4.out" },
        panelInsertTime
      );

      if (itemEls.length) {
        const itemsStart = panelInsertTime + panelDuration * 0.15;
        tl.to(
          itemEls,
          {
            yPercent: 0,
            rotate: 0,
            duration: 1,
            ease: "power4.out",
            stagger: { each: 0.1, from: "start" },
          },
          itemsStart
        );
      }

      if (socialTitle || socialLinks.length) {
        const socialsStart = panelInsertTime + panelDuration * 0.4;
        if (socialTitle)
          tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: "power2.out" }, socialsStart);
        if (socialLinks.length) {
          tl.to(
            socialLinks,
            {
              y: 0,
              opacity: 1,
              duration: 0.55,
              ease: "power3.out",
              stagger: { each: 0.08, from: "start" },
              onComplete: () => { gsap.set(socialLinks, { clearProps: "opacity" }); },
            },
            socialsStart + 0.04
          );
        }
      }

      openTlRef.current = tl;
      return tl;
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const playOpen = useCallback(() => {
      if (busyRef.current) return;
      busyRef.current = true;
      const tl = buildOpenTimeline();
      if (tl) {
        tl.eventCallback("onComplete", () => {
          busyRef.current = false;
        });
        tl.play(0);
      } else {
        busyRef.current = false;
      }
    }, [buildOpenTimeline]);

    const playClose = useCallback(() => {
      openTlRef.current?.kill();
      openTlRef.current = null;
      itemEntranceTweenRef.current?.kill();

      const panel = panelRef.current;
      const layers = preLayerElsRef.current;
      if (!panel) return;

      const offscreen = position === "left" ? -100 : 100;
      closeTweenRef.current?.kill();
      closeTweenRef.current = gsap.to([...layers, panel], {
        xPercent: offscreen,
        duration: 0.32,
        ease: "power3.in",
        overwrite: "auto",
        onComplete: () => {
          const rootPage = rootPageRef.current;
          if (rootPage) {
            const itemEls = Array.from(
              rootPage.querySelectorAll(".sm-panel-itemLabel")
            ) as HTMLElement[];
            if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
          }
          busyRef.current = false;
        },
      });
    }, [position]);

    // ── Icon / colour / text ──────────────────────────────────────────────
    const animateIcon = useCallback((opening: boolean) => {
      const icon = iconRef.current;
      const h = plusHRef.current;
      const v = plusVRef.current;
      if (!icon || !h || !v) return;
      spinTweenRef.current?.kill();
      if (opening) {
        gsap.set(icon, { rotate: 0, transformOrigin: "50% 50%" });
        spinTweenRef.current = gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .to(h, { rotate: 45, duration: 0.5 }, 0)
          .to(v, { rotate: -45, duration: 0.5 }, 0) as unknown as gsap.core.Timeline;
      } else {
        spinTweenRef.current = gsap
          .timeline({ defaults: { ease: "power3.inOut" } })
          .to(h, { rotate: 0, duration: 0.35 }, 0)
          .to(v, { rotate: 90, duration: 0.35 }, 0)
          .to(icon, { rotate: 0, duration: 0.001 }, 0) as unknown as gsap.core.Timeline;
      }
    }, []);

    const animateColor = useCallback(
      (opening: boolean) => {
        const btn = toggleBtnRef.current;
        if (!btn) return;
        colorTweenRef.current?.kill();
        const targetColor =
          changeMenuColorOnOpen
            ? opening
              ? openMenuButtonColor
              : menuButtonColor
            : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, {
          color: targetColor,
          duration: 0.25,
          ease: "none",
        });
      },
      [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
    );

    useEffect(() => {
      if (!toggleBtnRef.current) return;
      const targetColor =
        changeMenuColorOnOpen && openRef.current ? openMenuButtonColor : menuButtonColor;
      gsap.set(toggleBtnRef.current, { color: targetColor });
    }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

    const animateText = useCallback((opening: boolean) => {
      const inner = textInnerRef.current;
      if (!inner) return;
      textCycleAnimRef.current?.kill();
      const current = opening ? "Menu" : "Close";
      const target = opening ? "Close" : "Menu";
      const seq: string[] = [current];
      let last = current;
      for (let i = 0; i < 3; i++) {
        last = last === "Menu" ? "Close" : "Menu";
        seq.push(last);
      }
      if (last !== target) seq.push(target);
      seq.push(target);
      setTextLines(seq);
      gsap.set(inner, { yPercent: 0 });
      const lineCount = seq.length;
      textCycleAnimRef.current = gsap.to(inner, {
        yPercent: -((lineCount - 1) / lineCount) * 100,
        duration: 0.5 + lineCount * 0.07,
        ease: "power4.out",
      });
    }, []);

    // Toggle text-wrap width
    useLayoutEffect(() => {
      const wrap = textWrapRef.current;
      if (!wrap) return;
      let maxW = 0;
      wrap.querySelectorAll(".sm-toggle-line").forEach((l) => {
        const w = (l as HTMLElement).offsetWidth;
        if (w > maxW) maxW = w;
      });
      if (maxW > 0) wrap.style.setProperty("--sm-toggle-width", `${maxW}px`);
    }, [textLines]);

    // ── Public API ────────────────────────────────────────────────────────
    const toggleMenu = useCallback(() => {
      const target = !openRef.current;
      openRef.current = target;
      setOpen(target);
      if (!target) setActiveSub(null);
      if (target) {
        onMenuOpen?.();
        playOpen();
      } else {
        onMenuClose?.();
        playClose();
      }
      animateIcon(target);
      animateColor(target);
      animateText(target);
    }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose]);

    const closeMenu = useCallback(() => {
      if (!openRef.current) return;
      openRef.current = false;
      setOpen(false);
      setActiveSub(null);
      onMenuClose?.();
      playClose();
      animateIcon(false);
      animateColor(false);
      animateText(false);
    }, [playClose, animateIcon, animateColor, animateText, onMenuClose]);

    const openMenu = useCallback(() => {
      if (openRef.current) return;
      openRef.current = true;
      setOpen(true);
      onMenuOpen?.();
      playOpen();
      animateIcon(true);
      animateColor(true);
      animateText(true);
    }, [playOpen, animateIcon, animateColor, animateText, onMenuOpen]);

    useImperativeHandle(
      ref,
      () => ({ open: openMenu, close: closeMenu, toggle: toggleMenu }),
      [openMenu, closeMenu, toggleMenu]
    );

    // Click-away
    useEffect(() => {
      if (!closeOnClickAway) return;
      const handleClick = (e: MouseEvent) => {
        const wrapper = panelRef.current?.closest(".staggered-menu-wrapper");
        if (wrapper && !wrapper.contains(e.target as Node) && openRef.current) closeMenu();
      };
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }, [closeOnClickAway, closeMenu]);

    // ── Sub-page navigation ───────────────────────────────────────────────
    const navigateToSub = useCallback((item: StaggeredMenuItem) => {
      const root = rootPageRef.current;
      const sub = subPageRef.current;
      if (!root || !sub) return;

      // prep sub items for entrance animation
      const subItems = Array.from(
        sub.querySelectorAll(".sm-panel-itemLabel")
      ) as HTMLElement[];
      gsap.set(subItems, { yPercent: 140, rotate: 10 });

      gsap.to(root, { xPercent: -100, duration: 0.45, ease: "power4.inOut" });
      gsap.fromTo(sub, { xPercent: 100 }, { xPercent: 0, duration: 0.45, ease: "power4.inOut" });
      gsap.to(subItems, {
        yPercent: 0,
        rotate: 0,
        duration: 0.8,
        ease: "power4.out",
        stagger: { each: 0.08, from: "start" },
        delay: 0.3,
      });

      setActiveSub(item);
    }, []);

    const navigateBack = useCallback(() => {
      const root = rootPageRef.current;
      const sub = subPageRef.current;
      if (!root || !sub) return;

      const rootItems = Array.from(
        root.querySelectorAll(".sm-panel-itemLabel")
      ) as HTMLElement[];
      gsap.set(rootItems, { yPercent: 140, rotate: 10 });

      gsap.to(sub, { xPercent: 100, duration: 0.4, ease: "power3.inOut" });
      gsap.fromTo(root, { xPercent: -100 }, { xPercent: 0, duration: 0.4, ease: "power3.inOut" });
      gsap.to(rootItems, {
        yPercent: 0,
        rotate: 0,
        duration: 0.8,
        ease: "power4.out",
        stagger: { each: 0.08, from: "start" },
        delay: 0.25,
      });

      setActiveSub(null);
    }, []);

    // ── Layers ────────────────────────────────────────────────────────────
    const raw = colors && colors.length ? colors.slice(0, 4) : ["#0c0c14", "#14141f"];
    const layerArr = [...raw];
    if (layerArr.length >= 3) layerArr.splice(Math.floor(layerArr.length / 2), 1);

    // ── Render ────────────────────────────────────────────────────────────
    return (
      <div
        className={
          (className ? className + " " : "") +
          "staggered-menu-wrapper" +
          (isFixed ? " fixed-wrapper" : "")
        }
        style={accentColor ? ({ "--sm-accent": accentColor } as React.CSSProperties) : undefined}
        data-position={position}
        data-open={open || undefined}
      >
        {/* Hydration-safe style injection */}
        <style dangerouslySetInnerHTML={{ __html: SM_CSS }} />

        {/* Pre-layers (stagger effect) */}
        <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
          {layerArr.map((c, i) => (
            <div key={i} className="sm-prelayer" style={{ background: c }} />
          ))}
        </div>

        {/* Optional internal toggle */}
        {showInternalToggle && (
          <header
            className="staggered-menu-header"
            aria-label="Mobile navigation header"
          >
            <div className="sm-logo" aria-label="Logo">
              {logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt={logoAlt}
                  className="sm-logo-img"
                  draggable={false}
                  width={140}
                  height={32}
                />
              )}
            </div>
            <button
              ref={toggleBtnRef}
              className="sm-toggle"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="staggered-menu-panel"
              onClick={toggleMenu}
              type="button"
            >
              <span
                ref={textWrapRef}
                className="sm-toggle-textWrap"
                aria-hidden="true"
              >
                <span ref={textInnerRef} className="sm-toggle-textInner">
                  {textLines.map((l, i) => (
                    <span className="sm-toggle-line" key={i}>
                      {l}
                    </span>
                  ))}
                </span>
              </span>
              <span ref={iconRef} className="sm-icon" aria-hidden="true">
                <span ref={plusHRef} className="sm-icon-line" />
                <span ref={plusVRef} className="sm-icon-line" />
              </span>
            </button>
          </header>
        )}

        {/* Main panel */}
        <aside
          id="staggered-menu-panel"
          ref={panelRef}
          className="staggered-menu-panel"
          aria-hidden={!open}
        >
          <div className="sm-pages">
            {/* Root page */}
            <div ref={rootPageRef} className="sm-page">
              <ul
                className="sm-panel-list"
                role="list"
                data-numbering={displayItemNumbering || undefined}
              >
                {items.map((it, idx) => {
                  const hasChildren = Boolean(it.children && it.children.length > 0);
                  return (
                    <li className="sm-panel-itemWrap" key={it.label + idx}>
                      <a
                        className="sm-panel-item"
                        href={hasChildren ? undefined : it.link}
                        aria-label={it.ariaLabel}
                        role={hasChildren ? "button" : undefined}
                        tabIndex={0}
                        onClick={(e) => {
                          e.preventDefault();
                          if (hasChildren) {
                            navigateToSub(it);
                          } else {
                            if (it.onClick) {
                              it.onClick();
                            } else {
                              window.location.href = it.link;
                            }
                            closeMenu();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            if (hasChildren) navigateToSub(it);
                          }
                        }}
                      >
                        <span className="sm-panel-itemLabel">{it.label}</span>
                        {hasChildren && (
                          <svg
                            className="sm-panel-item-chevron"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>

              {displaySocials && socialItems.length > 0 && (
                <div className="sm-socials" aria-label="Social links">
                  <h3 className="sm-socials-title">Socials</h3>
                  <ul className="sm-socials-list" role="list">
                    {socialItems.map((s, i) => (
                      <li key={s.label + i}>
                        <a
                          href={s.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="sm-socials-link"
                        >
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sub page */}
            <div ref={subPageRef} className="sm-page">
              {activeSub && (
                <>
                  <button
                    className="sm-back-btn"
                    onClick={navigateBack}
                    type="button"
                    aria-label="Back to main menu"
                  >
                    <span className="sm-back-arrow">&#8592;</span>
                    Back
                  </button>
                  <p className="sm-sub-eyebrow">{activeSub.label}</p>
                  <ul className="sm-panel-list" role="list">
                    {activeSub.children?.map((child, idx) => (
                      <li className="sm-panel-itemWrap" key={child.label + idx}>
                        <a
                          className="sm-panel-item"
                          href={child.link}
                          aria-label={child.ariaLabel}
                          onClick={(e) => {
                            e.preventDefault();
                            if (child.onClick) {
                              child.onClick();
                            } else {
                              window.location.href = child.link;
                            }
                            closeMenu();
                          }}
                        >
                          <span className="sm-panel-itemLabel">{child.label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
    );
  }
);

StaggeredMenu.displayName = "StaggeredMenu";
export default StaggeredMenu;
