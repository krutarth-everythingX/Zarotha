import type React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@admin/Components/ui/button';
import { ErrorMessage, Field, FieldGroup, Fieldset, Label } from '@admin/Components/ui/fieldset';
import { Input } from '@admin/Components/ui/input';
import { Text, TextLink } from '@admin/Components/ui/text';
import { AuthScreenLayout } from '@admin/Layouts/AuthScreenLayout';

type LoginPageProps = {
    canResetPassword: boolean;
    status: string | null;
};

export default function Login({ canResetPassword, status }: LoginPageProps) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        post('/admin/login');
    }

    return (
        <>
            <Head title="Sign in" />
            <AuthScreenLayout
                title="Sign in to the CMS"
                description="Authorized Zarokha team members can access the project foundation here."
            >
                <form className="space-y-8" onSubmit={submit}>
                    <Fieldset>
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="username"
                                    value={data.email}
                                    onChange={(event) => setData('email', event.currentTarget.value)}
                                    data-invalid={errors.email ? true : undefined}
                                    required
                                />
                                {errors.email ? <ErrorMessage>{errors.email}</ErrorMessage> : null}
                            </Field>

                            <Field>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(event) => setData('password', event.currentTarget.value)}
                                    data-invalid={errors.password ? true : undefined}
                                    required
                                />
                                {errors.password ? <ErrorMessage>{errors.password}</ErrorMessage> : null}
                            </Field>
                        </FieldGroup>
                    </Fieldset>

                    {status ? (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                            {status}
                        </div>
                    ) : null}

                    <div className="flex items-center justify-between gap-4">
                        {canResetPassword ? (
                            <TextLink href="/admin/forgot-password">Forgot password?</TextLink>
                        ) : (
                            <Text>Password resets are unavailable.</Text>
                        )}

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </div>
                </form>
            </AuthScreenLayout>
        </>
    );
}
