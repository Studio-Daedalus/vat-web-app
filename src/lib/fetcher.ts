export const fetcher = async (url: string) => {
  const res = await fetch(url, {
    credentials: 'include', // if using auth cookies
  })

  if (!res.ok) {
    throw new Error('Failed to fetch')
  }

  return res.json()
}
