<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Artwork;
use App\Models\ArtworkMedia;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class ArtworkMediaController extends Controller
    {
        public function store(
        Request $request,
        Artwork $artwork
    ): JsonResponse {
        Gate::authorize('update', $artwork);

        $request->validate([
            'image' => ['required', 'image', 'max:10240'],
        ]);

        $path = '/storage/' . $request->file('image')->store(
            'artworks',
            'public'
        );

        $maxOrder = $artwork->media()->max('sort_order');

        $isFirstImage = !$artwork->media()->exists();

        $media = $artwork->media()->create([
            'path' => $path,
            'sort_order' => ($maxOrder ?? -1) + 1,
            'is_primary' => $isFirstImage,
        ]);

        if ($isFirstImage) {
            $artwork->update(['image' => $path]);
        }

        return response()->json([
            'media' => $media,
        ], 201);
    }

    public function update(
        Request $request,
        Artwork $artwork,
        ArtworkMedia $media
    ): JsonResponse {
        Gate::authorize('update', $artwork);

        abort_unless(
            $media->artwork_id === $artwork->id,
            404
        );

        $validated = $request->validate([
            'is_primary' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ]);

        if (($validated['is_primary'] ?? false) === true) {
            $artwork->media()
                ->whereKeyNot($media->id)
                ->update([
                    'is_primary' => false,
                ]);

            $artwork->update([
                'image' => $media->path,
            ]);
        }

        $media->update($validated);

        return response()->json([
            'media' => $media->fresh(),
        ]);
    }

    public function destroy(
        Artwork $artwork,
        ArtworkMedia $media
    ): JsonResponse {
        Gate::authorize('update', $artwork);

        abort_unless(
            $media->artwork_id === $artwork->id,
            404
        );

        if ($media->is_primary) {
            return response()->json([
                'message' => 'The primary image cannot be deleted.',
            ], 422);
        }

        if (str_starts_with($media->path, '/storage/')) {
            Storage::disk('public')->delete(
                str_replace('/storage/', '', $media->path)
            );
        }

        $media->delete();

        return response()->json([
            'message' => 'Media deleted successfully.',
        ]);
    }

    public function reorder(
        Request $request,
        Artwork $artwork,
        ArtworkMedia $media
    ): JsonResponse {
        Gate::authorize('update', $artwork);

        abort_unless(
            $media->artwork_id === $artwork->id,
            404
        );

        $validated = $request->validate([
            'direction' => ['required', 'in:up,down'],
        ]);

        $currentOrder = $media->sort_order;

        $neighbor = $artwork->media()
            ->where('sort_order', $validated['direction'] === 'up' ? '<' : '>', $currentOrder)
            ->orderBy(
                'sort_order',
                $validated['direction'] === 'up' ? 'desc' : 'asc'
            )
            ->first();

        if (! $neighbor) {
            return response()->json([
                'message' => 'Image is already at the edge of the list.',
            ]);
        }

        $neighborOrder = $neighbor->sort_order;

        $media->update([
            'sort_order' => $neighborOrder,
        ]);

        $neighbor->update([
            'sort_order' => $currentOrder,
        ]);

        return response()->json([
            'message' => 'Image order updated successfully.',
        ]);
    }
}
