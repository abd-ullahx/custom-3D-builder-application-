<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => 'required|email|exists:admins,email',
            'password' => 'required|string',
        ];
    }
    
    public function messages(): array
    {
        return [
            'email.exists' => 'These credentials do not match our records.',
        ];
    }
}
