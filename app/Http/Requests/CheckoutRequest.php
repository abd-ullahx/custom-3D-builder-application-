<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * CheckoutRequest
 *
 * Centralizes all checkout validation rules in one place,
 * keeping OrderController::store() clean and focused on logic.
 */
class CheckoutRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * Auth check is handled by the 'auth' middleware on the route.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules for the checkout form.
     */
    public function rules(): array
    {
        return [
            'items'            => ['required', 'array', 'min:1'],
            'items.*.name'     => ['required', 'string'],
            'items.*.price'    => ['required', 'numeric', 'min:0'],
            'items.*.qty'      => ['required', 'integer', 'min:1'],
            'billing_name'     => ['required', 'string', 'max:255'],
            'billing_email'    => ['required', 'string', 'email', 'max:255'],
            'shipping_address' => ['required', 'string'],
            'city'             => ['required', 'string', 'max:255'],
            'zip_code'         => ['required', 'string', 'max:255'],
            'phone'            => ['required', 'string'],
            'payment_method'   => ['nullable', 'string'],
            'notes'            => ['nullable', 'string'],
            'subtotal'         => ['required', 'numeric', 'min:0'],
            'shipping'         => ['required', 'numeric', 'min:0'],
            'tax'              => ['required', 'numeric', 'min:0'],
            'total'            => ['required', 'numeric', 'min:0'],
            'coupon_code'      => ['nullable', 'string'],
            'design_data'      => ['nullable', 'array'],
            'model_name'       => ['nullable', 'string'],
            'thumbnail'        => ['nullable', 'string'],
        ];
    }

    /**
     * Custom user-friendly error messages.
     */
    public function messages(): array
    {
        return [
            'items.required'           => 'Your cart is empty. Please add items before checking out.',
            'items.min'                => 'Your cart must have at least one item.',
            'billing_name.required'    => 'Please enter your full name.',
            'billing_email.required'   => 'Please enter your email address.',
            'billing_email.email'      => 'Please enter a valid email address.',
            'shipping_address.required'=> 'Please enter your shipping address.',
            'city.required'            => 'Please enter your city.',
            'zip_code.required'        => 'Please enter your zip/postal code.',
            'phone.required'           => 'Please enter your phone number.',
        ];
    }
}
