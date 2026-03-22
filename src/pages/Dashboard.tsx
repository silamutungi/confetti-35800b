import { useState, useEffect, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import type { Event, Rsvp } from '../types'

const EMOJIS = ['🎉', '🎂', '🍕', '🎵', '🏖️', '🎃', '🥂', '💃', '🏀', '🎄']

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [rsvps, setRsvps] = useState<Rsvp[]>([])
  const [rsvpLoading, setRsvpLoading] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventTime, setEventTime] = useState('')
  const [coverEmoji, setCoverEmoji] = useState('🎉')
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  const fetchEvents = async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const { data, error: fetchError } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', session.user.id)
      .is('deleted_at', null)
      .order('event_date', { ascending: true })
    setLoading(false)
    if (fetchError) {
      setError('Could not load your events. Please refresh.')
      return
    }
    setEvents(data || [])
  }

  useEffect(() => { fetchEvents() }, [])

  const fetchRsvps = async (eventId: string) => {
    setRsvpLoading(true)
    const { data } = await supabase
      .from('rsvps')
      .select('*')
      .eq('event_id', eventId)
      .is('deleted_at', null)
      .order('created_at', { ascending: true })
    setRsvpLoading(false)
    setRsvps(data || [])
  }

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event)
    fetchRsvps(event.id)
  }

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!title.trim() || !eventDate) {
      setFormError('Title and date are required.')
      return
    }
    setFormLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { setFormLoading(false); return }
    const { error: insertError } = await supabase.from('events').insert({
      user_id: session.user.id,
      title: title.trim().slice(0, 200),
      description: description.trim().slice(0, 1000),
      location: location.trim().slice(0, 300),
      event_date: eventDate,
      event_time: eventTime || '19:00',
      cover_emoji: coverEmoji
    })
    setFormLoading(false)
    if (insertError) {
      setFormError('Could not create event. Please try again.')
      return
    }
    setTitle('')
    setDescription('')
    setLocation('')
    setEventDate('')
    setEventTime('')
    setCoverEmoji('🎉')
    setShowForm(false)
    fetchEvents()
  }

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event? This cannot be undone.')) return
    await supabase.from('events').update({ deleted_at: new Date().toISOString() }).eq('id', eventId)
    setSelectedEvent(null)
    fetchEvents()
  }

  const goingCount = rsvps.filter(r => r.status === 'going').length
  const maybeCount = rsvps.filter(r => r.status === 'maybe').length
  const cantGoCount = rsvps.filter(r => r.status === 'cant_go').length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" role="status">
          <span className="sr-only">Loading</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-red-600 border border-red-200 bg-red-50 rounded-lg px-4 py-3" role="alert">{error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-800">Your events</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="min-h-[44px] px-6 py-2 bg-primary text-white rounded-lg font-mono hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {showForm ? 'Cancel' : '+ New event'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-ink/10 rounded-xl p-6 mb-8 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-mono mb-1">Event name</label>
            <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} maxLength={200} required className="w-full min-h-[44px] px-4 py-2 border border-ink/20 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Rooftop party" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-mono mb-1">Description</label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} maxLength={1000} rows={3} className="w-full px-4 py-2 border border-ink/20 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary" placeholder="What should guests know?" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-mono mb-1">Location</label>
              <input id="location" type="text" value={location} onChange={e => setLocation(e.target.value)} maxLength={300} className="w-full min-h-[44px] px-4 py-2 border border-ink/20 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary" placeholder="123 Main St" />
            </div>
            <div>
              <label htmlFor="eventDate" className="block text-sm font-mono mb-1">Date</label>
              <input id="eventDate" type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} required className="w-full min-h-[44px] px-4 py-2 border border-ink/20 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="eventTime" className="block text-sm font-mono mb-1">Time</label>
              <input id="eventTime" type="time" value={eventTime} onChange={e => setEventTime(e.target.value)} className="w-full min-h-[44px] px-4 py-2 border border-ink/20 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-mono mb-1">Cover emoji</label>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map(em => (
                  <button key={em} type="button" onClick={() => setCoverEmoji(em)} className={`min-w-[44px] min-h-[44px] text-2xl rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${coverEmoji === em ? 'border-primary bg-primary/10' : 'border-ink/10'}`}>{em}</button>
                ))}
              </div>
            </div>
          </div>
          {formError && <p className="text-red-600 text-sm border border-red-200 bg-red-50 rounded-lg px-4 py-2" role="alert">{formError}</p>}
          <button type="submit" disabled={formLoading} className="min-h-[44px] px-8 py-3 bg-primary text-white rounded-lg font-mono hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50">
            {formLoading ? 'Creating...' : 'Create event'}
          </button>
        </form>
      )}

      {selectedEvent ? (
        <div>
          <button onClick={() => setSelectedEvent(null)} className="min-h-[44px] mb-4 text-primary-dark underline font-mono focus:outline-none focus:ring-2 focus:ring-primary rounded">
            &larr; Back to events
          </button>
          <div className="bg-white border border-ink/10 rounded-xl p-6 mb-6">
            <div className="text-5xl mb-4">{selectedEvent.cover_emoji}</div>
            <h2 className="font-serif text-2xl font-600 mb-2">{selectedEvent.title}</h2>
            {selectedEvent.description && <p className="text-ink/60 mb-4">{selectedEvent.description}</p>}
            <div className="flex flex-wrap gap-4 text-sm text-ink/60 mb-4">
              <span>📅 {new Date(selectedEvent.event_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              <span>🕐 {selectedEvent.event_time}</span>
              {selectedEvent.location && <span>📍 {selectedEvent.location}</span>}
            </div>
            <div className="flex gap-4">
              <button onClick={() => handleDelete(selectedEvent.id)} className="min-h-[44px] px-4 py-2 border-2 border-red-400 text-red-600 rounded-lg font-mono hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400">Delete event</button>
            </div>
          </div>
          <h3 className="font-serif text-xl font-600 mb-4">Guest list</h3>
          <div className="flex gap-4 mb-6 text-sm">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">Going: {goingCount}</span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">Maybe: {maybeCount}</span>
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full">Can't go: {cantGoCount}</span>
          </div>
          {rsvpLoading ? (
            <div className="flex justify-center py-8"><div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" role="status"><span className="sr-only">Loading</span></div></div>
          ) : rsvps.length === 0 ? (
            <div className="bg-white border border-ink/10 rounded-xl p-8 text-center">
              <p className="text-ink/50 mb-2">No RSVPs yet.</p>
              <p className="text-sm text-ink/40">Share your event link to start collecting responses.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {rsvps.map(r => (
                <div key={r.id} className="flex items-center justify-between bg-white border border-ink/10 rounded-lg px-4 py-3">
                  <div>
                    <p className="font-mono font-500">{r.guest_name}</p>
                    <p className="text-sm text-ink/50">{r.guest_email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-mono ${r.status === 'going' ? 'bg-green-100 text-green-800' : r.status === 'maybe' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {r.status === 'going' ? 'Going' : r.status === 'maybe' ? 'Maybe' : "Can't go"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white border border-ink/10 rounded-xl p-12 text-center">
          <div className="text-5xl mb-4">🎈</div>
          <h2 className="font-serif text-2xl font-600 mb-2">No events yet</h2>
          <p className="text-ink/50 mb-6">Create your first event and start inviting guests.</p>
          <button onClick={() => setShowForm(true)} className="min-h-[44px] px-8 py-3 bg-primary text-white rounded-lg font-mono hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary">
            Create your first event
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {events.map(event => (
            <button key={event.id} onClick={() => handleSelectEvent(event)} className="text-left bg-white border border-ink/10 rounded-xl p-6 hover:border-primary/40 transition-colors focus:outline-none focus:ring-2 focus:ring-primary">
              <div className="text-3xl mb-3">{event.cover_emoji}</div>
              <h3 className="font-serif text-lg font-600 mb-1">{event.title}</h3>
              <p className="text-sm text-ink/50">
                {new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {event.event_time}
              </p>
              {event.location && <p className="text-sm text-ink/40 mt-1">📍 {event.location}</p>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}