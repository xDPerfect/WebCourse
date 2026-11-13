<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::orderBy('id')->get();

        return response()->json($categories);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories'],
        ]);

        $category = Category::create($data);

        return response()->json($category, 201);
    }

    public function destroy(Category $category): JsonResponse
    {
        if ($category->taskItems()->count() > 0) {
            return response()->json([
                'message' => 'Нельзя удалить категорию, пока к ней привязаны задачи.',
            ], 409);
        }

        $category->delete();

        return response()->json(null, 204);
    }
}
