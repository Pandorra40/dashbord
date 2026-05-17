import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const path = resolve('server/data.json')
  const data = JSON.parse(readFileSync(path, 'utf-8'))
  const idx = data.services.findIndex((s: any) => s.id === id)
  if (idx === -1) throw createError({ statusCode: 404 })
  data.services[idx] = { ...data.services[idx], ...body }
  writeFileSync(path, JSON.stringify(data, null, 2))
  return data.services[idx]
})
