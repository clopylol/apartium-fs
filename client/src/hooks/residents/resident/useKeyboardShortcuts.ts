import { useEffect, useRef } from "react";

export interface UseKeyboardShortcutsParams {
    enabled: boolean;
    onSearchFocus?: () => void;
    onClearFilters?: () => void;
    onToggleView?: () => void;
    hasActiveFilters?: boolean;
}

export function useKeyboardShortcuts({
    enabled,
    onSearchFocus,
    onClearFilters,
    onToggleView,
    hasActiveFilters = false,
}: UseKeyboardShortcutsParams): void {
    const searchInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            // Ignore if user is typing in an input, textarea, or contenteditable
            const target = event.target as HTMLElement;
            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable
            ) {
                return;
            }

            // '/' - Focus search input
            if (event.key === "/" && onSearchFocus) {
                event.preventDefault();
                onSearchFocus();
            }

            // 'Esc' - Clear filters (only if active filters exist)
            if (event.key === "Escape" && onClearFilters && hasActiveFilters) {
                event.preventDefault();
                onClearFilters();
            }

            // 'G' - Toggle view mode (grid/list)
            if (event.key === "g" || event.key === "G") {
                if (onToggleView) {
                    event.preventDefault();
                    onToggleView();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [enabled, onSearchFocus, onClearFilters, onToggleView, hasActiveFilters]);
}

