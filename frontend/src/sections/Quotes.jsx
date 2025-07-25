import { useMemo, useState } from "react"

import useQuotes from "../hooks/useQuotes"
import Spinner from "../components/Spinner"
import FilterBar from "../components/FilterBar"
import QuoteCard from "../components/QuoteCard"
import Pagination from "../components/Pagination"
import QuoteModal from "../components/QuoteModal"

const ITEMS_PER_PAGE = 4

/**
 * Renders a section for exploring quotes.
 *
 * This component displays a list of quotes, which can be filtered by text
 * or by tag. It also includes a pagination component at the bottom to
 * navigate between pages of quotes.
 *
 * @returns {JSX.Element} The JSX element for the Quotes section.
 */
const Quotes = () => {
	const { quotes, tags, loading } = useQuotes()
	const [filter, setFilter] = useState("")
	const [selectedTag, setSelectedTag] = useState(null)
	const [selectedQuote, setSelectedQuote] = useState(null)
	const [currentPage, setCurrentPage] = useState(1)

	const filteredQuotes = useMemo(() => {
		const result = quotes.filter((q) => {
			const matchesText =
				q.content.toLowerCase().includes(filter.toLowerCase()) ||
				q.author.toLowerCase().includes(filter.toLowerCase())
			const tagNames = q.tags.map((tag) => tag.name)
			const matchesTag = selectedTag ? tagNames.includes(selectedTag) : true
			return matchesText && matchesTag
		})

		setCurrentPage(1)
		return result
	}, [quotes, filter, selectedTag])

	const totalPages = Math.ceil(filteredQuotes.length / ITEMS_PER_PAGE)
	const paginatedQuotes = filteredQuotes.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	)

	const handlePageChange = (pageNum) => {
		if (pageNum >= 1 && pageNum <= totalPages) {
			setCurrentPage(pageNum)

			const target = document.getElementById("quotes")
			if (target) {
				const headerOffset = 100
				const elementPosition = target.getBoundingClientRect().top + window.scrollY
				const offsetPosition = elementPosition - headerOffset

				window.scrollTo({
					top: offsetPosition,
					behavior: "smooth",
				})
			}
		}
	}

	return (
		<section
			id="quotes"
			className="relative px-4 md:px-8 py-10 bg-gradient-to-br from-[#1e1e1e] to-[#121212] text-white min-h-full"
		>
			<h2 className="text-2xl md:text-4xl font-montserrat font-semibold mb-8 text-center">
				🧭 Explore Quotes
			</h2>

			<FilterBar
				tags={tags}
				filter={filter}
				setFilter={setFilter}
				selectedTag={selectedTag}
				setSelectedTag={setSelectedTag}
			/>

			{loading ? (
				<div className="h-full flex justify-center items-center">
					<Spinner />
				</div>
			) : (
				<>
					{filteredQuotes.length === 0 ? (
						<p className="text-center text-white/70 mt-16 font-montserrat text-2xl min-h-28">
							No quotes found 😔
						</p>
					) : (
						<>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
								{paginatedQuotes.map((quote) => (
									<QuoteCard key={quote.id} {...quote} onClick={() => setSelectedQuote(quote)} />
								))}
							</div>

							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								handlePageChange={handlePageChange}
							/>
						</>
					)}
				</>
			)}

			{selectedQuote && (
				<QuoteModal isOpen={true} onClose={() => setSelectedQuote(null)} quote={selectedQuote} />
			)}
		</section>
	)
}

export default Quotes
