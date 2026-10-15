<?php

use App\Models\Artwork;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        Artwork::query()->each(function (Artwork $artwork) {
            if (! $artwork->image) {
                return;
            }

            $artwork->media()->create([
                'path' => $artwork->image,
                'sort_order' => 0,
                'is_primary' => true,
            ]);
        });
    }

    public function down(): void
    {
        // Intentionally left empty.
        // The media records should not be deleted automatically on rollback.
    }
};
