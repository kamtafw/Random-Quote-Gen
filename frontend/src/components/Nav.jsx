import { useState } from "react"
import { navLinks } from "../constants"
import { Menu, X } from "lucide-react"
import QuoteIcon from "./QuoteIcon"

const Nav = () => {
	const [hamburgerOpen, setHamburgerOpen] = useState(false)

	return (
		<header className="fixed top-0 z-50 w-full bg-[#1e1e1e] backdrop-blur-sm h-28">
			<div className="p-6 md:p-8 flex items-center justify-between w-full mx-auto shadow-2xl">
				<div className="flex justify-start text-left text-2xl md:text-3xl text-gray-300 tracking-widest font-montserrat border-t-4 w-fit">
					<a href="/">
						RANDOM<span className="font-bold text-stone-500">Quote</span>
					</a>
					<QuoteIcon />
				</div>

				{/* Desktop Menu */}
				<nav>
					<ul className="hidden md:flex gap-16 text-gray-100 mb-3">
						{navLinks.map((link) => (
							<li key={link.href}>
								<a
									href={link.href}
									className="font-montserrat font-medium leading-normal text-sm lg:text-lg"
								>
									{link.label}
								</a>
							</li>
						))}
					</ul>
					<div className="border-b-[1px] border-gray-600" />
				</nav>

				{/* Hamburger Button */}
				<button
					className="md:hidden text-gray-200 focus:outline-none"
					onClick={() => setHamburgerOpen(!hamburgerOpen)}
				>
					{hamburgerOpen ? <X size={24} /> : <Menu size={24} />}
				</button>
			</div>

			{/* Mobile Menu */}
			{hamburgerOpen && (
				<nav className="md:hidden bg-[#1e1e1e] px-8 pb-4 pt-2">
					<ul className="flex flex-col gap-4 text-gray-100">
						{navLinks.map((link) => (
							<li key={link.href}>
								<a
									href={link.href}
									className="block text-sm font-montserrat font-medium"
									onClick={() => setHamburgerOpen(false)}
								>
									{link.label}
								</a>
							</li>
						))}
					</ul>
				</nav>
			)}
		</header>
	)
}

export default Nav
