/** Unified discount info interface */
export interface Discount {
  id: `${string}://${string}`
  brand: string
  title: string
  description: string
  logoUrl: string
  url: string
  provider: Provider
  condition: string | null
}

/** Raw response returned from Studentkortet API */
export interface StukResponse extends Record<string, unknown> {
  hits: {
    hits: {
      _source: {
        id: string
        name: string
        partner_extra_title: string
        headline: string
        description_text: string
        logo_image_url: string
        path: string
      }
    }[]
  }
}

/** Raw response returned from Mecenat API */
export interface MecenatResponse extends Record<string, unknown> {
  discounts?: {
    id: string
    brandLogo: string
    brandName: string
    title: string
    subtitle: string
    conditionHTML: string
    validTo: string
    url: string
  }[]
}

type Provider = 'Studentkortet' | 'Mecenat'

/**
 * Strip HTML and other unwanted characters from API responses
 * @param html HTML string
 */
export const stripHtml = (html: string) => {
  const content = html
    .replace(/\s*<\/p>\s*/g, '. ')
    .replace(/ \./g, '')
    .replace(/(<([^>]+)>)/gi, '')
    .replace(/\s*\r\n\s*/g, '. ')
    .replace(/\s*&nbsp;\s*/g, ' ')
    .replace(/\n/g, '')
    .replace(/([^\.])\.\.\s/g, '$1. ')
    .trim()

  return content
}

/**
 * Find discount conditions, like minimum order value
 * @param description Discount description
 */
export const findCondition = (description: string) => {
  const minAmount = description.match(/(minst|över|ordervärde) ([0-9]+) kr(onor)?(?! rabatt)/i)?.[2]
  return minAmount ? `Minst ${minAmount} kr` : null
}