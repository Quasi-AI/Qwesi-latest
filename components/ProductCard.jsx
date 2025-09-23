'use client'
import { StarIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ProductCard = ({ product }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    // calculate the average rating of the product
    const rating = Math.round(product.rating.reduce((acc, curr) => acc + curr.rating, 0) / product.rating.length);

    return (
        <Link href={`/product/${product.id}`} className='group max-xl:mx-auto'>
            <div className='bg-white border border-gray-200 h-40 sm:w-60 sm:h-68 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md hover:border-[#432DD7] transition-all duration-300'>
                <Image width={500} height={500} className='max-h-30 sm:max-h-40 w-auto group-hover:scale-115 transition duration-300' src={product.images[0]} alt="" />
            </div>
            <div className='flex justify-between gap-3 text-sm text-gray-800 pt-3 max-w-60'>
                <div>
                    <p className='group-hover:text-[#432DD7] transition-colors duration-200'>{product.name}</p>
                    <div className='flex mt-1'>
                        {Array(5).fill('').map((_, index) => (
                            <StarIcon key={index} size={14} className='text-transparent' fill={rating >= index + 1 ? "#432DD7" : "#D1D5DB"} />
                        ))}
                    </div>
                </div>
                <p className='font-medium text-[#432DD7]'>{currency}{product.price}</p>
            </div>
        </Link>
    )
}

export default ProductCard