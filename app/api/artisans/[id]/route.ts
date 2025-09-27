import { NextResponse } from "next/server"
import connectDB from "@/lib/database"
import { Artisan } from "@/lib/models/Artisan"
import { CloudinaryService } from "@/lib/cloudinary"

export async function GET(_req: Request, context: any) {
  try {
    await connectDB()
    const id = context?.params?.id
    const artisan = await Artisan.findById(id).lean()
    
    if (!artisan) {
      return NextResponse.json(
        { success: false, error: 'Artisan not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: artisan
    })
  } catch (error) {
    console.error('Error fetching artisan:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch artisan' },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request, context: any) {
  try {
    await connectDB()
    const body = await req.json()
    
    // Get existing artisan to check for image deletions
    const id = context?.params?.id
    const existingArtisan = await Artisan.findById(id)
    if (!existingArtisan) {
      return NextResponse.json(
        { success: false, error: 'Artisan not found' },
        { status: 404 }
      )
    }
    
    // Handle image deletions if new images are provided
    if (body.image && body.cloudinaryPublicId) {
      if (existingArtisan.cloudinaryPublicId !== body.cloudinaryPublicId) {
        await CloudinaryService.deleteImage(existingArtisan.cloudinaryPublicId)
      }
    }
    
    // Handle gallery deletions
    if (body.gallery && body.cloudinaryGalleryIds) {
      const imagesToDelete = existingArtisan.cloudinaryGalleryIds.filter(
        (id: string) => !body.cloudinaryGalleryIds.includes(id)
      )
      
      if (imagesToDelete.length > 0) {
        await CloudinaryService.deleteMultipleImages(imagesToDelete)
      }
    }
    
    // Update artisan
    const updatedArtisan = await Artisan.findByIdAndUpdate(
      id,
      {
        ...body,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    )
    
    return NextResponse.json({
      success: true,
      data: updatedArtisan,
      message: 'Artisan updated successfully'
    })
  } catch (error) {
    console.error('Error updating artisan:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update artisan' },
      { status: 500 }
    )
  }
}

export async function DELETE(_req: Request, context: any) {
  try {
    await connectDB()
    const id = context?.params?.id
    const artisan = await Artisan.findById(id)
    if (!artisan) {
      return NextResponse.json(
        { success: false, error: 'Artisan not found' },
        { status: 404 }
      )
    }
    
    // Delete images from Cloudinary
    const imagesToDelete = [
      artisan.cloudinaryPublicId,
      ...(artisan.cloudinaryGalleryIds || [])
    ].filter(Boolean)
    
    if (imagesToDelete.length > 0) {
      await CloudinaryService.deleteMultipleImages(imagesToDelete)
    }
    
    // Delete artisan from database
    await Artisan.findByIdAndDelete(id)
    
    return NextResponse.json({
      success: true,
      message: 'Artisan deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting artisan:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete artisan' },
      { status: 500 }
    )
  }
}