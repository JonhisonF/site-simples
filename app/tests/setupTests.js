import { vi } from 'vitest'

if (!(globalThis).crypto) (globalThis).crypto = {}
;(globalThis).crypto.getRandomValues = (arr) => {
  for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 0xffffffff)
  return arr
}

vi.stubGlobal('URL', {
  createObjectURL: vi.fn(() => 'blob:mock'),
  revokeObjectURL: vi.fn(),
})

const realCreateElement = Document.prototype.createElement
vi.spyOn(Document.prototype, 'createElement').mockImplementation(function(tagName) {
  const el = realCreateElement.call(this, tagName)
  if (String(tagName).toLowerCase() === 'a' && typeof el.click !== 'function') {
    el.click = () => {}
  }
  return el
})

vi.stubGlobal('confirm', vi.fn(() => true))
