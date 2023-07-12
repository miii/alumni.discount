import { Discount, MecenatResponse, StukResponse, findCondition, stripHtml } from '../utils/search'

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
  const stukDiscounts: Discount[] = stuk.hits.hits.map(({ _source: discount }) => {
    const description = stripHtml(discount.description_text)
    const condition = findCondition(description)

    return {
      id: `stuk://${discount.id}`,
      brand: discount.partner_extra_title || discount.name,
      title: discount.headline.trim(),
      description,
      logoUrl: discount.logo_image_url,
      url: `https://www.studentkortet.se/${discount.path}`,
      provider: 'Studentkortet',
      condition,
    }
})

  // Create discount objects from Mecenat response
  const mecenatDiscounts: Discount[] = mecenat.discounts?.map((discount) => {
    const conditionText = stripHtml(discount.conditionHTML)
    const description = discount.subtitle || conditionText
    const condition = findCondition(conditionText) || findCondition(description)

    return {
      id: `stuk://${discount.id}`,
      brand: discount.brandName,
      title: discount.title,
      description,
      logoUrl: discount.brandLogo,
      url: `https://www.mecenatalumni.com${discount.url}`,
      provider: 'Mecenat',
      condition,
    }
   }) ?? []

  // Place matched brands first
  const results = [...stukDiscounts, ...mecenatDiscounts]
    .sort((a, b) => {
      const abrand = a.brand.toLowerCase()
      const bbrand = b.brand.toLowerCase()
      const query = searchQuery.toLowerCase()

      // Prioritize brands that starts with query
      if (abrand.startsWith(query) && !bbrand.startsWith(query)) return -1
      if (!abrand.startsWith(query) && bbrand.startsWith(query)) return 1

      // Prioritize brands without discount condition
      if (a.condition && !b.condition) return 1
      if (!a.condition && b.condition) return -1

      // Match query in brand name
      if (abrand.includes(query) && !bbrand.includes(query)) return -1
      if (!abrand.includes(query) && bbrand.includes(query)) return 1

      // If both brands match query, sort alphabetically
      if (abrand.includes(query) && bbrand.includes(query))
        return abrand.localeCompare(bbrand)
      
      // Fallback to original order
      return 0
    })

  // Save in browser cache for 1 hour
  event.node.res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=3600')

  return { results }
})
