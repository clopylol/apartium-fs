/**
 * Validation and formatting utilities
 * Reusable functions for form validation and data formatting
 */

// ==================== PHONE NUMBER ====================

/**
 * Format phone number for display (538-765-0525)
 * @param phone - Phone number string (digits only)
 * @returns Formatted phone string (XXX-XXX-XXXX)
 */
export function formatPhoneNumber(phone: string): string {
    if (!phone) return "";
    
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, "");
    
    // Format as XXX-XXX-XXXX
    if (digits.length <= 3) {
        return digits;
    } else if (digits.length <= 6) {
        return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
        return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
}

/**
 * Clean phone number for database storage (removes all non-digits)
 * @param phone - Phone number string (formatted or unformatted)
 * @returns Clean phone string (digits only)
 */
export function cleanPhoneNumber(phone: string): string {
    if (!phone) return "";
    return phone.replace(/\D/g, "");
}

/**
 * Validate phone number format
 * @param phone - Phone number string
 * @returns true if valid (10 digits), false otherwise
 */
export function validatePhoneNumber(phone: string): boolean {
    const cleaned = cleanPhoneNumber(phone);
    return cleaned.length === 10 && /^\d{10}$/.test(cleaned);
}

/**
 * Get phone number error message
 * @param phone - Phone number string
 * @returns Error message or null if valid
 */
export function getPhoneNumberError(phone: string): string | null {
    if (!phone || phone.trim() === "") {
        return "Telefon numarası zorunludur";
    }
    
    const cleaned = cleanPhoneNumber(phone);
    
    if (cleaned.length === 0) {
        return "Geçerli bir telefon numarası girin";
    }
    
    if (cleaned.length < 10) {
        return "Telefon numarası 10 haneli olmalıdır";
    }
    
    if (cleaned.length > 10) {
        return "Telefon numarası en fazla 10 haneli olabilir";
    }
    
    if (!/^\d{10}$/.test(cleaned)) {
        return "Telefon numarası sadece rakamlardan oluşmalıdır";
    }
    
    return null;
}

// ==================== EMAIL ====================

/**
 * Validate email format
 * @param email - Email string
 * @returns true if valid email format, false otherwise
 */
export function validateEmail(email: string): boolean {
    if (!email || email.trim() === "") return true; // Email is optional
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

/**
 * Get email error message
 * @param email - Email string
 * @returns Error message or null if valid
 */
export function getEmailError(email: string): string | null {
    if (!email || email.trim() === "") {
        return null; // Email is optional
    }
    
    if (!validateEmail(email)) {
        return "Geçerli bir e-posta adresi girin (örn: ornek@email.com)";
    }
    
    // Check length
    if (email.length > 255) {
        return "E-posta adresi en fazla 255 karakter olabilir";
    }
    
    return null;
}

// ==================== NAME ====================

/**
 * Validate name (ad soyad)
 * @param name - Name string
 * @param maxLength - Maximum length (default: 100)
 * @returns true if valid, false otherwise
 */
export function validateName(name: string, maxLength: number = 100): boolean {
    if (!name || name.trim() === "") return false;
    
    const trimmed = name.trim();
    
    // Check length
    if (trimmed.length < 2) {
        return false;
    }
    
    if (trimmed.length > maxLength) {
        return false;
    }
    
    // Check for valid characters (letters, spaces, Turkish characters)
    const nameRegex = /^[a-zA-ZçğıöşüÇĞIİÖŞÜ\s]+$/;
    return nameRegex.test(trimmed);
}

/**
 * Get name error message
 * @param name - Name string
 * @param maxLength - Maximum length (default: 100)
 * @returns Error message or null if valid
 */
export function getNameError(name: string, maxLength: number = 100): string | null {
    if (!name || name.trim() === "") {
        return "Ad soyad zorunludur";
    }
    
    const trimmed = name.trim();
    
    if (trimmed.length < 2) {
        return "Ad soyad en az 2 karakter olmalıdır";
    }
    
    if (trimmed.length > maxLength) {
        return `Ad soyad en fazla ${maxLength} karakter olabilir`;
    }
    
    // Check for valid characters
    const nameRegex = /^[a-zA-ZçğıöşüÇĞIİÖŞÜ\s]+$/;
    if (!nameRegex.test(trimmed)) {
        return "Ad soyad sadece harf ve boşluk içerebilir";
    }
    
    return null;
}

/**
 * Truncate name to max length
 * @param name - Name string
 * @param maxLength - Maximum length
 * @returns Truncated name
 */
export function truncateName(name: string, maxLength: number = 100): string {
    if (!name) return "";
    return name.slice(0, maxLength);
}

// ==================== GENERAL VALIDATION ====================

/**
 * Validation result type
 */
export interface ValidationResult {
    isValid: boolean;
    error: string | null;
}

/**
 * Validate all form fields at once
 */
export interface ResidentFormData {
    name: string;
    phone: string;
    email: string;
    siteId: string;
    buildingId: string;
    unitId: string;
}

export interface ResidentFormErrors {
    name?: string;
    phone?: string;
    email?: string;
    siteId?: string;
    buildingId?: string;
    unitId?: string;
}

/**
 * Validate resident form data
 * @param data - Form data
 * @returns Validation errors object
 */
export function validateResidentForm(data: ResidentFormData): ResidentFormErrors {
    const errors: ResidentFormErrors = {};
    
    // Name validation
    const nameError = getNameError(data.name);
    if (nameError) {
        errors.name = nameError;
    }
    
    // Phone validation
    const phoneError = getPhoneNumberError(data.phone);
    if (phoneError) {
        errors.phone = phoneError;
    }
    
    // Email validation (optional)
    const emailError = getEmailError(data.email);
    if (emailError) {
        errors.email = emailError;
    }
    
    // Site validation
    if (!data.siteId || data.siteId.trim() === "") {
        errors.siteId = "Lütfen bir apartman seçin";
    }
    
    // Building validation
    if (!data.buildingId || data.buildingId.trim() === "") {
        errors.buildingId = "Lütfen bir blok seçin";
    }
    
    // Unit validation
    if (!data.unitId || data.unitId.trim() === "") {
        errors.unitId = "Lütfen bir daire seçin";
    }
    
    return errors;
}

/**
 * Check if form has any errors
 * @param errors - Validation errors object
 * @returns true if form is valid, false otherwise
 */
export function isFormValid(errors: ResidentFormErrors): boolean {
    return Object.keys(errors).length === 0;
}

// ==================== LICENSE PLATE (PLAKA) ====================

/**
 * Clean license plate for database storage (uppercase, no spaces)
 * Turkish license plate format: İlKodu(2 rakam) + HarfGrubu(1-3 harf) + RakamGrubu(2-4 rakam)
 * Example: 42BER69, 34ABC123, 06XYZ4567
 * @param plate - License plate string
 * @returns Clean plate string (uppercase, no spaces)
 */
export function cleanLicensePlate(plate: string): string {
    if (!plate) return "";
    
    // Remove all spaces and convert to uppercase
    let cleaned = plate.replace(/\s/g, "").toUpperCase();
    
    // Remove any invalid characters (keep only letters and numbers)
    cleaned = cleaned.replace(/[^A-Z0-9]/g, "");
    
    return cleaned;
}

/**
 * Format license plate for display (with spaces)
 * Turkish license plate format: İlKodu(2 rakam) + HarfGrubu(1-3 harf) + RakamGrubu(2-4 rakam)
 * Display format: "42 BER 69", "34 ABC 123", "06 XYZ 4567"
 * @param plate - License plate string (with or without spaces)
 * @returns Formatted plate string for display (with spaces)
 */
export function formatLicensePlateForDisplay(plate: string): string {
    if (!plate) return "";
    
    // First clean the plate (remove spaces, uppercase)
    const cleaned = cleanLicensePlate(plate);
    
    if (cleaned.length < 5) {
        return cleaned; // Too short to format
    }
    
    // First 2 characters are city code
    const cityCode = cleaned.slice(0, 2);
    
    // Find where letters start and end
    let letterStart = 2;
    let letterEnd = letterStart;
    
    while (letterEnd < cleaned.length && /[A-Z]/.test(cleaned[letterEnd])) {
        letterEnd++;
    }
    
    const letterGroup = cleaned.slice(letterStart, letterEnd);
    const numberGroup = cleaned.slice(letterEnd);
    
    // Format: "42 BER 69"
    return `${cityCode} ${letterGroup} ${numberGroup}`.trim();
}

/**
 * Validate Turkish license plate format
 * Format: İlKodu(2 rakam 01-81) + HarfGrubu(1-3 harf) + RakamGrubu(2-4 rakam)
 * @param plate - License plate string
 * @returns true if valid, false otherwise
 */
export function validateLicensePlate(plate: string): boolean {
    if (!plate || plate.trim() === "") return false;
    
    const cleaned = cleanLicensePlate(plate);
    
    // Total length should be 5-9 characters (2 + 1-3 + 2-4)
    if (cleaned.length < 5 || cleaned.length > 9) {
        return false;
    }
    
    // First 2 characters must be digits (01-81)
    const cityCode = cleaned.slice(0, 2);
    if (!/^\d{2}$/.test(cityCode)) {
        return false;
    }
    
    const cityCodeNum = parseInt(cityCode, 10);
    if (cityCodeNum < 1 || cityCodeNum > 81) {
        return false;
    }
    
    // Find where letters start and end
    let letterStart = 2;
    let letterEnd = letterStart;
    
    // Find the letter group (1-3 letters)
    while (letterEnd < cleaned.length && /[A-Z]/.test(cleaned[letterEnd])) {
        letterEnd++;
    }
    
    const letterGroup = cleaned.slice(letterStart, letterEnd);
    
    // Letter group must be 1-3 characters
    if (letterGroup.length < 1 || letterGroup.length > 3) {
        return false;
    }
    
    // Remaining must be digits (2-4 digits)
    const numberGroup = cleaned.slice(letterEnd);
    if (!/^\d{2,4}$/.test(numberGroup)) {
        return false;
    }
    
    return true;
}

/**
 * Get license plate error message
 * @param plate - License plate string
 * @returns Error message or null if valid
 */
export function getLicensePlateError(plate: string): string | null {
    if (!plate || plate.trim() === "") {
        return "Plaka numarası zorunludur";
    }
    
    const cleaned = cleanLicensePlate(plate);
    
    if (cleaned.length === 0) {
        return "Geçerli bir plaka numarası girin";
    }
    
    // Check total length
    if (cleaned.length < 5) {
        return "Plaka numarası en az 5 karakter olmalıdır";
    }
    
    if (cleaned.length > 9) {
        return "Plaka numarası en fazla 9 karakter olabilir";
    }
    
    // Check city code (first 2 digits)
    const cityCode = cleaned.slice(0, 2);
    if (!/^\d{2}$/.test(cityCode)) {
        return "Plaka numarası 2 rakam ile başlamalıdır (il kodu: 01-81)";
    }
    
    const cityCodeNum = parseInt(cityCode, 10);
    if (cityCodeNum < 1 || cityCodeNum > 81) {
        return "İl kodu 01 ile 81 arasında olmalıdır";
    }
    
    // Find letter group
    let letterStart = 2;
    let letterEnd = letterStart;
    
    while (letterEnd < cleaned.length && /[A-Z]/.test(cleaned[letterEnd])) {
        letterEnd++;
    }
    
    const letterGroup = cleaned.slice(letterStart, letterEnd);
    
    if (letterGroup.length === 0) {
        return "Plaka numarası harf grubu içermelidir (1-3 harf)";
    }
    
    if (letterGroup.length > 3) {
        return "Harf grubu en fazla 3 karakter olabilir";
    }
    
    // Check number group
    const numberGroup = cleaned.slice(letterEnd);
    
    if (numberGroup.length === 0) {
        return "Plaka numarası rakam grubu içermelidir (2-4 rakam)";
    }
    
    if (!/^\d+$/.test(numberGroup)) {
        return "Rakam grubu sadece rakamlardan oluşmalıdır";
    }
    
    if (numberGroup.length < 2) {
        return "Rakam grubu en az 2 rakam olmalıdır";
    }
    
    if (numberGroup.length > 4) {
        return "Rakam grubu en fazla 4 rakam olabilir";
    }
    
    return null;
}

