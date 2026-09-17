-- Seed data for Mesxico Cakes and Nuts
-- Product catalog with real images and strict integer kobo pricing

INSERT INTO public.products (name, slug, description, category, price_kobo, lead_time_hours, inventory_count, images, flavor_options, package_size, is_active, featured)
VALUES
  (
    'Artisanal Celebration Heart Cake',
    'artisanal-celebration-heart-cake',
    'Exquisitely layered celebration cake baked to order with premium Madagascan vanilla buttercream, silky sponge, and custom decorative piping. Comes in an elegant keepsake presentation package.',
    'cakes',
    2800000, -- ₦28,000
    48,
    25,
    ARRAY['/products/shapedcake_packaged.png'],
    ARRAY['Madagascar Vanilla', 'Rich Red Velvet', 'Belgian Chocolate', 'Strawberry Swirl'],
    '8-inch (Serves 12-16)',
    TRUE,
    TRUE
  ),
  (
    'Grand Celebration Cupcake Platter (24 pcs)',
    'grand-celebration-cupcake-platter-24',
    'A lavish party display of 24 freshly whipped cupcakes featuring assorted artisan frostings and hand-crafted decorative toppers. Perfect for birthdays, office celebrations, and weddings.',
    'cakes',
    2400000, -- ₦24,000
    48,
    30,
    ARRAY['/products/cupcake_bulk.png', '/products/cupcakes_bulk.jpeg'],
    ARRAY['Assorted Best-Sellers', 'All Chocolate Lovers', 'Vanilla & Berry Mix'],
    'Platter of 24',
    TRUE,
    TRUE
  ),
  (
    'Deluxe Swirled Cupcake Gift Box (12 pcs)',
    'deluxe-swirled-cupcake-box-12',
    'Twelve handcrafted cupcakes with luscious rosettes of buttercream frosting. Packaged in our signature ribbon-tied gift box ready for gifting.',
    'cakes',
    1400000, -- ₦14,000
    48,
    40,
    ARRAY['/products/cupcakes_decorated.jpeg'],
    ARRAY['Classic Mix', 'Red Velvet & Cream Cheese', 'Choco-Caramel'],
    'Box of 12',
    TRUE,
    TRUE
  ),
  (
    'Signature Confetti Celebration Cupcake',
    'signature-confetti-celebration-cupcake',
    'Single luxury celebration cupcake crowned with cloud-like vanilla buttercream, colorful sprinkles, and a celebration candle.',
    'cakes',
    320000, -- ₦3,200
    48,
    100,
    ARRAY['/products/cupcake_singlebirthday.jpeg', '/products/cupcake_candle.jpeg'],
    ARRAY['Birthday Funfetti', 'Red Velvet', 'Double Chocolate'],
    'Single Cupcake',
    TRUE,
    FALSE
  ),
  (
    'Rosy Velvet Birthday Cupcake',
    'rosy-velvet-birthday-cupcake',
    'Tender red velvet cupcake with smooth strawberry cream cheese swirl and celebration birthday candle.',
    'cakes',
    350000, -- ₦3,500
    48,
    80,
    ARRAY['/products/cupcake_pinkcandle.jpeg', '/products/cupcake_plated.jpeg'],
    ARRAY['Strawberry Cream Cheese', 'Vanilla Rose'],
    'Single Cupcake',
    TRUE,
    FALSE
  ),
  (
    'Ocean Swirl Vanilla Cupcake',
    'ocean-swirl-vanilla-cupcake',
    'Moist French vanilla sponge topped with dreamy two-tone blue vanilla frosting.',
    'cakes',
    300000, -- ₦3,000
    48,
    90,
    ARRAY['/products/cupcake_blue.jpeg'],
    ARRAY['French Vanilla', 'Salted Buttercream'],
    'Single Cupcake',
    TRUE,
    FALSE
  ),
  (
    'Citrus Blossom Buttercream Cupcake',
    'citrus-blossom-buttercream-cupcake',
    'Zesty orange infused sponge with whipped orange blossom cream and delicate garnish.',
    'cakes',
    300000, -- ₦3,000
    48,
    90,
    ARRAY['/products/cupcake_orange.jpeg'],
    ARRAY['Citrus Blossom', 'Lemon Curd Infusion'],
    'Single Cupcake',
    TRUE,
    FALSE
  ),
  (
    'Twin Indulgence Cupcake Duo',
    'twin-indulgence-cupcake-duo',
    'A pair of decadent gourmet cupcakes made for sharing. One rich cocoa and one velvety vanilla.',
    'cakes',
    550000, -- ₦5,500
    48,
    60,
    ARRAY['/products/cupcake_double.jpeg'],
    ARRAY['Chocolate & Vanilla Duo', 'Velvet & Salted Caramel'],
    'Duo Pack (2 pcs)',
    TRUE,
    FALSE
  ),
  (
    'Premium Oven-Roasted Jumbo Cashews (1kg Bulk Pouch)',
    'premium-oven-roasted-jumbo-cashews-1kg',
    'Hand-sorted Grade A Nigerian cashews, slowly roasted to golden perfection with a touch of sea salt. Rich, buttery, and packed in an airtight freshness pouch.',
    'nuts',
    1250000, -- ₦12,500
    24,
    50,
    ARRAY['/products/cashew_bulk.png', '/products/owner_cashew.png'],
    ARRAY['Lightly Salted', 'Unsalted Natural'],
    '1kg Airtight Pouch',
    TRUE,
    TRUE
  ),
  (
    'Mesxico Reserve Whole Roasted Cashews (500g Jar)',
    'mesxico-reserve-whole-cashews-500g',
    'Our founder’s pride: choice jumbo cashews roasted in small batches and sealed in a premium reusable presentation jar.',
    'nuts',
    680000, -- ₦6,800
    24,
    75,
    ARRAY['/products/owner_cashew.png'],
    ARRAY['Sea Salted', 'Cinnamon Honey Roasted'],
    '500g Glass Jar',
    TRUE,
    TRUE
  ),
  (
    'Crispy Gourmet Chinut Snack Pack (1kg Pouch)',
    'crispy-gourmet-chinut-pack-1kg',
    'The ultimate West African crunchy snack: golden spiced chin-chin combined with premium roasted groundnuts. Insanely addictive!',
    'nuts',
    500000, -- ₦5,000
    24,
    100,
    ARRAY['/products/chinut_bulk.png', '/products/chinut_double.jpeg'],
    ARRAY['Classic Nutmeg Spice', 'Sweet Vanilla Crunch'],
    '1kg Pouch',
    TRUE,
    TRUE
  ),
  (
    'Crunchy Chinut Party Duo',
    'crunchy-chinut-party-duo',
    'Two handy on-the-go packs of crisp chinut snack mix. Ideal for office desks and lunchboxes.',
    'nuts',
    350000, -- ₦3,500
    24,
    120,
    ARRAY['/products/chinut_double.jpeg'],
    ARRAY['Classic Sweet & Savory'],
    'Twin Packs (2 x 350g)',
    TRUE,
    FALSE
  ),
  (
    'Roasted Golden Peanuts (1kg Pantry Pack)',
    'roasted-golden-peanuts-1kg',
    'Choice Nigerian groundnuts roasted with traditional rock salt until deep and fragrant. Pure nostalgia in every handful.',
    'nuts',
    450000, -- ₦4,500
    24,
    100,
    ARRAY['/products/groundnut_bulk.png', '/products/groundnut_plated.png'],
    ARRAY['Traditional Roasted Salted', 'Dry Roasted Unsalted'],
    '1kg Pouch',
    TRUE,
    FALSE
  ),
  (
    'Artisanal Salted Groundnuts (500g Glass Jar)',
    'artisanal-salted-groundnuts-500g',
    'Crisp, savory handpicked groundnuts packed in a kitchen countertop jar with airtight freshness latch.',
    'nuts',
    280000, -- ₦2,800
    24,
    80,
    ARRAY['/products/groundnut_display.png', '/products/peanut_display.png'],
    ARRAY['Classic Salted'],
    '500g Glass Jar',
    TRUE,
    FALSE
  ),
  (
    'Velvety Artisanal Chocolate Nut Spread (350g Jar)',
    'velvety-artisanal-chocolate-nut-spread-350g',
    'Decadent artisan spread crafted with roasted groundnuts, pure cocoa, and raw cane sugar. Melt-in-the-mouth texture for pancakes, toast, and cakes.',
    'nuts',
    450000, -- ₦4,500
    24,
    60,
    ARRAY['/products/chocolatespread_single.png'],
    ARRAY['Dark Chocolate Hazelnut-Peanut', 'Milk Chocolate Crunch'],
    '350g Glass Jar',
    TRUE,
    TRUE
  )
ON CONFLICT (slug) DO NOTHING;
