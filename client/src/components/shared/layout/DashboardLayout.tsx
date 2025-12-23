// 1. External & React
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

// 4. Icons
import { Menu } from 'lucide-react';

// 3. Components
import { Sidebar } from '@/components/shared/sidebar';

export const DashboardLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen bg-ds-background-light dark:bg-ds-background-dark text-ds-primary-light dark:text-ds-primary-dark font-sans overflow-hidden">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden absolute top-4 left-4 z-40 p-2 bg-ds-card-light dark:bg-ds-card-dark text-ds-primary-light dark:text-ds-primary-dark rounded-lg border border-ds-border-light dark:border-ds-border-dark shadow-lg"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Sidebar */}
            <Sidebar
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
                <header className="h-16 border-b border-ds-border-light dark:border-ds-border-dark flex items-center justify-end px-6 bg-ds-card-light dark:bg-ds-card-dark">
                    {/* Header content (e.g., user dropdown, theme toggle) can go here */}
                    <div className="flex items-center gap-4">
                        {/* Placeholder for header items */}
                    </div>
                </header>
                <div className="flex-1 overflow-auto p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
