import { useState } from "react"

const useSubscribeForm = () => {
	const [email, setEmail] = useState("")
	const [frequency, setFrequency] = useState("daily")
	const [whatsapp, setWhatsapp] = useState(false)
	const [loading, setLoading] = useState(false)
	const [subscribed, setSubscribed] = useState(false)

	const reset = () => {
		setEmail("")
		setWhatsapp(false)
		setSubscribed(true)
		setTimeout(() => setSubscribed(false), 3000) // Auto-hide after 3s
	}

  const handleSubmit = (e) => {
		e.preventDefault()
		if (!email.includes("@")) return

		setLoading(true)
		setTimeout(() => {
			setLoading(false)
			reset()
		}, 1200)
	}

  return {
		email,
		setEmail,
		frequency,
		setFrequency,
		whatsapp,
		setWhatsapp,
		loading,
		subscribed,
		handleSubmit,
	}

}

export default useSubscribeForm
