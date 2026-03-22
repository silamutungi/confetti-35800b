import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink text-paper/60 font-mono">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">&copy; {year} Confetti. All rights reserved.</p>
          <nav className="flex gap-6 text-sm" aria-label="Footer navigation">
            <Link to="/privacy" className="hover:text-paper transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-paper transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded">Terms of Service</Link>
            <a href="mailto:hello@confetti.events" className="hover:text-paper transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded">Contact</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}