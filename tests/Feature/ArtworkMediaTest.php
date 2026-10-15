<?php

namespace Tests\Feature;

use App\Models\Artwork;
use App\Models\ArtworkMedia;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ArtworkMediaTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create([
            'is_admin' => true,
        ]);
    }

    private function artwork(): Artwork
    {
        $category = Category::create([
            'name' => 'Drawing',
            'slug' => 'drawing',
        ]);

        return Artwork::create([
            'slug' => 'test-artwork',
            'title' => 'Test Artwork',
            'category_id' => $category->id,
            'image' => '/storage/artworks/primary.jpg',
            'description' => 'Test description',
            'artwork_date' => '2026-09-01',
        ]);
    }

    public function test_admin_can_add_artwork_media(): void
    {
        Storage::fake('public');

        $artwork = $this->artwork();

        $this->actingAs($this->admin());

        $response = $this->post(
            route('admin.artworks.media.store', $artwork),
            [
                'image' => UploadedFile::fake()->create(
                    'detail.jpg',
                    100,
                    'image/jpeg'
                ),
            ]
        );

        $response
            ->assertCreated()
            ->assertJsonPath('media.is_primary', false);

        $this->assertDatabaseHas('artwork_media', [
            'artwork_id' => $artwork->id,
            'is_primary' => false,
            'sort_order' => 0,
        ]);
    }

    public function test_admin_can_make_media_primary(): void
    {
        $artwork = $this->artwork();

        $primary = $artwork->media()->create([
            'path' => '/storage/artworks/primary.jpg',
            'sort_order' => 0,
            'is_primary' => true,
        ]);

        $secondary = $artwork->media()->create([
            'path' => '/storage/artworks/secondary.jpg',
            'sort_order' => 1,
            'is_primary' => false,
        ]);

        $this->actingAs($this->admin());

        $response = $this->putJson(
            route('admin.artworks.media.update', [
                'artwork' => $artwork,
                'media' => $secondary,
            ]),
            [
                'is_primary' => true,
            ]
        );

        $response->assertOk();

        $this->assertDatabaseHas('artwork_media', [
            'id' => $secondary->id,
            'is_primary' => true,
        ]);

        $this->assertDatabaseHas('artwork_media', [
            'id' => $primary->id,
            'is_primary' => false,
        ]);
    }

    public function test_primary_media_cannot_be_deleted(): void
    {
        $artwork = $this->artwork();

        $media = $artwork->media()->create([
            'path' => '/storage/artworks/primary.jpg',
            'sort_order' => 0,
            'is_primary' => true,
        ]);

        $this->actingAs($this->admin());

        $response = $this->deleteJson(
            route('admin.artworks.media.destroy', [
                'artwork' => $artwork,
                'media' => $media,
            ])
        );

        $response->assertStatus(422);

        $this->assertDatabaseHas('artwork_media', [
            'id' => $media->id,
        ]);
    }

    public function test_admin_can_delete_secondary_media(): void
    {
        Storage::fake('public');

        $artwork = $this->artwork();

        Storage::disk('public')->put(
            'artworks/secondary.jpg',
            'test'
        );

        $media = $artwork->media()->create([
            'path' => '/storage/artworks/secondary.jpg',
            'sort_order' => 1,
            'is_primary' => false,
        ]);

        $this->actingAs($this->admin());

        $response = $this->deleteJson(
            route('admin.artworks.media.destroy', [
                'artwork' => $artwork,
                'media' => $media,
            ])
        );

        $response->assertOk();

        $this->assertDatabaseMissing('artwork_media', [
            'id' => $media->id,
        ]);

        Storage::disk('public')->assertMissing(
            'artworks/secondary.jpg'
        );
    }
}
