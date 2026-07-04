import React from 'react';
import { Field, Label } from '@admin/Components/ui/fieldset';
import { FieldError, FormInput, FormSelect, FormTextarea, PagePanel, FormCheckbox } from '@admin/Components/AdminPrimitives';
import { Text } from '@admin/Components/ui/text';
import RichTextEditor from './RichTextEditor';
import ImageUploadArea, { type ProductImage } from './ImageUploadArea';
import DynamicSpecifications, { type DynamicSpec } from './DynamicSpecifications';
import type { PublishStatus, SelectOption } from '@admin/types';

// Reusable Section Panel wrapper
export const SectionPanel = ({ id, title, description, children }: { id: string, title: string, description: string, children: React.ReactNode }) => (
    <div id={id} className="scroll-mt-24">
        <PagePanel>
            <div className="mb-6 border-b border-zinc-950/8 dark:border-white/10 pb-4">
                <p className="text-lg font-semibold text-zinc-950 dark:text-white">{title}</p>
                <Text className="mt-1">{description}</Text>
            </div>
            <div className="grid gap-6">
                {children}
            </div>
        </PagePanel>
    </div>
);

export type ProductDetails = {
    custom_wood_type?: string;
    material_grade?: string;
    wood_source?: string;
    is_reclaimed_wood?: boolean;
    is_sustainably_sourced?: boolean;
    dimensions_unit?: string;
    height?: string;
    width?: string;
    depth?: string;
    weight?: string;
    dynamic_specs?: DynamicSpec[];
};

export type ProductPayload = {
    id: number;
    categoryId: number | string;
    name: string;
    slug: string;
    sku?: string | null;
    productType?: string | null;
    woodType?: string | null;
    style?: string | null;
    regularPrice?: string | number | null;
    salePrice?: string | number | null;
    isTrackInventory?: boolean;
    stockQuantity?: string | number | null;
    availability?: string | null;
    shortDescription?: string | null;
    fullDescription?: string | null;
    details?: ProductDetails | null;
    galleryImages?: ProductImage[];
    status: PublishStatus;
    isFeatured: boolean;
    isBestSelling: boolean;
    isLatest: boolean;
    robotsIndex: boolean;
    robotsFollow: boolean;
};

export type ProductFormData = {
    category_id: number | string;
    name: string;
    slug: string;
    sku: string;
    product_type: string;
    wood_type: string;
    style: string;
    regular_price: string | number;
    sale_price: string | number;
    is_track_inventory: boolean;
    stock_quantity: string | number;
    availability: string;
    short_description: string;
    full_description: string;
    details: ProductDetails;
    gallery_images_state: ProductImage[];
    status: PublishStatus;
    is_featured: boolean;
    is_best_selling: boolean;
    is_latest: boolean;
    robots_index: boolean;
    robots_follow: boolean;
};

export type SectionProps = {
    data: ProductFormData;
    setData: <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => void;
    errors: Record<string, string>;
    categories?: SelectOption[];
};

export const BasicInfoSection = ({ data, setData, errors, categories }: SectionProps) => (
    <SectionPanel id="basic-info" title="Basic Information" description="The core details of the product.">
        <div className="grid gap-5 lg:grid-cols-2">
            <Field>
                <Label>Product Name</Label>
                <FormInput value={data.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)} />
                <FieldError message={errors.name} />
            </Field>
            <Field>
                <Label>Slug</Label>
                <FormInput value={data.slug} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('slug', e.target.value)} />
                <FieldError message={errors.slug} />
            </Field>
            <Field>
                <Label>SKU / Product Code</Label>
                <FormInput value={data.sku} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('sku', e.target.value)} />
                <FieldError message={errors.sku} />
            </Field>
            <Field>
                <Label>Category</Label>
                <FormSelect value={data.category_id} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setData('category_id', e.target.value)}>
                    <option value="">Select Category</option>
                    {categories?.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                </FormSelect>
                <FieldError message={errors.category_id} />
            </Field>
            <Field>
                <Label>Product Type</Label>
                <FormInput value={data.product_type} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('product_type', e.target.value)} placeholder="e.g., Bed, Table, Decor" />
                <FieldError message={errors.product_type} />
            </Field>
        </div>
        <Field>
            <Label>Short Description</Label>
            <FormTextarea value={data.short_description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('short_description', e.target.value)} rows={3} />
            <FieldError message={errors.short_description} />
        </Field>
        <Field>
            <Label>Long Description</Label>
            <RichTextEditor value={data.full_description} onChange={(val: string) => setData('full_description', val)} />
            <FieldError message={errors.full_description} />
        </Field>
    </SectionPanel>
);

export const ImagesSection = ({ data, setData }: SectionProps) => (
    <SectionPanel id="images" title="Images" description="Upload and manage product photos. Drag to reorder.">
        <ImageUploadArea
            images={data.gallery_images_state}
            onChange={(imgs) => setData('gallery_images_state', imgs)}
        />
    </SectionPanel>
);

export const MaterialSection = ({ data, setData }: SectionProps) => (
    <SectionPanel id="material" title="Material" description="Wood and material composition details.">
        <div className="grid gap-5 lg:grid-cols-2">
            <Field>
                <Label>Primary Wood Type</Label>
                <FormSelect value={data.wood_type} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setData('wood_type', e.target.value)}>
                    <option value="">Select Wood</option>
                    <option value="Teak">Teak</option>
                    <option value="Mango Wood">Mango Wood</option>
                    <option value="Sheesham">Sheesham</option>
                    <option value="Acacia">Acacia</option>
                    <option value="Other">Other (Custom)</option>
                </FormSelect>
            </Field>
            {data.wood_type === 'Other' && (
                <Field>
                    <Label>Custom Wood Type</Label>
                    <FormInput value={data.details?.custom_wood_type || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('details', {...data.details, custom_wood_type: e.target.value})} />
                </Field>
            )}
            <Field>
                <Label>Material Grade</Label>
                <FormInput value={data.details?.material_grade || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('details', {...data.details, material_grade: e.target.value})} placeholder="e.g. Premium Grade A" />
            </Field>
            <Field>
                <Label>Wood Source</Label>
                <FormInput value={data.details?.wood_source || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('details', {...data.details, wood_source: e.target.value})} />
            </Field>
        </div>
        <div className="flex gap-4 flex-wrap">
            <FormCheckbox checked={data.details?.is_reclaimed_wood || false} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('details', {...data.details, is_reclaimed_wood: e.target.checked})} label="Reclaimed Wood" />
            <FormCheckbox checked={data.details?.is_sustainably_sourced || false} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('details', {...data.details, is_sustainably_sourced: e.target.checked})} label="Sustainably Sourced" />
        </div>
    </SectionPanel>
);

export const DimensionsSection = ({ data, setData }: SectionProps) => (
    <SectionPanel id="dimensions" title="Dimensions & Weight" description="Physical specifications of the product.">
        <div className="grid gap-5 lg:grid-cols-3">
            <Field>
                <Label>Unit</Label>
                <FormSelect value={data.details?.dimensions_unit || 'inches'} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setData('details', {...data.details, dimensions_unit: e.target.value})}>
                    <option value="inches">Inches (in)</option>
                    <option value="cm">Centimeters (cm)</option>
                    <option value="mm">Millimeters (mm)</option>
                </FormSelect>
            </Field>
            <Field>
                <Label>Height</Label>
                <FormInput type="number" step="0.01" value={data.details?.height || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('details', {...data.details, height: e.target.value})} />
            </Field>
            <Field>
                <Label>Width</Label>
                <FormInput type="number" step="0.01" value={data.details?.width || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('details', {...data.details, width: e.target.value})} />
            </Field>
            <Field>
                <Label>Depth</Label>
                <FormInput type="number" step="0.01" value={data.details?.depth || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('details', {...data.details, depth: e.target.value})} />
            </Field>
            <Field>
                <Label>Weight (kg)</Label>
                <FormInput type="number" step="0.01" value={data.details?.weight || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('details', {...data.details, weight: e.target.value})} />
            </Field>
        </div>
    </SectionPanel>
);

export const PricingSection = ({ data, setData, errors }: SectionProps) => (
    <SectionPanel id="pricing" title="Pricing" description="Set up regular and sale prices.">
        <div className="grid gap-5 lg:grid-cols-2">
            <Field>
                <Label>Regular Price (₹)</Label>
                <FormInput type="number" step="0.01" value={data.regular_price} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('regular_price', e.target.value)} />
                <FieldError message={errors.regular_price} />
            </Field>
            <Field>
                <Label>Sale Price (₹)</Label>
                <FormInput type="number" step="0.01" value={data.sale_price} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('sale_price', e.target.value)} />
                <FieldError message={errors.sale_price} />
            </Field>
        </div>
    </SectionPanel>
);

export const InventorySection = ({ data, setData }: SectionProps) => (
    <SectionPanel id="inventory" title="Inventory" description="Manage stock and availability.">
        <div className="space-y-5">
            <FormCheckbox checked={data.is_track_inventory} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('is_track_inventory', e.target.checked)} label="Track Inventory" />

            {data.is_track_inventory && (
                <div className="grid gap-5 lg:grid-cols-2">
                    <Field>
                        <Label>Stock Quantity</Label>
                        <FormInput type="number" value={data.stock_quantity} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('stock_quantity', e.target.value)} />
                    </Field>
                </div>
            )}
            <Field>
                <Label>Availability Status</Label>
                <FormSelect value={data.availability} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setData('availability', e.target.value)}>
                    <option value="in_stock">In Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="made_to_order">Made to Order</option>
                    <option value="pre_order">Pre-order</option>
                </FormSelect>
            </Field>
        </div>
    </SectionPanel>
);

export const SpecsSection = ({ data, setData }: SectionProps) => (
    <SectionPanel id="specifications" title="Dynamic Specifications" description="Add custom key-value attributes.">
        <DynamicSpecifications
            specs={data.details?.dynamic_specs || []}
            onChange={(specs) => setData('details', {...data.details, dynamic_specs: specs})}
        />
    </SectionPanel>
);
