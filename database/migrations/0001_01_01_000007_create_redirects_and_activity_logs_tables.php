<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('redirects', function (Blueprint $table) {
            $table->id();
            $table->string('source_path', 2048)->unique();
            $table->string('target_path', 2048);
            $table->string('redirect_type', 20)->default('manual');
            $table->string('source_entity_type', 30)->nullable();
            $table->unsignedBigInteger('source_entity_id')->nullable();
            $table->unsignedSmallInteger('http_status')->default(301);
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index(['is_active', 'http_status'], 'redirects_active_status_idx');
            $table->index(['source_entity_type', 'source_entity_id'], 'redirects_entity_idx');
        });

        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('actor_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('subject_type', 50);
            $table->unsignedBigInteger('subject_id')->nullable();
            $table->string('action', 50);
            $table->string('summary')->nullable();
            $table->char('ip_hash', 64)->nullable();
            $table->timestamp('created_at')->nullable();
            $table->index(['subject_type', 'subject_id', 'created_at'], 'activity_logs_subject_created_idx');
            $table->index(['actor_user_id', 'created_at'], 'activity_logs_actor_created_idx');
            $table->index(['action', 'created_at'], 'activity_logs_action_created_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('redirects');
    }
};
