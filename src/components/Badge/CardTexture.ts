import * as THREE from 'three'
import defaultPhoto from '../../assets/hero.png'
interface CardTextureProps {
    name: string,
    title: string,
    photoUrl?: string,
}

export function createCardTexture({name, title, photoUrl}: CardTextureProps): Promise<THREE.CanvasTexture> {
    return new Promise((resolve)=>{
        
        const canvas= document.createElement('canvas')
        canvas.width= 1024
        canvas.height= 640
        const ctx=canvas.getContext('2d')
        
        if(!ctx){
            throw new Error('Could not get canvas context')
        }
        
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle='rgba(255,255,255,0.1)';
        
        // dot grid pano 
        const dotSpacing = 24
        for (let x = dotSpacing; x < canvas.width; x += dotSpacing) {
          for (let y = dotSpacing + 20; y < canvas.height; y += dotSpacing) {
            ctx.beginPath()
            ctx.arc(x, y, 2, 0, Math.PI * 2)
            ctx.fill()
          }
        }
        


        // name
        ctx.fillStyle = '#FFFFFF'
        ctx.font = '900 64px Inter, sans-serif'
        ctx.fillText(name.toUpperCase(), 380, 260)


                // Title
        ctx.fillStyle = '#CCFF00'
        ctx.font = 'bold 28px JetBrains Mono, monospace'
        ctx.fillText(title.toUpperCase(), 380, 315)


        // Subtle metadata text ( design polish)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.font = '16px JetBrains Mono, monospace'
        ctx.fillText('STATUS: ACTIVE', 380, 480)
        ctx.fillText('SYSTEM: ROBOTICS_PERCEPTION_V2.0', 380, 510)
        
        
        const finalizeTexture = () => {
          const texture = new THREE.CanvasTexture(canvas)
          texture.colorSpace = THREE.SRGBColorSpace 
          resolve(texture)
        }


        // photos
        const photo = new Image()
        photo.crossOrigin = 'anonymous'

        photo.onload = () => {
            ctx.save()
            ctx.beginPath()
            ctx.arc(200, 340, 110, 0, Math.PI * 2)
            ctx.closePath()
            ctx.clip()
            
            // Draw image
            ctx.drawImage(photo, 90, 230, 220, 220)
            ctx.restore()

            // Add a thin border around the circle
            ctx.strokeStyle = '#CCFF00'
            ctx.lineWidth = 4
            ctx.beginPath()
            ctx.arc(200, 340, 110, 0, Math.PI * 2)
            ctx.stroke()

            finalizeTexture()
        }

        photo.onerror=()=>{

            ctx.fillStyle='#111111'
            ctx.strokeStyle='rgba(204, 255, 0, 0.5)'
            ctx.lineWidth = 4
            ctx.beginPath()
            ctx.arc(200, 340, 110, 0, Math.PI * 2)
            ctx.fill()
            ctx.stroke()

        // Draw dummy silhouette / initials
            ctx.fillStyle = '#CCFF00'
            ctx.font = 'bold 80px Inter, sans-serif'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(name.charAt(0).toUpperCase(), 200, 340)
            ctx.textAlign = 'left' // reset align
            ctx.textBaseline = 'alphabetic' // reset baseline

            finalizeTexture()

        }
 

        photo.src = photoUrl || defaultPhoto
        
    
    })

}