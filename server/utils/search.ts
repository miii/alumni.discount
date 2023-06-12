/** Unified discount info interface */
export interface Discount {
  id: `${string}://${string}`
  brand: string
  title: string
  description: string
  logo_url: string
  url: string
  provider: Provider
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
  return html
    .replace(/<\/p>\s*/g, '. ')
    .replace(/ \./g, '')
    .replace(/(<([^>]+)>)/gi, '')
    .replace(/\s*\r\n\s*/g, '. ')
    .replace(/&nbsp;/g, '')
    .trim()
}