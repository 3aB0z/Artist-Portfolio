<?php

namespace App\Http\Controllers;

use App\Models\Artwork;
use Inertia\Inertia;
use Inertia\Response;

class ArtworkController extends Controller
{
    public function home(): Response
    {
        return Inertia::render('welcome', [
            'artworks' => Artwork::with([
                    'category',
                    'media',
                ])
                ->orderBy('artwork_date', 'desc')
                ->get(),
        ]);
    }

    public function index(): Response
    {
        return Inertia::render('gallery', [
            'artworks' => Artwork::with([
                    'category',
                    'media',
                ])
                ->orderBy('artwork_date', 'desc')
                ->get(),
        ]);
    }

    public function show(string $slug): Response
    {
        return Inertia::render('artwork', [
            'artwork' => Artwork::with([
                    'category',
                    'media',
                ])
                ->where('slug', $slug)
                ->firstOrFail(),
        ]);
    }
}
