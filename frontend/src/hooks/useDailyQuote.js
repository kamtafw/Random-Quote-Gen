import { useEffect, useState } from "react"
import api from "../api"

// Fetches and returns the daily quote from the API.
// @returns An object with the daily quote, loading status,
// error message, and a method to refresh the quote.

const useDailyQuote = () => {
	const [quote, setQuote] = useState(null)
	const [imageUrl, setImageUrl] = useState(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const fetchDailyQuote = async () => {
		setLoading(true)
		setError(null)

		try {
			const response = await api.get("/quotes/daily/")
			setQuote(response.data)
		} catch (error) {
			setError("Could not load today's quote. Please try again later.")
			console.error("Error fetching quote:", error)
		} finally {
			setLoading(false)
		}
	}

	const fetchQuoteImage = async () => {
		setLoading(true)
		setError(null)

		try {
			const response = await api.get("/quotes/daily/image-upload/")
			setImageUrl(response.data.image_url)
		} catch (error) {
			setError("Could not load today's quote image. Please try again later.")
			console.error("Error fetching quote image:", error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchDailyQuote()
		fetchQuoteImage()
	}, [])

	return { quote, imageUrl, loading, error, refresh: fetchDailyQuote }
}

export default useDailyQuote
