import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const path = resolve('server/data.json')
  const data = JSON.parse(readFileSync(path, 'utf-8'))
  const service = { id: Date.now(), ...body }
  data.services.push(service)
  writeFileSync(path, JSON.stringify(data, null, 2))
  return service
})
