import sharp from 'sharp'

export default defineEventHandler(async (event) => {
  const imageSrc = getQuery(event).src as string
  
  try {
    // Validate image URL
    const url = new URL(imageSrc)
    // Validate CDN to prevent SSRF
    if (!['img.meccdn.com', 'www.studentkortet.se'].includes(url.hostname))
      throw new Error('Invalid hostname')
  } catch (error) {
    throw createError({
      status: 400,
      message: 'Invalid image URL',
      cause: error,
    })
  }

  const imageBuffer = await $fetch<ArrayBuffer>(imageSrc, { responseType: 'arrayBuffer' })

  const image = sharp(imageBuffer).trim()
  const buffer = await image.toBuffer()

  event.node.res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')

  return buffer
})