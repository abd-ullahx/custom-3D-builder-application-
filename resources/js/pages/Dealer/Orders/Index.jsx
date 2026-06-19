import React from 'react'
import { Link } from '@inertiajs/react'
import DealerLayout from '../../../components/Dealer/DealerLayout'
import { FaShoppingBag, FaPlusCircle, FaChevronRight } from 'react-icons/fa'

export default function Index({ orders = {} }) {
  const statusColors = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    processing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    shipped: 'bg-purple-100 text-purple-800 border-purple-200',
    delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
  }

  const { data = [], links = [] } = orders

  return (
    <DealerLayout>
      <div className="space-y-8 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 uppercase">Wholesale Orders</h2>
            <p className="text-sm text-slate-500 mt-1">Review the status and breakdown of all B2B bulk orders submitted to EAY Sports.</p>
          </div>
          <Link
            href="/dealer/orders/create"
            className="self-start sm:self-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer"
          >
            <FaPlusCircle />
            <span>Place wholesale Order</span>
          </Link>
        </div>

        {/* Orders Log Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {data.length === 0 ? (
              <div className="text-center py-20 px-6">
                <FaShoppingBag className="mx-auto text-slate-300 mb-3" size={36} />
                <p className="text-slate-500 text-sm font-semibold">No wholesale orders recorded yet.</p>
                <Link
                  href="/dealer/orders/create"
                  className="inline-block mt-4 bg-indigo-600 text-white hover:bg-indigo-500 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                >
                  Create Wholesale Cart
                </Link>
              </div>
            ) : (
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-slate-50/80 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Submission Date</th>
                    <th className="px-6 py-4">Items Count</th>
                    <th className="px-6 py-4">Total wholesale</th>
                    <th className="px-6 py-4">Production Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  {data.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">#{order.id}</td>
                      <td className="px-6 py-4 text-xs text-slate-400 font-bold uppercase">{new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                      <td className="px-6 py-4">{order.items_count} items</td>
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
                          View Details <FaChevronRight size={8} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {links.length > 3 && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-center gap-1.5 bg-slate-50/50">
              {links.map((link, index) => (
                <Link
                  key={index}
                  href={link.url || '#'}
                  disabled={!link.url}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-all ${
                    link.active
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
                      : !link.url
                      ? 'text-slate-300 border-slate-100 bg-transparent cursor-not-allowed'
                      : 'text-slate-500 border-slate-200 hover:bg-white bg-transparent'
                  }`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DealerLayout>
  )
}
