import Categories from '@/components/Categories'
import LatestProducts from '@/components/LatestProducts'
import BestSelling from '@/components/BestSelling'

export default function HomePage() {
    return (
        <div className="min-h-screen">
            <Categories />
            <LatestProducts />
            <BestSelling />
        </div>
    )
}