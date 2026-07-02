import * as Headless from '@headlessui/react';
import { Link as InertiaLink } from '@inertiajs/react';
import type React from 'react';
import { forwardRef } from 'react';

export const Link = forwardRef(function Link(
    props: React.ComponentPropsWithoutRef<typeof InertiaLink>,
    ref: React.ForwardedRef<HTMLAnchorElement>,
) {
    return (
        <Headless.DataInteractive>
            <InertiaLink {...props} ref={ref} />
        </Headless.DataInteractive>
    );
});
