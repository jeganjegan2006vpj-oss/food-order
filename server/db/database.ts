import { IUser, IProduct, ICategory, ICart, IOrder, IReview } from '../models/types.js';

// In-memory persistent database engine
class MongoMockDatabase {
  public users: IUser[] = [];
  public products: IProduct[] = [];
  public categories: ICategory[] = [];
  public carts: Map<string, ICart> = new Map();
  public orders: IOrder[] = [];
  public reviews: IReview[] = [];

  constructor() {
    this.seedDatabase();
  }

  private seedDatabase() {
    // 1. Seed Users
    this.users = [
      {
        _id: 'user_admin_1',
        name: 'Admin Manager',
        email: 'admin@freshcart.com',
        password: 'adminpassword123', // In a real app bcrypt hashed
        phone: '+1 (555) 019-2834',
        role: 'admin',
        addresses: [
          {
            id: 'addr_adm_1',
            fullName: 'Admin FreshCart HQ',
            phone: '+1 (555) 019-2834',
            street: '742 Evergreen Terrace, Suite 400',
            city: 'San Francisco',
            state: 'California',
            pincode: '94107',
            isDefault: true
          }
        ],
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
      },
      {
        _id: 'user_cust_1',
        name: 'Sarah Jenkins',
        email: 'sarah@example.com',
        password: 'password123',
        phone: '+1 (555) 432-8901',
        role: 'customer',
        addresses: [
          {
            id: 'addr_1',
            fullName: 'Sarah Jenkins',
            phone: '+1 (555) 432-8901',
            street: '452 Pine Valley Rd, Apt 3B',
            city: 'San Jose',
            state: 'California',
            pincode: '95112',
            isDefault: true
          },
          {
            id: 'addr_2',
            fullName: 'Sarah Work',
            phone: '+1 (555) 432-8901',
            street: '100 Silicon Way, Tech Park',
            city: 'Palo Alto',
            state: 'California',
            pincode: '94301',
            isDefault: false
          }
        ],
        createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
      }
    ];

    // 2. Seed 12 Categories
    this.categories = [
      {
        _id: 'cat_1',
        name: 'Vegetables',
        slug: 'vegetables',
        icon: '🥦',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
        description: 'Farm-fresh, crisp, and organically harvested vegetables delivered daily.',
        productCount: 42,
        color: '#10b981'
      },
      {
        _id: 'cat_2',
        name: 'Fruits',
        slug: 'fruits',
        icon: '🍎',
        image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&auto=format&fit=crop&q=80',
        description: 'Sweet, juicy, orchard-picked seasonal and tropical fruits.',
        productCount: 38,
        color: '#f43f5e'
      },
      {
        _id: 'cat_3',
        name: 'Dairy',
        slug: 'dairy',
        icon: '🥛',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
        description: 'Pure whole milk, artisan cheeses, fresh butter, and creamy yogurts.',
        productCount: 26,
        color: '#0284c7'
      },
      {
        _id: 'cat_4',
        name: 'Bakery',
        slug: 'bakery',
        icon: '🍞',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
        description: 'Artisan sourdough, whole wheat loaves, buns, croissants, and baguettes.',
        productCount: 22,
        color: '#d97706'
      },
      {
        _id: 'cat_5',
        name: 'Rice & Grains',
        slug: 'rice-grains',
        icon: '🍚',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
        description: 'Premium aged basmati rice, organic quinoa, oats, lentils, and pulses.',
        productCount: 19,
        color: '#eab308'
      },
      {
        _id: 'cat_6',
        name: 'Beverages',
        slug: 'beverages',
        icon: '🥤',
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
        description: 'Cold-pressed fresh juices, sparkling waters, organic teas, and kombucha.',
        productCount: 31,
        color: '#ec4899'
      },
      {
        _id: 'cat_7',
        name: 'Snacks',
        slug: 'snacks',
        icon: '🍪',
        image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80',
        description: 'Crispy roasted nuts, artisan crackers, baked chips, and dark chocolates.',
        productCount: 35,
        color: '#f97316'
      },
      {
        _id: 'cat_8',
        name: 'Household',
        slug: 'household',
        icon: '🧴',
        image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80',
        description: 'Eco-friendly cleaning sprays, laundry essentials, and paper towels.',
        productCount: 18,
        color: '#6366f1'
      },
      {
        _id: 'cat_9',
        name: 'Personal Care',
        slug: 'personal-care',
        icon: '🧼',
        image: 'https://images.unsplash.com/photo-1608248597359-00e9d6d37651?w=600&auto=format&fit=crop&q=80',
        description: 'Organic soaps, gentle shampoos, herbal toothpastes, and lotions.',
        productCount: 24,
        color: '#14b8a6'
      },
      {
        _id: 'cat_10',
        name: 'Baby Products',
        slug: 'baby-products',
        icon: '🍼',
        image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80',
        description: 'Hypoallergenic baby formula, purees, wipes, and organic skincare.',
        productCount: 16,
        color: '#8b5cf6'
      },
      {
        _id: 'cat_11',
        name: 'Meat & Seafood',
        slug: 'meat-seafood',
        icon: '🍗',
        image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&auto=format&fit=crop&q=80',
        description: 'Free-range chicken breast, wild Atlantic salmon, and lean cuts.',
        productCount: 20,
        color: '#ef4444'
      },
      {
        _id: 'cat_12',
        name: 'Frozen Foods',
        slug: 'frozen-foods',
        icon: '❄️',
        image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
        description: 'Flash-frozen organic berries, ready dumplings, veggies, and artisan gelato.',
        productCount: 17,
        color: '#38bdf8'
      }
    ];

    // 3. Seed Products
    this.products = [
      {
        _id: 'prod_1',
        name: 'Fresh Red Honeycrisp Apples',
        category: 'Fruits',
        categorySlug: 'fruits',
        description: 'Crisp, aromatic, and remarkably sweet Honeycrisp apples grown in Washington state orchards. Packed with fiber and antioxidant vitamin C.',
        price: 3.49,
        originalPrice: 4.99,
        discount: 30,
        stock: 45,
        unit: '1 kg (approx. 5-6 apples)',
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80',
        badge: 'Best Seller',
        rating: 4.9,
        reviewsCount: 184,
        isOrganic: true,
        isFeatured: true,
        isDeal: true,
        ingredients: ['100% Organically Grown Honeycrisp Apples'],
        nutrition: {
          calories: '52 kcal per 100g',
          protein: '0.3 g',
          carbs: '14 g',
          fat: '0.2 g',
          fiber: '2.4 g'
        },
        storageInfo: 'Keep refrigerated between 34°F and 38°F for maximum crunch.',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'prod_2',
        name: 'Organic Cavendish Bananas',
        category: 'Fruits',
        categorySlug: 'fruits',
        description: 'Naturally ripened, certified organic sweet bananas rich in potassium and energy. Perfect for morning smoothies or a healthy on-the-go snack.',
        price: 1.89,
        originalPrice: 2.49,
        discount: 24,
        stock: 80,
        unit: 'Bunch (approx. 1 kg)',
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
        badge: 'Organic',
        rating: 4.8,
        reviewsCount: 230,
        isOrganic: true,
        isFeatured: true,
        isDeal: false,
        ingredients: ['100% Certified Organic Bananas'],
        nutrition: {
          calories: '89 kcal per 100g',
          protein: '1.1 g',
          carbs: '22.8 g',
          fat: '0.3 g',
          fiber: '2.6 g'
        },
        storageInfo: 'Store at room temperature away from direct sunlight.',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'prod_3',
        name: 'Vine-Ripened Cluster Tomatoes',
        category: 'Vegetables',
        categorySlug: 'vegetables',
        description: 'Vibrant, juicy red vine tomatoes boasting intense sweetness and aroma. Hand-picked on the vine to lock in vine-ripened flavor for salads and pasta.',
        price: 2.79,
        originalPrice: 3.99,
        discount: 30,
        stock: 50,
        unit: '500 g pack',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
        badge: 'Farm Fresh',
        rating: 4.7,
        reviewsCount: 96,
        isOrganic: true,
        isFeatured: true,
        isDeal: true,
        ingredients: ['Vine Ripened Red Tomatoes'],
        nutrition: {
          calories: '18 kcal per 100g',
          protein: '0.9 g',
          carbs: '3.9 g',
          fat: '0.2 g',
          fiber: '1.2 g'
        },
        storageInfo: 'Store stem-side down at cool room temperature.',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'prod_4',
        name: 'Premium Himalayan Basmati Rice',
        category: 'Rice & Grains',
        categorySlug: 'rice-grains',
        description: 'Extra-long grain aromatic basmati rice aged for 24 months. Fluffs up effortlessly without sticking, making it ideal for biryanis, pilafs, and daily feasts.',
        price: 12.99,
        originalPrice: 17.99,
        discount: 28,
        stock: 35,
        unit: '5 kg bag',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
        badge: 'Aged 2 Years',
        rating: 4.9,
        reviewsCount: 152,
        isOrganic: false,
        isFeatured: true,
        isDeal: true,
        ingredients: ['100% Pure Royal Himalayan Basmati Rice'],
        nutrition: {
          calories: '130 kcal per 100g cooked',
          protein: '2.7 g',
          carbs: '28 g',
          fat: '0.3 g',
          fiber: '0.4 g'
        },
        storageInfo: 'Store in an airtight container in a dry, cool pantry.',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'prod_5',
        name: 'Farmstead Organic Whole Milk',
        category: 'Dairy',
        categorySlug: 'dairy',
        description: 'Grade A whole milk pasteurized from pasture-raised grass-fed dairy cows. Smooth, rich, and naturally high in vitamin D and bioavailable calcium.',
        price: 4.29,
        originalPrice: 5.49,
        discount: 22,
        stock: 60,
        unit: '1 Gallon (3.78 L)',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
        badge: 'Grass-Fed',
        rating: 4.9,
        reviewsCount: 310,
        isOrganic: true,
        isFeatured: true,
        isDeal: false,
        ingredients: ['Organic Grade A Pasteurized Whole Milk, Vitamin D3'],
        nutrition: {
          calories: '150 kcal per 240ml',
          protein: '8 g',
          carbs: '12 g',
          fat: '8 g',
          fiber: '0 g'
        },
        storageInfo: 'Keep refrigerated at or below 38°F. Consume within 7 days of opening.',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'prod_6',
        name: 'Artisan Whole Wheat Sourdough Bread',
        category: 'Bakery',
        categorySlug: 'bakery',
        description: 'Naturally leavened with a 50-year-old sourdough starter. Baked in stone hearth ovens for a crackling blistered crust and an airy, velvety crumb.',
        price: 4.99,
        originalPrice: 6.50,
        discount: 23,
        stock: 25,
        unit: '750 g artisanal loaf',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
        badge: 'Freshly Baked',
        rating: 4.8,
        reviewsCount: 118,
        isOrganic: true,
        isFeatured: true,
        isDeal: false,
        ingredients: ['Organic Wheat Flour, Water, Wild Sourdough Culture, Sea Salt'],
        nutrition: {
          calories: '160 kcal per slice (60g)',
          protein: '6 g',
          carbs: '31 g',
          fat: '1 g',
          fiber: '3 g'
        },
        storageInfo: 'Store cut side down in paper or linen bag at room temperature.',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'prod_7',
        name: 'Crisp Organic Sweet Carrots',
        category: 'Vegetables',
        categorySlug: 'vegetables',
        description: 'Tender baby carrots washed and trimmed, loaded with beta-carotene. Unbelievably sweet with a satisfying snap in every bite.',
        price: 1.99,
        originalPrice: 2.89,
        discount: 31,
        stock: 55,
        unit: '1 kg bag',
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80',
        badge: 'Crunchy Pick',
        rating: 4.6,
        reviewsCount: 88,
        isOrganic: true,
        isFeatured: true,
        isDeal: true,
        ingredients: ['100% Organically Grown Sweet Carrots'],
        nutrition: {
          calories: '41 kcal per 100g',
          protein: '0.9 g',
          carbs: '9.6 g',
          fat: '0.2 g',
          fiber: '2.8 g'
        },
        storageInfo: 'Store in vegetable crisper drawer in high humidity.',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'prod_8',
        name: 'Fresh Green Broccoli Crowns',
        category: 'Vegetables',
        categorySlug: 'vegetables',
        description: 'Deep green, tightly packed crowns bursting with sulforaphane, vitamin K, and fiber. Ideal for steaming, roasting, or stir-frying.',
        price: 2.49,
        originalPrice: 3.49,
        discount: 29,
        stock: 40,
        unit: '2 heads (approx. 600 g)',
        image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600&auto=format&fit=crop&q=80',
        badge: 'Superfood',
        rating: 4.7,
        reviewsCount: 75,
        isOrganic: true,
        isFeatured: true,
        isDeal: false,
        ingredients: ['Fresh Cut Organic Broccoli Crowns'],
        nutrition: {
          calories: '34 kcal per 100g',
          protein: '2.8 g',
          carbs: '6.6 g',
          fat: '0.4 g',
          fiber: '2.6 g'
        },
        storageInfo: 'Refrigerate in a perforated bag for up to 5 days.',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'prod_9',
        name: 'Cold-Pressed Valencia Orange Juice',
        category: 'Beverages',
        categorySlug: 'beverages',
        description: 'Pure Valencia oranges squeezed within hours of picking. Never from concentrate, with juicy bits of natural pulp and zero added sugars.',
        price: 4.49,
        originalPrice: 6.99,
        discount: 36,
        stock: 32,
        unit: '1 Liter bottle',
        image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80',
        badge: '100% Juice',
        rating: 4.9,
        reviewsCount: 142,
        isOrganic: true,
        isFeatured: true,
        isDeal: true,
        ingredients: ['100% Pure Cold-Pressed Valencia Orange Juice with Pulp'],
        nutrition: {
          calories: '110 kcal per 240ml',
          protein: '2 g',
          carbs: '26 g',
          fat: '0 g',
          fiber: '1 g'
        },
        storageInfo: 'Shake well before pouring. Keep cold at 38°F.',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'prod_10',
        name: 'Yukon Gold Butter Potatoes',
        category: 'Vegetables',
        categorySlug: 'vegetables',
        description: 'Golden, thin-skinned potatoes with a naturally rich, buttery taste and creamy texture. Ideal for velvety mashes, roasting, or steaming.',
        price: 3.29,
        originalPrice: 4.49,
        discount: 27,
        stock: 70,
        unit: '2.5 kg bag',
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
        badge: 'Pantry Staple',
        rating: 4.8,
        reviewsCount: 110,
        isOrganic: false,
        isFeatured: true,
        isDeal: false,
        ingredients: ['Yukon Gold Potatoes'],
        nutrition: {
          calories: '77 kcal per 100g',
          protein: '2 g',
          carbs: '17.5 g',
          fat: '0.1 g',
          fiber: '2.2 g'
        },
        storageInfo: 'Store in a cool, dark, ventilated bin.',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'prod_11',
        name: 'Sweet Spanish Yellow Onions',
        category: 'Vegetables',
        categorySlug: 'vegetables',
        description: 'Firm, golden globes packed with aromatic sweetness. Caramelizes into deep, luscious savory gold for soups, curries, and burgers.',
        price: 2.19,
        originalPrice: 3.19,
        discount: 31,
        stock: 65,
        unit: '1.5 kg mesh bag',
        image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=600&auto=format&fit=crop&q=80',
        badge: 'Essential',
        rating: 4.7,
        reviewsCount: 84,
        isOrganic: false,
        isFeatured: true,
        isDeal: false,
        ingredients: ['Fresh Yellow Onions'],
        nutrition: {
          calories: '40 kcal per 100g',
          protein: '1.1 g',
          carbs: '9.3 g',
          fat: '0.1 g',
          fiber: '1.7 g'
        },
        storageInfo: 'Keep in dry, airy darkness away from potatoes.',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'prod_12',
        name: 'Rainbow Stir-Fry Vegetable Medley',
        category: 'Vegetables',
        categorySlug: 'vegetables',
        description: 'Pre-washed and sliced bell peppers, snow peas, baby corn, florets, and red cabbage. Ready to wok in under 5 minutes.',
        price: 3.99,
        originalPrice: 5.99,
        discount: 33,
        stock: 38,
        unit: '450 g ready tray',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
        badge: 'Quick Prep',
        rating: 4.8,
        reviewsCount: 164,
        isOrganic: true,
        isFeatured: true,
        isDeal: true,
        ingredients: ['Broccoli, Red Bell Pepper, Snap Peas, Carrots, Baby Corn'],
        nutrition: {
          calories: '45 kcal per 150g serving',
          protein: '2 g',
          carbs: '8 g',
          fat: '0.3 g',
          fiber: '3 g'
        },
        storageInfo: 'Use within 3 days of opening or keep tightly sealed in fridge.',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'prod_13',
        name: 'Wild Caught Alaskan Salmon Fillet',
        category: 'Meat & Seafood',
        categorySlug: 'meat-seafood',
        description: 'Sustainably wild-caught sockeye salmon with ruby-red color, delicate flaky texture, and powerful heart-healthy Omega-3 fatty acids.',
        price: 14.99,
        originalPrice: 22.99,
        discount: 35,
        stock: 20,
        unit: '500 g fresh cut',
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80',
        badge: 'UP TO 50% DEAL',
        rating: 4.9,
        reviewsCount: 92,
        isOrganic: false,
        isFeatured: false,
        isDeal: true,
        ingredients: ['Wild Alaskan Sockeye Salmon Fillet'],
        nutrition: {
          calories: '208 kcal per 100g',
          protein: '22 g',
          carbs: '0 g',
          fat: '13 g'
        },
        storageInfo: 'Keep on crushed ice or cook within 2 days of delivery.',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'prod_14',
        name: 'Artisan Dark Chocolate Almond Crunch',
        category: 'Snacks',
        categorySlug: 'snacks',
        description: '72% single-origin cacao studded with slow-roasted California almonds and flakes of French Fleur de Sel.',
        price: 3.79,
        originalPrice: 5.50,
        discount: 31,
        stock: 50,
        unit: '100 g bar',
        image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600&auto=format&fit=crop&q=80',
        badge: 'Gourmet',
        rating: 4.9,
        reviewsCount: 140,
        isOrganic: true,
        isFeatured: false,
        isDeal: true,
        ingredients: ['Organic Cacao Mass, Cane Sugar, Roasted Almonds, Sea Salt'],
        nutrition: {
          calories: '220 kcal per 40g',
          protein: '4 g',
          carbs: '18 g',
          fat: '16 g'
        },
        storageInfo: 'Store in cool ambient pantry between 60°F and 68°F.',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'prod_15',
        name: 'Whole Grain Honey Toasted Oaty Cereal',
        category: 'Snacks',
        categorySlug: 'snacks',
        description: 'Golden crispy whole oat clusters glazed with wildflower clover honey and toasted pumpkin seeds.',
        price: 4.89,
        originalPrice: 6.99,
        discount: 30,
        stock: 45,
        unit: '650 g box',
        image: 'https://images.unsplash.com/photo-1521483451569-e33803c0330c?w=600&auto=format&fit=crop&q=80',
        badge: 'High Fiber',
        rating: 4.8,
        reviewsCount: 112,
        isOrganic: true,
        isFeatured: false,
        isDeal: true,
        ingredients: ['Whole Rolled Oats, Clover Honey, Pumpkin Seeds, Cinnamon, Sea Salt'],
        nutrition: {
          calories: '190 kcal per 50g',
          protein: '5 g',
          carbs: '34 g',
          fat: '4.5 g',
          fiber: '4 g'
        },
        storageInfo: 'Fold bag tightly after opening to preserve crunch.',
        createdAt: new Date().toISOString()
      }
    ];

    // 4. Seed Reviews
    this.reviews = [
      {
        _id: 'rev_1',
        userId: 'user_cust_1',
        userName: 'Sarah Jenkins',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
        productId: 'prod_1',
        rating: 5,
        comment: 'Hands down the crunchiest, sweetest apples I have ever ordered online! Arrived chilled and without a single bruise.',
        createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
      },
      {
        _id: 'rev_2',
        userId: 'user_cust_2',
        userName: 'Marcus Sterling',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        productId: 'prod_1',
        rating: 5,
        comment: 'FreshCart 3D delivery is unmatched. The 3D store is super fun and the quality is true grocery store grade.',
        createdAt: new Date(Date.now() - 8 * 86400000).toISOString()
      },
      {
        _id: 'rev_3',
        userId: 'user_cust_3',
        userName: 'Elena Rostova',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        productId: 'prod_5',
        rating: 5,
        comment: 'Creamy, rich grass-fed milk. My morning coffee has never tasted better!',
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
      }
    ];

    // 5. Seed Orders
    this.orders = [
      {
        _id: 'ord_1001',
        orderNumber: 'FC-89241',
        userId: 'user_cust_1',
        customerName: 'Sarah Jenkins',
        customerEmail: 'sarah@example.com',
        items: [
          {
            productId: 'prod_1',
            name: 'Fresh Red Honeycrisp Apples',
            price: 3.49,
            quantity: 2,
            unit: '1 kg',
            image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80'
          },
          {
            productId: 'prod_5',
            name: 'Farmstead Organic Whole Milk',
            price: 4.29,
            quantity: 1,
            unit: '1 Gallon',
            image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80'
          },
          {
            productId: 'prod_6',
            name: 'Artisan Whole Wheat Sourdough Bread',
            price: 4.99,
            quantity: 1,
            unit: '750 g',
            image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80'
          }
        ],
        deliveryAddress: {
          fullName: 'Sarah Jenkins',
          phone: '+1 (555) 432-8901',
          street: '452 Pine Valley Rd, Apt 3B',
          city: 'San Jose',
          state: 'California',
          pincode: '95112'
        },
        deliveryMethod: 'express',
        deliveryFee: 3.99,
        paymentMethod: 'card',
        paymentStatus: 'completed',
        orderStatus: 'Out for Delivery',
        timeline: [
          { status: 'Order Placed', timestamp: '10:30 AM', note: 'Order received and verified', completed: true },
          { status: 'Order Confirmed', timestamp: '10:35 AM', note: 'Inventory reserved at Fremont Hub', completed: true },
          { status: 'Packing', timestamp: '11:15 AM', note: 'Chilled produce packed in insulated thermal pods', completed: true },
          { status: 'Out for Delivery', timestamp: '11:45 AM', note: 'Driver David is in transit (ETA: 25 mins)', completed: true },
          { status: 'Delivered', timestamp: 'Pending', note: 'Will be left at front door with photo proof', completed: false }
        ],
        subtotal: 16.26,
        discount: 2.50,
        tax: 1.15,
        totalAmount: 18.90,
        estimatedDelivery: 'Today by 12:30 PM',
        createdAt: new Date(Date.now() - 3 * 3600000).toISOString()
      },
      {
        _id: 'ord_1002',
        orderNumber: 'FC-89190',
        userId: 'user_cust_1',
        customerName: 'Sarah Jenkins',
        customerEmail: 'sarah@example.com',
        items: [
          {
            productId: 'prod_4',
            name: 'Premium Himalayan Basmati Rice',
            price: 12.99,
            quantity: 1,
            unit: '5 kg',
            image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80'
          },
          {
            productId: 'prod_9',
            name: 'Cold-Pressed Valencia Orange Juice',
            price: 4.49,
            quantity: 2,
            unit: '1 L',
            image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80'
          }
        ],
        deliveryAddress: {
          fullName: 'Sarah Jenkins',
          phone: '+1 (555) 432-8901',
          street: '452 Pine Valley Rd, Apt 3B',
          city: 'San Jose',
          state: 'California',
          pincode: '95112'
        },
        deliveryMethod: 'same-day',
        deliveryFee: 4.99,
        paymentMethod: 'upi',
        paymentStatus: 'completed',
        orderStatus: 'Delivered',
        timeline: [
          { status: 'Order Placed', timestamp: 'Yesterday 09:00 AM', note: 'Order received', completed: true },
          { status: 'Order Confirmed', timestamp: 'Yesterday 09:10 AM', note: 'Confirmed', completed: true },
          { status: 'Packing', timestamp: 'Yesterday 09:40 AM', note: 'Packed', completed: true },
          { status: 'Out for Delivery', timestamp: 'Yesterday 10:15 AM', note: 'Out for delivery', completed: true },
          { status: 'Delivered', timestamp: 'Yesterday 10:45 AM', note: 'Delivered to recipient', completed: true }
        ],
        subtotal: 21.97,
        discount: 3.00,
        tax: 1.52,
        totalAmount: 25.48,
        estimatedDelivery: 'Delivered Yesterday',
        createdAt: new Date(Date.now() - 26 * 3600000).toISOString()
      }
    ];
  }
}

export const db = new MongoMockDatabase();
