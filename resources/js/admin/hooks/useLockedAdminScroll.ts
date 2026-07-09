import { useEffect } from "react";
import { getAdminScrollContainer } from "@admin/Components/AdminPrimitives";

export function useLockedAdminScroll(locked = true) {
    useEffect(() => {
        if (!locked || typeof document === "undefined") {
            return;
        }

        const scrollContainer = getAdminScrollContainer();
        const previousHtmlOverflow = document.documentElement.style.overflow;
        const previousBodyOverflow = document.body.style.overflow;
        const previousContainerOverflowY = scrollContainer?.style.overflowY;

        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";

        if (scrollContainer) {
            scrollContainer.style.overflowY = "hidden";
        }

        return () => {
            document.documentElement.style.overflow = previousHtmlOverflow;
            document.body.style.overflow = previousBodyOverflow;

            if (scrollContainer) {
                scrollContainer.style.overflowY =
                    previousContainerOverflowY ?? "";
            }
        };
    }, [locked]);
}
