import { readFileSync } from 'fs'
import { resolve } from 'path'

export default defineEventHandler(() => {
  const data = JSON.parse(readFileSync(resolve('server/data.json'), 'utf-8'))
  return data.services
})
