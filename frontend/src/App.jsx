import { Toaster } from "react-hot-toast"
import Nav from "./components/Nav"
import { DailyQuote, Quotes, Subscribe, SuggestQuote, Footer } from "./sections"

const App = () => {
	return (
		<>
			<Toaster position="top-right" toastOptions={{ duration: 4000 }} />
			<main className="min-h-screen">
				<Nav />
				<section className="mt-28 flex flex-col lg:grid grid-cols-1 lg:grid-cols-2 auto-rows-auto">
					<section className="row-span-2">
						<DailyQuote />
					</section>
					<section className="row-span-2 min-h-[80vh]">
						<Quotes />
					</section>
					<section className="row-span-1 h-full">
						<SuggestQuote />
					</section>
					<section className="row-span-1 h-full">
						<Subscribe />
					</section>
				</section>
				<section>
					<Footer />
				</section>
			</main>
		</>
	)
}

export default App
