import type React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@admin/Components/ui/button';
import { ErrorMessage, Field, FieldGroup, Fieldset, Label } from '@admin/Components/ui/fieldset';
import { Input } from '@admin/Components/ui/input';
import { TextLink } from '@admin/Components/ui/text';
import { AuthScreenLayout } from '@admin/Layouts/AuthScreenLayout';

type ForgotPasswordProps = {
    status: string | null;
};

export default function ForgotPassword({ status }: ForgotPasswordProps) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        post('/admin/forgot-password');
    }

    return (
        <>
            <Head title="Reset password" />
            <AuthScreenLayout
                title="Reset your password"
                description="Enter your CMS email address and we will send a reset link if the account exists."
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
                        </FieldGroup>
                    </Fieldset>

                    {status ? (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                            {status}
                        </div>
                    ) : null}

                    <div className="flex items-center justify-between gap-4">
                        <TextLink href="/admin/login">Back to sign in</TextLink>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Sending...' : 'Send reset link'}
                        </Button>
                    </div>
                </form>
            </AuthScreenLayout>
        </>
    );
}
