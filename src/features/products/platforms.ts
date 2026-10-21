const PLATFORM_LABELS: Record<string, string> = {
    amazon: "Amazon",
    flipkart: "Flipkart",
    myntra: "Myntra",
};

export const platformLabel = (platform: string) => PLATFORM_LABELS[platform] ?? platform;
