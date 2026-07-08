import type React from "react";
import { Head, useForm } from "@inertiajs/react";

type LoginPageProps = {
    canResetPassword: boolean;
    status: string | null;
};

export default function Login({ canResetPassword, status }: LoginPageProps) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        post("/admin/login");
    }

    return (
        <>
            <Head title="Sign in" />
            <main className="relative isolate min-h-dvh overflow-x-hidden bg-zinc-950 text-white">
                <div
                    className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage:
                            "url('/images/admin-login-handcrafted-bg.webp')",
                    }}
                    aria-hidden="true"
                />
                <div
                    className="absolute inset-0 -z-10 bg-gradient-to-br from-black/85 via-zinc-950/55 to-black/80"
                    aria-hidden="true"
                />
                <div
                    className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-black/75 to-transparent"
                    aria-hidden="true"
                />

                <div className="absolute top-4 left-4 z-10 sm:top-6 sm:left-6 lg:top-8 lg:left-8">
                    <img
                        src="/images/logo.png"
                        alt="Zarokha"
                        className="h-12 w-auto sm:h-14 lg:h-16"
                    />
                </div>

                <div className="flex min-h-dvh items-center justify-center px-4 py-8 sm:px-6 lg:px-16">
                    <section className="w-full max-w-[28rem] rounded-lg border border-white/20 bg-zinc-950/55 px-5 py-6 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:px-8 sm:py-8">
                        <div className="mb-8 space-y-3">
                            <div className="flex items-center gap-3">
                                <img
                                    src="/images/logo-z.png"
                                    alt="Zarokha mark"
                                    className="h-14 w-14 rounded-md object-contain sm:h-16 sm:w-16"
                                />
                                <div className="min-w-0">
                                    <h1 className="text-2xl font-semibold text-white sm:text-3xl">
                                        Sign in to the CMS
                                    </h1>
                                </div>
                            </div>
                            <p className="max-w-sm text-sm leading-6 text-zinc-100/80">
                                Authorized Zarokha team members can access the
                                project foundation here.
                            </p>
                        </div>

                        <form className="space-y-7" onSubmit={submit}>
                            <div className="space-y-5">
                                <div>
                                    <label
                                        className="block text-sm font-medium text-white"
                                        htmlFor="email"
                                    >
                                        Email address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        autoComplete="username"
                                        value={data.email}
                                        onChange={(event) =>
                                            setData(
                                                "email",
                                                event.currentTarget.value,
                                            )
                                        }
                                        aria-invalid={
                                            errors.email ? true : undefined
                                        }
                                        aria-describedby={
                                            errors.email
                                                ? "email-error"
                                                : undefined
                                        }
                                        className="mt-3 block h-12 w-full rounded-lg border border-white/20 bg-white/10 px-4 text-base text-white shadow-inner shadow-black/20 outline-none transition placeholder:text-white/40 focus:border-amber-100/80 focus:bg-white/15 focus:ring-4 focus:ring-amber-100/20 sm:h-11 sm:text-sm"
                                        required
                                    />
                                    {errors.email ? (
                                        <p
                                            className="mt-2 text-sm text-red-200"
                                            id="email-error"
                                        >
                                            {errors.email}
                                        </p>
                                    ) : null}
                                </div>

                                <div>
                                    <label
                                        className="block text-sm font-medium text-white"
                                        htmlFor="password"
                                    >
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        autoComplete="current-password"
                                        value={data.password}
                                        onChange={(event) =>
                                            setData(
                                                "password",
                                                event.currentTarget.value,
                                            )
                                        }
                                        aria-invalid={
                                            errors.password ? true : undefined
                                        }
                                        aria-describedby={
                                            errors.password
                                                ? "password-error"
                                                : undefined
                                        }
                                        className="mt-3 block h-12 w-full rounded-lg border border-white/20 bg-white/10 px-4 text-base text-white shadow-inner shadow-black/20 outline-none transition placeholder:text-white/40 focus:border-amber-100/80 focus:bg-white/15 focus:ring-4 focus:ring-amber-100/20 sm:h-11 sm:text-sm"
                                        required
                                    />
                                    {errors.password ? (
                                        <p
                                            className="mt-2 text-sm text-red-200"
                                            id="password-error"
                                        >
                                            {errors.password}
                                        </p>
                                    ) : null}
                                </div>

                                <label className="flex items-center gap-3 text-sm text-zinc-100/85">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(event) =>
                                            setData(
                                                "remember",
                                                event.currentTarget.checked,
                                            )
                                        }
                                        className="h-4 w-4 rounded border border-white/25 bg-white/10 text-white accent-white outline-none ring-0 focus:ring-4 focus:ring-amber-100/20"
                                    />
                                    <span>Remember me</span>
                                </label>
                            </div>

                            {status ? (
                                <div
                                    className="rounded-lg border border-emerald-200/30 bg-emerald-300/10 px-4 py-3 text-sm leading-6 text-emerald-50"
                                    role="status"
                                >
                                    {status}
                                </div>
                            ) : null}

                            <div className="flex justify-end">
                                {!canResetPassword ? (
                                    <p className="text-sm text-zinc-100/75">
                                        Password resets are unavailable.
                                    </p>
                                ) : null}

                                <button
                                    className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-zinc-950 shadow-lg shadow-black/25 transition hover:bg-amber-50 focus:outline-none focus:ring-4 focus:ring-amber-100/35 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-28"
                                    type="submit"
                                    disabled={processing}
                                >
                                    {processing ? "Signing in..." : "Sign in"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </main>
        </>
    );
}
