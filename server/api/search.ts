import { Discount, MecenatResponse, StukResponse, stripHtml } from '../utils/search'

export default defineEventHandler(async (event) => {
  const { q } = getQuery(event)
  const searchQuery = String(q).trim()

  // Skip search if query is too short
  if (searchQuery.length < 2)
    return { results: [] }

  const stukUrl = `https://api.studentkortet.se/search/?query=${searchQuery}&indices=partner`
  const mecenatUrl = `https://www.mecenatalumni.com/v2/se/f/search?text=${searchQuery}&site=alumni&preview=true&pageSize=10`

  const stukReponse = $fetch<StukResponse>(stukUrl)
  const mecenatResponse = $fetch<MecenatResponse>(mecenatUrl)

  // Fetch responses in parallel
  const [stuk, mecenat] = await Promise.all([stukReponse, mecenatResponse])

  // Create discount objects from Studentkortet response
  const stukDiscounts: Discount[] = stuk.hits.hits.map(({ _source: discount }) => ({
    id: `stuk://${discount.id}`,
    brand: discount.partner_extra_title || discount.name,
    title: discount.headline.trim(),
    description: stripHtml(discount.description_text),
    logo_url: discount.logo_image_url,
    url: `https://www.studentkortet.se/${discount.path}`,
    provider: 'Studentkortet',
  }))

  // Create discount objects from Mecenat response
  const mecenatDiscounts: Discount[] = mecenat.discounts?.map((discount) => ({
    id: `stuk://${discount.id}`,
    brand: discount.brandName,
    title: discount.title,
    subtitle: discount.subtitle,
    description: stripHtml(discount.conditionHTML),
    logo_url: discount.brandLogo,
    url: `https://www.mecenatalumni.com${discount.url}`,
    provider: 'Mecenat',
  })) ?? []

  // Place matched brands first
  const results = [...stukDiscounts, ...mecenatDiscounts]
    .sort((a, b) => {
      if (a.brand.includes(searchQuery) && !b.brand.includes(searchQuery)) return -1
      if (!a.brand.includes(searchQuery) && b.brand.includes(searchQuery)) return 1
      
      return 0
    })

  // Save in browser cache for 1 hour
  event.node.res.setHeader('Cache-Control', 'public, max-age=3600')

  return { results }
})
