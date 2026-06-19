<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactQuery;
use Illuminate\Http\Request;

class AdminContactController extends Controller
{
    /**
     * Display a listing of the contact queries.
     */
    public function index(Request $request)
    {
        $query = ContactQuery::latest();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }

        $contactQueries = $query->paginate(10)->withQueryString();

        return view('admin.contact-queries.index', compact('contactQueries'));
    }

    /**
     * Display the specified contact query.
     */
    public function show($id)
    {
        $contactQuery = ContactQuery::findOrFail($id);
        return view('admin.contact-queries.show', compact('contactQuery'));
    }

    /**
     * Remove the specified contact query from database.
     */
    public function destroy($id)
    {
        $contactQuery = ContactQuery::findOrFail($id);
        $contactQuery->delete();

        return redirect()->route('admin.contact-queries.index')
            ->with('success', 'Contact query deleted successfully.');
    }
}
