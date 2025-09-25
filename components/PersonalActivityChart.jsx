'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function PersonalActivityChart({ data }) {
    // Transform the data for the chart
    const chartData = data.map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        conversations: item.count || 0
    }))

    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                        dataKey="date" 
                        stroke="#6b7280"
                        fontSize={12}
                    />
                    <YAxis 
                        stroke="#6b7280"
                        fontSize={12}
                    />
                    <Tooltip 
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="conversations" 
                        stroke="#5C3AEB" 
                        strokeWidth={2}
                        dot={{ fill: '#5C3AEB', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#5C3AEB', strokeWidth: 2 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}