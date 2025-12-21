import { Outlet } from 'react-router-dom';

export const BlankLayout = () => {
    return (
        <div className="min-h-screen bg-ds-background-light dark:bg-ds-background-dark">
            <Outlet />
        </div>
    );
};
