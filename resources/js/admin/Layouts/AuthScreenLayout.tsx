import type React from 'react';
import { AuthLayout } from '@admin/Components/ui/auth-layout';
import { Heading } from '@admin/Components/ui/heading';
import { Text } from '@admin/Components/ui/text';

type AuthScreenLayoutProps = {
    title: string;
    description: string;
    children: React.ReactNode;
};

export function AuthScreenLayout({ title, description, children }: AuthScreenLayoutProps) {
    return (
        <AuthLayout>
            <div className="w-full max-w-md space-y-8">
                <div className="space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                        Zarokha CMS
                    </p>
                    <Heading>{title}</Heading>
                    <Text>{description}</Text>
                </div>
                {children}
            </div>
        </AuthLayout>
    );
}
