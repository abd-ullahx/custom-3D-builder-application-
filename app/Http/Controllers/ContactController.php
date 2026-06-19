<?php

namespace App\Http\Controllers;

use App\Models\ContactQuery;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ContactController extends Controller
{
    /**
     * Show the contact page (if needed, though routes file has direct inertia render)
     */
    public function index()
    {
        return Inertia::render('Contact');
    }

    /**
     * Handle form submission
     */
    public function submit(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ],[
            'name.required' => 'Please enter your name.',
            'email.required' => 'Please enter your email.',
            'subject.required' => 'Please enter your subject.',
            'message.required' => 'Please enter your message.',
            'email.email' => 'Please enter a valid email address.',
            'subject.max' => 'Subject cannot exceed 255 characters.',
            'message.max' => 'Message cannot exceed 5000 characters.',
            'name.max' => 'Name cannot exceed 255 characters.',
        ]);
        // 1. Store in Database
        $query = ContactQuery::create($validated);

        // 1. Store in Database
        


        // 2. Send email to Admin(s)
        try {
            $adminEmails = Admin::pluck('email')->filter()->toArray();
            if (empty($adminEmails)) {
                $adminEmails = ['admin@eaysports.com'];
            }

            $mailSubject = "New Contact Query: " . $query->subject;
            $mailBody = "You have received a new contact message from EAY Sports storefront.\n\n"
                      . "Name: " . $query->name . "\n"
                      . "Email: " . $query->email . "\n"
                      . "Subject: " . $query->subject . "\n\n"
                      . "Message:\n" . $query->message . "\n\n"
                      . "You can view this message and respond from the Admin Portal.";

            Mail::raw($mailBody, function ($message) use ($adminEmails, $mailSubject) {
                $message->to($adminEmails)
                        ->subject($mailSubject);
            });
        } catch (\Exception $e) {
            // Log error or let it slide so it doesn't break form submission if mail configuration is missing
            logger()->error('Failed to send admin contact email: ' . $e->getMessage());
        }

        return redirect()->back()->with('success', 'Thank you! Your message has been sent successfully.');
    }
}
