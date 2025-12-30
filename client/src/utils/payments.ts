/**
 * Parses placeholder payment ID to extract residentId and unitId
 * Format: "placeholder-{residentId}-{unitId}"
 * Uses lastIndexOf to handle cases where residentId or unitId might contain '-'
 * @param placeholderId - Placeholder payment ID
 * @returns Object with residentId and unitId, or null if invalid
 */
export function parsePlaceholderId(placeholderId: string): { residentId: string; unitId: string } | null {
    if (!placeholderId.startsWith('placeholder-')) {
        return null;
    }
    
    // Remove "placeholder-" prefix
    const rest = placeholderId.substring('placeholder-'.length);
    
    // Find the last occurrence of '-' to split residentId and unitId
    // This handles cases where residentId or unitId might contain '-'
    const lastDashIndex = rest.lastIndexOf('-');
    
    if (lastDashIndex === -1 || lastDashIndex === 0 || lastDashIndex === rest.length - 1) {
        return null; // Invalid format
    }
    
    const residentId = rest.substring(0, lastDashIndex);
    const unitId = rest.substring(lastDashIndex + 1);
    
    if (!residentId || !unitId) {
        return null;
    }
    
    return { residentId, unitId };
}

