import type React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@admin/Components/ui/button';
import { ErrorMessage, Field, FieldGroup, Fieldset, Label } from '@admin/Components/ui/fieldset';
import { Input } from '@admin/Components/ui/input';
import { TextLink } from '@admin/Components/ui/text';
import { AuthScreenLayout } from '@admin/Layouts/AuthScreenLayout';

type ResetPasswordProps = {
    email: string;
    token: string;
};

export default function ResetPassword({ email, token }: ResetPasswordProps) {
    const { data, setData, post, processing, errors } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        post('/admin/reset-password');
    }

    return (
        <>
            <Head title="Choose a new password" />
            <AuthScreenLayout
                title="Choose a new password"
                description="Use a strong password for the Zarokha CMS account."
            >
                <form className="space-y-8" onSubmit={submit}>
                    <Fieldset>
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(event) => setData('email', event.currentTarget.value)}
                                    data-invalid={errors.email ? true : undefined}
                                    required
                                />
                                {errors.email ? <ErrorMessage>{errors.email}</ErrorMessage> : null}
                            </Field>

                            <Field>
                                <Label htmlFor="password">New password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(event) => setData('password', event.currentTarget.value)}
                                    data-invalid={errors.password ? true : undefined}
                                    required
                                />
                                {errors.password ? <ErrorMessage>{errors.password}</ErrorMessage> : null}
                            </Field>

                            <Field>
                                <Label htmlFor="password_confirmation">Confirm password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(event) => setData('password_confirmation', event.currentTarget.value)}
                                    required
                                />
                            </Field>
                        </FieldGroup>
                    </Fieldset>

                    <div className="flex items-center justify-between gap-4">
                        <TextLink href="/admin/login">Back to sign in</TextLink>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save password'}
                        </Button>
                    </div>
                </form>
            </AuthScreenLayout>
        </>
    );
}
