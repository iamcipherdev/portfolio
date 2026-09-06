"use client";

import { useEffect, useSyncExternalStore, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";

function useCustomCursorEnabled(): boolean {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener("resize", cb);
      return () => window.removeEventListener("resize", cb);
    },
    () =>
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

type Variant = "default" | "hover" | "view" | "open" | "press";

/**
 * Custom cursor — desktop (fine pointer) only, disabled with
 * reduced motion. Small dot + trailing ring; contextual labels:
 * VIEW over project cards, OPEN ↗ over external links.
 * Native cursor is hidden via body.has-custom-cursor (see globals.css)
 * except on text inputs, so usability is never compromised.
 */
export function Cursor() {
  const enabled = useCustomCursorEnabled();
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<Variant>("default");
  const [label, setLabel] = useState<string>("");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 420, damping: 34, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 420, damping: 34, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;

    document.body.classList.add("has-custom-cursor");

    let raf = 0;
    let pendingX = 0;
    let pendingY = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pendingX = e.clientX;
      pendingY = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          x.set(pendingX);
          y.set(pendingY);
          raf = 0;
        });
      }
      setVisible(true);
    };

    const onOver = (e: Event) => {
      const target = e.target as Element | null;
      if (!target || typeof target.closest !== "function") return;

      const marked = target.closest<HTMLElement>("[data-cursor]");
      if (marked) {
        const kind = marked.dataset.cursor;
        if (kind === "view") {
          setVariant("view");
          setLabel(marked.dataset.cursorLabel || "VIEW");
          return;
        }
        if (kind === "open") {
          setVariant("open");
          setLabel(marked.dataset.cursorLabel || "OPEN ↗");
          return;
        }
      }
      if (target.closest("a, button, [role='button'], summary")) {
        setVariant("hover");
        return;
      }
      setVariant("default");
    };

    const onDown = () => setVariant((v) => (v === "default" ? "press" : v));
    const onUp = () => setVariant((v) => (v === "press" ? "default" : v));
    const onLeaveDoc = () => setVisible(false);
    const onEnterDoc = () => setVisible(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeaveDoc);
    document.documentElement.addEventListener("mouseenter", onEnterDoc);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeaveDoc);
      document.documentElement.removeEventListener("mouseenter", onEnterDoc);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const ringSize =
    variant === "view" || variant === "open" ? 76 : variant === "hover" ? 52 : variant === "press" ? 24 : 34;
  const showLabel = variant === "view" || variant === "open";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[95] hidden md:block">
      {/* dot */}
      <motion.div
        className="absolute left-0 top-0 h-[6px] w-[6px] rounded-full bg-[#4D6BFF]"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible ? (showLabel ? 0 : 1) : 0, scale: variant === "press" ? 0.6 : 1 }}
        transition={{ duration: 0.18 }}
      />
      {/* ring / label bubble */}
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className={
            showLabel
              ? "flex items-center justify-center rounded-full bg-[#111111] text-[#F5F3EE] shadow-[0_10px_30px_-8px_rgba(17,17,17,0.5)]"
              : "rounded-full border border-[#11111166] mix-blend-difference invert"
          }
          animate={{
            width: ringSize,
            height: ringSize,
          }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
        >
          <AnimatePresence mode="wait">
            {showLabel ? (
              <motion.span
                key={label}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.16 }}
                className="font-mono text-[8.5px] font-medium uppercase tracking-[0.18em]"
              >
                {label}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
