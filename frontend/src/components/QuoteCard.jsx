const QuoteCard = ({ content, author, tags ,onClick}) => {
	return (
		<div onClick={onClick} className="bg-white/10 p-4 rounded-xl backdrop-blur-md shadow-lg hover:scale-[1.02] transition-all duration-300 border border-white/10">
			<p className="text-sm md:text-base font-montserrat text-white mb-4 line-clamp-1">{content}</p>
			<div className="flex justify-between items-center font-palanquin text-sm text-white/80">
				<span>- {author}</span>
				<button
					className="bg-pink-900 hover:bg-pink-950 transition px-4 py-2 rounded-md"
					onClick={() => alert("Liked!")}
					disabled={true}
				>
					Like
				</button>
			</div>
			<div className="flex flex-wrap gap-2 mt-3">
				{tags.map((tag) => (
					<span key={tag.name} className="text-xs bg-white/10 px-3 py-1 rounded-full text-white">
						#{tag.name}
					</span>
				))}
			</div>
		</div>
	)
}

export default QuoteCard
