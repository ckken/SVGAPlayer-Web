import 'regenerator-runtime/runtime'
import { SVGAPlus } from '@svgaplus/core'
// import buffer from './demo.svga'
async function main () {
  // Load SVGA file into array buffer.
  const buffer = await SVGAPlus.loadSvgaFile('./demo.svga')

  // Or you can just prepare a copy of arary buffer.
//   const buffer = new ArrayBuffer(...)
  
  // Create SVGAPlus.
  const sprite = new SVGAPlus({
    element: document.querySelector('#drawingCanvas'),
    buffer
  })

  // Initialize SVGAPlus instance.
  await sprite.init()

  // Feel free to add a listener.
  sprite.onPlay(() => {
    console.log('current frame:', sprite.frame)
  })

  // Play whole animation in loop.
  sprite.play()

  // Play frame 1 - 5 in loop.
  sprite.play(0, 4)  

  // Play frame 1 - 15 once.
  await sprite.playOnce(0, 14)

  // Reverse frame 10 to 1.
  await sprite.playOnce(9, 0)
}
main()