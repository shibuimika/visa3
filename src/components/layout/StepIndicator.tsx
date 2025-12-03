import { cn } from "@/lib/utils";

interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
    label?: string;
    className?: string;
}

export function StepIndicator({ currentStep, totalSteps, label, className }: StepIndicatorProps) {
    const progress = Math.min(100, Math.max(0, ((currentStep - 1) / totalSteps) * 100));

    return (
        <div className={cn("w-full space-y-2", className)}>
            <div className="flex justify-between text-sm font-medium text-muted-foreground">
                <span>{label || `ステップ ${currentStep} / ${totalSteps}`}</span>
                <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                    className="h-full bg-primary transition-all duration-500 ease-in-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
