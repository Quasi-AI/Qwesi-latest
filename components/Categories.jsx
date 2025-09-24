'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Car, Home, Smartphone, Briefcase, Shirt, Sofa, Dog, Wrench, Search, Baby, 
    Gamepad2, Dumbbell, Book, Music, Camera, Utensils, Star, Plane, Heart, GraduationCap, 
    ShoppingBag, Hammer, Truck, Building, Laptop, Phone, Watch, Armchair, Cat, Settings, 
    ShirtIcon, Toy, Dumbbell as Gym, BookOpen, Guitar, Video, UtensilsCrossed, Hotel, 
    Sparkles, Users, Store, HardHat } from 'lucide-react'

const categories = [{
    id: 'vehicles',
    name: 'Vehicles',
    icon: Car,
    count: '12,430',
    color: 'text-blue-600',
    subcategories: [
        { name: 'Cars for Sale', icon: Car, color: 'text-blue-500' },
        { name: 'Motorcycles', icon: Car, color: 'text-red-500' },
        { name: 'Vehicle Parts', icon: Settings, color: 'text-gray-500' },
        { name: 'Trucks & Buses', icon: Truck, color: 'text-orange-500' }
    ]
},
    {
        id: 'property',
        name: 'Property',
        icon: Home,
        count: '9,821',
        color: 'text-green-600',
        subcategories: [
            { name: 'Houses for Rent', icon: Home, color: 'text-green-500' },
            { name: 'Houses for Sale', icon: Home, color: 'text-emerald-500' },
            { name: 'Commercial Property', icon: Building, color: 'text-blue-500' },
            { name: 'Land & Plots', icon: Home, color: 'text-teal-500' }
        ]
    },
    {
        id: 'electronics',
        name: 'Electronics',
        icon: Smartphone,
        count: '15,632',
        color: 'text-[#5C3AEB]',
        subcategories: [
            { name: 'Mobile Phones', icon: Phone, color: 'text-purple-500' },
            { name: 'Computers', icon: Laptop, color: 'text-blue-500' },
            { name: 'TVs & Audio', icon: Video, color: 'text-red-500' },
            { name: 'Accessories', icon: Settings, color: 'text-gray-500' }
        ]
    },
    {
        id: 'jobs',
        name: 'Jobs',
        icon: Briefcase,
        count: '5,234',
        color: 'text-orange-600',
        subcategories: [
            { name: 'Full-time', icon: Briefcase, color: 'text-orange-500' },
            { name: 'Part-time', icon: Briefcase, color: 'text-yellow-500' },
            { name: 'Remote Work', icon: Laptop, color: 'text-blue-500' },
            { name: 'Freelance', icon: Users, color: 'text-green-500' }
        ]
    },
    {
        id: 'fashion',
        name: 'Fashion',
        icon: Shirt,
        count: '7,891',
        color: 'text-pink-600',
        subcategories: [
            { name: "Men's Fashion", icon: Shirt, color: 'text-blue-500' },
            { name: "Women's Fashion", icon: Shirt, color: 'text-pink-500' },
            { name: 'Jewelry & Watches', icon: Watch, color: 'text-yellow-500' },
            { name: 'Bags & Shoes', icon: ShoppingBag, color: 'text-purple-500' }
        ]
    },
    {
        id: 'furniture',
        name: 'Home & Garden',
        icon: Sofa,
        count: '6,543',
        color: 'text-emerald-600',
        subcategories: [
            { name: 'Furniture', icon: Armchair, color: 'text-brown-500' },
            { name: 'Home Appliances', icon: Settings, color: 'text-gray-500' },
            { name: 'Garden & Outdoor', icon: Home, color: 'text-green-500' },
            { name: 'Decor', icon: Sparkles, color: 'text-pink-500' }
        ]
    },
    {
        id: 'pets',
        name: 'Pets',
        icon: Dog,
        count: '3,421',
        color: 'text-amber-600',
        subcategories: [
            { name: 'Dogs & Cats', icon: Dog, color: 'text-amber-500' },
            { name: 'Other Pets', icon: Cat, color: 'text-gray-500' },
            { name: 'Pet Supplies', icon: ShoppingBag, color: 'text-blue-500' },
            { name: 'Pet Services', icon: Heart, color: 'text-red-500' }
        ]
    },
    {
        id: 'services',
        name: 'Services',
        icon: Wrench,
        count: '4,125',
        color: 'text-gray-600',
        subcategories: [
            { name: 'Home Services', icon: Home, color: 'text-green-500' },
            { name: 'Professional', icon: Briefcase, color: 'text-blue-500' },
            { name: 'Events', icon: Users, color: 'text-purple-500' },
            { name: 'Repairs', icon: Wrench, color: 'text-orange-500' }
        ]
    },
    {
        id: 'baby-kids',
        name: 'Baby & Kids',
        icon: Baby,
        count: '2,890',
        color: 'text-rose-600',
        subcategories: [
            { name: 'Baby Gear', icon: Baby, color: 'text-pink-500' },
            { name: 'Kids Clothing', icon: Shirt, color: 'text-blue-500' },
            { name: 'Toys', icon: Gamepad2, color: 'text-red-500' },
            { name: 'Education', icon: Book, color: 'text-green-500' }
        ]
    },
    {
        id: 'games',
        name: 'Games & Hobbies',
        icon: Gamepad2,
        count: '3,567',
        color: 'text-indigo-600',
        subcategories: [
            { name: 'Video Games', icon: Gamepad2, color: 'text-indigo-500' },
            { name: 'Board Games', icon: Users, color: 'text-green-500' },
            { name: 'Collectibles', icon: Star, color: 'text-yellow-500' },
            { name: 'Art & Crafts', icon: Sparkles, color: 'text-pink-500' }
        ]
    },
    {
        id: 'sports',
        name: 'Sports & Fitness',
        icon: Dumbbell,
        count: '2,234',
        color: 'text-red-600',
        subcategories: [
            { name: 'Gym Equipment', icon: Dumbbell, color: 'text-red-500' },
            { name: 'Sports Gear', icon: Users, color: 'text-blue-500' },
            { name: 'Outdoor Activities', icon: Home, color: 'text-green-500' },
            { name: 'Fitness Classes', icon: Users, color: 'text-purple-500' }
        ]
    },
    {
        id: 'books',
        name: 'Books & Media',
        icon: Book,
        count: '1,890',
        color: 'text-teal-600',
        subcategories: [
            { name: 'Books', icon: BookOpen, color: 'text-teal-500' },
            { name: 'Movies & TV', icon: Video, color: 'text-red-500' },
            { name: 'Music CDs', icon: Music, color: 'text-purple-500' },
            { name: 'Magazines', icon: BookOpen, color: 'text-blue-500' }
        ]
    },
    {
        id: 'music',
        name: 'Music & Instruments',
        icon: Music,
        count: '1,456',
        color: 'text-purple-600',
        subcategories: [
            { name: 'Guitars', icon: Guitar, color: 'text-brown-500' },
            { name: 'Keyboards', icon: Music, color: 'text-purple-500' },
            { name: 'Drums', icon: Music, color: 'text-red-500' },
            { name: 'Audio Equipment', icon: Settings, color: 'text-gray-500' }
        ]
    },
    {
        id: 'photography',
        name: 'Photography',
        icon: Camera,
        count: '987',
        color: 'text-cyan-600',
        subcategories: [
            { name: 'Cameras', icon: Camera, color: 'text-cyan-500' },
            { name: 'Lenses', icon: Camera, color: 'text-blue-500' },
            { name: 'Studio Equipment', icon: Settings, color: 'text-gray-500' },
            { name: 'Photo Services', icon: Users, color: 'text-purple-500' }
        ]
    },
    {
        id: 'food',
        name: 'Food & Catering',
        icon: Utensils,
        count: '2,345',
        color: 'text-yellow-600',
        subcategories: [
            { name: 'Restaurant Equipment', icon: UtensilsCrossed, color: 'text-gray-500' },
            { name: 'Catering Services', icon: Users, color: 'text-blue-500' },
            { name: 'Food Delivery', icon: Truck, color: 'text-green-500' },
            { name: 'Ingredients', icon: ShoppingBag, color: 'text-orange-500' }
        ]
    },
    {
        id: 'travel',
        name: 'Travel & Tourism',
        icon: Plane,
        count: '1,234',
        color: 'text-sky-600',
        subcategories: [
            { name: 'Tour Packages', icon: Users, color: 'text-blue-500' },
            { name: 'Hotels', icon: Hotel, color: 'text-purple-500' },
            { name: 'Car Rentals', icon: Car, color: 'text-green-500' },
            { name: 'Travel Gear', icon: ShoppingBag, color: 'text-orange-500' }
        ]
    },
    {
        id: 'health',
        name: 'Health & Beauty',
        icon: Heart,
        count: '3,789',
        color: 'text-red-500',
        subcategories: [
            { name: 'Skincare', icon: Sparkles, color: 'text-pink-500' },
            { name: 'Makeup', icon: Sparkles, color: 'text-purple-500' },
            { name: 'Health Products', icon: Heart, color: 'text-red-500' },
            { name: 'Beauty Services', icon: Users, color: 'text-blue-500' }
        ]
    },
    {
        id: 'education',
        name: 'Education',
        icon: GraduationCap,
        count: '2,567',
        color: 'text-blue-500',
        subcategories: [
            { name: 'Tutoring', icon: Users, color: 'text-blue-500' },
            { name: 'Courses', icon: Book, color: 'text-green-500' },
            { name: 'Books & Materials', icon: BookOpen, color: 'text-teal-500' },
            { name: 'Educational Software', icon: Laptop, color: 'text-purple-500' }
        ]
    },
    {
        id: 'retail',
        name: 'Retail & Shopping',
        icon: ShoppingBag,
        count: '4,678',
        color: 'text-violet-600',
        subcategories: [
            { name: 'General Store', icon: Store, color: 'text-blue-500' },
            { name: 'Wholesale', icon: ShoppingBag, color: 'text-green-500' },
            { name: 'Online Shopping', icon: Laptop, color: 'text-purple-500' },
            { name: 'Gift Items', icon: Sparkles, color: 'text-pink-500' }
        ]
    },
    {
        id: 'construction',
        name: 'Construction & Tools',
        icon: Hammer,
        count: '1,567',
        color: 'text-orange-500',
        subcategories: [
            { name: 'Building Materials', icon: Building, color: 'text-gray-500' },
            { name: 'Tools', icon: Wrench, color: 'text-orange-500' },
            { name: 'Construction Services', icon: Users, color: 'text-blue-500' },
            { name: 'Heavy Machinery', icon: Settings, color: 'text-red-500' }
        ]
    }
]

export default function Categories() {
    const [searchTerm, setSearchTerm] = useState('')
    const [showAll, setShowAll] = useState(false)

    const filteredCategories = categories.filter(category => 
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const displayedCategories = showAll ? filteredCategories : filteredCategories.slice(0, 8)

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Categories</h1>
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search categories..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C3AEB] focus:border-transparent" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayedCategories.map((category) => (
                    <div key={category.id} className="relative group">
                        <Link href={`/shop?category=${category.id}`} className="block w-full bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-[#5C3AEB] transition-all duration-200 cursor-pointer">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                                    <category.icon className={`w-6 h-6 ${category.color}`} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 group-hover:text-[#5C3AEB] transition-colors duration-200">{category.name}</h3>
                                    <p className="text-sm text-gray-500">{category.count} ads</p>
                                </div>
                            </div>
                        </Link>
                        
                        {/* Hover Subcategories */}
                        <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-10 transition-all duration-300">
                            <ul className="space-y-1">
                                {category.subcategories.map((sub, idx) => (
                                    <li key={idx}>
                                        <Link
                                            href={`/shop?category=${category.id}&sub=${sub.name.toLowerCase().replace(/ /g, '-')}`}
                                            className="flex w-full items-center text-sm text-gray-700 hover:text-[#5C3AEB] p-3 hover:bg-gray-50 rounded-lg transition-all duration-200 group/item"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3 group-hover/item:bg-gray-200">
                                                <sub.icon className={`w-5 h-5 ${sub.color}`} />
                                            </div>
                                            <span className="font-medium">{sub.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            {!searchTerm && filteredCategories.length > 8 && (
                <div className="text-center mt-6">
                    <button onClick={() => setShowAll(!showAll)} 
                        className="px-6 py-2 bg-[#5C3AEB] text-white rounded-lg hover:bg-[#3525b8]">
                        {showAll ? 'Show Less' : `Show More (${filteredCategories.length - 8} more)`}
                    </button>
                </div>
            )}

            {filteredCategories.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No categories found</p>
                    <button onClick={() => setSearchTerm('')}
                        className="px-4 py-2 bg-[#5C3AEB] text-white rounded-lg hover:bg-[#3525b8]">
                        Show All Categories
                    </button>
                </div>
            )}
        </div>
    )
}