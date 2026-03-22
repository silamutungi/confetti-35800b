import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <section className="px-4 py-20 md:py-32 text-center max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl md:text-6xl font-800 leading-tight mb-6">
          Event invitations your guests actually want to open
        </h1>
        <p className="text-lg md:text-xl text-ink/60 max-w-2xl mx-auto mb-10">
          Create a beautiful event page in seconds, share a link, and watch RSVPs roll in. No app downloads, no sign-ups for guests.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/signup"
            className="inline-flex items-center justify-center min-h-[44px] px-8 py-3 bg-primary text-white rounded-lg font-mono text-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Create your first event
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center min-h-[44px] px-8 py-3 border-2 border-primary-dark text-primary-dark rounded-lg font-mono text-lg hover:bg-primary-dark/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Sign in
          </Link>
        </div>
      </section>

      <section className="px-4 py-16 md:py-24 bg-ink text-paper">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-600 text-center mb-16">
            Everything you need, nothing you don't
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="font-serif text-xl font-600 mb-2">One-click invites</h3>
              <p className="text-paper/70">
                Share a single link. Guests RSVP without downloading anything or creating an account.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="font-serif text-xl font-600 mb-2">Live guest list</h3>
              <p className="text-paper/70">
                See who's going, who's maybe, and who can't make it — updated in real time.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="font-serif text-xl font-600 mb-2">Beautiful by default</h3>
              <p className="text-paper/70">
                Every event page looks polished. Pick an emoji, add details, and you're done.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-600 mb-6">
            Stop chasing RSVPs in group chats
          </h2>
          <p className="text-lg text-ink/60 mb-10">
            Group texts get buried. Facebook events get ignored. Confetti gives every event its own page with a clear yes, maybe, or no — so you always know who's coming.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center min-h-[44px] px-8 py-3 bg-primary text-white rounded-lg font-mono text-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Get started free
          </Link>
        </div>
      </section>
    </div>
  )
}