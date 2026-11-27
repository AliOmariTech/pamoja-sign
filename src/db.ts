import { useEffect, useRef, useState } from 'react'
let dbp: Promise<IDBDatabase> | undefined
const open = () => (dbp ??= new Promise<IDBDatabase>((res, rej) => {
  const r = indexedDB.open('pamoja', 1)
  r.onupgradeneeded = () => r.result.createObjectStore('kv')
  r.onsuccess = () => { r.result.onversionchange = () => { r.result.close(); dbp = undefined }; res(r.result) }
  r.onerror = () => { dbp = undefined; rej(r.error) }
}))
export async function get<T>(k: string): Promise<T | undefined> {
  const d = await open()
  return new Promise((res, rej) => { const q = d.transaction('kv').objectStore('kv').get(k); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error) })
}
export async function set(k: string, v: unknown) {
  const d = await open()
  return new Promise<void>((res, rej) => { const t = d.transaction('kv', 'readwrite'); t.objectStore('kv').put(v, k); t.oncomplete = () => res(); t.onerror = () => rej(t.error) })
}
export async function wipe() {
  const d = await open()
  return new Promise<void>((res, rej) => { const t = d.transaction('kv', 'readwrite'); t.objectStore('kv').clear(); t.oncomplete = () => res(); t.onerror = () => rej(t.error) })
}
export function useStored<T>(k: string, init: T): [T, (v: T) => void] {
  const [v, s] = useState<T>(init); const touched = useRef(false)
  useEffect(() => { let on = true; get<T>(k).then(x => { if (on && !touched.current && x !== undefined) s(x) }).catch(() => {}); return () => { on = false } }, [k])
  return [v, x => { touched.current = true; s(x); set(k, x).catch(() => {}) }]
}
