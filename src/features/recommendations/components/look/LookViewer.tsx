import { Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";
import { XClose } from "@untitledui/icons";
import { ThinkingOrb } from "thinking-orbs";

import { useLookPieces } from "../../hooks/useLookPieces";
import type { CompleteTheLookItem, LookAnchor } from "../../types";
import { LookCarousel3D } from "./LookCarousel3D";

type Props = {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    anchor: LookAnchor;
    items: CompleteTheLookItem[];
};

/** The whole look as a spinnable 3D carousel. */
export const LookViewer = ({ isOpen, onOpenChange, anchor, items }: Props) => {
    // Only search the stores once the viewer is actually open.
    const { pieces, loadingCount } = useLookPieces(anchor, items, isOpen);
    const close = () => onOpenChange(false);

    return (
        <ModalOverlay
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable
            className="fixed inset-0 z-50 flex items-end justify-center bg-overlay/70 backdrop-blur-[6px] sm:items-center sm:p-4"
        >
            <Modal className="w-full max-w-4xl">
                <Dialog className="flex max-h-[92dvh] flex-col overflow-hidden rounded-t-3xl bg-primary shadow-2xl outline-hidden sm:max-h-[90vh] sm:rounded-3xl">
                    <header className="flex items-center gap-4 border-b border-secondary px-4 py-4 sm:px-6">
                        <div className="min-w-0 flex-1">
                            <Heading slot="title" className="text-lg font-bold text-primary sm:text-xl">
                                Complete the look in 3D
                            </Heading>
                            <p className="truncate text-sm text-tertiary">Styled around {anchor.title}</p>
                        </div>

                        <button
                            type="button"
                            onClick={close}
                            aria-label="Close"
                            className="flex size-10 shrink-0 items-center justify-center rounded-full text-fg-secondary transition hover:bg-primary_hover"
                        >
                            <XClose className="size-5" />
                        </button>
                    </header>

                    <div className="min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6">
                        <LookCarousel3D pieces={pieces} onNavigate={close} />

                        <p className="mt-4 flex items-center gap-2 text-sm text-tertiary" aria-live="polite">
                            {loadingCount > 0 ? (
                                <>
                                    <ThinkingOrb state="searching" size={20} aria-hidden />
                                    Finding {loadingCount} {loadingCount === 1 ? "piece" : "pieces"} across the stores… this can take up to a minute.
                                </>
                            ) : (
                                "Photos and prices from live store searches. Tap a piece to compare it across stores."
                            )}
                        </p>
                    </div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
};
