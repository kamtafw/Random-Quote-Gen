import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { FaCopy, FaShareAlt, FaDownload } from "react-icons/fa"

import Spinner from "../components/Spinner"
import useDailyQuote from "../hooks/useDailyQuote"

const copyToClipboard = (quote) => {
	navigator.clipboard.writeText(`“${quote.content}” - ${quote.author}`)
	toast.success("Copied to clipboard!")

}

const shareQuote = (quote) => {
	const shareText = `“${quote.content}” - ${quote.author}`
	if (navigator.share) {
		navigator.share({
			title: "Quote of the Day",
			text: shareText,
			url: window.location.href,
		})
	} else {
		toast.error("Sharing not supported on this device.")
	}
}

const DailyQuote = () => {
	const { quote, imageUrl, loading } = useDailyQuote()

	const [showTypewriter, setShowTypewriter] = useState(true)
	const [typed, setTyped] = useState("")

	const downloadQuoteImage = async () => {
		if (!imageUrl) return

		const download = async () => {
		const response = await fetch(imageUrl)
		const blob = await response.blob()
		const blobUrl = window.URL.createObjectURL(blob)
		const link = document.createElement("a")
		link.href = blobUrl
		link.download = `quote-${new Date().toLocaleDateString()}.png`
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		window.URL.revokeObjectURL(blobUrl)
	}

	toast.promise(
		download(),
		{
			loading: "Downloading...",
			success: "Image downloaded!",
			error: "Failed to download image.",
		}
	)
	}

	useEffect(() => {
		if (!quote?.content) return

		setTyped("")
		setShowTypewriter(true)

		let i = 0
		setTyped(quote.content[0])

		const timeoutRef = { current: null }

		const typeNextChar = () => {
			setTyped((prev) => prev + quote.content[i])
			i++

			if (i < quote.content.length) {
				timeoutRef.current = setTimeout(typeNextChar, 50)
			} else {
				setShowTypewriter(false)
			}
		}

		timeoutRef.current = setTimeout(typeNextChar, 50)

		return () => clearTimeout(timeoutRef.current)
	}, [quote?.content])

	const handleClick = (e, fn) => {
		fn()
		e.currentTarget.blur()
	}

	return (
		<section
			id="home"
			className="relative px-8 md:px-12 py-10 min-h-80 md:min-h-full bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f] text-white flex items-center justify-center"
		>
			{/* <section className="px-4 py-10 sm:px-8 md:px-12 bg-gradient-to-br from-[#1e1e1e] to-[#121212] text-white min-h-full"> */}
			<div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-600/10 to-indigo-600/10 blur-3xl opacity-25 z-0" />

			<div className="relative z-10 max-w-2xl p-4 md:p-8 w-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl text-center">
				{loading ? (
					<div className="h-full flex justify-center items-center">
						<Spinner />
					</div>
				) : (
					<>
						<div className="text-white/50 text-sm mb-2 font-palanquin">
							Daily Quote · {new Date().toLocaleDateString()}
						</div>
						<blockquote className="text-xl lg:text-3xl leading-relaxed font-semibold font-montserrat mb-4">
							“
							{showTypewriter ? (
								<span>
									{typed}
									<span className="animate-pulse ml-1">|</span>
								</span>
							) : (
								quote.content
							)}
							”
						</blockquote>
						<p className="text-sm md:text-base font-medium font-palanquin text-stone-400 mt-4 mb-1">
							— {quote?.author}
						</p>
						{/* {quote?.source && (
							<p className="text-sm text-white/50 italic mb-4 font-palanquin">
								from <span className="underline">{quote.source}</span>
							</p>
						)} */}
						{quote?.tags.length > 0 && (
							<div className="flex flex-wrap justify-center gap-2 mb-6 font-palanquin">
								{quote.tags.map((tag) => (
									<span
										key={tag.name}
										className="px-3 py-1 bg-white/10 text-xs md:text-sm rounded-full text-white/70"
									>
										#{tag.name}
									</span>
								))}
							</div>
						)}

						<div className="flex justify-center gap-4 flex-wrap mt-4">
							<button
								onClick={(e) => handleClick(e, () => copyToClipboard(quote))}
								className="flex items-center gap-2 bg-white/10 text-sm md:text-base hover:bg-white/20 px-4 py-2 rounded-lg transition focus:outline-none"
							>
								<FaCopy /> Copy
							</button>
							<button
								onClick={(e) => handleClick(e, () => shareQuote(quote))}
								className="flex items-center gap-2 bg-white/10 text-sm md:text-base hover:bg-white/20 px-4 py-2 rounded-lg transition focus:outline-none"
							>
								<FaShareAlt /> Share
							</button>
							<button
								onClick={(e) => handleClick(e, () => downloadQuoteImage())}
								className="flex items-center gap-2 bg-white/10 text-sm md:text-base hover:bg-white/20 px-4 py-2 rounded-lg transition focus:outline-none"
							>
								<FaDownload /> Download
							</button>
						</div>
					</>
				)}
			</div>
		</section>
	)
}

export default DailyQuote
