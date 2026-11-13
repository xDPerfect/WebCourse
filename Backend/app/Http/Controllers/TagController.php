<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function index(): JsonResponse
    {
        $tags = Tag::orderBy('id')->get();

        return response()->json($tags);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:tags'],
        ]);

        $tag = Tag::create($data);

        return response()->json($tag, 201);
    }

    public function destroy(Tag $tag): JsonResponse
    {
        if ($tag->taskTags()->count() > 0) {
            return response()->json([
                'message' => 'Нельзя удалить тег, пока к нему привязаны задачи.',
            ], 409);
        }

        $tag->delete();

        return response()->json(null, 204);
    }
}
