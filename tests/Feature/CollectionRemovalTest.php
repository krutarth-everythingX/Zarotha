<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class CollectionRemovalTest extends TestCase
{
    use RefreshDatabase;

    public function test_collection_schema_and_admin_routes_are_removed(): void
    {
        $this->assertFalse(Schema::hasTable('collections'));
        $this->assertFalse(Schema::hasTable('collection_product'));
        $this->assertFalse(Schema::hasTable('homepage_featured_collection_items'));

        foreach (Route::getRoutes() as $route) {
            if (str_contains($route->uri(), 'collections')) {
                $this->assertNull($route->getName());
                $this->assertStringContainsString('RedirectController', $route->getActionName());

                continue;
            }

            $this->assertStringNotContainsString('collections.', (string) $route->getName());
        }
    }

    public function test_collection_admin_pages_are_removed(): void
    {
        $this->assertFileDoesNotExist(resource_path('js/admin/Pages/Admin/Collections/Index.tsx'));
        $this->assertFileDoesNotExist(resource_path('js/admin/Pages/Admin/Collections/Form.tsx'));
    }
}
