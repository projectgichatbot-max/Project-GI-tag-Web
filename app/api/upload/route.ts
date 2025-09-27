import { type NextRequest, NextResponse } from "next/server"
import { CloudinaryService, UPLOAD_OPTIONS } from "@/lib/cloudinary"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'product', 'artisan', 'user', 'gallery'
    const folder = formData.get('folder') as string
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
  // Determine upload options based on type (separate handling for documents)
  let uploadOptions: typeof UPLOAD_OPTIONS[keyof typeof UPLOAD_OPTIONS]
    switch (type) {
      case 'product':
        uploadOptions = UPLOAD_OPTIONS.PRODUCT_IMAGE
        break
      case 'artisan':
        uploadOptions = UPLOAD_OPTIONS.ARTISAN_IMAGE
        break
      case 'user':
        uploadOptions = UPLOAD_OPTIONS.USER_AVATAR
        break
      case 'gallery':
        uploadOptions = UPLOAD_OPTIONS.GALLERY_IMAGE
        break
      default:
        uploadOptions = UPLOAD_OPTIONS.GALLERY_IMAGE
    }
    
    // If document type requested, handle separately (raw resource)
    if (type === 'document') {
      const result = await CloudinaryService.uploadImage(buffer, UPLOAD_OPTIONS.DOCUMENT)
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 500 })
      }
      return NextResponse.json({ success: true, data: result.data, message: 'File uploaded successfully' })
    }

    // Override folder only if it matches allowed image folders (exclude inquiries & temp)
    const allowedFolders = [
      UPLOAD_OPTIONS.PRODUCT_IMAGE.folder,
      UPLOAD_OPTIONS.ARTISAN_IMAGE.folder,
      UPLOAD_OPTIONS.USER_AVATAR.folder,
      UPLOAD_OPTIONS.GALLERY_IMAGE.folder
    ] as const
    if (folder && allowedFolders.includes(folder as any)) {
      uploadOptions = { ...uploadOptions, folder } as typeof uploadOptions
    }

    // Upload image to Cloudinary
    const result = await CloudinaryService.uploadImage(buffer, uploadOptions as typeof UPLOAD_OPTIONS.PRODUCT_IMAGE)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'File uploaded successfully'
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId')
    
    if (!publicId) {
      return NextResponse.json(
        { success: false, error: 'No public ID provided' },
        { status: 400 }
      )
    }
    
    const result = await CloudinaryService.deleteImage(publicId)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}
