<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\StoreArtworkRequest;
use App\Http\Requests\UpdateArtworkRequest;
use App\Http\Controllers\Controller;
use App\Models\Artwork;
use App\Models\Category;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArtworkController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', Artwork::class);

        return Inertia::render('admin/artworks/index', [
            'categories' => Category::orderBy('name')->get(),
        ]);
    }

    public function data(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', Artwork::class);

        $query = Artwork::with([
            'category',
            'media',
        ]);

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();

            $query->where(function ($query) use ($search) {
                $query
                    ->where('title', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->integer('category_id'));
        }

        $sort = $request->input('sort', 'artwork_date');
        $direction = $request->input('direction', 'desc');

        $allowedSorts = [
            'title',
            'artwork_date',
            'created_at',
        ];

        if (! in_array($sort, $allowedSorts, true)) {
            $sort = 'artwork_date';
        }

        if (! in_array($direction, ['asc', 'desc'], true)) {
            $direction = 'desc';
        }

        $artworks = $query
            ->orderBy($sort, $direction)
            ->paginate(
                min(max($request->integer('per_page', 20), 1), 100)
            )
            ->withQueryString();

        return response()->json($artworks);
    }

    public function create(): Response
    {
        Gate::authorize('create', Artwork::class);

        return Inertia::render('admin/artworks/create', [
            'categories' => Category::orderBy('name')->get(),
        ]);
    }

    public function store(StoreArtworkRequest $request): RedirectResponse
    {
        Gate::authorize('create', Artwork::class);

        Artwork::create($request->validated());

        return redirect()->route('admin.artworks.index');
    }

    public function edit(Artwork $artwork): Response
    {
        Gate::authorize('update', $artwork);

        $artwork->load('media');

        return Inertia::render('admin/artworks/edit', [
            'artwork' => $artwork,
            'categories' => Category::orderBy('name')->get(),
        ]);
    }

    public function update(
        UpdateArtworkRequest $request,
        Artwork $artwork
    ): RedirectResponse {
        Gate::authorize('update', $artwork);

        $artwork->update($request->validated());

        return redirect()->route('admin.artworks.index');
    }

    public function destroy(Artwork $artwork): RedirectResponse
    {
        Gate::authorize('delete', $artwork);

        foreach ($artwork->media as $media) {
            if (str_starts_with($media->path, '/storage/')) {
                Storage::disk('public')->delete(
                    str_replace('/storage/', '', $media->path)
                );
            }
        }

        $artwork->delete();

        return redirect()->route('admin.artworks.index');
    }
}
