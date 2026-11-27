import { describe, it, expect } from 'vitest'
import { norm, filterPhrases, findPhrase, isVideoType } from './lib'
import { phrases } from './data'
const f = (o: Partial<Parameters<typeof filterPhrases>[1]>) => filterPhrases(phrases, { q: '', cat: 'All', fav: [], onlyFav: false, ...o }).map(p => p.id)
describe('lib', () => {
  it('normalises text', () => expect(norm('  My  name is... ')).toBe('my name is'))
  it('searches English and Kiswahili', () => { expect(f({ q: 'water' })).toEqual(['p9']); expect(f({ q: 'asante' })).toEqual(['p10']) })
  it('filters by category and favourites', () => { expect(f({ cat: 'Medical' })).toEqual(['p3', 'p4']); expect(f({ fav: ['p1'], onlyFav: true })).toEqual(['p1']) })
  it('matches only exact library phrases', () => {
    expect(findPhrase(phrases, 'thank you')?.id).toBe('p10'); expect(findPhrase(phrases, 'My name is')?.id).toBe('p7')
    expect(findPhrase(phrases, 'hello there')).toBeUndefined(); expect(findPhrase(phrases, '')).toBeUndefined()
  })
  it('detects video content types', () => { expect(isVideoType('video/mp4')).toBe(true); expect(isVideoType('text/html')).toBe(false); expect(isVideoType(null)).toBe(false) })
})
