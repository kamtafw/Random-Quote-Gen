import { AnimatePresence, motion } from "motion/react"
import useSuggestQuote from "../hooks/useSuggestQuote"
import TagsInput from "../components/TagsInput"

const SuggestQuote = () => {
	const {
		content,
		setContent,
		author,
		setAuthor,
		tags,
		setTags,
		source,
		setSource,
		handleSubmit,
		loading,
		submitted,
		error,
	} = useSuggestQuote()

	return (
		<section
			id="suggest"
			className="bg-gradient-to-l from-[#1b1b1b] to-[#111] flex flex-col items-center justify-center p-6 md:p-12 text-white min-h-full"
		>
			<h2 className="text-2xl md:text-4xl mb-6 text-center font-montserrat font-semibold">
				📝 Suggest a New Quote
			</h2>
			<p className="text-sm md:text-base text-center text-muted-foreground mb-6 max-w-xl mx-auto">
				Have a quote that inspires you? Share it with the world and we might feature it!
			</p>

			<form
				onSubmit={handleSubmit}
				className="w-full max-w-3xl bg-white/5 backdrop-blur-sm rounded-2xl px-4 py-6 md:p-8 border border-white/10 shadow-xl font-palanquin"
			>
				{/* Quote */}
				<div className="mb-4">
					<label className="block mb-1 text-sm">Quote *</label>
					<textarea
						rows={3}
						className="w-full p-3 resize-none rounded-md bg-white/10 focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-white/40"
						placeholder="Write the quote here..."
						value={content}
						onChange={(e) => setContent(e.target.value)}
						required
					/>
				</div>

				{/* Author */}
				<div className="mb-4">
					<label className="block mb-1 text-sm">Author *</label>
					<input
						type="text"
						className="w-full p-3 rounded-md bg-white/10 focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-white/40"
						placeholder="e.g. Maya Angelou"
						value={author}
						onChange={(e) => setAuthor(e.target.value)}
						required
					/>
				</div>

				{/* Tags + Source */}
				<div className="flex gap-4 mb-4 flex-col md:flex-row">
					<div className="md:w-1/2 w-full">
						<label className="block mb-1 text-sm">Tags *</label>
						<TagsInput tags={tags} setTags={setTags} />
						{/* <input
							type="text"
							className="w-full p-3 rounded-md bg-white/10 focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-white/40"
							placeholder="e.g. Inspiration, life, motivation..."
							value={tag}
							onChange={(e) => setTag(e.target.value)}
						/> */}
					</div>
					<div className="md:w-1/2 w-full">
						<label className="block mb-1 text-sm">Source (optional)</label>
						<input
							type="text"
							className="w-full p-3 rounded-md bg-white/10 focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-white/40"
							placeholder="e.g. Book, article, interview..."
							value={source}
							onChange={(e) => setSource(e.target.value)}
						/>
					</div>
				</div>

				{/* Submit */}
				<button
					type="submit"
					disabled={loading || !content || !author || !tags.length}
					className="w-full mt-6 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition duration-300"
				>
					{loading ? "Submitting..." : "Submit Quote"}
				</button>

				{/* Feedback */}
				<AnimatePresence>
					{submitted && (
						<motion.p
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.4 }}
							className="mt-4 text-green-400 text-center font-medium"
						>
							🎉 Thanks for suggesting a quote!
						</motion.p>
					)}
				</AnimatePresence>

				<AnimatePresence>
					{error && (
						<motion.p
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.4 }}
							className="text-red-400 mt-4 text-center font-medium"
						>
							🎉 Thanks for suggesting a quote!
						</motion.p>
					)}
				</AnimatePresence>
			</form>
		</section>
	)
}

export default SuggestQuote
