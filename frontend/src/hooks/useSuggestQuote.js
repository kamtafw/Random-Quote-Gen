import { useState } from "react"
import api from "../api"

const useSuggestQuote = () => {
	const [content, setContent] = useState("")
	const [author, setAuthor] = useState("")
	const [tags, setTags] = useState([])
	const [source, setSource] = useState("")
	const [loading, setLoading] = useState(false)
	const [submitted, setSubmitted] = useState(false)
	const [error, setError] = useState(null)

	const reset = () => {
		setContent("")
		setAuthor("")
		setTags([])
		setSource("")
		setTimeout(() => setSubmitted(false), 3000)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (!content || !author || !tags.length) {
			setError("All fields marked * are required.")
			return false
		}

		setLoading(true)
		setError(null)

		try {
			const response = await api.post("/quotes/", {
				content,
				author,
				tags: tags.map((t) => ({ name: t })),
				source,
			})
			setSubmitted(response.status === 201)
			if (response.status === 201) {
				reset()
			}
		} catch (err) {
			console.error(err)
			setError("Something went wrong. Please try again.")
			return false
		} finally {
			setLoading(false)
		}
	}

	const submitQuote = async ({ content, author, tags, source }) => {
		if (!content || !author || !tags.length) {
			setError("All fields marked * are required.")
			return false
		}

		setLoading(true)
		setError(null)

		try {
			const response = await api.post("/quotes/", {
				content,
				author,
				tags: tags.map((t) => ({ name: t })),
				source,
			})
			setSubmitted(response.status === 201)
			return response.status === 201
		} catch (err) {
			console.error(err)
			setError("Something went wrong. Please try again.")
			return false
		} finally {
			setLoading(false)
		}
	}

	return {
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
	}
}

export default useSuggestQuote
