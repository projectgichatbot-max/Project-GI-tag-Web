/**
 * seed-artisans.js
 * 
 * Creates 27 artisan documents in MongoDB Atlas (one per GI product),
 * uploads portrait images to Cloudinary, and links them to products.
 * 
 * Safe to re-run: uses upsert by name — existing artisans are preserved/updated.
 * 
 * Run: node scripts/seed-artisans.js
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

// ─── DNS Fallback (fixes SRV lookup failures on some networks) ────────────────
import dns from 'dns'
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4'])

import mongoose from 'mongoose'
import { v2 as cloudinary } from 'cloudinary'
import https from 'https'
import http from 'http'

// ─── Cloudinary Config ────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// ─── Mongoose Artisan Schema ─────────────────────────────────────────────────
const ArtisanSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  village: { type: String, required: true },
  district: { type: String, required: true },
  region: { type: String, required: true },
  specialization: { type: String, required: true },
  experience: { type: String, required: true },
  bio: { type: String, required: true },
  image: { type: String, required: true },
  cloudinaryPublicId: { type: String, required: true },
  products: [{ type: String }],
  skills: [{ type: String }],
  achievements: [{ type: String }],
  featured: { type: Boolean, default: false },
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 0 },
  contact: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
    whatsapp: { type: String },
    address: { type: String, required: true }
  },
  workshopsOffered: [{
    title: { type: String },
    duration: { type: String },
    description: { type: String },
    maxParticipants: { type: Number, default: 10 },
    available: { type: Boolean, default: true }
  }],
  availability: { type: String, required: true },
  languages: [{ type: String }],
  certifications: [{ type: String }],
  socialImpact: {
    familiesSupported: { type: Number, default: 0 },
    studentsTrained: { type: Number, default: 0 },
    culturalEvents: { type: Number, default: 0 },
    communityProjects: { type: Number, default: 0 }
  },
  testimonials: [mongoose.Schema.Types.Mixed],
  gallery: [{ type: String }],
  cloudinaryGalleryIds: [{ type: String }],
  socialMedia: { type: mongoose.Schema.Types.Mixed, default: {} },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true }
  },
  tags: [{ type: String }],
  keywords: [{ type: String }],
}, { timestamps: true })

const Artisan = mongoose.models?.Artisan || mongoose.model('Artisan', ArtisanSchema)

// ─── Product Schema (for linking) ────────────────────────────────────────────
const ProductSchema = new mongoose.Schema({
  name: String,
  artisan: mongoose.Schema.Types.Mixed,
}, { strict: false, timestamps: true })

const Product = mongoose.models?.Product || mongoose.model('Product', ProductSchema)

// ─── Real human portrait URLs from randomuser.me ─────────────────────────────
// randomuser.me provides actual photos of real-looking people
// Using gender-appropriate portraits for each artisan
const ARTISAN_PORTRAITS = {
  // Female artisans (women/)
  'ganga-devi-negi':    'https://randomuser.me/api/portraits/women/44.jpg',
  'kamala-devi':        'https://randomuser.me/api/portraits/women/62.jpg',
  'sunita-rawat':       'https://randomuser.me/api/portraits/women/47.jpg',
  'tara-devi-bhotiya':  'https://randomuser.me/api/portraits/women/72.jpg',
  'meena-bisht':        'https://randomuser.me/api/portraits/women/55.jpg',
  'pushpa-devi':        'https://randomuser.me/api/portraits/women/68.jpg',
  'chandra-bala':       'https://randomuser.me/api/portraits/women/33.jpg',
  'rekha-devi-bisht':   'https://randomuser.me/api/portraits/women/29.jpg',
  'savita-arya':        'https://randomuser.me/api/portraits/women/51.jpg',
  'anita-devi':         'https://randomuser.me/api/portraits/women/40.jpg',
  'leela-devi':         'https://randomuser.me/api/portraits/women/76.jpg',
  'kamla-singh':        'https://randomuser.me/api/portraits/women/38.jpg',
  'priya-negi':         'https://randomuser.me/api/portraits/women/26.jpg',
  // Male artisans (men/)
  'harish-chandra-rawat':  'https://randomuser.me/api/portraits/men/52.jpg',
  'rajesh-negi':           'https://randomuser.me/api/portraits/men/35.jpg',
  'mohan-lal-bisht':       'https://randomuser.me/api/portraits/men/67.jpg',
  'bhupendra-singh':       'https://randomuser.me/api/portraits/men/41.jpg',
  'devendra-tamta':        'https://randomuser.me/api/portraits/men/57.jpg',
  'girish-semwal':         'https://randomuser.me/api/portraits/men/43.jpg',
  'pratap-singh-rawat':    'https://randomuser.me/api/portraits/men/61.jpg',
  'ratan-singh-karki':     'https://randomuser.me/api/portraits/men/74.jpg',
  'vinod-kumar-sharma':    'https://randomuser.me/api/portraits/men/28.jpg',
  'surender-singh-negi':   'https://randomuser.me/api/portraits/men/36.jpg',
  'jagdish-prasad':        'https://randomuser.me/api/portraits/men/49.jpg',
  'dinesh-kumar':          'https://randomuser.me/api/portraits/men/22.jpg',
  'bharat-singh':          'https://randomuser.me/api/portraits/men/65.jpg',
  'sohan-lal':             'https://randomuser.me/api/portraits/men/79.jpg',
}

// ─── Helper: upload portrait to Cloudinary ───────────────────────────────────
// Always overwrites — ensures landscape photos are replaced with portraits
async function uploadArtisanImage(slug) {
  const publicId = `uttarakhand-heritage/artisans/${slug}`
  const portraitUrl = ARTISAN_PORTRAITS[slug]

  if (!portraitUrl) {
    // Fallback for any unregistered slug
    const fallbackUrl = `https://randomuser.me/api/portraits/men/50.jpg`
    return { url: fallbackUrl, publicId }
  }

  try {
    // overwrite: true ensures we REPLACE any existing wrong (landscape) image
    const result = await cloudinary.uploader.upload(portraitUrl, {
      public_id: publicId,
      overwrite: true,
      invalidate: true,
      transformation: [
        { width: 400, height: 400, crop: 'fill', quality: 'auto:best', gravity: 'face' },
        { format: 'webp' }
      ],
      resource_type: 'image',
    })
    console.log(`   ✅ Portrait uploaded: ${slug}`)
    return { url: result.secure_url, publicId: result.public_id }
  } catch (err) {
    console.error(`   ❌ Cloudinary upload failed for ${slug}:`, err.message)
    // Fallback: store the randomuser.me URL directly
    return { url: portraitUrl, publicId }
  }
}

// ─── All 27 Artisans Data ────────────────────────────────────────────────────
const artisansData = [
  {
    slug: 'ganga-devi-negi',
    name: 'Ganga Devi Negi',
    village: 'Gopeshwar',
    district: 'Chamoli',
    region: 'Garhwal',
    specialization: 'Tejpat Cultivation',
    experience: '28 years',
    featured: false,
    rating: 4.7,
    reviewsCount: 82,
    bio: 'Ganga Devi Negi is a renowned Tejpat cultivator from the pristine forests of Chamoli. She has spent nearly three decades mastering the sustainable harvesting of Cinnamomum tamala, working in harmony with the Himalayan ecosystem. Her practices combine traditional knowledge passed down by her grandmothers with modern organic certification methods.',
    skills: ['Tejpat Cultivation', 'Sustainable Harvesting', 'Ayurvedic Knowledge', 'Organic Farming'],
    achievements: ['GI Registration Holder for Uttarakhand Tejpat', 'State Organic Farmer Award 2019', 'Heritage Preserver Award 2022'],
    contact: {
      phone: '+91-9412345601',
      email: 'ganga.negi@example.com',
      whatsapp: '+91-9412345601',
      address: 'Gopeshwar Village, Chamoli District, Uttarakhand'
    },
    workshopsOffered: [
      {
        title: 'Sustainable Herb Harvesting',
        duration: '1 day',
        description: 'Learn traditional sustainable harvesting methods for mountain herbs',
        maxParticipants: 12,
        available: true
      }
    ],
    availability: 'Available for workshops and farm visits',
    languages: ['Hindi', 'Garhwali', 'English'],
    certifications: ['Organic Farming Certification', 'GI Product Grower'],
    socialImpact: { familiesSupported: 18, studentsTrained: 95, culturalEvents: 8, communityProjects: 5 },
    location: { latitude: 30.3523, longitude: 79.3262, address: 'Gopeshwar, Chamoli' },
    tags: ['tejpat', 'herbs', 'organic', 'garhwal', 'cultivation'],
    keywords: ['tejpat', 'bay leaves', 'spice', 'chamoli', 'organic farmer', 'ganga devi'],
    productName: 'Uttarakhand Tejpat',
  },
  {
    slug: 'harish-chandra-rawat',
    name: 'Harish Chandra Rawat',
    village: 'Majra',
    district: 'Dehradun',
    region: 'Garhwal',
    specialization: 'Basmati Rice Cultivation',
    experience: '32 years',
    featured: false,
    rating: 4.8,
    reviewsCount: 167,
    bio: 'Harish Chandra Rawat leads a progressive basmati farming cooperative in Dehradun\'s fertile valleys. With over three decades of experience, he has mastered the art of cultivating long-grain aromatic Basmati rice using traditional and scientific methods. His cooperative supports 40+ farming families.',
    skills: ['Basmati Cultivation', 'Rice Processing', 'Cooperative Management', 'Quality Control'],
    achievements: ['Best Farmer Award 2020', 'Cooperative Leader Excellence', 'GI Certification Champion'],
    contact: {
      phone: '+91-9412345602',
      email: 'harish.rawat@example.com',
      whatsapp: '+91-9412345602',
      address: 'Majra Village, Dehradun, Uttarakhand'
    },
    workshopsOffered: [
      {
        title: 'Traditional Basmati Farming Methods',
        duration: '2 days',
        description: 'Experience the complete cycle of Basmati cultivation',
        maxParticipants: 15,
        available: true
      }
    ],
    availability: 'Available during non-harvest season',
    languages: ['Hindi', 'Garhwali', 'English'],
    certifications: ['Basmati GI Producer', 'APEDA Certified'],
    socialImpact: { familiesSupported: 42, studentsTrained: 280, culturalEvents: 15, communityProjects: 12 },
    location: { latitude: 30.3165, longitude: 78.0322, address: 'Majra, Dehradun' },
    tags: ['basmati', 'rice', 'dehradun', 'farming', 'cooperative'],
    keywords: ['basmati rice', 'dehradun', 'aromatic rice', 'farmer', 'harish rawat'],
    productName: 'Basmati Rice',
  },
  {
    slug: 'kamala-devi',
    name: 'Kamala Devi',
    village: 'Almora',
    district: 'Almora',
    region: 'Kumaon',
    specialization: 'Aipan Art',
    experience: '30+ years',
    featured: true,
    rating: 4.9,
    reviewsCount: 89,
    bio: 'Kamala Devi learned the sacred art of Aipan from her grandmother when she was just 12 years old. Over three decades, she has mastered the intricate geometric patterns that hold deep spiritual significance in Kumaoni culture. She has dedicated her life to preserving this traditional art form and has trained over 50 women in her community.',
    skills: ['Aipan Pattern Design', 'Rice Paste Preparation', 'Sacred Geometry', 'Cultural Preservation', 'Community Teaching'],
    achievements: ['Master Craftsperson Award 2020', 'Cultural Heritage Preserver Award', 'UNESCO Cultural Ambassador', 'National Art Exhibition'],
    contact: {
      phone: '+91-9412345603',
      email: 'kamala.aipan@example.com',
      whatsapp: '+91-9412345603',
      address: 'Almora Town, Almora District, Uttarakhand'
    },
    workshopsOffered: [
      {
        title: 'Introduction to Aipan Art',
        duration: '2 days',
        description: 'Learn the basics of traditional Aipan geometric patterns and rice paste technique',
        maxParticipants: 10,
        available: true
      },
      {
        title: 'Advanced Aipan Pattern Techniques',
        duration: '3 days',
        description: 'Advanced course in sacred geometry and festival decoration patterns',
        maxParticipants: 8,
        available: true
      }
    ],
    availability: 'Available for workshops and cultural demonstrations',
    languages: ['Hindi', 'Kumaoni', 'English'],
    certifications: ['Master Artisan Certification', 'GI Product Creator'],
    socialImpact: { familiesSupported: 15, studentsTrained: 56, culturalEvents: 22, communityProjects: 9 },
    location: { latitude: 29.5918, longitude: 79.6531, address: 'Almora Town, Almora' },
    tags: ['aipan', 'art', 'traditional', 'sacred', 'kumaon'],
    keywords: ['aipan art', 'geometric patterns', 'almora', 'traditional art', 'kamala devi'],
    productName: 'Aipan Art',
  },
  {
    slug: 'rajesh-negi',
    name: 'Rajesh Negi',
    village: 'Munsiyari',
    district: 'Pithoragarh',
    region: 'Kumaon',
    specialization: 'Organic Farming',
    experience: '25 years',
    featured: true,
    rating: 4.8,
    reviewsCount: 124,
    bio: 'Rajesh Negi has been practicing organic farming in the high altitudes of Munsiyari for over two decades. He leads a collective of 15 farming families who grow Rajma using traditional methods, maintaining seed purity and organic practices at elevations above 2,200 meters.',
    skills: ['Organic Farming', 'Seed Preservation', 'High-Altitude Agriculture', 'Cooperative Leadership'],
    achievements: ['GI Certification for Munsiyari Rajma', 'Best Farmer Group 2021', 'Organic Pioneer Award', 'Seed Conservation Award'],
    contact: {
      phone: '+91-9412345604',
      email: 'rajesh.negi@example.com',
      whatsapp: '+91-9412345604',
      address: 'Munsiyari Village, Pithoragarh District, Uttarakhand'
    },
    workshopsOffered: [
      {
        title: 'High-Altitude Organic Farming',
        duration: '3 days',
        description: 'Experience traditional rajma cultivation at 2200m altitude',
        maxParticipants: 10,
        available: true
      }
    ],
    availability: 'Available for workshops and consultations',
    languages: ['Hindi', 'Kumaoni', 'English'],
    certifications: ['Organic Farming Certificate', 'GI Product Grower'],
    socialImpact: { familiesSupported: 25, studentsTrained: 150, culturalEvents: 12, communityProjects: 8 },
    location: { latitude: 30.0668, longitude: 80.2456, address: 'Munsiyari Village, Pithoragarh' },
    tags: ['organic', 'farming', 'rajma', 'kumaon', 'high-altitude'],
    keywords: ['rajma', 'kidney beans', 'organic farming', 'munsiyari', 'rajesh negi'],
    productName: 'Munsiyari White Kidney Beans (Rajma)',
  },
  {
    slug: 'mohan-lal-bisht',
    name: 'Mohan Lal Bisht',
    village: 'Uttarkashi',
    district: 'Uttarkashi',
    region: 'Garhwal',
    specialization: 'Ringal Bamboo Craft',
    experience: '35+ years',
    featured: false,
    rating: 4.7,
    reviewsCount: 156,
    bio: 'Third-generation Ringal craftsman Mohan Lal Bisht has innovated traditional bamboo weaving designs while preserving authenticity. He leads a cooperative of 20 artisans and exports their beautiful eco-friendly products across India.',
    skills: ['Ringal Bamboo Weaving', 'Basket Making', 'Traditional Tools', 'Cooperative Management', 'Export Quality Crafting'],
    achievements: ['Innovation in Traditional Craft Award', 'Cooperative Leader Recognition', 'Export Quality Certification', 'Best Artisan 2022'],
    contact: {
      phone: '+91-9412345605',
      email: 'mohan.ringaal@example.com',
      whatsapp: '+91-9412345605',
      address: 'Uttarkashi Town, Uttarkashi District, Uttarakhand'
    },
    workshopsOffered: [
      {
        title: 'Ringal Bamboo Craft Basics',
        duration: '2 days',
        description: 'Learn traditional weaving techniques using Himalayan bamboo',
        maxParticipants: 12,
        available: true
      }
    ],
    availability: 'Available for workshops and demonstrations',
    languages: ['Hindi', 'Garhwali'],
    certifications: ['Master Artisan', 'Export Quality Certified'],
    socialImpact: { familiesSupported: 20, studentsTrained: 80, culturalEvents: 10, communityProjects: 6 },
    location: { latitude: 30.7261, longitude: 78.4432, address: 'Uttarkashi Town, Uttarkashi' },
    tags: ['ringal', 'bamboo', 'craft', 'garhwal', 'eco-friendly'],
    keywords: ['ringal craft', 'bamboo weaving', 'basket', 'uttarkashi', 'mohan lal bisht'],
    productName: 'Ringal Craft',
  },
  {
    slug: 'sunita-rawat',
    name: 'Sunita Rawat',
    village: 'Chamoli',
    district: 'Chamoli',
    region: 'Garhwal',
    specialization: 'Woolen Blanket Weaving',
    experience: '22 years',
    featured: false,
    rating: 4.6,
    reviewsCount: 203,
    bio: 'Sunita Rawat is an expert in traditional wool processing and weaving techniques from the Garhwal region. She revived ancient patterns and natural colors used by mountain communities for centuries, creating beautiful Thulma blankets prized for warmth and artistry.',
    skills: ['Wool Processing', 'Traditional Weaving', 'Natural Dyeing', 'Pattern Design', 'Loom Operation'],
    achievements: ['Traditional Pattern Revival Award', 'Women Empowerment Leader', 'Quality Excellence Award 2021'],
    contact: {
      phone: '+91-9412345606',
      email: 'sunita.wool@example.com',
      whatsapp: '+91-9412345606',
      address: 'Chamoli Town, Chamoli District, Uttarakhand'
    },
    workshopsOffered: [
      {
        title: 'Traditional Wool Processing and Weaving',
        duration: '3 days',
        description: 'Experience the complete process from raw wool to finished blanket',
        maxParticipants: 8,
        available: true
      }
    ],
    availability: 'Available for workshops and cultural tours',
    languages: ['Hindi', 'Garhwali'],
    certifications: ['Master Weaver Certificate', 'Handicraft Board Registered'],
    socialImpact: { familiesSupported: 12, studentsTrained: 65, culturalEvents: 14, communityProjects: 7 },
    location: { latitude: 30.4078, longitude: 79.3224, address: 'Chamoli Town, Chamoli' },
    tags: ['wool', 'weaving', 'thulma', 'blanket', 'garhwal'],
    keywords: ['thulma blanket', 'woolen textiles', 'chamoli', 'weaving', 'sunita rawat'],
    productName: 'Thulma Blanket',
  },
  {
    slug: 'tara-devi-bhotiya',
    name: 'Tara Devi Bhotiya',
    village: 'Dharchula',
    district: 'Pithoragarh',
    region: 'Kumaon',
    specialization: 'Bhotiya Rug Weaving',
    experience: '40+ years',
    featured: true,
    rating: 4.8,
    reviewsCount: 45,
    bio: 'A living legend of the Bhotiya community, Tara Devi preserves the ancient rug weaving traditions of her tribe. With over four decades of practice, she maintains traditional looms and natural dyeing techniques, creating Bhotiya Dann rugs that tell stories of Himalayan heritage.',
    skills: ['Traditional Loom Weaving', 'Natural Dyeing', 'Tribal Pattern Design', 'Wool Processing', 'Heritage Preservation'],
    achievements: ['Tribal Heritage Preservation Award', 'Natural Dyeing Expert Recognition', 'Community Collective Award 2020'],
    contact: {
      phone: '+91-9412345607',
      email: 'tara.bhotiya@example.com',
      whatsapp: '+91-9412345607',
      address: 'Dharchula, Pithoragarh District, Uttarakhand'
    },
    workshopsOffered: [
      {
        title: 'Bhotiya Weaving Traditions',
        duration: '4 days',
        description: 'Immersive workshop in traditional Bhotiya tribal weaving patterns',
        maxParticipants: 6,
        available: true
      }
    ],
    availability: 'Available for workshops and tribal cultural experiences',
    languages: ['Hindi', 'Kumaoni', 'Bhotiya'],
    certifications: ['Tribal Artisan Certification', 'Heritage Craft Master'],
    socialImpact: { familiesSupported: 22, studentsTrained: 45, culturalEvents: 18, communityProjects: 6 },
    location: { latitude: 29.8597, longitude: 80.5313, address: 'Dharchula, Pithoragarh' },
    tags: ['bhotiya', 'rug', 'tribal', 'weaving', 'kumaon'],
    keywords: ['bhotiya dann', 'rug', 'tribal weaving', 'pithoragarh', 'tara devi'],
    productName: 'Bhotiya Dann (Rug)',
  },
  {
    slug: 'bhupendra-singh',
    name: 'Bhupendra Singh',
    village: 'Ranikhet',
    district: 'Almora',
    region: 'Kumaon',
    specialization: 'Chiura Oil Extraction',
    experience: '20 years',
    featured: false,
    rating: 4.5,
    reviewsCount: 58,
    bio: 'Bhupendra Singh carries forward the traditional practice of extracting Chiura oil from Diploknema butyracea seeds using ancient wooden ghani (oil press) techniques. His cold-press methods preserve the natural properties that make this oil prized in Ayurvedic medicine.',
    skills: ['Cold Press Oil Extraction', 'Traditional Ghani Operation', 'Ayurvedic Knowledge', 'Seed Processing'],
    achievements: ['Traditional Oil Extractor Award', 'Ayurvedic Heritage Keeper', 'GI Product Producer'],
    contact: {
      phone: '+91-9412345608',
      email: 'bhupendra.chiura@example.com',
      whatsapp: '+91-9412345608',
      address: 'Ranikhet, Almora District, Uttarakhand'
    },
    workshopsOffered: [
      {
        title: 'Traditional Oil Extraction Methods',
        duration: '1 day',
        description: 'Experience the ancient wooden ghani oil pressing technique',
        maxParticipants: 15,
        available: true
      }
    ],
    availability: 'Available for demonstrations and consultations',
    languages: ['Hindi', 'Kumaoni'],
    certifications: ['Organic Producer Certificate', 'Ayurvedic Products Verified'],
    socialImpact: { familiesSupported: 8, studentsTrained: 35, culturalEvents: 6, communityProjects: 3 },
    location: { latitude: 29.6405, longitude: 79.4287, address: 'Ranikhet, Almora' },
    tags: ['chiura', 'oil', 'ayurvedic', 'kumaon', 'extraction'],
    keywords: ['chiura oil', 'chyura', 'ayurvedic oil', 'almora', 'bhupendra singh'],
    productName: 'Kumaon Chiura (Chyura) Oil',
  },
  {
    slug: 'devendra-tamta',
    name: 'Devendra Tamta',
    village: 'Almora',
    district: 'Almora',
    region: 'Kumaon',
    specialization: 'Tamta Copper Craft',
    experience: '25 years',
    featured: false,
    rating: 4.6,
    reviewsCount: 92,
    bio: 'Devendra Tamta is a master copper craftsman from the traditional Tamta community of Almora, known for their centuries-old copper-working heritage. He creates exquisite utensils, ceremonial vessels, and decorative items using traditional tools and techniques passed through generations.',
    skills: ['Copper Hammering', 'Traditional Engraving', 'Vessel Forming', 'Metal Finishing', 'Traditional Tool Use'],
    achievements: ['Tamta Community Heritage Award', 'State Handicraft Board Recognition', 'Traditional Craft Excellence 2021'],
    contact: {
      phone: '+91-9412345609',
      email: 'devendra.tamta@example.com',
      whatsapp: '+91-9412345609',
      address: 'Tamta Mohalla, Almora Town, Uttarakhand'
    },
    workshopsOffered: [
      {
        title: 'Copper Craft Traditional Methods',
        duration: '2 days',
        description: 'Learn hammering and forming techniques from a master Tamta craftsman',
        maxParticipants: 8,
        available: true
      }
    ],
    availability: 'Available for workshops and demonstrations',
    languages: ['Hindi', 'Kumaoni'],
    certifications: ['Handicraft Board Master Artisan', 'GI Product Creator'],
    socialImpact: { familiesSupported: 10, studentsTrained: 45, culturalEvents: 8, communityProjects: 4 },
    location: { latitude: 29.5918, longitude: 79.6531, address: 'Almora Town, Almora' },
    tags: ['copper', 'tamta', 'craft', 'kumaon', 'utensils'],
    keywords: ['tamta copper', 'copper craft', 'almora', 'utensils', 'devendra tamta'],
    productName: 'Copper Products (Tamta Craft)',
  },
  {
    slug: 'meena-bisht',
    name: 'Meena Bisht',
    village: 'Hawalbagh',
    district: 'Almora',
    region: 'Kumaon',
    specialization: 'Amaranth (Chaulai) Cultivation',
    experience: '18 years',
    featured: false,
    rating: 4.7,
    reviewsCount: 63,
    bio: 'Meena Bisht is a pioneering woman farmer specializing in Chaulai (Amaranth) cultivation in the hilly terrain of Almora. She has championed the revival of this ancient super-grain among local farming communities and developed innovative organic farming techniques suited to mountain conditions.',
    skills: ['Chaulai Cultivation', 'Organic Farming', 'Women\'s Self-Help Group Leadership', 'Seed Preservation'],
    achievements: ['Women Farmer Excellence Award', 'Organic Agriculture Pioneer', 'Community Development Leader 2022'],
    contact: {
      phone: '+91-9412345610',
      email: 'meena.bisht@example.com',
      whatsapp: '+91-9412345610',
      address: 'Hawalbagh, Almora District, Uttarakhand'
    },
    workshopsOffered: [
      {
        title: 'Amaranth Cultivation Workshop',
        duration: '1 day',
        description: 'Learn to grow and harvest protein-rich Chaulai grain',
        maxParticipants: 20,
        available: true
      }
    ],
    availability: 'Available for workshops and farm visits',
    languages: ['Hindi', 'Kumaoni'],
    certifications: ['Organic Farmer Certified', 'Women Agripreneur'],
    socialImpact: { familiesSupported: 14, studentsTrained: 82, culturalEvents: 7, communityProjects: 5 },
    location: { latitude: 29.6500, longitude: 79.6800, address: 'Hawalbagh, Almora' },
    tags: ['chaulai', 'amaranth', 'organic', 'kumaon', 'women-farmer'],
    keywords: ['chaulai', 'amaranth', 'ramdana', 'almora', 'meena bisht'],
    productName: 'Chaulai (Ramdana)',
  },
  {
    slug: 'pushpa-devi',
    name: 'Pushpa Devi',
    village: 'Kapkote',
    district: 'Bageshwar',
    region: 'Kumaon',
    specialization: 'Barnyard Millet Farming',
    experience: '24 years',
    featured: false,
    rating: 4.6,
    reviewsCount: 55,
    bio: 'Pushpa Devi is a dedicated millet farmer from Bageshwar district, preserving the traditional cultivation of Jhangora (Barnyard Millet) in high-altitude terraced fields. She is a vocal advocate for millet revival and leads a women\'s collective focused on traditional grain preservation.',
    skills: ['Jhangora Cultivation', 'Terraced Farming', 'Traditional Processing', 'Collective Leadership'],
    achievements: ['Millet Preservation Award', 'Women Leader in Agriculture', 'Traditional Crop Champion 2021'],
    contact: {
      phone: '+91-9412345611',
      email: 'pushpa.jhangora@example.com',
      whatsapp: '+91-9412345611',
      address: 'Kapkote Village, Bageshwar District, Uttarakhand'
    },
    workshopsOffered: [
      {
        title: 'Jhangora Millet Production',
        duration: '2 days',
        description: 'Traditional millet farming on Himalayan terraced fields',
        maxParticipants: 15,
        available: true
      }
    ],
    availability: 'Available for farm visits and educational workshops',
    languages: ['Hindi', 'Kumaoni'],
    certifications: ['Traditional Farmer Certification', 'Organic Producer'],
    socialImpact: { familiesSupported: 16, studentsTrained: 60, culturalEvents: 9, communityProjects: 4 },
    location: { latitude: 29.9500, longitude: 79.9700, address: 'Kapkote, Bageshwar' },
    tags: ['jhangora', 'millet', 'organic', 'kumaon', 'terraced-farming'],
    keywords: ['jhangora', 'barnyard millet', 'bageshwar', 'millet farming', 'pushpa devi'],
    productName: 'Jhangora (Barnyard Millet)',
  },
  {
    slug: 'girish-semwal',
    name: 'Girish Semwal',
    village: 'Bhatwari',
    district: 'Uttarkashi',
    region: 'Garhwal',
    specialization: 'Red Rice Cultivation',
    experience: '20 years',
    featured: false,
    rating: 4.7,
    reviewsCount: 78,
    bio: 'Girish Semwal is a passionate cultivator of Uttarakhand Lal Chawal (Red Rice) in the valleys of Uttarkashi. He leads the Bhagirathi Annapurna cooperative and has been instrumental in reviving traditional red rice varieties that were nearly lost to modern agriculture.',
    skills: ['Red Rice Cultivation', 'Traditional Seed Conservation', 'Cooperative Management', 'Organic Farming'],
    achievements: ['Red Rice Revival Award', 'Heritage Seed Preserver', 'Bhagirathi Cooperative Leader'],
    contact: {
      phone: '+91-9412345612',
      email: 'girish.semwal@example.com',
      whatsapp: '+91-9412345612',
      address: 'Bhatwari, Uttarkashi District, Uttarakhand'
    },
    workshopsOffered: [
      {
        title: 'Red Rice Traditional Farming',
        duration: '2 days',
        description: 'Learn the cultivation of heritage red rice varieties',
        maxParticipants: 12,
        available: true
      }
    ],
    availability: 'Available for workshops and farm demonstrations',
    languages: ['Hindi', 'Garhwali'],
    certifications: ['Organic Certified Farmer', 'Heritage Seed Keeper'],
    socialImpact: { familiesSupported: 20, studentsTrained: 75, culturalEvents: 10, communityProjects: 6 },
    location: { latitude: 30.9500, longitude: 78.7800, address: 'Bhatwari, Uttarkashi' },
    tags: ['lal-chawal', 'red-rice', 'organic', 'garhwal', 'seed-conservation'],
    keywords: ['lal chawal', 'red rice', 'uttarkashi', 'heritage rice', 'girish semwal'],
    productName: 'Uttarakhand Lal Chawal (Red Rice)',
  },
  {
    slug: 'pratap-singh-rawat',
    name: 'Pratap Singh Rawat',
    village: 'Pauri',
    district: 'Pauri Garhwal',
    region: 'Garhwal',
    specialization: 'Finger Millet Farming',
    experience: '26 years',
    featured: false,
    rating: 4.6,
    reviewsCount: 69,
    bio: 'Pratap Singh Rawat is a specialist in Mandua (Finger Millet) cultivation in the rugged hills of Pauri Garhwal. He champions the nutritional and cultural importance of this traditional grain and leads a farmer producer cooperative that supplies premium finger millet to urban markets.',
    skills: ['Mandua Cultivation', 'Traditional Processing', 'Multi-Crop Farming', 'Market Linkage'],
    achievements: ['Millet Farmer Excellence Award', 'Traditional Crop Preserver', 'Cooperative Formation Achievement'],
    contact: {
      phone: '+91-9412345613',
      email: 'pratap.rawat@example.com',
      whatsapp: '+91-9412345613',
      address: 'Pauri Town, Pauri Garhwal District, Uttarakhand'
    },
    workshopsOffered: [
      {
        title: 'Mandua Farming and Nutrition',
        duration: '1 day',
        description: 'Learn about this calcium-rich traditional grain and its cultivation',
        maxParticipants: 20,
        available: true
      }
    ],
    availability: 'Available for educational visits and workshops',
    languages: ['Hindi', 'Garhwali'],
    certifications: ['Traditional Farmer Certificate', 'Organic Millet Producer'],
    socialImpact: { familiesSupported: 18, studentsTrained: 88, culturalEvents: 8, communityProjects: 5 },
    location: { latitude: 30.1500, longitude: 78.7700, address: 'Pauri, Pauri Garhwal' },
    tags: ['mandua', 'finger-millet', 'organic', 'garhwal', 'nutrition'],
    keywords: ['mandua', 'finger millet', 'ragi', 'pauri garhwal', 'pratap rawat'],
    productName: 'Mandua (Finger Millet)',
  },
  {
    slug: 'chandra-bala',
    name: 'Chandra Bala',
    village: 'Takula',
    district: 'Almora',
    region: 'Kumaon',
    specialization: 'Chili Cultivation',
    experience: '22 years',
    featured: false,
    rating: 4.5,
    reviewsCount: 42,
    bio: 'Chandra Bala is the head of the Chokot Patti Farmers Producer Company, specializing in the cultivation of Almora Lakhori Mirchi, a distinctive local red chili variety. She has built a network of 30 chili-growing families in the Takula region, ensuring quality and authenticity.',
    skills: ['Chili Cultivation', 'Post-Harvest Processing', 'Quality Grading', 'Cooperative Leadership'],
    achievements: ['Women Entrepreneur in Agriculture Award', 'GI Chili Production Leader', 'Quality Producer Recognition'],
    contact: {
      phone: '+91-9412345614',
      email: 'chandra.bala@example.com',
      whatsapp: '+91-9412345614',
      address: 'Takula Village, Almora District, Uttarakhand'
    },
    workshopsOffered: [
      {
        title: 'Lakhori Mirchi Cultivation and Processing',
        duration: '1 day',
        description: 'Learn about the unique local chili variety and its cultivation',
        maxParticipants: 20,
        available: true
      }
    ],
    availability: 'Available for farm visits and consultations',
    languages: ['Hindi', 'Kumaoni'],
    certifications: ['GI Product Grower', 'Organic Spice Producer'],
    socialImpact: { familiesSupported: 30, studentsTrained: 95, culturalEvents: 6, communityProjects: 4 },
    location: { latitude: 29.7000, longitude: 79.7200, address: 'Takula, Almora' },
    tags: ['lakhori-mirchi', 'chili', 'spice', 'kumaon', 'women-farmer'],
    keywords: ['lakhori mirchi', 'chili', 'almora', 'spice', 'chandra bala'],
    productName: 'Almora Lakhori Mirchi',
  },
  {
    slug: 'ratan-singh-karki',
    name: 'Ratan Singh Karki',
    village: 'Berinag',
    district: 'Pithoragarh',
    region: 'Kumaon',
    specialization: 'High-Altitude Tea Cultivation',
    experience: '28 years',
    featured: false,
    rating: 4.7,
    reviewsCount: 94,
    bio: 'Ratan Singh Karki is a tea artisan from the renowned Berinag tea-growing belt at 1,650 meters elevation. Over 28 years, he has perfected the art of growing and hand-processing the distinctive Berinag tea, known for its muscatel notes and brisk flavour unique to the Kumaon Himalayas.',
    skills: ['Tea Cultivation', 'Hand-Rolling Tea', 'Fermentation Control', 'Quality Grading', 'Organic Methods'],
    achievements: ['Best Tea Producer Award', 'High-Altitude Tea Pioneer', 'GI Tea Certification'],
    contact: {
      phone: '+91-9412345615',
      email: 'ratan.karki@example.com',
      whatsapp: '+91-9412345615',
      address: 'Berinag, Pithoragarh District, Uttarakhand'
    },
    workshopsOffered: [
      {
        title: 'Tea Garden to Cup Experience',
        duration: '3 days',
        description: 'Witness tea cultivation, plucking, and traditional processing',
        maxParticipants: 10,
        available: true
      }
    ],
    availability: 'Available for tea garden tours and workshops',
    languages: ['Hindi', 'Kumaoni', 'English'],
    certifications: ['Organic Tea Producer', 'GI Tea Grower'],
    socialImpact: { familiesSupported: 22, studentsTrained: 110, culturalEvents: 12, communityProjects: 7 },
    location: { latitude: 29.9100, longitude: 80.0200, address: 'Berinag, Pithoragarh' },
    tags: ['berinag', 'tea', 'high-altitude', 'kumaon', 'organic'],
    keywords: ['berinag tea', 'uttarakhand tea', 'pithoragarh', 'high altitude tea', 'ratan karki'],
    productName: 'Uttarakhand Berinag Tea',
  },
  {
    slug: 'vinod-kumar-sharma',
    name: 'Vinod Kumar Sharma',
    village: 'Ramnagar',
    district: 'Nainital',
    region: 'Kumaon',
    specialization: 'Litchi Orcharding',
    experience: '30 years',
    featured: false,
    rating: 4.8,
    reviewsCount: 112,
    bio: 'Vinod Kumar Sharma is a third-generation litchi orchardist from Ramnagar, custodian of some of the oldest litchi trees in Kumaon. He manages a 5-acre family orchard producing the prized Ramnagar-Nainital Litchi, known for its exceptional sweetness and translucent flesh.',
    skills: ['Litchi Cultivation', 'Orchard Management', 'Post-Harvest Handling', 'Fruit Preservation'],
    achievements: ['Best Fruit Producer Award', 'Heritage Orchard Conservation', 'GI Litchi Certification'],
    contact: {
      phone: '+91-9412345616',
      email: 'vinod.sharma@example.com',
      whatsapp: '+91-9412345616',
      address: 'Ramnagar, Nainital District, Uttarakhand'
    },
    workshopsOffered: [
      {
        title: 'Litchi Orchard Visit and Harvesting',
        duration: '1 day',
        description: 'Experience litchi picking season and post-harvest handling',
        maxParticipants: 20,
        available: false
      }
    ],
    availability: 'Available during May-June harvest season',
    languages: ['Hindi', 'Kumaoni', 'English'],
    certifications: ['GI Litchi Producer', 'Horticulture Department Certified'],
    socialImpact: { familiesSupported: 12, studentsTrained: 55, culturalEvents: 8, communityProjects: 4 },
    location: { latitude: 29.3940, longitude: 79.1267, address: 'Ramnagar, Nainital' },
    tags: ['litchi', 'fruit', 'nainital', 'kumaon', 'orcharding'],
    keywords: ['ramnagar litchi', 'nainital litchi', 'litchi', 'fruit', 'vinod sharma'],
    productName: 'Ramnagar Nainital Litchi',
  },
  {
    slug: 'rekha-devi-bisht',
    name: 'Rekha Devi Bisht',
    village: 'Ramgarh',
    district: 'Nainital',
    region: 'Kumaon',
    specialization: 'Peach Cultivation',
    experience: '18 years',
    featured: false,
    rating: 4.6,
    reviewsCount: 61,
    bio: 'Rekha Devi Bisht tends her family\'s peach orchards in the picturesque Ramgarh valley, known as the fruit bowl of Kumaon. Her orchard produces the renowned Ramgarh Nainital Aadu, prized for its fragrance and sweetness. She has become a leader in promoting the region\'s fruit heritage.',
    skills: ['Peach Cultivation', 'Orchard Management', 'Fruit Processing', 'Jam and Preserve Making'],
    achievements: ['Best Fruit Grower Nainital', 'Women Horticulture Leader', 'GI Peach Certification'],
    contact: {
      phone: '+91-9412345617',
      email: 'rekha.bisht@example.com',
      whatsapp: '+91-9412345617',
      address: 'Ramgarh, Nainital District, Uttarakhand'
    },
    workshopsOffered: [
      {
        title: 'Peach Orchard to Preserve',
        duration: '1 day',
        description: 'Visit the orchard, pick peaches, and learn traditional jam making',
        maxParticipants: 15,
        available: false
      }
    ],
    availability: 'Available during June-July harvest season',
    languages: ['Hindi', 'Kumaoni'],
    certifications: ['GI Peach Producer', 'Horticulture Certified'],
    socialImpact: { familiesSupported: 8, studentsTrained: 35, culturalEvents: 5, communityProjects: 3 },
    location: { latitude: 29.4600, longitude: 79.4600, address: 'Ramgarh, Nainital' },
    tags: ['peach', 'aadu', 'fruit', 'kumaon', 'orcharding'],
    keywords: ['ramgarh peach', 'aadu', 'nainital fruit', 'peach', 'rekha bisht'],
    productName: 'Ramgarh Nainital Aadu (Peach)',
  },
  {
    slug: 'surender-singh-negi',
    name: 'Surender Singh Negi',
    village: 'Lansdowne',
    district: 'Pauri Garhwal',
    region: 'Garhwal',
    specialization: 'Citrus Fruit Cultivation',
    experience: '22 years',
    featured: false,
    rating: 4.5,
    reviewsCount: 50,
    bio: 'Surender Singh Negi cultivates the prized Uttarakhand Malta orange in the mild climate of the Garhwal foothills. His orchards produce the distinctively flavored Malta citrus fruit, known for extraordinary Vitamin C content. He is active in promoting this underrepresented local fruit variety.',
    skills: ['Citrus Cultivation', 'Malta Variety Propagation', 'Organic Pest Management', 'Juice Processing'],
    achievements: ['Malta Fruit Pioneer Award', 'Heritage Citrus Preserver', 'GI Malta Certification'],
    contact: {
      phone: '+91-9412345618',
      email: 'surender.negi@example.com',
      whatsapp: '+91-9412345618',
      address: 'Lansdowne, Pauri Garhwal, Uttarakhand'
    },
    workshopsOffered: [
      {
        title: 'Malta Citrus Orchard Experience',
        duration: '1 day',
        description: 'Visit the Malta orange orchard and learn about citrus cultivation',
        maxParticipants: 20,
        available: false
      }
    ],
    availability: 'Available December-February during harvest',
    languages: ['Hindi', 'Garhwali'],
    certifications: ['GI Malta Producer', 'Horticulture Certified'],
    socialImpact: { familiesSupported: 10, studentsTrained: 45, culturalEvents: 5, communityProjects: 3 },
    location: { latitude: 29.8371, longitude: 78.6868, address: 'Lansdowne, Pauri Garhwal' },
    tags: ['malta', 'citrus', 'fruit', 'garhwal', 'vitamin-c'],
    keywords: ['malta fruit', 'citrus', 'garhwal', 'uttarakhand malta', 'surender negi'],
    productName: 'Uttarakhand Malta Fruit',
  },
  {
    slug: 'jagdish-prasad',
    name: 'Jagdish Prasad',
    village: 'Gopeshwar',
    district: 'Chamoli',
    region: 'Garhwal',
    specialization: 'Pigeon Pea Farming',
    experience: '24 years',
    featured: false,
    rating: 4.6,
    reviewsCount: 76,
    bio: 'Jagdish Prasad leads the SEWA Koshish Kisaan Sahakarita, a farmer cooperative focused on growing Uttarakhand Pahari Toor Dal in the traditional hill farming systems of Chamoli and Tehri. His cooperative maintains traditional varieties while ensuring quality and fair prices for farmers.',
    skills: ['Pigeon Pea Cultivation', 'Dal Processing', 'Cooperative Management', 'Quality Control'],
    achievements: ['Best Cooperative Farmer Award', 'GI Dal Certification', 'SEWA Recognition 2021'],
    contact: {
      phone: '+91-9412345619',
      email: 'jagdish.prasad@example.com',
      whatsapp: '+91-9412345619',
      address: 'Gopeshwar, Chamoli District, Uttarakhand'
    },
    workshopsOffered: [
      {
        title: 'Traditional Pigeon Pea Farming',
        duration: '1 day',
        description: 'Learn about traditional dal production in the Garhwal hills',
        maxParticipants: 15,
        available: true
      }
    ],
    availability: 'Available for farm visits and workshops',
    languages: ['Hindi', 'Garhwali'],
    certifications: ['Traditional Farmer Certification', 'GI Dal Producer'],
    socialImpact: { familiesSupported: 28, studentsTrained: 120, culturalEvents: 10, communityProjects: 6 },
    location: { latitude: 30.3523, longitude: 79.3262, address: 'Gopeshwar, Chamoli' },
    tags: ['toor-dal', 'pigeon-pea', 'farming', 'garhwal', 'cooperative'],
    keywords: ['toor dal', 'pigeon pea', 'chamoli', 'hill farming', 'jagdish prasad'],
    productName: 'Uttarakhand Pahari Toor Dal',
  },
  {
    slug: 'savita-arya',
    name: 'Savita Arya',
    village: 'Bageshwar',
    district: 'Almora',
    region: 'Kumaon',
    specialization: 'Horse Gram Farming',
    experience: '20 years',
    featured: false,
    rating: 4.7,
    reviewsCount: 85,
    bio: 'Savita Arya is a dedicated cultivator of Uttarakhand Gahat (Horse Gram), working with farmer groups across the Kumaon and Garhwal highlands. She champions this nutritious but underappreciated lentil variety and has won recognition for her efforts in reviving traditional crop diversity.',
    skills: ['Gahat Cultivation', 'Traditional Processing', 'Women\'s Group Leadership', 'Organic Farming'],
    achievements: ['Women Farmer Champion Award', 'Heritage Crop Preservationist', 'Lentil Cultivation Excellence'],
    contact: {
      phone: '+91-9412345620',
      email: 'savita.arya@example.com',
      whatsapp: '+91-9412345620',
      address: 'Near Bageshwar, Almora District, Uttarakhand'
    },
    workshopsOffered: [
      {
        title: 'Gahat Horse Gram Workshop',
        duration: '1 day',
        description: 'Learn about this traditional protein-rich Himalayan lentil',
        maxParticipants: 20,
        available: true
      }
    ],
    availability: 'Available for farm visits and educational programs',
    languages: ['Hindi', 'Kumaoni'],
    certifications: ['Traditional Farmer Certificate', 'Organic Pulse Grower'],
    socialImpact: { familiesSupported: 18, studentsTrained: 95, culturalEvents: 8, communityProjects: 5 },
    location: { latitude: 29.8100, longitude: 79.8000, address: 'Near Bageshwar, Almora' },
    tags: ['gahat', 'horse-gram', 'lentil', 'kumaon', 'organic'],
    keywords: ['gahat', 'horse gram', 'lentil', 'almora', 'savita arya'],
    productName: 'Uttarakhand Gahat (Horse Gram)',
  },
  {
    slug: 'dinesh-kumar',
    name: 'Dinesh Kumar',
    village: 'Takula',
    district: 'Almora',
    region: 'Kumaon',
    specialization: 'Black Soybean Farming',
    experience: '16 years',
    featured: false,
    rating: 4.6,
    reviewsCount: 54,
    bio: 'Dinesh Kumar is a progressive farmer specializing in Uttarakhand Kala Bhat (Black Soybean) cultivation. He has developed innovative cultivation techniques that have improved yields while maintaining the traditional flavor profile of this nutritious black soybean variety.',
    skills: ['Black Soybean Cultivation', 'Organic Farming', 'Post-Harvest Processing', 'Market Development'],
    achievements: ['Innovative Farmer Award', 'Black Soybean Promotion Champion', 'GI Producer Recognition'],
    contact: {
      phone: '+91-9412345621',
      email: 'dinesh.kbhat@example.com',
      whatsapp: '+91-9412345621',
      address: 'Takula, Almora District, Uttarakhand'
    },
    workshopsOffered: [
      {
        title: 'Black Soybean Cultivation',
        duration: '1 day',
        description: 'Learn about this unique protein-rich traditional soybean variety',
        maxParticipants: 15,
        available: true
      }
    ],
    availability: 'Available for farm visits and consultations',
    languages: ['Hindi', 'Kumaoni'],
    certifications: ['Organic Soybean Producer', 'GI Product Grower'],
    socialImpact: { familiesSupported: 10, studentsTrained: 50, culturalEvents: 5, communityProjects: 3 },
    location: { latitude: 29.7000, longitude: 79.7200, address: 'Takula, Almora' },
    tags: ['kala-bhat', 'black-soybean', 'protein', 'kumaon', 'organic'],
    keywords: ['kala bhat', 'black soybean', 'protein', 'almora', 'dinesh kumar'],
    productName: 'Uttarakhand Kala Bhat',
  },
  {
    slug: 'anita-devi',
    name: 'Anita Devi',
    village: 'Ghat',
    district: 'Chamoli',
    region: 'Garhwal',
    specialization: 'Nettle Fabric Weaving',
    experience: '25 years',
    featured: false,
    rating: 4.5,
    reviewsCount: 38,
    bio: 'Anita Devi weaves traditional Bichhu Buti (Nettle) fabric using handlooms and ancient techniques passed down through her family. She is part of a small but dedicated community of weavers in Chamoli who transform wild Himalayan nettle plants into beautiful, sustainable textile fabric.',
    skills: ['Nettle Fiber Extraction', 'Handloom Weaving', 'Natural Dyeing', 'Traditional Textile Techniques'],
    achievements: ['Eco-Textile Pioneer Award', 'Sustainable Heritage Weaver', 'GI Nettle Fabric Certification'],
    contact: {
      phone: '+91-9412345622',
      email: 'anita.bichhu@example.com',
      whatsapp: '+91-9412345622',
      address: 'Ghat Village, Chamoli District, Uttarakhand'
    },
    workshopsOffered: [
      {
        title: 'Nettle Fabric: From Plant to Cloth',
        duration: '3 days',
        description: 'Immersive workshop on traditional nettle fiber extraction and weaving',
        maxParticipants: 8,
        available: true
      }
    ],
    availability: 'Available for workshops and demonstrations',
    languages: ['Hindi', 'Garhwali'],
    certifications: ['Eco-Textile Producer', 'Traditional Weaver Certificate'],
    socialImpact: { familiesSupported: 9, studentsTrained: 35, culturalEvents: 7, communityProjects: 3 },
    location: { latitude: 30.1000, longitude: 79.2000, address: 'Ghat, Chamoli' },
    tags: ['bichhu-buti', 'nettle', 'fabric', 'eco-textile', 'garhwal'],
    keywords: ['bichhu buti', 'nettle fabric', 'chamoli', 'eco textile', 'anita devi'],
    productName: 'Uttarakhand Bichhu Buti (Nettle) Fabric',
  },
  {
    slug: 'leela-devi',
    name: 'Leela Devi',
    village: 'Almora',
    district: 'Almora',
    region: 'Kumaon',
    specialization: 'Rangwali Pichhoda Shawl Weaving',
    experience: '30 years',
    featured: false,
    rating: 4.7,
    reviewsCount: 70,
    bio: 'Leela Devi is a master shawl weaver creating the iconic Rangwali Pichhoda — traditional colorful shawls of the Kumaon region. Her work preserves the distinctive patterns and color schemes used by women during festivals for centuries, and she has trained dozens of women weavers in her community.',
    skills: ['Shawl Weaving', 'Traditional Pattern Design', 'Natural Dyeing', 'Color Theory in Traditional Art'],
    achievements: ['Master Weaver Award', 'Rajya Shilp Sahitya Ratna', 'Women Heritage Artisan 2022'],
    contact: {
      phone: '+91-9412345623',
      email: 'leela.pichhoda@example.com',
      whatsapp: '+91-9412345623',
      address: 'Almora Town, Almora District, Uttarakhand'
    },
    workshopsOffered: [
      {
        title: 'Traditional Kumaoni Shawl Weaving',
        duration: '4 days',
        description: 'Learn the colorful patterns of Rangwali Pichhoda shawl weaving',
        maxParticipants: 8,
        available: true
      }
    ],
    availability: 'Available for workshops and cultural programs',
    languages: ['Hindi', 'Kumaoni'],
    certifications: ['Master Weaver Certificate', 'Handicraft Board Registered'],
    socialImpact: { familiesSupported: 15, studentsTrained: 72, culturalEvents: 16, communityProjects: 7 },
    location: { latitude: 29.5918, longitude: 79.6531, address: 'Almora Town, Almora' },
    tags: ['rangwali', 'pichhoda', 'shawl', 'weaving', 'kumaon'],
    keywords: ['rangwali pichhoda', 'shawl', 'kumaon textile', 'almora', 'leela devi'],
    productName: 'Rangwali Pichhoda (Kumaon)',
  },
  {
    slug: 'bharat-singh',
    name: 'Bharat Singh',
    village: 'Urgam',
    district: 'Chamoli',
    region: 'Garhwal',
    specialization: 'Wooden Mask Carving',
    experience: '28 years',
    featured: false,
    rating: 4.8,
    reviewsCount: 46,
    bio: 'Bharat Singh is a master wood carver from Urgam Valley, specializing in creating the sacred masks used in the Ramman festival — a UNESCO recognized Intangible Cultural Heritage. Each mask he carves represents a deity or character from ancient mythology and takes weeks of skilled craftsmanship.',
    skills: ['Traditional Wood Carving', 'Natural Paint Application', 'Ritual Mask Design', 'Sacred Iconography'],
    achievements: ['UNESCO Recognized Craftsman', 'Ramman Festival Cultural Keeper', 'State Shilpi Award', 'Heritage Preservation Excellence'],
    contact: {
      phone: '+91-9412345624',
      email: 'bharat.ramman@example.com',
      whatsapp: '+91-9412345624',
      address: 'Urgam Valley, Chamoli District, Uttarakhand'
    },
    workshopsOffered: [
      {
        title: 'Traditional Wooden Mask Carving',
        duration: '5 days',
        description: 'Learn the traditional art of carving Ramman festival masks',
        maxParticipants: 6,
        available: true
      }
    ],
    availability: 'Available for workshops (except during Ramman festival season)',
    languages: ['Hindi', 'Garhwali'],
    certifications: ['UNESCO Recognized Artisan', 'State Master Craftsman'],
    socialImpact: { familiesSupported: 12, studentsTrained: 42, culturalEvents: 25, communityProjects: 8 },
    location: { latitude: 30.5500, longitude: 79.4100, address: 'Urgam Valley, Chamoli' },
    tags: ['ramman', 'mask', 'wood-carving', 'chamoli', 'unesco'],
    keywords: ['ramman mask', 'wooden mask', 'chamoli', 'wood carving', 'bharat singh'],
    productName: 'Chamoli Wooden Ramman Mask',
  },
  {
    slug: 'sohan-lal',
    name: 'Sohan Lal',
    village: 'Bageshwar',
    district: 'Almora',
    region: 'Kumaon',
    specialization: 'Likhai Wood Carving',
    experience: '35 years',
    featured: false,
    rating: 4.6,
    reviewsCount: 62,
    bio: 'Sohan Lal is a master practitioner of Likhai — the traditional wood carving art of Kumaon. Over 35 years, he has carved intricate floral and geometric designs into doors, window frames, temples, and decorative panels that adorn heritage buildings across the region. His work preserves the architectural memory of Kumaon.',
    skills: ['Wood Carving', 'Architectural Detailing', 'Traditional Pattern Design', 'Wood Finishing', 'Tool Craft'],
    achievements: ['Master Wood Carver Award', 'Heritage Architecture Preserver', 'Shilp Guru Recognition'],
    contact: {
      phone: '+91-9412345625',
      email: 'sohan.likhai@example.com',
      whatsapp: '+91-9412345625',
      address: 'Near Bageshwar, Almora District, Uttarakhand'
    },
    workshopsOffered: [
      {
        title: 'Likhai Wood Carving Workshop',
        duration: '3 days',
        description: 'Learn traditional Kumaoni wood carving patterns and techniques',
        maxParticipants: 8,
        available: true
      }
    ],
    availability: 'Available for workshops and architectural consultations',
    languages: ['Hindi', 'Kumaoni'],
    certifications: ['Master Artisan Certification', 'Heritage Craft Keeper'],
    socialImpact: { familiesSupported: 10, studentsTrained: 58, culturalEvents: 12, communityProjects: 5 },
    location: { latitude: 29.8100, longitude: 79.8000, address: 'Near Bageshwar, Almora' },
    tags: ['likhai', 'wood-carving', 'kumaon', 'heritage', 'architectural'],
    keywords: ['likhai', 'wood carving', 'kumaon', 'traditional art', 'sohan lal'],
    productName: 'Uttarakhand Likhai (Wood Carving)',
  },
  {
    slug: 'kamla-singh',
    name: 'Kamla Singh',
    village: 'Ukhimath',
    district: 'Chamoli',
    region: 'Garhwal',
    specialization: 'Buransh Sharbat Production',
    experience: '16 years',
    featured: false,
    rating: 4.7,
    reviewsCount: 80,
    bio: 'Kamla Singh collects and processes Rhododendron (Buransh) flowers from pristine Himalayan forests to craft the traditional Buransh Sharbat. This fragrant, vibrant pink drink is Uttarakhand\'s distinctive state flower beverage. Kamla uses traditional stone-grinding methods and natural preservation techniques.',
    skills: ['Flower Processing', 'Natural Extraction', 'Traditional Sharbat Making', 'Quality Control'],
    achievements: ['Heritage Beverage Innovator', 'Women Entrepreneur Award', 'Buransh Sharbat Pioneer'],
    contact: {
      phone: '+91-9412345626',
      email: 'kamla.buransh@example.com',
      whatsapp: '+91-9412345626',
      address: 'Ukhimath, Chamoli District, Uttarakhand'
    },
    workshopsOffered: [
      {
        title: 'Buransh Flower Processing Experience',
        duration: '1 day',
        description: 'Learn traditional Buransh sharbat making from Rhododendron flowers',
        maxParticipants: 15,
        available: false
      }
    ],
    availability: 'Available March-April during Buransh bloom season',
    languages: ['Hindi', 'Garhwali'],
    certifications: ['Food Processing Certificate', 'Natural Products Verified'],
    socialImpact: { familiesSupported: 10, studentsTrained: 42, culturalEvents: 8, communityProjects: 4 },
    location: { latitude: 30.5000, longitude: 79.2500, address: 'Ukhimath, Chamoli' },
    tags: ['buransh', 'sharbat', 'rhododendron', 'garhwal', 'beverage'],
    keywords: ['buransh sharbat', 'rhododendron', 'chamoli', 'traditional beverage', 'kamla singh'],
    productName: 'Uttarakhand Buransh Sharbat',
  },
  {
    slug: 'priya-negi',
    name: 'Priya Negi',
    village: 'Nainital',
    district: 'Nainital',
    region: 'Kumaon',
    specialization: 'Handmade Candle Making',
    experience: '12 years',
    featured: false,
    rating: 4.5,
    reviewsCount: 45,
    bio: 'Priya Negi is a creative artisan and entrepreneur who has revitalized the traditional Mombatti (candle) crafting heritage of Nainital. She creates beautifully designed candles that blend traditional motifs with contemporary aesthetics, running a small workshop that trains local women in the craft.',
    skills: ['Candle Making', 'Natural Wax Crafting', 'Design and Decoration', 'Fragrance Blending', 'Quality Product Development'],
    achievements: ['Creative Artisan Award', 'Women Entrepreneur Recognition', 'Nainital Tourism Craft Excellence'],
    contact: {
      phone: '+91-9412345627',
      email: 'priya.candles@example.com',
      whatsapp: '+91-9412345627',
      address: 'Nainital Town, Nainital District, Uttarakhand'
    },
    workshopsOffered: [
      {
        title: 'Handmade Candle Making Workshop',
        duration: '1 day',
        description: 'Create your own decorative Nainital-style candles with traditional designs',
        maxParticipants: 20,
        available: true
      }
    ],
    availability: 'Available for workshops year-round',
    languages: ['Hindi', 'Kumaoni', 'English'],
    certifications: ['Artisan Craft Certificate', 'Women Entrepreneurship Certification'],
    socialImpact: { familiesSupported: 8, studentsTrained: 40, culturalEvents: 6, communityProjects: 3 },
    location: { latitude: 29.3919, longitude: 79.4542, address: 'Nainital Town, Nainital' },
    tags: ['mombatti', 'candle', 'nainital', 'handicraft', 'artisan'],
    keywords: ['mombatti', 'candle', 'nainital', 'handmade candle', 'priya negi'],
    productName: 'Nainital Mombatti (Candle)',
  },
]

// ─── Main Seeding Function ────────────────────────────────────────────────────
async function seedArtisans() {
  console.log('\n🌱 Starting artisan seeding...\n')
  console.log('📡 Connecting to MongoDB Atlas...')
  
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('✅ MongoDB connected\n')

  // Fetch all products to link artisans
  console.log('📦 Fetching existing products from DB...')
  const products = await Product.find({}).select('name artisan _id').lean()
  console.log(`   Found ${products.length} products\n`)

  const results = { created: 0, updated: 0, skipped: 0, errors: 0 }
  const allArtisanIds = []

  for (const artisanData of artisansData) {
    const { slug, productName, ...data } = artisanData
    
    try {
      process.stdout.write(`📸 Processing: ${data.name}...`)

      // Upload portrait image to Cloudinary (overwrite: true replaces wrong images)
      const { url: imageUrl, publicId } = await uploadArtisanImage(slug)

      // Find linked products (match by product name or artisan name in product)
      const linkedProducts = products.filter(p => {
        const nameMatch = p.name?.toLowerCase().includes(productName.toLowerCase().split(' ')[0]) ||
                         productName.toLowerCase().includes((p.name || '').toLowerCase().split(' ')[0])
        const artisanMatch = p.artisan?.name?.toLowerCase().includes(data.name.toLowerCase().split(' ')[0])
        return nameMatch || artisanMatch
      })
      
      const linkedProductIds = linkedProducts.map(p => p._id.toString())

      // Build full artisan doc
      const artisanDoc = {
        ...data,
        image: imageUrl,
        cloudinaryPublicId: publicId,
        products: linkedProductIds,
        gallery: [],
        cloudinaryGalleryIds: [],
        socialMedia: {},
        testimonials: [],
      }

      // Upsert by name (safe to re-run)
      const existing = await Artisan.findOne({ name: data.name })
      
      if (existing) {
        // Update image and products, preserve other existing data
        await Artisan.findByIdAndUpdate(existing._id, {
          image: imageUrl,
          cloudinaryPublicId: publicId,
          products: linkedProductIds.length > 0 ? linkedProductIds : existing.products,
          updatedAt: new Date()
        })
        allArtisanIds.push(existing._id.toString())
        results.updated++
        console.log(` ✏️  Updated`)
      } else {
        const newArtisan = await Artisan.create(artisanDoc)
        allArtisanIds.push(newArtisan._id.toString())
        results.created++
        console.log(` ✅ Created`)
      }
    } catch (err) {
      console.log(` ❌ Error: ${err.message}`)
      results.errors++
    }
  }

  console.log('\n📊 Seeding Complete!')
  console.log(`   ✅ Created: ${results.created} new artisans`)
  console.log(`   ✏️  Updated: ${results.updated} existing artisans`)
  console.log(`   ❌ Errors: ${results.errors}`)
  console.log(`\n🔢 Total artisans in DB: ${await Artisan.countDocuments({})}`)

  await mongoose.connection.close()
  console.log('\n🔒 MongoDB connection closed\n')
  process.exit(0)
}

seedArtisans().catch((err) => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
