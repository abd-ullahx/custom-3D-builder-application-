import React from 'react'
import { Link } from '@inertiajs/react'
import DealerLayout from '../../components/Dealer/DealerLayout'
import { FaShoppingBag, FaDollarSign, FaBoxes, FaPalette, FaChevronRight } from 'react-icons/fa'

export default function Dashboard({ stats = {}, recentOrders = [], dealerName = '' }) {
  
  const statusColors = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    processing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    shipped: 'bg-purple-100 text-purple-800 border-purple-200',
    delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
  }

  const statCards = [
    { label: 'Total B2B Orders', val: stats.total_orders, icon: <FaShoppingBag size={20} />, bg: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    { label: 'Pending Production', val: stats.pending_orders, icon: <FaBoxes size={20} />, bg: 'bg-amber-50 text-amber-600 border-amber-100' },
    { label: 'Wholesale Spent', val: `$${stats.total_spent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: <FaDollarSign size={20} />, bg: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { label: 'Team Uniform Saves', val: stats.designs_count, icon: <FaPalette size={20} />, bg: 'bg-purple-50 text-purple-600 border-purple-100' },
  ]

  return (
    <DealerLayout>
      <div className="space-y-8 animate-fadeIn">
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 uppercase">Partner Dashboard</h2>
          <p className="text-sm text-slate-500 mt-1">Hello, {dealerName}! Track wholesale orders, custom designs, and B2B statistics.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
                <h3 className="text-xl md:text-2xl font-extrabold text-slate-800 mt-2 tracking-tight">{card.val}</h3>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${card.bg} shadow-md`}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-800 text-base tracking-wide uppercase">Recent Wholesale Orders</h3>
            <Link 
              href="/dealer/orders" 
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wider flex items-center gap-1"
            >
              View Full Logs <FaChevronRight size={8} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {recentOrders.length === 0 ? (
              <div className="text-center py-16 px-6">
                <FaShoppingBag className="mx-auto text-slate-300 mb-3" size={32} />
                <p className="text-slate-500 text-sm font-semibold">No wholesale orders logged yet.</p>
                <Link 
                  href="/dealer/orders/create" 
                  className="inline-block mt-4 bg-indigo-600 text-white hover:bg-indigo-500 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Place First Wholesale Order
                </Link>
              </div>
            ) : (
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-slate-50/80 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Submission Date</th>
                    <th className="px-6 py-4">Uniform Items</th>
                    <th className="px-6 py-4">Total wholesale</th>
                    <th className="px-6 py-4">Production Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">#{order.id}</td>
                      <td className="px-6 py-4 text-xs text-slate-400 font-bold uppercase">{new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                      <td className="px-6 py-4">{order.items_count} kinds</td>
                      <td className="px-6 py-4 text-slate-800 font-bold">${order.total_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColors[order.status] || 'bg-slate-100 text-slate-800'}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/dealer/orders/${order.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#4F46E5] hover:text-[#4338CA] hover:underline"
                        >
                          View Breakdown <FaChevronRight size={8} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </DealerLayout>
  )
}
