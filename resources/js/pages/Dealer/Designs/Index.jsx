import React from 'react'
import { Link, router } from '@inertiajs/react'
import DealerLayout from '../../../components/Dealer/DealerLayout'
import { FaPalette, FaTrash, FaEye, FaChevronRight } from 'react-icons/fa'

export default function Index({ designs = [] }) {
  
  const handleDeleteDesign = (id) => {
    if (confirm('Are you sure you want to delete this B2B saved design template?')) {
      router.delete(`/dealer/designs/${id}`)
    }
  }

  return (
    <DealerLayout>
      <div className="space-y-8 animate-fadeIn">
        {/* Header */}
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 uppercase">Saved Uniform Designs</h2>
          <p className="text-sm text-slate-500 mt-1">Review, load, and manage customized team templates created in the 3D Customizer studio.</p>
        </div>

        {/* Designs Grid */}
        {designs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-20 text-center max-w-4xl mx-auto">
            <FaPalette className="mx-auto text-slate-300 mb-4" size={42} />
            <h3 className="font-extrabold text-slate-800 text-lg uppercase tracking-wide">No custom templates saved yet.</h3>
            <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">
              Open the 3D Customizer Studio on the storefront, modify sportswear templates, and save them to your account to view them here.
            </p>
            <Link
              href="/builder?from=dealer"
              className="inline-flex items-center gap-2 mt-6 bg-indigo-600 text-white hover:bg-indigo-500 font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer"
            >
              Enter 3D Customizer Studio
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {designs.map((design) => (
              <div
                key={design.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col relative group"
              >
                {/* Image / Thumbnail */}
                <div className="relative h-44 overflow-hidden bg-slate-50 border-b border-slate-100 shrink-0">
                  <img
                    src={design.image}
                    alt={design.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-85 transition-opacity" />

                  {/* Load Design Overlay */}
                  <Link
                    href={`/builder/${design.model_name || 'M1'}?saved_id=${design.id}&from=dealer`}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <span className="bg-white text-slate-800 text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-lg flex items-center gap-1.5 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                      <FaEye className="text-indigo-600" /> Open in Customizer
                    </span>
                  </Link>

                  {/* Delete button (Top Right) */}
                  <button
                    onClick={() => handleDeleteDesign(design.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/40 hover:bg-rose-600 text-white flex items-center justify-center transition-colors shadow-sm z-20 cursor-pointer"
                    title="Delete design"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm truncate">{design.name}</h4>
                    <p className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest mt-1">
                      Model: {design.model_name.toUpperCase()}
                    </p>
                  </div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase mt-4">
                    Saved {design.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DealerLayout>
  )
}
