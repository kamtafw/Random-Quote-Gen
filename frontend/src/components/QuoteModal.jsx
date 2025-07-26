import { formatDistanceToNow } from "date-fns"
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa"

const QuoteModal = ({ isOpen, onClose, quote }) => {
	if (!isOpen || !quote) return null

	const handleBackdropClick = (e) => {
		if (e.target === e.currentTarget) {
			onClose()
		}
	}

	const timeAgo = formatDistanceToNow(new Date(quote.created_at), {
		addSuffix: true,
	})

	return (
		<div
			className="absolute inset-0 bg-black/50 flex m-4 px-4 justify-center items-center z-30"
			onClick={handleBackdropClick}
		>
			<div className="relative w-full max-w-2xl bg-white/5 backdrop-blur-lg border border-white/10 text-white p-3 rounded-2xl shadow-2xl animate-fade-in scale-[1] transition-transform duration-300">
				{/* Close Button */}
				{/* <button
					onClick={onClose}
					className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl"
				>
					&times;
				</button> */}

				{/* Quote Content */}
				<div className="text-center mb-4 relative">
					<FaQuoteLeft className="text-pink-500 text-base md:text-lg inline-block mr-2 -mt-2"/>
					<p className="text-base md:text-xl font-montserrat font-semibold inline-block max-w-3xl">
						{quote.content}
					</p>
					<FaQuoteRight className="text-pink-500 text-base md:text-lg inline-block ml-2 -mt-2" />
				</div>

				{/* Author */}
				<p className="text-right text-white/80 text-sm md:text-base font-palanquin mb-4">
					— {quote.author || "Unknown"}
				</p>

				{/* Metadata */}
				<div className="mt-6 bg-white/10 border border-white/10 rounded-xl p-4 flex flex-wrap justify-between items-center text-sm gap-3">
					<div className="flex flex-wrap gap-2 items-center">
						{quote.tags.map((tag) => (
							<span
								key={tag.name}
								className="bg-white/10 px-3 py-1 rounded-full text-white text-xs"
							>
								#{tag.name}
							</span>
						))}
					</div>
					<div className="text-white/50">
						<span>{timeAgo}</span>
						{quote.is_approved ? (
							<span className="ml-3 text-green-400 font-semibold">APPROVED</span>
						) : (
							<span className="ml-3 text-yellow-400 font-semibold">PENDING</span>
						)}
					</div>
				</div>

				{/* Optional Source */}
				{/* {quote.source?.trim() && (
					<p className="mt-4 text-sm text-white/60 italic text-right">Source: {quote.source}</p>
				)} */}
			</div>
		</div>
	)
}

export default QuoteModal
