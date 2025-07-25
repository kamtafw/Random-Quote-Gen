import { AnimatePresence, motion } from "motion/react"

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
	if (totalPages <= 1) return null

	const getPageNumbers = () => {
		const pages = []

		if (totalPages <= 3) {
			for (let i = 1; i <= totalPages; i++) pages.push(i)
		} else {
			if (currentPage <= 2) {
				pages.push(1, 2, "...", totalPages)
			} else if (currentPage >= totalPages - 1) {
				pages.push(1, "...", totalPages - 1, totalPages)
			} else {
				pages.push(1, "...", currentPage, "...", totalPages)
			}
		}

		return pages
	}

	const isNumber = (val) => typeof val === "number"

	return (
		<div className="flex justify-center items-center gap-2 mt-12 flex-wrap font-palanquin">
			<button
				onClick={() => handlePageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className="px-3 py-1 text-xs md:text-sm bg-white/10 text-white rounded hover:bg-white/20 disabled:opacity-40"
			>
				⬅ Prev
			</button>

			{/* Page Buttons */}
			<AnimatePresence>
				{getPageNumbers().map((page, idx) => {
					const isCurrent = page === currentPage
					return isNumber(page) ? (
						<motion.button
							key={page}
							onClick={() => handlePageChange(page)}
							className={`px-3 py-1 text-xs md:text-sm rounded transition font-palanquin ${
								isCurrent
									? "bg-white text-black font-semibold"
									: "bg-white/10 text-white hover:bg-white/20"
							}`}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.2 }}
						>
							{page}
						</motion.button>
					) : (
						<span key={`dots-${idx}`} className="px-2 text-xs md:text-sm text-white/60 select-none">
							...
						</span>
					)
				})}
			</AnimatePresence>

			<button
				onClick={() => handlePageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="px-3 py-1 text-xs md:text-sm bg-white/10 text-white rounded hover:bg-white/20 disabled:opacity-40"
			>
				Next ➡
			</button>
		</div>
	)
}

export default Pagination
