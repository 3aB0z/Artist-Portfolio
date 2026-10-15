<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArtworkController;

Route::get('/', [ArtworkController::class, 'home'])->name('home');
Route::get('/gallery', [ArtworkController::class, 'index'])->name('gallery');
Route::get('/artwork/{slug}', [ArtworkController::class, 'show'])->name('artwork.show');
Route::inertia('/about', 'about')->name('about');
Route::inertia('/contact', 'contact')->name('contact');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::middleware('admin')->group(function () {
        Route::get('dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])
            ->name('dashboard');

        Route::get('api/admin/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'data'])
            ->name('api.admin.dashboard');

        Route::get('/api/admin/artworks', [
            \App\Http\Controllers\Admin\ArtworkController::class,
            'data',
        ])->name('api.admin.artworks');

        Route::get('/admin/artworks', [\App\Http\Controllers\Admin\ArtworkController::class, 'index'])
            ->name('admin.artworks.index');

        Route::get('/admin/artworks/create', [\App\Http\Controllers\Admin\ArtworkController::class, 'create'])
            ->name('admin.artworks.create');

        Route::post('/admin/artworks', [\App\Http\Controllers\Admin\ArtworkController::class, 'store'])
            ->name('admin.artworks.store');

        Route::get('/admin/artworks/{artwork:slug}/edit', [\App\Http\Controllers\Admin\ArtworkController::class, 'edit'])
            ->name('admin.artworks.edit');

        Route::put('/admin/artworks/{artwork:slug}', [\App\Http\Controllers\Admin\ArtworkController::class, 'update'])
            ->name('admin.artworks.update');

        Route::delete('/admin/artworks/{artwork:slug}', [\App\Http\Controllers\Admin\ArtworkController::class, 'destroy'])
            ->name('admin.artworks.destroy');

        Route::get('/admin/categories', [\App\Http\Controllers\Admin\CategoryController::class, 'index'])
            ->name('admin.categories.index');

        Route::get('/admin/categories/create', [\App\Http\Controllers\Admin\CategoryController::class, 'create'])
            ->name('admin.categories.create');

        Route::post('/admin/categories', [\App\Http\Controllers\Admin\CategoryController::class, 'store'])
            ->name('admin.categories.store');

        Route::get('/admin/categories/{category:slug}/edit', [\App\Http\Controllers\Admin\CategoryController::class, 'edit'])
            ->name('admin.categories.edit');

        Route::put('/admin/categories/{category:slug}', [\App\Http\Controllers\Admin\CategoryController::class, 'update'])
            ->name('admin.categories.update');

        Route::delete('/admin/categories/{category:slug}', [\App\Http\Controllers\Admin\CategoryController::class, 'destroy'])
            ->name('admin.categories.destroy');

        Route::post(
            '/admin/artworks/{artwork:slug}/media',
            [\App\Http\Controllers\Admin\ArtworkMediaController::class, 'store']
        )->name('admin.artworks.media.store');

        Route::put(
            '/admin/artworks/{artwork:slug}/media/{media}',
            [\App\Http\Controllers\Admin\ArtworkMediaController::class, 'update']
        )->name('admin.artworks.media.update');

        Route::delete(
            '/admin/artworks/{artwork:slug}/media/{media}',
            [\App\Http\Controllers\Admin\ArtworkMediaController::class, 'destroy']
        )->name('admin.artworks.media.destroy');

        Route::put(
            '/admin/artworks/{artwork:slug}/media/{media}/reorder',
            [\App\Http\Controllers\Admin\ArtworkMediaController::class, 'reorder']
        )->name('admin.artworks.media.reorder');
    });
});

require __DIR__.'/settings.php';
