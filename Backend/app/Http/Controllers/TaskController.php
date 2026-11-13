<?php

namespace App\Http\Controllers;

use App\Models\Status;
use App\Models\TaskItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(): JsonResponse
    {
        $tasks = TaskItem::with('priority', 'status', 'category', 'taskTags.tag')
            ->orderBy('id')
            ->get();

        return response()->json($tasks);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'priority_id' => ['required', 'integer', 'exists:priorities,id'],
            'status_id' => ['required', 'integer', 'exists:statuses,id'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['integer', 'distinct', 'exists:tags,id'],
        ]);

        $data['finished_at'] = $data['status_id'] === Status::COMPLETED_ID ? now() : null;

        $tagIds = $data['tag_ids'] ?? [];
        unset($data['tag_ids']);

        $task = TaskItem::create($data);

        foreach ($tagIds as $tagId) {
            $task->taskTags()->create(['tag_id' => $tagId]);
        }

        return response()->json($task->load('priority', 'status', 'category', 'taskTags.tag'), 201);
    }

    public function update(Request $request, TaskItem $task): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'priority_id' => ['required', 'integer', 'exists:priorities,id'],
            'status_id' => ['required', 'integer', 'exists:statuses,id'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['integer', 'distinct', 'exists:tags,id'],
        ]);

        $data['finished_at'] = $data['status_id'] === Status::COMPLETED_ID
            ? ($task->finished_at ?? now())
            : null;

        $tagIds = $data['tag_ids'] ?? [];
        unset($data['tag_ids']);

        $task->update($data);

        $task->taskTags()->delete();
        foreach ($tagIds as $tagId) {
            $task->taskTags()->create(['tag_id' => $tagId]);
        }

        return response()->json($task->load('priority', 'status', 'category', 'taskTags.tag'));
    }

    public function destroy(TaskItem $task): JsonResponse
    {
        $task->delete();

        return response()->json(null, 204);
    }
}
