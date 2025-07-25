import { AnimatePresence, motion } from "motion/react"
import useSubscribeForm from "../hooks/useSubscribeForm"

const Subscribe = () => {
	const {
		email,
		setEmail,
		frequency,
		setFrequency,
		whatsapp,
		setWhatsapp,
		loading,
		subscribed,
		handleSubmit,
	} = useSubscribeForm()

	return (
		<section
			id="subscribe"
			className="bg-gradient-to-r from-[#1f1f1f] to-[#131313] p-6 md:p-12 text-white text-center min-h-full"
		>
			<h2 className="text-2xl md:text-4xl font-montserrat font-semibold mb-6">📬 Stay Inspired</h2>
			<p className="text-white/70 max-w-2xl mx-auto mb-8 font-palanquin text-sm md:text-base">
				Join the list and get handpicked quotes in your inbox (or WhatsApp). <br />
				Coming soon – we’re building it out. 😉
			</p>

			<form
				onSubmit={handleSubmit}
				className="w-full max-w-3xl bg-white/5 backdrop-blur-sm rounded-2xl px-4 py-6 md:p-8 border border-white/10 shadow-xl font-palanquin"
				// className="w-full max-w-3xl bg-white/5 backdrop-blur-sm rounded-2xl px-4 py-6 md:p-8 border border-white/10 shadow-xl font-palanquin"
			>
				<div className="mb-4 text-left">
					<label htmlFor="email" className="block mb-1 text-sm text-white/70">
						Your Email
					</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="you@example.com"
						required
						className="w-full p-3 rounded-md bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-400"
					/>
				</div>

				<div className="flex justify-between gap-4 mb-4 text-sm">
					{["daily", "weekly"].map((opt) => (
						<label
							key={opt}
							className={`flex-1 py-2 rounded-md cursor-pointer transition text-center ${
								frequency === opt
									? "bg-pink-500 text-white"
									: "bg-white/10 text-white hover:bg-pink-400/50"
							}`}
						>
							<input
								type="radio"
								name="frequency"
								value={opt}
								checked={frequency === opt}
								onChange={() => setFrequency(opt)}
								className="hidden"
							/>
							{opt.charAt(0).toUpperCase() + opt.slice(1)}
						</label>
					))}
				</div>

				<div className="mb-6 flex items-center gap-2 text-sm text-white/80">
					<input
						type="checkbox"
						id="whatsapp"
						checked={whatsapp}
						onChange={(e) => setWhatsapp(e.target.checked)}
						className="accent-pink-500 w-4 h-4"
					/>
					<label htmlFor="whatsapp">Send quotes via WhatsApp</label>
				</div>

				<button
					type="submit"
					disabled={loading || !email}
					className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition"
				>
					{loading ? "Subscribing..." : "Subscribe"}
				</button>

				<AnimatePresence>
					{subscribed && (
						<motion.p
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.4 }}
							className="mt-4 text-green-400 text-center font-medium"
						>
							✅ Subscribed! You’ll hear from us soon.
						</motion.p>
					)}
				</AnimatePresence>
			</form>
		</section>
	)
}

export default Subscribe
