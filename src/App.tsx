import { useEffect, useState } from 'react'
import { get, set, wipe, useStored } from './db'
import { phrases, phraseCats, modules, type Phrase } from './data'
import { filterPhrases, findPhrase, isVideoType } from './lib'

const NAV = ['Home','Learn','Phrases','Academy','AI','About','Settings'] as const
type Page = typeof NAV[number]
const LABEL: Record<Page,string> = { Home:'Home', Learn:'Learn Sign Language', Phrases:'Phrase Library', Academy:'Pamoja Sign Academy', AI:'AI Communication', About:'About Us', Settings:'Settings' }

function useOnline() {
  const [on, s] = useState(navigator.onLine)
  useEffect(() => { const a = () => s(true), b = () => s(false); addEventListener('online', a); addEventListener('offline', b); return () => { removeEventListener('online', a); removeEventListener('offline', b) } }, [])
  return on
}

function Placeholder({ text }: { text: string }) {
  return <div className="rounded-lg border-2 border-dashed border-clay/50 bg-white p-4 text-sm" role="note">
    <strong>Placeholder.</strong> {text} Verified KSL video not yet added.</div>
}

function Video({ src }: { src?: string }) {
  const [url, setUrl] = useState<string>()
  const [saved, setSaved] = useState(false)
  const [msg, setMsg] = useState('')
  useEffect(() => {
    if (!src) return
    let u: string | undefined
    get<Blob>('vid:' + src).then(b => { if (b) { u = URL.createObjectURL(b); setUrl(u); setSaved(true) } }).catch(() => {})
    return () => { if (u) URL.revokeObjectURL(u) }
  }, [src])
  if (!src) return <Placeholder text="No demonstration here yet." />
  const dl = async () => {
    setMsg('Downloading...')
    try {
      const r = await fetch(src)
      if (!r.ok || !isVideoType(r.headers.get('content-type'))) throw new Error('not a video')
      const b = await r.blob(); await set('vid:' + src, b); setUrl(URL.createObjectURL(b)); setSaved(true); setMsg('')
    } catch { setMsg('Download failed. Check your connection and that the video file exists, then try again.') }
  }
  return <div><video controls preload="none" className="w-full rounded-lg bg-black" src={url ?? src}
      onError={() => setMsg('This video cannot be played. If you are offline, it must be downloaded first.')} />
    {saved ? <p className="text-sm text-pine">Saved for offline use.</p> : <button className="btn bg-pine text-white mt-2" onClick={dl}>Download for offline</button>}
    {msg && <p role="alert" className="text-sm">{msg}</p>}</div>
}

function Home({ go }: { go: (p: Page) => void }) {
  return <div className="space-y-6">
    <h1 className="text-4xl font-extrabold text-pine leading-tight">PAMOJA SIGN</h1>
    <p className="text-xl">Connecting Communities Through Sign Language, Education and Technology.</p>
    <p>Started in Kakuma Refugee Settlement, Kenya, to help Deaf and hearing people communicate more easily.</p>
    <div className="grid gap-3">{(['Learn','Phrases','AI'] as Page[]).map(p => <button key={p} className="btn bg-pine text-white text-left justify-start" onClick={() => go(p)}>{LABEL[p]}</button>)}</div>
    <Placeholder text="Sign demonstrations are being prepared with Deaf community members." />
  </div>
}

 function Learn() {
  const [done, setDone] = useStored<string[]>('done', [])
  const [open, setOpen] = useState<string | null>(null)
  const m = modules[0]

  return <div className="space-y-4">
    <h1 className="text-2xl font-bold">{m.name}</h1>
    <p className="text-sm">{done.length} of {m.lessons.length} lessons completed</p>

    {m.lessons.map(l => <section key={l.id} className="rounded-lg bg-white p-4 shadow-sm">
      <button
        className="w-full text-left font-semibold min-h-[44px]"
        aria-expanded={open === l.id}
        onClick={() => setOpen(open === l.id ? null : l.id)}
      >
        {done.includes(l.id) ? '✔ ' : ''}{l.title}
      </button>

      {open === l.id && <div className="space-y-3 mt-2">
        <p>{l.explain}</p>

        <ul className="list-disc pl-5">
          {l.objectives.map(o => <li key={o}>{o}</li>)}
        </ul>

        {l.videoType === 'youtube' && l.video ? (
          <>
            <div className="aspect-video overflow-hidden rounded-lg bg-black">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${l.video}?start=${l.videoStart ?? 0}`}
                title={l.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <p className="text-xs text-gray-500">
  {l.video === 'OoxHyN5siBE'
    ? 'Learning resource: KSL Library. External video, not created by Pamoja Sign. Signs still need review by Deaf KSL users in Kakuma.'
    : 'Video by Action for Children with Disabilities (ACD). External educational resource, not created by Pamoja Sign.'}
  {' '}Plays online.
</p>

           
          </>
        ) : (
          <Video src={l.video} />
        )}

        <p><strong>Practice:</strong> {l.practice}</p>

        <button
          className="btn bg-sun"
          onClick={() => setDone(done.includes(l.id) ? done.filter(x => x !== l.id) : [...done, l.id])}
        >
          {done.includes(l.id) ? 'Mark as not complete' : 'Mark as complete'}
        </button>
      </div>}
    </section>)}
  </div>
}

function Phrases() { const [q, setQ] = useState(''); const [cat, setCat] = useState('All')
  const [fav, setFav] = useStored<string[]>('fav', []); const [onlyFav, setOnlyFav] = useState(false)
  const list = filterPhrases(phrases, { q, cat, fav, onlyFav })
  return <div className="space-y-3"><h1 className="text-2xl font-bold">Phrase Library</h1>
    <p className="text-sm">Written translations are not the same as sign language. Always watch the sign.</p>
    <input aria-label="Search phrases" className="w-full rounded-lg border p-3" placeholder="Search phrases" value={q} onChange={e => setQ(e.target.value)} />
    <select aria-label="Category" className="w-full rounded-lg border p-3" value={cat} onChange={e => setCat(e.target.value)}>
      {['All', ...phraseCats].map(c => <option key={c}>{c}</option>)}</select>
    <label className="flex gap-2 items-center"><input type="checkbox" checked={onlyFav} onChange={e => setOnlyFav(e.target.checked)} /> Favourites only</label>
    {list.length === 0 && <p>No phrases match. Try another word or category.</p>}
    {list.map((p: Phrase) => <article key={p.id} className="rounded-lg bg-white p-4 shadow-sm space-y-2">
      <h2 className="font-bold text-lg">{p.en}</h2><p>{p.sw} <span className="text-xs">(draft Kiswahili)</span></p>
      <p className="text-sm">{p.cat}. {p.desc}</p><Video src={p.video} />
      <button className="btn border-2 border-pine" aria-pressed={fav.includes(p.id)} onClick={() => setFav(fav.includes(p.id) ? fav.filter(x => x !== p.id) : [...fav, p.id])}>
        {fav.includes(p.id) ? '★ Favourite' : '☆ Add to favourites'}</button></article>)}</div>
}

function Academy() {
  return <div className="space-y-4"><h1 className="text-2xl font-bold">Pamoja Sign Academy</h1>
    <p>Our community learning programme will run sign-language sessions, train hearing students, and involve Deaf people as trainers and advisers.</p>
    {['Learning programmes','Upcoming activities','Community participation','Volunteer opportunities'].map(s =>
      <section key={s} className="rounded-lg bg-white p-4"><h2 className="font-semibold">{s}</h2><p className="text-sm">No information published yet. The team will add it here.</p></section>)}</div>
}

const SR_ERR: Record<string, string> = { 'not-allowed': 'Microphone permission was denied. Allow it in your browser settings.', 'service-not-allowed': 'Speech recognition is not allowed on this device.', 'no-speech': 'No speech heard. Tap and try again.', network: 'Speech recognition needs an internet connection and cannot work offline.', 'audio-capture': 'No microphone found.' }
function AI() {
  const [text, setText] = useState(''); const [listening, setListening] = useState(false); const [err, setErr] = useState('')
  const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  const listen = () => {
    setErr('')
    try {
      const r = new SR(); r.lang = 'en-US'
      r.onresult = (e: any) => setText(e.results[0][0].transcript)
      r.onerror = (e: any) => { setErr(SR_ERR[e.error] ?? 'Speech recognition failed. Try again or type your message.'); setListening(false) }
      r.onend = () => setListening(false); setListening(true); r.start()
    } catch { setErr('Could not start the microphone. Type your message instead.'); setListening(false) }
  }
  const t = text.trim(); const hit = findPhrase(phrases, text)
  return <div className="space-y-4"><h1 className="text-2xl font-bold">AI Communication</h1>
    <section className="rounded-lg bg-white p-4 space-y-2"><h2 className="font-semibold">Speech to text (working, browser-based)</h2>
      {SR ? <button className="btn bg-pine text-white" onClick={listen} disabled={listening}>{listening ? 'Listening...' : 'Tap and speak'}</button>
        : <p className="text-sm">Your browser does not support speech recognition. Type instead.</p>}
      <p className="text-xs">The microphone is used only after you tap. Nothing is recorded or stored by this app. Some browsers send audio to their own speech service.</p>
      <textarea aria-label="Message" className="w-full rounded-lg border p-3" rows={3} value={text} onChange={e => setText(e.target.value)} placeholder="Spoken or typed words appear here" />
      {err && <p role="alert" className="text-sm">{err}</p>}</section>
    <section className="rounded-lg bg-white p-4 space-y-2"><h2 className="font-semibold">Text to verified sign (exact phrase match only)</h2>
      {!t ? <p className="text-sm">Enter a phrase from the library.</p> : hit ? <><p>Matched: {hit.en}</p><Video src={hit.video} /></> :
        <p className="text-sm">No verified sign available for this message. This is not a translation tool: sign languages have their own grammar.</p>}</section>
    {['Sign recognition from camera','Kiswahili and other languages','Free-text speech to sign'].map(f => <p key={f} className="rounded-lg border-2 border-dashed p-3 text-sm"><strong>Planned, not working:</strong> {f}. Needs verified data and review by Deaf community members.</p>)}</div>
}

function About() {
  return <div className="space-y-3"><h1 className="text-2xl font-bold">About Us</h1>
    <p>Pamoja Sign began with our experience meeting Deaf community members in Kakuma. We saw how communication barriers affect healthcare, education and daily services. We started a school sign-language club that grew to about 24 students.</p>
    <p><strong>Values:</strong> inclusion, accessibility, innovation, community participation, affordability, respect for Deaf culture.</p>
    <ul className="list-disc pl-5"><li>Ali Omari Washikala: Founder, leadership and community engagement</li><li>Abraham Leek Tor: Technology and app development</li><li>Rafael Yasir: Sign-language learning and content</li><li>Fardosa Alamayo: Community mobilisation and student coordination</li></ul></div>
}

function Settings({ big, setBig }: { big: boolean; setBig: (v: boolean) => void }) {
  const [m, setM] = useState('')
  return <div className="space-y-4"><h1 className="text-2xl font-bold">Settings</h1>
    <label className="flex gap-2 items-center"><input type="checkbox" checked={big} onChange={e => setBig(e.target.checked)} /> Larger text</label>
    <p className="text-sm">Stored on this device only: lesson progress, favourites, downloaded videos and settings. No personal details are collected or sent anywhere.</p>
    <button className="btn bg-clay text-white" onClick={async () => { try { await wipe(); location.reload() } catch { setM('Could not clear saved data.') } }}>Clear all saved data</button>
    {m && <p role="status">{m}</p>}</div>
}

const fromHash = (): Page => { const h = location.hash.slice(1) as Page; return NAV.includes(h) ? h : 'Home' }
export default function App() {
  const [page, setPage] = useState<Page>(fromHash); const on = useOnline()
  const [big, setBig] = useStored<boolean>('big', false)
  useEffect(() => { const h = () => { setPage(fromHash()); window.scrollTo(0, 0) }; addEventListener('hashchange', h); return () => removeEventListener('hashchange', h) }, [])
  useEffect(() => { document.title = page === 'Home' ? 'PAMOJA SIGN' : LABEL[page] + ' - PAMOJA SIGN'; document.getElementById('nav-' + page)?.scrollIntoView?.({ inline: 'center', block: 'nearest' }) }, [page])
  const go = (p: Page) => { location.hash = p }
  return <div className="min-h-screen" style={{ fontSize: big ? '1.2rem' : '1rem' }}>
    <header className="bg-pine text-white p-3 flex justify-between items-center sticky top-0 z-10"><strong>PAMOJA SIGN</strong>
      <span role="status" className={'text-xs rounded px-2 py-1 ' + (on ? 'bg-white text-pine' : 'bg-sun text-ink')}>{on ? 'Online' : 'Offline'}</span></header>
    <main className="max-w-xl mx-auto p-4 pb-28">{{ Home: <Home go={go} />, Learn: <Learn />, Phrases: <Phrases />, Academy: <Academy />, AI: <AI />, About: <About />, Settings: <Settings big={big} setBig={setBig} /> }[page]}</main>
    <nav aria-label="Main" className="fixed bottom-0 inset-x-0 bg-white border-t flex overflow-x-auto" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {NAV.map(p => <button key={p} id={'nav-' + p} aria-label={LABEL[p]} aria-current={page === p ? 'page' : undefined} onClick={() => go(p)}
        className={'flex-1 min-w-[84px] min-h-[56px] px-2 text-sm ' + (page === p ? 'font-bold text-pine border-t-4 border-sun' : '')}>{p}</button>)}</nav></div>
}
