import { FaGithub, FaTwitter, FaLinkedin, FaHeart } from "react-icons/fa"

const Footer = () => {
	return (
		<footer id="contact" className="bg-[#0c0c0c] text-white/80 py-12 px-6 border-t border-white/10">
			<div className="max-w-[110rem] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
				{/* Logo & Tagline */}
				<div className="text-center md:text-left">
					<h3 className="text-2xl font-montserrat text-white">RANDOM <span className="font-bold">Quote</span> 💭</h3>
					<p className="text-white/60 text-sm mt-2 max-w-xs">
						A daily dose of thoughts, wisdom, and wit — curated just for you.
					</p>
				</div>

				{/* Nav Links */}
				<div className="flex flex-col md:flex-row items-center gap-4 text-sm text-white/70 font-montessrat">
					<a href="#" className="hover:text-pink-400 transition">
						Home
					</a>
					<a href="#suggest" className="hover:text-pink-400 transition">
						Suggest
					</a>
					<a href="#liked" className="hover:text-pink-400 transition">
						Liked
					</a>
					<a href="#subscribe" className="hover:text-pink-400 transition">
						Subscribe
					</a>
					<a href="#contact" className="hover:text-pink-400 transition">
						Contact
					</a>
					<a
						href="mailto:tivasalvation@gmail.com"
						className="hover:text-pink-400 transition hidden md:inline"
					>
						contact@randomquote.com
					</a>
				</div>

				{/* Socials */}
				<div className="flex gap-5 text-xl justify-center md:justify-end">
					<a
						href="https://github.com/kamtafw"
						target="_blank"
						className="hover:text-pink-400 transition"
					>
						<FaGithub />
					</a>
					<a
						href="https://x.com/kamtafw"
						target="_blank"
						className="hover:text-pink-400 transition"
					>
						<FaTwitter />
					</a>
					<a
						href="https://linkedin.com/in/salvation-tiva"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-pink-400 transition"
					>
						<FaLinkedin />
					</a>
				</div>
			</div>

			{/* Divider */}
			<div className="my-6 border-t border-white/10" />

			{/* Bottom Bar */}
			<div className="text-center text-xs text-white/40">
				© {new Date().getFullYear()} RANDOM <span className="font-semibold">Quote</span>. Built with{" "}
				<span className="text-pink-400">
					<FaHeart className="inline mb-[2px]" />
				</span>{" "}
				by Tiva.
			</div>
		</footer>
	)
}

export default Footer
