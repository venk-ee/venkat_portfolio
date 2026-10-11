import * as THREE from 'three'

interface CardTextureProps {
  name: string
  title: string
  photoUrl?: string
}

const CANVAS_SIZE = 1024
const CARD_TOP = 90
const CARD_BOTTOM = 760
const WHITE_TOP = 415
const CARD_PAD_X = 42
const TEXT_PAD_X = 65
const FACE_OFFSETS = [0, 512]

const PHOTO_W = 205
const PHOTO_H = 245
const PHOTO_X_REL = 245
const PHOTO_Y = 315
const PHOTO_RADIUS = 14

const FONT_FAMILY = 'Inter, -apple-system, sans-serif'
const TITLE_START_SIZE = 42
const NAME_START_SIZE = 48
const MIN_FIT_SIZE = 20
const FIT_STEP = 2

const FACET_REL: [number, number][][] = [
  [[280, 100], [450, 120], [380, 270]],
  [[380, 270], [450, 120], [470, 250]],
  [[380, 270], [470, 250], [460, 390]],
  [[270, 270], [380, 270], [340, 420]],
  [[340, 420], [380, 270], [460, 390]],
]
const FACET_SHADES = ['#151515', '#1d1d1d', '#131313', '#191919', '#212121']

const SILHOUETTE_PARTS: { dy: number; r: number }[] = [
  { dy: 95, r: 42 },
  { dy: 235, r: 80 },
]

function normalizeLine(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, ' ')
}

function setFittedFont(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  startSize: number,
  weight: number,
): void {
  let size = startSize
  while (size > MIN_FIT_SIZE) {
    ctx.font = `${weight} ${size}px ${FONT_FAMILY}`
    if (ctx.measureText(text).width <= maxWidth) break
    size -= FIT_STEP
  }
  ctx.font = `${weight} ${size}px ${FONT_FAMILY}`
}

function traceRoundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
): void {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, radius)
}

function drawFacets(ctx: CanvasRenderingContext2D, baseOffset: number): void {
  FACET_REL.forEach((polygon, i) => {
    ctx.fillStyle = FACET_SHADES[i % FACET_SHADES.length]
    ctx.beginPath()
    ctx.moveTo(baseOffset + polygon[0][0], polygon[0][1])
    ctx.lineTo(baseOffset + polygon[1][0], polygon[1][1])
    ctx.lineTo(baseOffset + polygon[2][0], polygon[2][1])
    ctx.closePath()
    ctx.fill()
  })
}

function drawPhoto(
  ctx: CanvasRenderingContext2D,
  baseOffset: number,
  img?: HTMLImageElement,
): void {
  const photoX = baseOffset + PHOTO_X_REL

  ctx.save()
  traceRoundRectPath(ctx, photoX, PHOTO_Y, PHOTO_W, PHOTO_H, PHOTO_RADIUS)
  ctx.clip()

  const bgGrad = ctx.createLinearGradient(photoX, PHOTO_Y, photoX, PHOTO_Y + PHOTO_H)
  bgGrad.addColorStop(0, '#26262b')
  bgGrad.addColorStop(1, '#0f0f12')
  ctx.fillStyle = bgGrad
  ctx.fillRect(photoX, PHOTO_Y, PHOTO_W, PHOTO_H)

  if (img) {
    ctx.filter = 'grayscale(100%) contrast(115%) brightness(105%)'
    const scale = Math.max(PHOTO_W / img.width, PHOTO_H / img.height) * 1.05
    const dw = img.width * scale
    const dh = img.height * scale
    const dx = photoX + (PHOTO_W - dw) / 2
    const dy = PHOTO_Y + (PHOTO_H - dh) + 5
    ctx.drawImage(img, dx, dy, dw, dh)
    ctx.filter = 'none'
  } else {
    ctx.fillStyle = '#3F3F46'
    SILHOUETTE_PARTS.forEach(({ dy, r }) => {
      ctx.beginPath()
      ctx.arc(photoX + PHOTO_W / 2, PHOTO_Y + dy, r, 0, Math.PI * 2)
      ctx.fill()
    })
  }
  ctx.restore()

  ctx.strokeStyle = '#0e0e0e'
  ctx.lineWidth = 4
  traceRoundRectPath(ctx, photoX, PHOTO_Y, PHOTO_W, PHOTO_H, PHOTO_RADIUS)
  ctx.stroke()
}

function drawFace(
  ctx: CanvasRenderingContext2D,
  baseOffset: number,
  titleText: string,
  nameText: string,
  img?: HTMLImageElement,
): void {
  const cardLeft = baseOffset + CARD_PAD_X
  const cardRight = baseOffset + 470
  const textX = baseOffset + TEXT_PAD_X

  ctx.fillStyle = '#1D1C1B'
  ctx.fillRect(cardLeft, CARD_TOP, cardRight - cardLeft, CARD_BOTTOM - CARD_TOP)

  drawFacets(ctx, baseOffset)

  ctx.fillStyle = '#D9D9D9'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  setFittedFont(ctx, titleText, cardRight - textX - 10, TITLE_START_SIZE, 700)
  ctx.fillText(titleText, textX, 200)

  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.moveTo(textX, 395)
  ctx.lineTo(textX + 50, 395)
  ctx.lineTo(textX + 50, 345)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#F4F3F3'
  ctx.beginPath()
  ctx.roundRect(cardLeft, WHITE_TOP, cardRight - cardLeft, CARD_BOTTOM - WHITE_TOP, [0, 0, 16, 16])
  ctx.fill()

  ctx.fillStyle = '#000000'
  ctx.textAlign = 'left'
  setFittedFont(ctx, nameText, cardRight - textX - 15, NAME_START_SIZE, 900)
  ctx.fillText(nameText, textX, 650)

  drawPhoto(ctx, baseOffset, img)
}

function loadImage(url: string): Promise<HTMLImageElement | undefined> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(undefined)
    img.src = url
  })
}

export async function createCardTexture({ name, title, photoUrl }: CardTextureProps): Promise<THREE.CanvasTexture> {
  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_SIZE
  canvas.height = CANVAS_SIZE
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#1D1C1B'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const titleText = normalizeLine(title)
  const nameText = normalizeLine(name)
  const img = photoUrl ? await loadImage(photoUrl) : undefined

  FACE_OFFSETS.forEach((offset) => drawFace(ctx, offset, titleText, nameText, img))

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}
