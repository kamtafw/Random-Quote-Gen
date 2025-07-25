const FilterBar = ({ tags, filter, setFilter, selectedTag, setSelectedTag }) => {
	return (
		<div className="flex flex-col gap-6 items-center mb-6">
			<input
				type="text"
				placeholder="Search quotes or authors..."
				value={filter}
				onChange={(e) => setFilter(e.target.value)}
				className="bg-white/10 font-montserrat text-sm md:text-base text-white w-full md:w-4/5 p-2 rounded-md focus:outline-none"
			/>
			<div className="flex gap-2 flex-wrap mt-2 sm:mt-0">
				{tags.map((tag) => (
						<button
							key={tag.name}
							onClick={() => setSelectedTag((prev) => (prev === tag.name ? null : tag.name))}
							className={`${
								tag.name === selectedTag ? "bg-white/10" : "bg-transparent"
							} p-1 md:p-2 rounded-full font-montserrat text-white text-xs hover:bg-white/10 transition`}
						>
							#{tag.name}
						</button>
					))}
			</div>
		</div>
	)
}

export default FilterBar
