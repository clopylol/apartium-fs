<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1iANpTDWd14adlgxUIOaiJRbGt9njncg0

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Design System

Bu proje tutarlı bir design system kullanmaktadır. Yeni component veya UI elementi eklerken aşağıdaki kurallara uyun:

### 🎯 Önemli Kural

**Yeni bir UI component'i veya stil eklemeden önce:**

1. ✅ **Önce Design System'i kontrol edin**: `/design-system` sayfasına gidip mevcut component'leri inceleyin
2. ✅ **Varsa kullanın**: Eğer ihtiyacınız olan component Design System'de varsa, onu kullanın
3. ✅ **Yoksa oluşturun ve ekleyin**: Eğer yeni bir component oluşturuyorsanız:
   - Component'i oluşturduktan sonra Design System sayfasına (`src/pages/design-system/DesignSystemPage.tsx`) örnek ekleyin
   - Tüm varyantları, boyutları ve kullanım senaryolarını gösterin
   - Best practices ve kullanım kurallarını dokümante edin

### 📋 Design System Sayfası

Design System sayfasına şu şekilde erişebilirsiniz:
- Sidebar'dan "Design System" linkine tıklayın
- Veya direkt `/design-system` route'una gidin

### 🎨 Renk Sistemi

- **ASLA** sabit renk kodları (#hex, rgb, hsl) kullanmayın
- Sadece `tailwind.config.js` içinde tanımlı `ds-*` renk token'larını kullanın
- Light/Dark mode desteği zorunludur
- SVG icon'lar için `currentColor` kullanın

### 📦 Component Organizasyonu

- Her component kendi klasöründe olmalı
- Her klasörde `index.ts` export dosyası olmalı
- Path alias `@/` kullanılmalı
