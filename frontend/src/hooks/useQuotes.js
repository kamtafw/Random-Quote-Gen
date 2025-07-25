import { useEffect, useState } from "react"
import api from "../api"

const useQuotes = () => {
	const [quotes, setQuotes] = useState([])
	const [tags, setTags] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const fetchQuotes = async () => {
		setLoading(true)
		setError(null)

		try {
			const quoteResponse = await api.get("/quotes/")
			const tagResponse = await api.get("/quotes/tags/")
			setQuotes(quoteResponse.data)
			setTags(tagResponse.data)
		} catch (error) {
			setError("Could not load data. Please try again later.")
			console.error("Error fetching quotes:", error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchQuotes()
	}, [])

	return { quotes, tags, loading, error }
}

export default useQuotes
