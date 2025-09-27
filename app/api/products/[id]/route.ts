import { type NextRequest, NextResponse } from "next/server"
import { getDatabaseService } from "@/lib/database-service-fixed"
import { CloudinaryService } from "@/lib/cloudinary"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDatabaseService()
    
    const product = await db.getProductById(params.id)
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const body = await request.json()
    
    // Get existing product to check for image deletions
    const existingProduct = await Product.findById(params.id)
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Handle image deletions if new images are provided
    if (body.images && body.cloudinaryPublicIds) {
      const imagesToDelete = existingProduct.cloudinaryPublicIds.filter(
        (id: string) => !body.cloudinaryPublicIds.includes(id)
      )
      
      if (imagesToDelete.length > 0) {
        await CloudinaryService.deleteMultipleImages(imagesToDelete)
      }
    }
    
    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      {
        ...body,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    )
    
    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const product = await Product.findById(params.id)
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Delete images from Cloudinary
    if (product.cloudinaryPublicIds && product.cloudinaryPublicIds.length > 0) {
      await CloudinaryService.deleteMultipleImages(product.cloudinaryPublicIds)
    }
    
    // Delete product from database
    await Product.findByIdAndDelete(params.id)
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}