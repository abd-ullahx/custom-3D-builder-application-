<?php

namespace Database\Factories;

use App\Models\Area;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Area>
 */
class AreaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'zip_code' => $this->faker->postcode,
            'latitude' => $this->faker->latitude(-90, 90),
            'longitude' => $this->faker->longitude(-180, 180),
        ];
    }
}
