import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

async function uploadImagesToCloudinary() {
  try {
    console.log('☁️ Starting Cloudinary image upload...\n')

    // Get all images from public folder
    const publicDir = path.join(__dirname, '..', 'public')
    const imageFiles = fs.readdirSync(publicDir)
      .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))

    console.log(`📁 Found ${imageFiles.length} images in public folder\n`)

    // Upload images with proper folder structure
    const uploadResults = {
      products: [],
      artisans: [],
      gallery: [],
      errors: []
    }

    for (const file of imageFiles) {
      const filePath = path.join(publicDir, file)
      const fileName = path.parse(file).name

      try {
        // Determine folder based on filename
        let folder = 'uttarakhand-heritage/gallery'
        let uploadPreset = {}

        if (fileName.includes('rajma') || fileName.includes('aipan') || 
            fileName.includes('ringaal') || fileName.includes('woolen') || 
            fileName.includes('cap')) {
          folder = 'uttarakhand-heritage/products'
          uploadPreset = {
            folder: folder,
            public_id: fileName,
            overwrite: true,
            resource_type: 'image',
            transformation: [
              { width: 1200, height: 900, crop: 'limit' },
              { quality: 'auto:good' }
            ]
          }
          console.log(`📦 Uploading PRODUCT: ${file} -> ${folder}/`)
        } else if (fileName.includes('artisan')) {
          folder = 'uttarakhand-heritage/artisans'
          uploadPreset = {
            folder: folder,
            public_id: fileName,
            overwrite: true,
            resource_type: 'image',
            transformation: [
              { width: 800, height: 800, crop: 'fill', gravity: 'face' },
              { quality: 'auto:good' }
            ]
          }
          console.log(`👤 Uploading ARTISAN: ${file} -> ${folder}/`)
        } else {
          uploadPreset = {
            folder: folder,
            public_id: fileName,
            overwrite: true,
            resource_type: 'image',
            transformation: [
              { width: 1920, height: 1080, crop: 'limit' },
              { quality: 'auto:best' }
            ]
          }
          console.log(`🖼️  Uploading GALLERY: ${file} -> ${folder}/`)
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(filePath, uploadPreset)

        // Store result
        if (folder.includes('products')) {
          uploadResults.products.push({
            originalName: file,
            cloudinaryUrl: result.secure_url,
            publicId: result.public_id,
            folder: folder,
            size: result.bytes,
            format: result.format
          })
        } else if (folder.includes('artisans')) {
          uploadResults.artisans.push({
            originalName: file,
            cloudinaryUrl: result.secure_url,
            publicId: result.public_id,
            folder: folder,
            size: result.bytes,
            format: result.format
          })
        } else {
          uploadResults.gallery.push({
            originalName: file,
            cloudinaryUrl: result.secure_url,
            publicId: result.public_id,
            folder: folder,
            size: result.bytes,
            format: result.format
          })
        }

        console.log(`   ✅ Uploaded: ${result.secure_url}`)
        console.log(`   📊 Size: ${(result.bytes / 1024).toFixed(2)} KB\n`)

      } catch (error) {
        console.error(`   ❌ Failed to upload ${file}:`, error.message, '\n')
        uploadResults.errors.push({
          file: file,
          error: error.message
        })
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('📊 CLOUDINARY UPLOAD SUMMARY')
    console.log('='.repeat(60))
    console.log(`✅ Products uploaded: ${uploadResults.products.length}`)
    console.log(`✅ Artisans uploaded: ${uploadResults.artisans.length}`)
    console.log(`✅ Gallery uploaded: ${uploadResults.gallery.length}`)
    console.log(`❌ Errors: ${uploadResults.errors.length}`)
    console.log('='.repeat(60))

    // Show folder structure
    console.log('\n📁 CLOUDINARY FOLDER STRUCTURE CREATED:')
    console.log('├── uttarakhand-heritage/')
    if (uploadResults.products.length > 0) {
      console.log(`│   ├── products/ (${uploadResults.products.length} files)`)
      uploadResults.products.forEach(p => {
        console.log(`│   │   └── ${p.publicId.split('/').pop()}`)
      })
    }
    if (uploadResults.artisans.length > 0) {
      console.log(`│   ├── artisans/ (${uploadResults.artisans.length} files)`)
      uploadResults.artisans.forEach(a => {
        console.log(`│   │   └── ${a.publicId.split('/').pop()}`)
      })
    }
    if (uploadResults.gallery.length > 0) {
      console.log(`│   └── gallery/ (${uploadResults.gallery.length} files)`)
      uploadResults.gallery.forEach(g => {
        console.log(`│       └── ${g.publicId.split('/').pop()}`)
      })
    }

    // Show errors if any
    if (uploadResults.errors.length > 0) {
      console.log('\n⚠️  ERRORS:')
      uploadResults.errors.forEach(err => {
        console.log(`   ❌ ${err.file}: ${err.error}`)
      })
    }

    console.log('\n🎉 CLOUDINARY UPLOAD COMPLETED!')
    console.log('👉 Check your Cloudinary console now: https://console.cloudinary.com')
    
    return uploadResults

  } catch (error) {
    console.error('❌ Cloudinary upload failed:', error)
    throw error
  }
}

// Run the upload
uploadImagesToCloudinary()
  .then(() => {
    console.log('\n✅ All done! Your Cloudinary folders should now be visible.')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Upload script failed:', error)
    process.exit(1)
  })
