import type { Phrase } from './data'
export const norm = (s: string) => s.toLowerCase().replace(/[.?!,]/g, '').replace(/\s+/g, ' ').trim()
export function filterPhrases(list: Phrase[], o: { q: string; cat: string; fav: string[]; onlyFav: boolean }) {
  const q = norm(o.q)
  return list.filter(p => (o.cat === 'All' || p.cat === o.cat) && (!o.onlyFav || o.fav.includes(p.id)) && norm(p.en + ' ' + p.sw + ' ' + p.desc).includes(q))
}
export function findPhrase(list: Phrase[], text: string) {
  const t = norm(text)
  return t ? list.find(p => norm(p.en) === t) : undefined
}
export const isVideoType = (ct: string | null) => !!ct && ct.toLowerCase().startsWith('video/')
