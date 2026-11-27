import { it, expect } from 'vitest'
import { get, set, wipe } from './db'
it('stores, reads and clears values', async () => {
  expect(await get('x')).toBeUndefined()
  await set('x', { a: [1, 2] }); expect(await get('x')).toEqual({ a: [1, 2] })
  await set('x', 'new'); expect(await get('x')).toBe('new')
  await wipe(); expect(await get('x')).toBeUndefined()
})
