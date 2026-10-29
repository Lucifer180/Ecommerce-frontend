import type { FC, ReactNode } from "react";
import { AlertCircle, SearchLg } from "@untitledui/icons";
import { ThinkingOrb, type OrbState } from "thinking-orbs";

import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { cx } from "@/utils/cx";

/** Full-area loader; a thinking orb (https://libraries.dev/orbs) in place of a spinner. */
export const PageSpinner = ({ className, state = "working" }: { className?: string; state?: OrbState }) => (
    <div role="status" className={cx("flex min-h-60 w-full items-center justify-center", className)}>
        <ThinkingOrb state={state} size={64} aria-label="Loading" />
    </div>
);

type StateProps = {
    icon?: FC<{ className?: string }>;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
};

const State = ({ icon, title, description, action, className }: StateProps) => (
    <div className={cx("flex flex-col items-center justify-center gap-4 px-6 py-16 text-center", className)}>
        <FeaturedIcon icon={icon} size="lg" color="gray" theme="modern" />
        <div className="flex flex-col gap-1">
            <p className="text-lg font-semibold text-primary">{title}</p>
            {description && <p className="max-w-md text-md text-tertiary">{description}</p>}
        </div>
        {action}
    </div>
);

export const EmptyState = ({ icon = SearchLg, ...props }: StateProps) => <State icon={icon} {...props} />;

type ErrorStateProps = Omit<StateProps, "icon" | "action"> & {
    onRetry?: () => void;
};

export const ErrorState = ({ title = "Something went wrong", description, onRetry, className }: Partial<ErrorStateProps>) => (
    <State
        icon={AlertCircle}
        title={title}
        description={description}
        className={className}
        action={
            onRetry ? (
                <Button size="md" color="secondary" onPress={onRetry}>
                    Try again
                </Button>
            ) : undefined
        }
    />
);
