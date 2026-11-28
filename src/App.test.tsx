import { it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import App from './App'
import { get } from './db'
const nav = () => within(screen.getByRole('navigation', { name: 'Main' }))
const go = (name: string) => fireEvent.click(nav().getByRole('button', { name }))
it('opens all seven sections', async () => {
  render(<App />)
  const s: [string, RegExp][] = [['Learn Sign Language', /Kenyan Sign Language/], ['Phrase Library', /Phrase Library/], ['Pamoja Sign Academy', /Pamoja Sign Academy/], ['AI Communication', /AI Communication/], ['About Us', /About Us/], ['Settings', /Settings/], ['Home', /PAMOJA SIGN/]]
  for (const [n, h] of s) { go(n); expect(await screen.findByRole('heading', { level: 1, name: h })).toBeTruthy() }
})
it('searches and filters phrases', async () => {
  render(<App />); go('Phrase Library')
  const box = await screen.findByLabelText('Search phrases')
  fireEvent.change(box, { target: { value: 'water' } })
  expect(screen.getByText('I need water.')).toBeTruthy(); expect(screen.queryByText('Thank you.')).toBeNull()
  fireEvent.change(box, { target: { value: 'zzz' } }); expect(screen.getByText(/No phrases match/)).toBeTruthy()
  fireEvent.change(box, { target: { value: '' } }); fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'Medical' } })
  expect(screen.getByText('Do you have any allergies?')).toBeTruthy(); expect(screen.queryByText('Thank you.')).toBeNull()
})
it('saves favourites and restores them after reload', async () => {
  const a = render(<App />); go('Phrase Library')
  fireEvent.click((await screen.findAllByRole('button', { name: /Add to favourites/ }))[0])
  await waitFor(async () => expect(await get('fav')).toEqual(['p1']))
  a.unmount(); render(<App />); go('Phrase Library')
  expect(await screen.findByRole('button', { name: '★ Favourite' })).toBeTruthy()
})
it('tracks lesson completion', async () => {
  render(<App />); go('Learn Sign Language')
  fireEvent.click(await screen.findByRole('button', { name: 'KSL Alphabet (A-Z)' }))
  expect(screen.getByTitle('KSL Alphabet (A-Z)')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Mark as complete' }))
  await waitFor(async () => expect(await get('done')).toEqual(['ksl-0']))
  expect(screen.getByText('1 of 12 lessons completed')).toBeTruthy()
})
it('shows offline status and reacts to connection changes', async () => {
  Object.defineProperty(navigator, 'onLine', { value: false, configurable: true })
  render(<App />); expect(screen.getByText('Offline')).toBeTruthy()
  Object.defineProperty(navigator, 'onLine', { value: true, configurable: true })
  fireEvent(window, new Event('online')); expect(await screen.findByText('Online')).toBeTruthy()
})
it('applies larger text immediately from Settings', async () => {
  const { container } = render(<App />); go('Settings')
  fireEvent.click(await screen.findByLabelText('Larger text'))
  expect((container.firstElementChild as HTMLElement).style.fontSize).toBe('1.2rem')
})
it('text-to-sign only matches library phrases and never fakes a sign', async () => {
  render(<App />); go('AI Communication')
  const t = await screen.findByLabelText('Message')
  fireEvent.change(t, { target: { value: 'thank you' } }); expect(screen.getByText(/Matched: Thank you/)).toBeTruthy()
  fireEvent.change(t, { target: { value: 'good morning teacher' } }); expect(screen.getByText(/No verified sign available/)).toBeTruthy()
})
