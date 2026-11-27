import 'fake-indexeddb/auto'
import { beforeEach } from 'vitest'
import { wipe } from './db'
window.scrollTo = () => {}
beforeEach(async () => { await wipe(); location.hash = '' })
