import React, { Component, type ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onRetry?: () => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
        });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return <ErrorFallback error={this.state.error} onReset={this.handleReset} onRetry={this.props.onRetry} />;
        }

        return this.props.children;
    }
}

interface ErrorFallbackProps {
    error: Error | null;
    onReset: () => void;
    onRetry?: () => void;
}

function ErrorFallback({ error, onReset, onRetry }: ErrorFallbackProps): JSX.Element {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-ds-destructive-light/10 dark:bg-ds-destructive-dark/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-ds-destructive-light/20 dark:ring-ds-destructive-dark/20">
                <AlertCircle className="w-10 h-10 text-ds-destructive-light dark:text-ds-destructive-dark" />
            </div>
            <h3 className="text-ds-secondary-light dark:text-ds-secondary-dark font-bold text-xl mb-2">
                {t("errorBoundary.title")}
            </h3>
            <p className="text-ds-muted-light dark:text-ds-muted-dark mb-2 text-center max-w-md">
                {t("errorBoundary.message")}
            </p>
            {error && process.env.NODE_ENV === "development" && (
                <details className="mt-4 p-4 bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg max-w-2xl w-full text-left">
                    <summary className="cursor-pointer text-sm font-medium text-ds-muted-light dark:text-ds-muted-dark mb-2">
                        Error Details (Development Only)
                    </summary>
                    <pre className="text-xs text-ds-destructive-light dark:text-ds-destructive-dark overflow-auto">
                        {error.toString()}
                        {error.stack && `\n\n${error.stack}`}
                    </pre>
                </details>
            )}
            <button
                onClick={() => {
                    onReset();
                    onRetry?.();
                }}
                className="mt-6 flex items-center gap-2 px-4 py-2 bg-ds-primary-light dark:bg-ds-primary-dark text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
                <RefreshCw className="w-4 h-4" />
                {t("errorBoundary.retry")}
            </button>
        </div>
    );
}

