import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/shared/button';
import { Home, ArrowLeft, Map } from 'lucide-react';

export const NotFoundPage: FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-ds-background-light dark:bg-ds-background-dark text-ds-secondary-light dark:text-ds-secondary-dark relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-ds-primary-300/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/2 -left-20 w-72 h-72 bg-ds-secondary-300/10 rounded-full blur-3xl animate-pulse delay-700" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-ds-action/5 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                {/* Icon Container */}
                <div className="relative mx-auto w-32 h-32 mb-8">
                    <div className="absolute inset-0 bg-ds-action/20 rounded-full animate-ping" />
                    <div className="relative flex items-center justify-center w-full h-full bg-ds-card-light dark:bg-ds-card-dark rounded-full shadow-2xl border-4 border-ds-background-light dark:border-ds-background-dark">
                        <Map className="w-16 h-16 text-ds-action" />
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4">
                    <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-ds-primary-light to-ds-action dark:from-ds-primary-dark dark:to-ds-action">
                        {t('notFound.title')}
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-bold text-ds-primary-light dark:text-ds-primary-dark">
                        {t('notFound.heading')}
                    </h2>
                    <p className="text-lg text-ds-muted-light dark:text-ds-muted-dark max-w-md mx-auto">
                        {t('notFound.description')}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => navigate(-1)}
                        leftIcon={<ArrowLeft className="w-5 h-5" />}
                        className="w-full sm:w-auto"
                    >
                        {t('notFound.goBack')}
                    </Button>
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={() => navigate('/dashboard')}
                        leftIcon={<Home className="w-5 h-5" />}
                        className="w-full sm:w-auto"
                    >
                        {t('notFound.goHome')}
                    </Button>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 text-center text-sm text-ds-muted-light/60 dark:text-ds-muted-dark/60">
                <p>Apartium &copy; {new Date().getFullYear()}</p>
            </div>
        </div>
    );
};
