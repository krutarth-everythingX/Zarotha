import { Head, router } from "@inertiajs/react";
import { AdminShell } from "@admin/Layouts/AdminShell";
import type { SelectOption } from "@admin/types";
import ProductDrawer, { type ProductPayload } from "./ProductDrawer";

type ProductsFormProps = {
    mode: "create" | "edit";
    product: ProductPayload | null;
    categories: SelectOption[];
};

export default function ProductsForm({
    mode,
    product,
    categories,
}: ProductsFormProps) {
    const title =
        mode === "edit" ? `Edit ${product?.name ?? "Product"}` : "Add Product";

    return (
        <>
            <Head title={title} />
            <AdminShell
                title="Products"
                description="Add and edit products from a focused drawer."
            >
                <ProductDrawer
                    mode={mode}
                    product={product}
                    categories={categories}
                    onClose={() => router.visit("/admin/products")}
                />
            </AdminShell>
        </>
    );
}
