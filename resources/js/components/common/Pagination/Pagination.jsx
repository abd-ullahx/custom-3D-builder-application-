import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { memo } from 'react'

export const Pagination = memo(({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }
    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 rounded-lg flex items-center justify-center border border-gray-200 text-slate-500 hover:bg-gray-50 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      {getPageNumbers().map((page, i) => (
        page === '...' ? (
          <div key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400">
            <MoreHorizontal size={16} />
          </div>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
              currentPage === page
                ? 'bg-[#4F46E5] text-white shadow-md shadow-indigo-200'
                : 'border border-gray-200 text-slate-600 hover:bg-gray-50 hover:border-indigo-200 hover:text-indigo-600'
            }`}
          >
            {page}
          </button>
        )
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 rounded-lg flex items-center justify-center border border-gray-200 text-slate-500 hover:bg-gray-50 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
})
