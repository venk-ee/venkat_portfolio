import * as THREE from 'three'

interface CardTextureProps {
  name: string
  title: string
  photoUrl?: string
}

export function createCardTexture({ name, title, photoUrl }: CardTextureProps): Promise<THREE.CanvasTexture> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1024
    const ctx = canvas.getContext('2d')!

    // Base background
    ctx.fillStyle = '#080808'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // =========================================================================
    // FRONT FACE OF THE CARD (Right Half: X from 512 to 1024)
    // =========================================================================
    const frontOffset = 512
    const cardLeft = frontOffset + 42
    const cardRight = frontOffset + 470
    const cardTop = 90
    const cardBottom = 760

    // 1. Top Section - Dark matte background
    ctx.fillStyle = '#0e0e0e'
    ctx.fillRect(cardLeft, cardTop, cardRight - cardLeft, cardBottom - cardTop)

    // 2. Subtle faceted low-poly crystal geometry (Top Right)
    const facets: [number, number][][] = [
      [[frontOffset + 280, 100], [frontOffset + 450, 120], [frontOffset + 380, 270]],
      [[frontOffset + 380, 270], [frontOffset + 450, 120], [frontOffset + 470, 250]],
      [[frontOffset + 380, 270], [frontOffset + 470, 250], [frontOffset + 460, 390]],
      [[frontOffset + 270, 270], [frontOffset + 380, 270], [frontOffset + 340, 420]],
      [[frontOffset + 340, 420], [frontOffset + 380, 270], [frontOffset + 460, 390]],
    ]
    const shades = ['#151515', '#1d1d1d', '#131313', '#191919', '#212121']
    facets.forEach((polygon, i) => {
      ctx.fillStyle = shades[i % shades.length]
      ctx.beginPath()
      ctx.moveTo(polygon[0][0], polygon[0][1])
      ctx.lineTo(polygon[1][0], polygon[1][1])
      ctx.lineTo(polygon[2][0], polygon[2][1])
      ctx.closePath()
      ctx.fill()
    })

    // 3. Top-Left Title (e.g. "AI & ML \n ENGINEER")
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 42px Inter, -apple-system, sans-serif'
    ctx.textAlign = 'left'
    const titleWords = title.split(' ')
    const mid = Math.ceil(titleWords.length / 2)
    const line1 = titleWords.slice(0, mid).join(' ')
    const line2 = titleWords.slice(mid).join(' ')
    ctx.fillText(line1, frontOffset + 65, 185)
    if (line2) {
      ctx.fillText(line2, frontOffset + 65, 230)
    }

    // 4. White Geometric Triangle Mark (Middle Left)
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.moveTo(frontOffset + 65, 395)
    ctx.lineTo(frontOffset + 115, 395)
    ctx.lineTo(frontOffset + 115, 345)
    ctx.closePath()
    ctx.fill()

    // 5. Bottom Section - Crisp Off-White Card Block
    const whiteTop = 415
    ctx.fillStyle = '#F5F5F7'
    ctx.beginPath()
    ctx.roundRect(cardLeft, whiteTop, cardRight - cardLeft, cardBottom - whiteTop, [0, 0, 16, 16])
    ctx.fill()

    // 6. Left Bio / Specialization Text
    ctx.fillStyle = '#8A8A93'
    ctx.font = '500 13px Inter, monospace, sans-serif'
    const bioLines = [
      'Applied AI, R&D',
      'Computer Vision,',
      'Vision Transformers',
      'Real-time 3D Systems'
    ]
    bioLines.forEach((text, idx) => {
      ctx.fillText(text, frontOffset + 65, 475 + idx * 20)
    })

    // 7. Bold Stacked Name at Bottom
    ctx.fillStyle = '#0A0A0A'
    ctx.font = '900 48px Inter, -apple-system, sans-serif'
    const nameParts = name.trim().split(' ')
    if (nameParts.length > 1) {
      ctx.fillText(nameParts[0].toUpperCase(), frontOffset + 65, 650)
      ctx.fillText(nameParts.slice(1).join(' ').toUpperCase(), frontOffset + 65, 705)
    } else {
      ctx.fillText(name.toUpperCase(), frontOffset + 65, 680)
    }

    // =========================================================================
    // BACK FACE OF THE CARD (Left Half: X from 0 to 512)
    // =========================================================================
    const backLeft = 42
    const backRight = 470
    ctx.fillStyle = '#0d0d0f'
    ctx.fillRect(backLeft, cardTop, backRight - backLeft, cardBottom - cardTop)

    // Subtle back calibration circles
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(256, 380, 90, 0, Math.PI * 2)
    ctx.stroke()

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.beginPath()
    ctx.arc(256, 380, 45, 0, Math.PI * 2)
    ctx.stroke()

    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 22px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('PERCEPTION & AI', 256, 530)

    ctx.fillStyle = '#66666E'
    ctx.font = '13px JetBrains Mono, monospace'
    ctx.fillText('AUTONOMOUS SYSTEMS // v2.4', 256, 565)
    ctx.textAlign = 'left'

    // =========================================================================
    // 8. Photo Rendering
    // =========================================================================
    const photoX = frontOffset + 245
    const photoY = 355
    const photoW = 205
    const photoH = 245

    const finalizeAndResolve = (img?: HTMLImageElement) => {
      ctx.save()
      ctx.beginPath()
      ctx.roundRect(photoX, photoY, photoW, photoH, 14)
      ctx.clip()

      // Studio dark gradient backdrop
      const bgGrad = ctx.createLinearGradient(photoX, photoY, photoX, photoY + photoH)
      bgGrad.addColorStop(0, '#26262b')
      bgGrad.addColorStop(1, '#0f0f12')
      ctx.fillStyle = bgGrad
      ctx.fillRect(photoX, photoY, photoW, photoH)

      if (img) {
        ctx.filter = 'grayscale(100%) contrast(115%) brightness(105%)'
        // Fill width nicely, align to bottom of frame
        const scale = Math.max(photoW / img.width, photoH / img.height) * 1.05
        const dw = img.width * scale
        const dh = img.height * scale
        const dx = photoX + (photoW - dw) / 2
        const dy = photoY + (photoH - dh) + 5
        ctx.drawImage(img, dx, dy, dw, dh)
      } else {
        // Fallback elegant silhouette
        ctx.fillStyle = '#3F3F46'
        ctx.beginPath()
        ctx.arc(photoX + photoW / 2, photoY + 95, 42, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(photoX + photoW / 2, photoY + 235, 80, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()

      // Border around photo
      ctx.strokeStyle = '#0e0e0e'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.roundRect(photoX, photoY, photoW, photoH, 14)
      ctx.stroke()

      const texture = new THREE.CanvasTexture(canvas)
      texture.colorSpace = THREE.SRGBColorSpace
      resolve(texture)
    }

    if (photoUrl) {
      const img = new Image()
      img.onload = () => finalizeAndResolve(img)
      img.onerror = () => finalizeAndResolve()
      img.src = photoUrl
    } else {
      finalizeAndResolve()
    }
  })
}