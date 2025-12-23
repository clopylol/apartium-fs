import { useLocation } from 'react-router-dom';

export const PlaceholderPage = () => {
    const location = useLocation();
    const pageName = location.pathname.split('/').pop() || 'Page';
    const title = pageName.charAt(0).toUpperCase() + pageName.slice(1);

    return (
        <div className="flex flex-col items-center justify-center h-full text-ds-muted-light dark:text-ds-muted-dark">
            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            <p className="text-lg">Bu sayfa henüz geliştirme aşamasında.</p>
        </div>
    );
};
