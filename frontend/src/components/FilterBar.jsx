import { useState } from "react"

const FilterBar = ({ tags, filter, setFilter, selectedTag, setSelectedTag }) => {
	const [showAllTags, setShowAllTags] = useState(false)
	const [tagSearch, setTagSearch] = useState("")

	const topTags = tags.slice(0, 6)
	const filteredTags = tags.filter((tag) =>
		tag.name.toLowerCase().includes(tagSearch.toLowerCase())
	)

	const handleTagClick = (tagName) => {
		setSelectedTag((prev) => (prev === tagName ? null : tagName))
		setShowAllTags(false) // close modal if open
	}

	return (
		<div className="flex flex-col gap-6 items-center mb-6 w-full">
			<input
				type="text"
				placeholder="Search quotes or authors..."
				value={filter}
				onChange={(e) => setFilter(e.target.value)}
				className="bg-white/10 font-montserrat text-sm md:text-base text-white w-full md:w-4/5 p-2 rounded-md focus:outline-none"
			/>
			{/* <div className="flex gap-2 overflow-x-auto max-w-full scrollbar-thin scrollbar-thumb-white/20"> */}
			<div className="flex gap-2 flex-wrap mt-2 sm:mt-0 justify-center">
				{topTags.map((tag) => (
					<button
						key={tag.name}
						// onClick={() => setSelectedTag((prev) => (prev === tag.name ? null : tag.name))}
						onClick={() => handleTagClick(tag.name)}
						className={`${tag.name === selectedTag ? "bg-white/10" : "bg-transparent"}
								px-3 py-1 whitespace-nowrap rounded-full font-montserrat text-white text-xs hover:bg-white/10 transition`}
					>
						#{tag.name}
					</button>
				))}

				{/* Toggle All Tags Modal */}
				<button
					onClick={() => setShowAllTags((prev) => !prev)}
					className="px-3 py-1 text-xs text-white/70 font-palanquin hover:text-white underline"
				>
					{showAllTags ? "Close All Tags" : "View All Tags"}
				</button>
			</div>

			{/* All Tags Dropdown */}
			{showAllTags && (
				<div className="w-full md:w-3/5 max-h-64 overflow-y-auto bg-white/5 rounded-md p-4 border border-white/10 backdrop-blur-md">
					{/* Tag Search Input */}
					<input
						type="text"
						placeholder="Filter tags..."
						value={tagSearch}
						onChange={(e) => setTagSearch(e.target.value)}
						className="w-full mb-3 p-2 text-sm rounded-md bg-white/10 text-white focus:outline-none"
					/>

					{/* Filtered Tag List */}
					<div className="flex flex-wrap gap-2">
						{filteredTags.length > 0 ? (
							filteredTags.map((tag) => (
								<button
									key={tag.name}
									onClick={() => handleTagClick(tag.name)}
									className={`${
										selectedTag === tag.name ? "bg-white/10" : "bg-transparent"
									} px-3 py-1 whitespace-nowrap rounded-full text-white text-xs hover:bg-white/10 transition`}
								>
									#{tag.name}
								</button>
							))
						) : (
							<div className="text-xs md:text-sm text-white/60">No tags match your search.</div>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

export default FilterBar
