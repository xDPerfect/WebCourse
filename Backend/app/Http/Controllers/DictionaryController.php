<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Priority;
use App\Models\Status;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;

class DictionaryController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'priorities' => Priority::orderBy('id')->get(),
            'statuses' => Status::orderBy('id')->get(),
            'categories' => Category::orderBy('name')->get(),
            'tags' => Tag::orderBy('name')->get(),
        ]);
    }
}
