import { Head, useForm } from '@inertiajs/react';
import { Button } from '@admin/Components/ui/button';
import { AdminShell } from '@admin/Layouts/AdminShell';
import { PagePanel, FormCheckbox } from '@admin/Components/AdminPrimitives';
import { Text } from '@admin/Components/ui/text';
import { useEffect, useState } from 'react';
import {
    BasicInfoSection, ImagesSection, MaterialSection, DimensionsSection,
    PricingSection, InventorySection, SpecsSection
} from './ProductSections';
import type { SelectOption } from '@admin/types';

type ProductsFormProps = {
    mode: 'create' | 'edit';
    product: any | null;
    categories: SelectOption[];
};

export default function ProductsForm({ mode, product, categories }: ProductsFormProps) {
    const form = useForm({
        category_id: product?.categoryId ?? '',
        name: product?.name ?? '',
        slug: product?.slug ?? '',
        sku: product?.sku ?? '',
        product_type: product?.productType ?? '',
        wood_type: product?.woodType ?? '',
        style: product?.style ?? '',
        regular_price: product?.regularPrice ?? '',
        sale_price: product?.salePrice ?? '',
        is_track_inventory: product?.isTrackInventory ?? false,
        stock_quantity: product?.stockQuantity ?? '',
        availability: product?.availability ?? 'in_stock',

        short_description: product?.shortDescription ?? '',
        full_description: product?.fullDescription ?? '',

        details: product?.details ?? {
            custom_wood_type: '',
            material_grade: '',
            wood_source: '',
            is_reclaimed_wood: false,
            is_sustainably_sourced: false,
            dimensions_unit: 'inches',
            height: '',
            width: '',
            depth: '',
            weight: '',
            dynamic_specs: []
        },

        gallery_images_state: product?.galleryImages ?? [],

        status: product?.status ?? 'draft',
        is_featured: product?.isFeatured ?? false,
        is_best_selling: product?.isBestSelling ?? false,
        is_latest: product?.isLatest ?? false,
    });

    const submit = (statusOverride?: string) => {
        const payload: Record<string, any> = {
            ...form.data,
            gallery_images: form.data.gallery_images_state.map((img: any) => img.id),
        };

        if (statusOverride) {
            payload.status = statusOverride;
        }

        // Remove the gallery_images_state from the payload (not a DB field)
        delete payload.gallery_images_state;

        if (mode === 'edit' && product?.id) {
            form.transform(() => payload);
            form.patch(`/admin/products/${product.id}`);
            return;
        }

        form.transform(() => payload);
        form.post('/admin/products');
    };

    const sections = [
        { id: 'basic-info', label: 'Basic Info' },
        { id: 'images', label: 'Images' },
        { id: 'material', label: 'Material' },
        { id: 'dimensions', label: 'Dimensions & Weight' },
        { id: 'pricing', label: 'Pricing' },
        { id: 'inventory', label: 'Inventory' },
        { id: 'specifications', label: 'Dynamic Specs' },
    ];

    const [activeSection, setActiveSection] = useState(sections[0].id);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 150;
            for (let i = sections.length - 1; i >= 0; i--) {
                const sectionId = sections[i].id;
                const element = document.getElementById(sectionId);
                if (element && element.offsetTop <= scrollPosition) {
                    setActiveSection(sectionId);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <>
            <Head title={mode === 'edit' ? `Edit ${product?.name ?? 'Product'}` : 'Add Product'} />
            <AdminShell
                title={mode === 'edit' ? 'Edit Product' : 'Add Product'}
                description="Manage comprehensive product details."
                actions={
                    <div className="flex gap-2">
                        <Button outline type="button" onClick={() => submit('draft')} disabled={form.processing}>Save as Draft</Button>
                        <Button type="button" onClick={() => submit('published')} disabled={form.processing}>Publish Product</Button>
                    </div>
                }
            >
                <form
                    className="grid grid-cols-1 xl:grid-cols-[250px_1fr] gap-8 items-start relative pb-20"
                    onSubmit={(event) => {
                        event.preventDefault();
                        submit();
                    }}
                >
                    {/* Left Sticky Navigation */}
                    <div className="hidden xl:block sticky top-24">
                        <PagePanel className="p-4">
                            <p className="font-semibold mb-4 px-2 text-zinc-950 dark:text-white">Sections</p>
                            <nav className="flex flex-col space-y-1">
                                {sections.map(section => (
                                    <button
                                        key={section.id}
                                        type="button"
                                        onClick={() => scrollToSection(section.id)}
                                        className={`text-left px-3 py-2 text-sm rounded-md transition-colors ${
                                            activeSection === section.id
                                                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-medium'
                                                : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-white'
                                        }`}
                                    >
                                        {section.label}
                                    </button>
                                ))}
                            </nav>

                            <div className="mt-8 border-t border-zinc-950/8 dark:border-white/10 pt-4 px-2 space-y-4">
                                <p className="font-semibold text-zinc-950 dark:text-white">Visibility flags</p>
                                <div className="space-y-3">
                                    <FormCheckbox checked={form.data.is_featured} onChange={(e) => form.setData('is_featured', e.target.checked)} label="Featured Product" />
                                    <FormCheckbox checked={form.data.is_best_selling} onChange={(e) => form.setData('is_best_selling', e.target.checked)} label="Best Selling" />
                                    <FormCheckbox checked={form.data.is_latest} onChange={(e) => form.setData('is_latest', e.target.checked)} label="Latest Collection" />
                                </div>
                            </div>
                        </PagePanel>
                    </div>

                    {/* Main Content Sections */}
                    <div className="space-y-8 min-w-0">
                        <BasicInfoSection data={form.data} setData={form.setData} errors={form.errors} categories={categories} />
                        <ImagesSection data={form.data} setData={form.setData} errors={form.errors} />
                        <MaterialSection data={form.data} setData={form.setData} errors={form.errors} />
                        <DimensionsSection data={form.data} setData={form.setData} errors={form.errors} />
                        <PricingSection data={form.data} setData={form.setData} errors={form.errors} />
                        <InventorySection data={form.data} setData={form.setData} errors={form.errors} />
                        <SpecsSection data={form.data} setData={form.setData} errors={form.errors} />
                    </div>
                </form>
            </AdminShell>
        </>
    );
}
