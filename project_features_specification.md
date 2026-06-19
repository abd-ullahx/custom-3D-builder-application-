# Eay Sports - Complete Project Features & Technical Specification

Welcome to the comprehensive technical and functional specification document for **Eay Sports**, an interactive 3D Sportswear Customization and E-commerce Platform. This document outlines the overall architecture, data models, functional layers (Customer storefront & Admin panel), and non-functional specifications developed to date.

---

## 1. Tech Stack & Architecture

Eay Sports is built on a modern, decoupled hybrid architecture optimized for speed, interactivity, and reliability:
- **Backend Framework:** Laravel 11.x (PHP 8.3+) acting as the database driver, asset compiler, session coordinator, and robust MVC / API provider.
- **Frontend Engine:** React 18.x running via Inertia.js to achieve the performance of a Single Page Application (SPA) with secure backend routing.
- **State Management:** Redux Toolkit (JS client-side) ensuring unified tracking of shopping carts, wishlist items, interactive designs, and authentication.
- **Database Engine:** MySQL (with strict data validation constraints).
- **Styling & Assets:** Custom TailwindCSS / Vanilla CSS layouts, Lucide React icons, and Framer Motion micro-animations.
- **Build System:** Vite.

---

## 2. Database Architecture & Data Models

The system consists of **16 Eloquent Models** representing full e-commerce, customizer, and content management capability:

| Eloquent Model | Table Name | Key Attributes | Core Purpose & Relationships |
| :--- | :--- | :--- | :--- |
| **User** | `users` | `id`, `name`, `last_name`, `email`, `password`, `phone`, `profile_image`, `email_notifications`, `sms_alerts`, `newsletter`, `two_factor_auth` | Manages storefront customer accounts, preferences, notifications, and profile details. Has many Orders and Saved Designs. |
| **Admin** | `admins` | `id`, `name`, `email`, `password` | Secures credentials and sessions for control panel staff. |
| **Order** | `orders` | `id`, `user_id`, `price`, `status`, `address`, `city`, `postal_code`, `country`, `items_count` | Represents a complete customer checkout purchase. Belongs to a User, has many OrderItems. |
| **OrderItem** | `order_items` | `id`, `order_id`, `product_id`, `name`, `price`, `qty`, `image`, `size`, `color`, `custom_name`, `custom_number` | Stores specific customization details, prices, and quantities for each item purchased. Belongs to an Order and Product. |
| **Product** | `products` | `id`, `name`, `slug`, `price`, `description`, `featured_image` | Represents an item in the storefront store catalog. Has many ProductImages (gallery) and belongs to many Categories. |
| **ProductImage** | `product_images` | `id`, `product_id`, `image_url` | Additional gallery photos for rich product detail carousels. |
| **Category** | `categories` | `id`, `parent_id`, `name`, `slug`, `status` | Hierarchical system grouping products (supports subcategories). Belongs to many Products. |
| **SavedDesign** | `saved_designs` | `id`, `user_id`, `name`, `model_name`, `image`, `design_data` | Custom configurations from the 3D Builder workspace saved by users. Belongs to a User. |
| **BuilderModel** | `builder_models` | `id`, `name`, `model_name`, `model_url`, `image_url` | Holds 3D model resources (e.g. `.glb` / `.gltf` uniform templates) utilized by the customizer canvas. |
| **Dealer** | `dealers` | `id`, `area_id`, `name`, `address`, `phone`, `email`, `lat`, `lng`, `status` | Retail and wholesale locations. Belongs to a geographic Area. |
| **Area** | `areas` | `id`, `name`, `status` | Geographic distribution regions (e.g., states or countries) grouping local dealers. |
| **HomeBanner** | `banners` | `id`, `image`, `status`, `order` | Slides and marketing graphics displayed on the homepage slider. |
| **HomeCategory** | `home_categories` | `id`, `name`, `count`, `gradient`, `image_file`, `status`, `order` | Promotional cards highlighted on the homepage (with custom gradient styles). |
| **ShowcaseVideo** | `showcase_videos` | `id`, `phase_name`, `video_file`, `status`, `order` | Highlights premium video stories and gameplay showcase banners. |
| **ContactQuery** | `contact_queries` | `id`, `name`, `email`, `phone`, `subject`, `message` | Customer support submissions. |
| **Subscriber** | `subscribers` | `id`, `email` | Tracks email addresses signed up for marketing and newsletters. |

---

## 3. Customer Storefront (User Side) Features

The customer-facing portal is designed for visual appeal, interactive design, and smooth e-commerce operations.

### A. Homepage & Branding
- **Dynamic Carousel Slider:** Animates marketing graphics sorted by custom ordering criteria.
- **Showcase Category Cards:** Promotes key categories using modern glassmorphism styles and curated color gradients.
- **Showcase Video Grid:** Loops promotional gameplay or production phase clips in high-fidelity embeds.
- **Dynamic Search Overlay:** Contextual search enabling instant matches across all catalog products.
- **Integrated Newsletter Form:** Secure newsletter subscription embedded directly inside the footer.

### B. Interactive 3D Sportswear Studio (Customizer)
- **3D Render Canvas:** Loads custom builder models (`.glb`/`.gltf` assets) to represent sportswear items.
- **Live Uniform Customization:**
  - **Color Picker:** Choose uniform primary, secondary, and accent colors.
  - **Custom Names:** Add player names onto jerseys (dynamically mapped onto back/front textures).
  - **Player Numbers:** Set player jersey numbers.
  - **Size Selections:** Assign sizes suited for single orders or whole teams.
- **Configuration Saving:** Instantly saves structural configurations to `saved_designs` linked with the customer profile.
- **Direct Cart Injection:** Bypasses catalogs to add the fully customized 3D design directly into the shopping cart for purchase.

### C. Unified Customer Profile (Sidebar Panel)
Toggling "My Account" opens a premium, sliding panel containing:
- **Interactive Profile Avatar (NEW):**
  - Displays the customer's custom profile picture.
  - **Instant Upload Flow:** Clicking the camera icon opens the file selector. Choosing an image immediately uploads it via `POST /api/auth/profile-image`.
  - **Modern UI feedback:** Shows progress spinner animations on the camera button during uploading and fires success/error toasts.
  - **Disk Management:** Deletes previous user avatars automatically to save space.
- **Profile Info Form:** Edit First Name, Last Name, and Phone Number (with Email protected as read-only).
- **Recent Orders History:**
  - Displays reference IDs, order dates, status markers, and total pricing.
  - **Accordion Details:** Toggling an order reveals detailed item lists with images, product prices, ordered quantities, size selections, color configurations, player names, and numbers.
- **Saved Designs Library:** Displays thumbnails of saved 3D uniform configurations. Customers can load them back into the 3D Customizer in one click or delete them.
- **Wishlist Manager:** Lists bookmarked products. Supports immediate navigation or removal from the list.
- **Preference Settings:** Toggle switches for *Email Notifications*, *SMS Alerts*, *Newsletters*, and *Two-Factor Authentication*.

### D. Catalogue & Product Details
- **Products Catalog:** Multi-column layout with search, category filtering, price sliders, and sorting options.
- **Product details:** Displays specifications, a multi-photo zoom gallery carousel, wishlist toggling, and size/quantity selector.

### E. Shopping Cart & Checkout
- **Cart Slide Drawer:** Keeps track of item quantities, customizations, subtotal, and updates in real-time.
- **Secure Checkout System:** Gathers shipping inputs (Street Address, City, Postal Code, Country) and logs transactions safely into `orders` and `order_items` tables.

---

## 4. Control Panel (Admin Side) Features

Admin panel functionalities are served through backend Blade views, allowing control panel administrators to manage the platform's resources:

- **Admin Authentication:** Secure login, session regeneration, and logout routes.
- **Dashboard Hub:** Central control panel showing high-level stats (total orders, active users, product counts, contact queries).
- **Products Manager (CRUD):**
  - Add, edit, and delete catalogue items.
  - Rich description text area.
  - **Featured Image Upload:** Manage primary display picture.
  - **Gallery Images Upload:** Bulk upload additional images with quick-remove buttons for each image in the gallery.
- **Categories Tree Manager (CRUD):** 
  - Manage parent-child categories, descriptions, and visibility status.
  - Includes a "Check Slug" AJAX helper to check for duplicate slug URLs.
- **Geographic Areas CRUD:** Manage shipping and dealer locator regions.
- **Dealers CRUD:**
  - Add and update retail dealer outlets.
  - Set addresses, coordinates (latitude, longitude) for map rendering, phone numbers, emails, active status, and link them to an Area.
- **3D Model Asset CRUD:** Upload `.glb`/`.gltf` custom uniform files, preview icons, tags, and model names.
- **Slider Banner CRUD:** Upload marketing slides, set display orders, and toggle active flags.
- **Showcase Video CRUD:** Manage homepage clips, sort order, and operational phases.

---

## 5. Non-Functional Specifications

- **Performance & Optimization:**
  - Fast client-side transitions via Inertia's virtual DOM loading.
  - Local Storage synchronization for shopping carts and authentication tokens.
- **Security & Integrity:**
  - Core CSRF protection on all forms and fetch requests (CSRF token headers).
  - Validation layers preventing SQL injections, illegal image formats, or script executions.
  - Session verification restricting admin endpoints to authenticated staff.
- **Robust File Storage:**
  - Image and avatar uploads use public directories (`public/uploads/avatars`, `public/images/`) rather than standard symlink configurations. This ensures zero symlink breaks when migrating, serving, or hosting across varying servers.
  - Automatically cleans up old physical files (unlink) when profile images or banners are updated or deleted.
- **Premium Aesthetics:** Outfit/Inter typography, harmonious gradients, fluid hover states, and responsive views suitable for mobile, tablet, and desktop monitors.

---

*Document generated on May 26, 2026, summarizing all completed features for Eay Sports.*
