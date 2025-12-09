import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

// Initialize Firebase Admin
let app: App | undefined
let db: Firestore | null = null
let storage: ReturnType<typeof getStorage> | null = null

function initializeFirebase() {
  if (getApps().length > 0) {
    app = getApps()[0]
    db = getFirestore(app)
    storage = getStorage(app)
    return true
  }

  const firebaseConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }

  try {
    // Only initialize if all required config is present
    if (firebaseConfig.projectId && firebaseConfig.privateKey && firebaseConfig.clientEmail) {
      app = initializeApp({
        credential: cert(firebaseConfig),
        storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
      })
      db = getFirestore(app)
      storage = getStorage(app)
      console.log('✅ Firebase Admin initialized')
      return true
    } else {
      console.warn('⚠️ Firebase credentials not fully configured. Skipping Firebase initialization.')
      return false
    }
  } catch (error: any) {
    console.warn('⚠️ Firebase Admin initialization failed (this is okay if using MongoDB):', error.message)
    return false
  }
}

// Export initialization function
export { initializeFirebase, db, storage }

// Firebase collections
export const COLLECTIONS = {
  PRODUCTS: 'products',
  ARTISANS: 'artisans',
  USERS: 'users',
  INQUIRIES: 'inquiries',
  REVIEWS: 'reviews',
  WORKSHOPS: 'workshops',
  NEWSLETTER: 'newsletter'
} as const

// Firebase helper functions
export class FirebaseService {
  // Get document by ID
  static async getDocument(collection: string, id: string) {
    if (!db) throw new Error('Firebase not initialized')
    
    const doc = await db.collection(collection).doc(id).get()
    return doc.exists ? { id: doc.id, ...doc.data() } : null
  }

  // Get all documents with optional filters
  static async getDocuments(
    collection: string, 
    filters?: Array<{ field: string; operator: any; value: any }>,
    limit?: number,
    orderBy?: { field: string; direction: 'asc' | 'desc' }
  ) {
    if (!db) throw new Error('Firebase not initialized')
    
    const colRef = db.collection(collection)
    let q: FirebaseFirestore.Query = colRef

    if (filters) {
      for (const filter of filters) {
        q = (q as FirebaseFirestore.Query).where(filter.field, filter.operator, filter.value)
      }
    }

    if (orderBy) {
      q = q.orderBy(orderBy.field, orderBy.direction)
    }

    if (limit) {
      q = q.limit(limit)
    }

    const snapshot = await q.get()
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  // Create document
  static async createDocument(collection: string, data: any) {
    if (!db) throw new Error('Firebase not initialized')
    
    const docRef = await db.collection(collection).add({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return { id: docRef.id, ...data }
  }

  // Update document
  static async updateDocument(collection: string, id: string, data: any) {
    if (!db) throw new Error('Firebase not initialized')
    
    await db.collection(collection).doc(id).update({
      ...data,
      updatedAt: new Date()
    })
    return { id, ...data }
  }

  // Delete document
  static async deleteDocument(collection: string, id: string) {
    if (!db) throw new Error('Firebase not initialized')
    
    await db.collection(collection).doc(id).delete()
    return { success: true }
  }

  // Search documents
  static async searchDocuments(
    collection: string,
    searchTerm: string,
    searchFields: string[],
    limit: number = 10
  ) {
    if (!db) throw new Error('Firebase not initialized')
    
    const results = []
    const snapshot = await db.collection(collection).limit(limit).get()
    
    for (const doc of snapshot.docs) {
      const data = doc.data()
      const searchableText = searchFields
        .map(field => data[field] || '')
        .join(' ')
        .toLowerCase()
      
      if (searchableText.includes(searchTerm.toLowerCase())) {
        results.push({ id: doc.id, ...data })
      }
    }
    
    return results
  }

  // Upload file to Firebase Storage
  static async uploadFile(
    file: Buffer,
    path: string,
    metadata?: any
  ) {
    if (!storage) throw new Error('Firebase Storage not initialized')
    
    const bucket = storage.bucket()
    const fileRef = bucket.file(path)
    
    await fileRef.save(file, {
      metadata: {
        contentType: metadata?.contentType || 'image/jpeg',
        ...metadata
      }
    })
    
    // Make file publicly accessible
    await fileRef.makePublic()
    
    return {
      url: `https://storage.googleapis.com/${bucket.name}/${path}`,
      path: path,
      name: path.split('/').pop()
    }
  }

  // Delete file from Firebase Storage
  static async deleteFile(path: string) {
    if (!storage) throw new Error('Firebase Storage not initialized')
    
    const bucket = storage.bucket()
    const fileRef = bucket.file(path)
    
    try {
      await fileRef.delete()
      return { success: true }
    } catch (error) {
      console.error('Error deleting file:', error)
      return { success: false, error }
    }
  }
}

export default app