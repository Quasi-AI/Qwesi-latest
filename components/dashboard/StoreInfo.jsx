'use client'
import Image from "next/image"
import { MapPin, Mail, Phone } from "lucide-react"

const StoreInfo = ({store}) => {
    return (
        <div className="flex-1 space-y-4 text-sm bg-white rounded-lg p-6 border border-slate-200">
            <div className="flex flex-col sm:flex-row gap-4">
                <Image 
                    width={80} 
                    height={80} 
                    src={store.logo} 
                    alt={store.name} 
                    className="w-20 h-20 object-contain shadow-md rounded-lg border border-slate-100 mx-auto sm:mx-0" 
                />
                
                <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row gap-3 items-center sm:items-start mb-2">
                        <h3 className="text-xl font-bold text-slate-800">{store.name}</h3>
                        <span className="text-sm text-blue-600 font-medium">@{store.username}</span>
                    </div>

                    {/* Status Badge */}
                    <span
                        className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                            store.status === 'pending'
                                ? 'bg-orange-100 text-orange-800 border border-orange-200'
                                : store.status === 'rejected'
                                ? 'bg-red-100 text-red-800 border border-red-200'
                                : 'bg-green-100 text-green-800 border border-green-200'
                        }`}
                    >
                        {store.status}
                    </span>
                </div>
            </div>

            <p className="text-slate-600 leading-relaxed max-w-2xl">{store.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2 text-slate-700">
                    <MapPin size={16} className="text-blue-600 flex-shrink-0" />
                    <span className="truncate">{store.address}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                    <Phone size={16} className="text-blue-600 flex-shrink-0" />
                    <span>{store.contact}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                    <Mail size={16} className="text-blue-600 flex-shrink-0" />
                    <span className="truncate">{store.email}</span>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
                <p className="text-slate-600 mb-3">
                    Applied on <span className="font-medium text-slate-800">{new Date(store.createdAt).toLocaleDateString()}</span> by:
                </p>
                <div className="flex items-center gap-3">
                    <Image 
                        width={36} 
                        height={36} 
                        src={store.user.image} 
                        alt={store.user.name} 
                        className="w-9 h-9 rounded-full border-2 border-blue-100" 
                    />
                    <div>
                        <p className="text-slate-800 font-medium">{store.user.name}</p>
                        <p className="text-slate-500 text-sm">{store.user.email}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StoreInfo