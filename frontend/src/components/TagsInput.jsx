// components/TagsInput.jsx
import { useState, useEffect, useRef } from "react"

const TagsInput = ({ tags, setTags }) => {
	const [input, setInput] = useState("")
	const containerRef = useRef(null)

	const handleKeyDown = (e) => {
		if ((e.key === "Enter" || e.key === "," || e.key === " " || e.key === "Tab") && input.trim()) {
			e.preventDefault()
			const newTag = input.trim().toLowerCase()
			if (!tags.includes(newTag)) {
				setTags([...tags, newTag])
			}
			setInput("")
		} else if (e.key === "Backspace" && input === "") {
			setTags(tags.slice(0, -1))
		}
	}

	const removeTag = (i) => {
		setTags(tags.filter((_, index) => index !== i))
	}

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollLeft = containerRef.current.scrollWidth
		}
	}, [tags])

	return (
		<div
			ref={containerRef}
			style={{ scrollbarWidth: "thin" }}
			className="p-2 rounded-md bg-white/10 focus-within:ring-2 focus-within:ring-pink-500 overflow-x-auto whitespace-nowrap"
		>
			<div className="flex items-center gap-2">
				{tags.map((tag, i) => (
					<span
						key={i}
						className="bg-pink-600 text-white px-3 py-1 rounded-full text-sm flex items-center"
					>
						{tag}
						<button
							type="button"
							onClick={() => removeTag(i)}
							className="ml-2 text-white hover:text-gray-200"
						>
							×
						</button>
					</span>
				))}
				<input
					type="text"
					rows={1}
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					className="flex-shrink-0 bg-transparent text-white placeholder-white/40 focus:outline-none min-w-[100px]"
					placeholder="Add tag..."
				/>
			</div>
		</div>
	)
}

export default TagsInput
