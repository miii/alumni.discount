/** Unified discount info interface */
export interface Discount {
  /** Unique discount ID */
  id: `${string}://${string}`
  /** Brand name */
  brand: string
  /** Discount title */
  title: string
  /** Discount description */
  description: string
  /** Logo URL of the brand */
  logoUrl: string
  /** Discount URL on the provider's website */
  url: string
  /** Discount provider */
  provider: Provider
  /** Minimum order value */
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
    // Assume </p> is a sentence separator
    .replace(/\s*<\/p>\s*/g, '. ')
    // Dots should never be preceded by a space
    .replace(/ \./g, '')
    // Remove HTML tags
    .replace(/(<([^>]+)>)/gi, '')
    // Remove spaces
    .replace(/\s*\r\n\s*/g, '. ')
    .replace(/\s*&nbsp;\s*/g, ' ')
    // Remove newlines
    .replace(/\n/g, '')
    // Remove multiple dots, but not ellipsis
    .replace(/([^\.])\.\.\s/g, '$1. ')
    // Remove surrounding spaces
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