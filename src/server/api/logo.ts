import sharp from 'sharp'

export default defineEventHandler(async (event) => {
  const imageSrc = getQuery(event).src as string
  const imageBuffer = await $fetch<ArrayBuffer>(imageSrc, { responseType: 'arrayBuffer' })

  const image = sharp(imageBuffer).trim()
  const buffer = await image.toBuffer()

  event.node.res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
  return buffer
})