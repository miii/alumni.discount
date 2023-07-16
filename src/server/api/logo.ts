import sharp from 'sharp'

/**
 * Perform some image manipulation on brand logotypes to:
 * - Normalize surrounding padding
 * - Replace white with transparent
 * - Support dark mode
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const imageSrc = query.src as string
  const darkMode = query.dark === 'true'
  
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
  let image = sharp(imageBuffer)
    .trim() // Crop surrounding padding
    .ensureAlpha() // Add alpha channel if missing

  // Replace white with transparent
  const whiteThreshold = 200
  image = await replaceColor(
    image,
    ([r, g, b]) => (r + g + b) / 3 > whiteThreshold,
    ([r, g, b, a]) => [r, g, b, 0]
  )

  if (darkMode) {
    // In dark mode, replace black with white
    const blackThreshold = 80
    image = await replaceColor(
      image,
      ([r, g, b]) => (r + g + b) / 3 < blackThreshold,
      ([r, g, b, a]) => [255, 255, 255, a]
    )

    // Tint image to match dark mode color scheme
    image = image
      .tint({ r: 75, g: 85, b: 99 }) // Tailwind gray-600
      .linear(1.5) // Lighten
  }

  const outputBuffer = await image
    .median() // Smoothen edges
    .toBuffer()

  // Cache for 1 year
  event.node.res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')

  return outputBuffer
})

type Color = [number, number, number, number]

const replaceColor = async (
  image: sharp.Sharp,
  threshold: (color: Color) => boolean,
  newColor: (color: Color) => Color,
) => {
  // Get raw pixel data
  const { data: buffer, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const v255 = (n: number) => Math.round(Math.min(255, Math.max(0, n)))

  // Replace colors
  for (let i = 0; i < buffer.length; i += 4) {
    const [r, g, b, a] = [buffer[i], buffer[i + 1], buffer[i + 2], buffer[i + 3]]
    if (threshold([r, g, b, a])) {
      const [nr, ng, nb, na] = newColor([r, g, b, a])

      buffer[i] = v255(nr)
      buffer[i + 1] = v255(ng)
      buffer[i + 2] = v255(nb)
      buffer[i + 3] = v255(na)
    }
  }

  // Create new image
  const raw: sharp.CreateRaw = {
    width: info.width,
    height: info.height,
    channels: 4,
  }

  // Return new image
  return sharp(buffer, { raw }).toFormat('png')
}