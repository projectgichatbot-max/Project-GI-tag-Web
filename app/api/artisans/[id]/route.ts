import { NextResponse } from "next/server"
import connectDB from "@/lib/database"
import { Artisan } from "@/lib/models/Artisan"
import { Product } from "@/lib/models/Product"
import { CloudinaryService } from "@/lib/cloudinary"

export async function GET(_req: Request, context: any) {
  try {
    await connectDB()
    const id = context?.params?.id
    const artisan = await Artisan.findById(id).lean() as any

    if (!artisan) {
      return NextResponse.json(
        { success: false, error: 'Artisan not found' },
        { status: 404 }
      )
    }

    // Fetch linked products — by stored product IDs OR by artisan name match
    let linkedProducts: any[] = []
    try {
      if (artisan.products && artisan.products.length > 0) {
        // Try to find by stored product IDs
        const { default: mongoose } = await import('mongoose')
        const validIds = (artisan.products as string[]).filter((pid: string) => mongoose.Types.ObjectId.isValid(pid))
        if (validIds.length > 0) {
          linkedProducts = await Product.find({
            _id: { $in: validIds }
          }).select('name category images cloudinaryPublicIds description region rating reviewsCount giCertified').lean()
        }
      }

      // Fallback: match by artisan name in product.artisan.name
      if (linkedProducts.length === 0 && artisan.name) {
        linkedProducts = await Product.find({
          'artisan.name': { $regex: artisan.name.split(' ')[0], $options: 'i' }
        }).select('name category images cloudinaryPublicIds description region rating reviewsCount giCertified').limit(10).lean()
      }
    } catch (e) {
      // Non-fatal — return artisan without products
      linkedProducts = []
    }

    // Serialize
    const serializedArtisan = {
      ...artisan,
      _id: artisan._id?.toString(),
      products: (artisan.products || []).map((p: any) => (typeof p === 'object' ? p?.toString() : p)),
    }

    const serializedProducts = linkedProducts.map((p: any) => ({
      ...p,
      _id: p._id?.toString(),
    }))

    return NextResponse.json({
      success: true,
      data: serializedArtisan,
      linkedProducts: serializedProducts,
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