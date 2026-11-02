import { type PointerEvent as ReactPointerEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Hand } from "@untitledui/icons";

import type { LookPiece } from "../../types";
import { LookPieceCard } from "./LookPieceCard";

const DRAG_DEG_PER_PX = 0.35;
const AUTO_SPIN_DEG_PER_FRAME = 0.06;
const EASE = 0.12;
const FRICTION = 0.9;
/** Caps the coast after a flick (a fast drag can arrive as one huge move) to about one card. */
const MAX_FLICK_DEG_PER_FRAME = 6;
/** Movement past this many px turns a press into a drag, and the click after it is swallowed. */
const DRAG_THRESHOLD = 6;
/** Room under the square photo for the category, title and price lines. */
const CARD_TEXT_HEIGHT = 104;

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The pieces stand on a ring in CSS 3D space. Drag/swipe to spin it, with
 * momentum and a snap to the nearest card; arrows and buttons step through.
 * Animation runs in one rAF loop writing transforms directly, so dragging
 * never re-renders React.
 */
export const LookCarousel3D = ({ pieces, onNavigate }: { pieces: LookPiece[]; onNavigate?: () => void }) => {
    const count = pieces.length;
    const step = 360 / count;

    const stageRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    const [size, setSize] = useState({ card: 180, radius: 260 });
    const [front, setFront] = useState(0);

    // Mutable animation state; kept out of React state on purpose.
    const motion = useRef({ angle: 0, target: 0, velocity: 0, dragging: false, autoSpin: true, lastX: 0, startX: 0, moved: false });

    // Card width follows the stage; the radius is what keeps neighbours from overlapping.
    useLayoutEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;
        const measure = () => {
            const width = stage.clientWidth;
            const card = Math.round(Math.min(200, Math.max(120, width * 0.34)));
            const radius = Math.round(Math.min(width * 0.75, card / 2 / Math.tan(Math.PI / count) + card * 0.35));
            setSize({ card, radius });
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(stage);
        return () => observer.disconnect();
    }, [count]);

    useEffect(() => {
        const state = motion.current;
        if (prefersReducedMotion()) state.autoSpin = false;

        let frame = 0;
        let lastFront = -1;
        const tick = () => {
            if (!state.dragging) {
                if (Math.abs(state.velocity) > 0.05) {
                    // Coast after a flick, then hand over to the snap.
                    state.angle += state.velocity;
                    state.velocity *= FRICTION;
                    state.target = Math.round(state.angle / step) * step;
                } else if (state.autoSpin) {
                    state.target += AUTO_SPIN_DEG_PER_FRAME;
                    state.angle = state.target;
                } else {
                    state.angle += (state.target - state.angle) * EASE;
                }
            }

            if (ringRef.current) ringRef.current.style.transform = `translateZ(${-size.radius}px) rotateY(${-state.angle}deg)`;

            // Fade and disable cards as they turn away from the viewer.
            cardRefs.current.forEach((card, index) => {
                if (!card) return;
                const facing = Math.cos(((index * step - state.angle) * Math.PI) / 180);
                card.style.opacity = String(0.25 + 0.75 * Math.max(0, facing));
                card.style.pointerEvents = facing > 0.6 ? "auto" : "none";
            });

            const nearest = ((Math.round(state.angle / step) % count) + count) % count;
            if (nearest !== lastFront) {
                lastFront = nearest;
                setFront(nearest);
            }
            frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [count, step, size.radius]);

    const go = useCallback(
        (delta: number) => {
            const state = motion.current;
            state.autoSpin = false;
            state.velocity = 0;
            state.target = Math.round(state.target / step) * step + delta * step;
            if (prefersReducedMotion()) state.angle = state.target;
        },
        [step]
    );

    const onPointerDown = (event: ReactPointerEvent) => {
        const state = motion.current;
        state.dragging = true;
        state.autoSpin = false;
        state.moved = false;
        state.velocity = 0;
        state.lastX = state.startX = event.clientX;
    };

    const onPointerMove = (event: ReactPointerEvent) => {
        const state = motion.current;
        if (!state.dragging) return;
        if (!state.moved && Math.abs(event.clientX - state.startX) > DRAG_THRESHOLD) {
            state.moved = true;
            // Capture only once it is a real drag, so a plain tap still reaches the card's link.
            stageRef.current?.setPointerCapture(event.pointerId);
        }
        if (!state.moved) return;
        const delta = -(event.clientX - state.lastX) * DRAG_DEG_PER_PX;
        state.angle += delta;
        state.target = state.angle;
        state.velocity = Math.max(-MAX_FLICK_DEG_PER_FRAME, Math.min(MAX_FLICK_DEG_PER_FRAME, delta));
        state.lastX = event.clientX;
    };

    const endDrag = () => {
        const state = motion.current;
        if (!state.dragging) return;
        state.dragging = false;
        if (prefersReducedMotion()) state.velocity = 0;
        state.target = Math.round(state.angle / step) * step;
    };

    return (
        <div className="flex flex-col gap-4">
            <div
                ref={stageRef}
                role="group"
                aria-roledescription="carousel"
                aria-label="Complete the look in 3D. Use the arrow keys to rotate."
                tabIndex={0}
                onKeyDown={(event) => {
                    if (event.key === "ArrowRight") go(1);
                    else if (event.key === "ArrowLeft") go(-1);
                    else return;
                    event.preventDefault();
                }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                // Swallow the click that ends a drag so releasing over a card doesn't navigate.
                onClickCapture={(event) => {
                    if (motion.current.moved) {
                        event.preventDefault();
                        event.stopPropagation();
                        motion.current.moved = false;
                    }
                }}
                onMouseEnter={() => (motion.current.autoSpin = false)}
                className="relative cursor-grab touch-pan-y overflow-hidden rounded-3xl bg-aurora outline-focus-ring select-none focus-visible:outline-2 focus-visible:outline-offset-2 active:cursor-grabbing"
                style={{ height: size.card + CARD_TEXT_HEIGHT + 150, perspective: `${Math.max(900, size.radius * 3.2)}px` }}
            >
                <div className="pointer-events-none absolute inset-0 bg-dot-grid" aria-hidden />
                {/* Floor shadow the ring appears to stand on. */}
                <div
                    className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-[50%] bg-black/50 blur-2xl"
                    style={{ bottom: 28, width: size.radius * 2, height: 46 }}
                    aria-hidden
                />

                <div className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]" style={{ transform: "rotateX(-6deg)" }}>
                    <div ref={ringRef} className="relative [transform-style:preserve-3d]" style={{ width: size.card, height: size.card + CARD_TEXT_HEIGHT }}>
                        {pieces.map((piece, index) => (
                            <div
                                key={piece.key}
                                ref={(element) => {
                                    cardRefs.current[index] = element;
                                }}
                                className="absolute inset-x-0 top-0 [backface-visibility:hidden]"
                                style={{ transform: `rotateY(${index * step}deg) translateZ(${size.radius}px)` }}
                                // Only the front card is reachable by keyboard and screen readers.
                                inert={index !== front}
                            >
                                <LookPieceCard piece={piece} onNavigate={onNavigate} draggable={false} className="shadow-2xl" />
                            </div>
                        ))}
                    </div>
                </div>

                <span className="pointer-events-none absolute top-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium whitespace-nowrap text-white/75 backdrop-blur">
                    <Hand className="size-3.5" aria-hidden />
                    Drag to spin · tap to compare
                </span>
            </div>

            <div className="flex items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous piece"
                    className="flex size-11 items-center justify-center rounded-full border border-secondary text-fg-secondary transition hover:bg-primary_hover"
                >
                    <ChevronLeft className="size-5" />
                </button>

                <div className="flex min-w-0 flex-col items-center text-center" aria-live="polite">
                    <span className="text-xs font-semibold tracking-wide text-brand-secondary uppercase">{pieces[front]?.category}</span>
                    <span className="max-w-full truncate text-sm font-semibold text-primary first-letter:uppercase">{pieces[front]?.title}</span>
                    <span className="mt-1 flex gap-1.5" aria-hidden>
                        {pieces.map((piece, index) => (
                            <span key={piece.key} className={index === front ? "h-1.5 w-4 rounded-full bg-brand-solid transition-all" : "size-1.5 rounded-full bg-quaternary transition-all"} />
                        ))}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next piece"
                    className="flex size-11 items-center justify-center rounded-full border border-secondary text-fg-secondary transition hover:bg-primary_hover"
                >
                    <ChevronRight className="size-5" />
                </button>
            </div>
        </div>
    );
};
