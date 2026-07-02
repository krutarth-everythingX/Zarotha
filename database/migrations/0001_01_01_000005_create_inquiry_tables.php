<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->foreignId('assigned_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('status', 20)->default('unread');
            $table->string('source_page_key', 50)->nullable();
            $table->string('source_url', 2048)->nullable();
            $table->string('name', 150);
            $table->string('email', 190);
            $table->string('phone', 50);
            $table->string('whatsapp_number', 50)->nullable();
            $table->string('subject')->nullable();
            $table->text('message');
            $table->boolean('consent_confirmed')->default(false);
            $table->string('referrer_url', 2048)->nullable();
            $table->string('utm_source', 100)->nullable();
            $table->string('utm_medium', 100)->nullable();
            $table->string('utm_campaign', 150)->nullable();
            $table->string('utm_term', 150)->nullable();
            $table->string('utm_content', 150)->nullable();
            $table->char('ip_hash', 64)->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamp('last_replied_at')->nullable();
            $table->timestamp('archived_at')->nullable();
            $table->timestamps();
            $table->index(['status', 'created_at', 'id'], 'inquiries_status_created_idx');
            $table->index(['assigned_user_id', 'status', 'created_at', 'id'], 'inquiries_assigned_status_idx');
            $table->index(['product_id', 'created_at'], 'inquiries_product_created_idx');
            $table->index(['email', 'created_at'], 'inquiries_email_created_idx');
            $table->index(['source_page_key', 'created_at'], 'inquiries_source_created_idx');
        });

        Schema::create('inquiry_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inquiry_id')->constrained('inquiries')->cascadeOnDelete();
            $table->foreignId('actor_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('activity_type', 30);
            $table->text('note_body')->nullable();
            $table->string('old_status', 20)->nullable();
            $table->string('new_status', 20)->nullable();
            $table->foreignId('old_assigned_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('new_assigned_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('created_at')->nullable();
            $table->index(['inquiry_id', 'created_at', 'id'], 'inquiry_activities_inquiry_created_idx');
            $table->index(['activity_type', 'created_at'], 'inquiry_activities_type_created_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inquiry_activities');
        Schema::dropIfExists('inquiries');
    }
};
