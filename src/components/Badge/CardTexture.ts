import * as THREE from 'three'

interface CardTextureProps {
  name: string
  title: string
}

export function createCardTexture({ name, title }: CardTextureProps): Promise<THREE.CanvasTexture> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1024 
    const ctx = canvas.getContext('2d')!

    // 1. Base Background
    ctx.fillStyle = '#080808'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 2. Draw Grid Lines on both front (right) and back (left)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)'
    ctx.lineWidth = 2
    const gridSpacing = 80
    for (let x = gridSpacing; x < canvas.width; x += gridSpacing) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    for (let y = gridSpacing; y < canvas.height; y += gridSpacing) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // A divider line down the middle of the texture (won't be visible on the card)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
    ctx.beginPath()
    ctx.moveTo(512, 0)
    ctx.lineTo(512, canvas.height)
    ctx.stroke()


    // FRONT FACE OF THE CARD (Right Half: X from 512 to 1024)
    const frontOffset = 512

    // 1. Top-Left Calibration Triangle (Relative X = 70)
    ctx.fillStyle = '#CCFF00'
    ctx.beginPath()
    ctx.moveTo(frontOffset + 70, 120)
    ctx.lineTo(frontOffset + 100, 170)
    ctx.lineTo(frontOffset + 40, 170)
    ctx.closePath()
    ctx.fill()

    // // 2. Giant Vertical Text on the Right (Relative X = 330)
    // ctx.fillStyle = 'rgba(255, 255, 255, 0.07)'
    // ctx.font = '900 110px Inter, sans-serif'
    // ctx.textAlign = 'center'
    // const verticalText = ['R', 'O', 'B', 'O', 'T']
    // const startX = frontOffset + 340
    // const startY = 250
    // const spacing = 110
    // verticalText.forEach((char, index) => {
    //   ctx.fillText(char, startX, startY + index * spacing)
    // })

    // // Reset alignment
    // ctx.textAlign = 'left'

    // 3. Bottom-Left Details (Relative X = 70)
    // Name
    ctx.fillStyle = '#CCFF00'  //'#FFFFFF'
    ctx.font = '900 50px Inter, sans-serif'
    ctx.fillText(name.toUpperCase(), frontOffset + 20, 600)

    // Title
    ctx.fillStyle = '#FFFFFF'  //'#888888'
    ctx.font = 'bold 25px JetBrains Mono, monospace'
    ctx.fillText(title.toUpperCase(), frontOffset + 130, 650)

    // System Status tag
    // ctx.fillStyle = '#CCFF00'
    // ctx.font = 'bold 12px JetBrains Mono, monospace'
    // ctx.fillText('STATUS: ACTIVE // PERCEPTION_NODE_01', frontOffset + 70, 690)

    // 4. Bottom-Right White Asset Block (Relative X = 320)
    // ctx.fillStyle = '#FFFFFF'
    // ctx.fillRect(frontOffset + 320, 650, 120, 40)


    // =========================================================================
    // BACK FACE OF THE CARD (Left Half: X from 0 to 512)
    // =========================================================================
    // const backOffset = 0

    // // Draw a cool logo / calibration circle on the back center
    // ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    // ctx.lineWidth = 2
    // ctx.beginPath()
    // ctx.arc(backOffset + 256, 400, 100, 0, Math.PI * 2)
    // ctx.stroke()

    // ctx.strokeStyle = '#CCFF00'
    // ctx.beginPath()
    // ctx.arc(backOffset + 256, 400, 40, 0, Math.PI * 2)
    // ctx.stroke()

    // ctx.fillStyle = '#FFFFFF'
    // ctx.font = '900 24px Inter, sans-serif'
    // ctx.textAlign = 'center'
    // ctx.fillText('ROBOTICS & CV', backOffset + 256, 560)

    // ctx.fillStyle = '#888888'
    // ctx.font = 'bold 14px JetBrains Mono, monospace'
    // ctx.fillText('PERCEPTION SYSTEM v2.0', backOffset + 256, 605)

    // Finalize
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    resolve(texture)
  })
}