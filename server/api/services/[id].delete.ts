import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))
  const path = resolve('server/data.json')
  const data = JSON.parse(readFileSync(path, 'utf-8'))
  data.services = data.services.filter((s: any) => s.id !== id)
  writeFileSync(path, JSON.stringify(data, null, 2))
  return { ok: true }
})
