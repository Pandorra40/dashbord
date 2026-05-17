export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const password = useRuntimeConfig().adminPassword
  if (body.password !== password) throw createError({ statusCode: 401 })
  setCookie(event, 'admin_token', password, { httpOnly: true, maxAge: 60 * 60 * 8 })
  return { ok: true }
})
