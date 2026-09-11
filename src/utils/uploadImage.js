/**
 * Compress and convert an image file to a base64 data URL.
 * Uses canvas to resize large images before encoding,
 * keeping Firestore documents under size limits.
 *
 * @param {File} file - The image file to process
 * @param {number} maxSize - Max width/height in pixels (default: 800)
 * @param {number} quality - JPEG quality 0-1 (default: 0.8)
 * @returns {Promise<string>} Base64 data URL of the compressed image
 */
export function imageToBase64(file, maxSize = 800, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error("Erreur de lecture du fichier."))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error("Erreur de chargement de l'image."))
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height * maxSize) / width)
            width = maxSize
          } else {
            width = Math.round((width * maxSize) / height)
            height = maxSize
          }
        }

        // Draw to canvas and compress
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        const dataURL = canvas.toDataURL('image/jpeg', quality)
        resolve(dataURL)
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
