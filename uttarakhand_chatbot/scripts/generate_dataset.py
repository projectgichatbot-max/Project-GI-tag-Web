import json
import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
OUTPUT_FILE = DATA_DIR / "master_gi_dataset.json"

# Master dataset containing 27 GI tags + Bal Mithai
master_dataset = [
    {
        "name": "Uttarakhand Tejpat",
        "category": "Agricultural Product",
        "region": "Chamoli, Uttarakhand",
        "description": "Organic aromatic bay leaves (Cinnamomum tamala) grown in the high-altitude regions of Chamoli district, Garhwal Himalayas. Known for their unique culinary aroma and medicinal properties.",
        "uses": [
            "Culinary spice and flavoring agent",
            "Traditional herbal teas",
            "Ayurvedic remedies and medicine"
        ],
        "examples": [
            "Aromatic flavor",
            "Medicinal properties",
            "Organically grown"
        ],
        "ingredients": [],
        "recipe": [],
        "registration": "Registration Number: 520, Date: 31 May 2016"
    },
    {
        "name": "Basmati Rice",
        "category": "Agricultural Product",
        "region": "Dehradun, Haridwar, Udham Singh Nagar",
        "description": "Premium aromatic long-grain rice variety with a distinctive fragrance, soft texture, and exceptional cooking quality, cultivated in the fertile Himalayan sub-tracts.",
        "uses": [
            "Staple food for daily meals",
            "Special occasion dishes (Biryani, Pulao)",
            "Festive sweets and offerings"
        ],
        "examples": [
            "Distinctive fragrance",
            "Long slender grains",
            "Soft texture after cooking"
        ],
        "ingredients": [],
        "recipe": [],
        "registration": "Registration Number: 145, Date: 18 Aug 2016"
    },
    {
        "name": "Aipan Art",
        "category": "Handicraft",
        "region": "Kumaon Region",
        "description": "Traditional ritualistic folk art painted by Kumaoni women, utilizing white rice paste (biswar) over a red ochre (geru) background to create geometric and symbolic patterns.",
        "uses": [
            "Ritual floor drawings for temples and entrances",
            "Wall decorations during festivals and weddings",
            "Auspicious ceremonies and home decor"
        ],
        "examples": [
            "Chowki paintings",
            "Decorative wall hangings",
            "Handmade festival cards"
        ],
        "ingredients": [],
        "recipe": [],
        "registration": "Registration Number: 837, Date: 2021"
    },
    {
        "name": "Munsyari Rajma",
        "category": "Agricultural Product",
        "region": "Munsyari, Pithoragarh district",
        "description": "Premium high-altitude white kidney beans grown organically in the pristine Munsyari valley. Famous for their rich taste, high protein content, and soft cooking texture.",
        "uses": [
            "Preparation of traditional Himalayan Rajma curry",
            "High-protein vegetarian dishes"
        ],
        "examples": [
            "High protein",
            "Rich taste",
            "Soft texture"
        ],
        "ingredients": [],
        "recipe": [],
        "registration": "Registration Number: 854, Date: 2023"
    },
    {
        "name": "Ringaal Craft",
        "category": "Handicraft",
        "region": "Kumaon Region (Almora, Bageshwar, Chamoli)",
        "description": "Traditional eco-friendly bamboo craft made using Ringaal bamboo (native Himalayan dwarf bamboo) using intricate weaving patterns passed down through generations.",
        "uses": [
            "Utility baskets and storage containers",
            "Decorative items and home accents",
            "Daily household articles"
        ],
        "examples": [
            "Woven basket",
            "Fruit tray",
            "Decorative lamp"
        ],
        "ingredients": [],
        "recipe": [],
        "registration": "Registration Number: 505, Date: 2015"
    },
    {
        "name": "Thulma Blanket",
        "category": "Textile",
        "region": "Chamoli, Uttarkashi",
        "description": "Thick, hand-spun and hand-woven woolen blanket featuring a soft, raised furry surface, created traditionally by the Bhotiya weavers of Uttarakhand.",
        "uses": [
            "Winter bedding and insulation in extreme cold",
            "Floor mats and traditional seating"
        ],
        "examples": [
            "Extra thick warmth",
            "Hand-spun mountain wool",
            "Soft furry texture"
        ],
        "ingredients": [],
        "recipe": [],
        "registration": "Registration Number: 508, Date: 2015"
    },
    {
        "name": "Bhotiya Dann (Rug)",
        "category": "Handicraft",
        "region": "Pithoragarh, Chamoli",
        "description": "Hand-knotted traditional woolen rug featuring intricate designs with Tibetan and Himalayan motifs, crafted by the Bhotiya tribal artisans.",
        "uses": [
            "Floor covering and warmth",
            "Decorative wall tapestries",
            "Aesthetic seating"
        ],
        "examples": [
            "Hand-knotted wool rug",
            "Decorative wall rug"
        ],
        "ingredients": [],
        "recipe": [],
        "registration": "Registration Number: 506, Date: 2015"
    },
    {
        "name": "Kumaon Chiura (Chyura) Oil",
        "category": "Agricultural Product",
        "region": "Kumaon Region",
        "description": "Organic butter/oil extracted from the seeds of the Kumaon butter tree (Diploknema butyracea), traditionally used as a local substitute for ghee.",
        "uses": [
            "Cooking fat and culinary uses",
            "Natural skin moisturizer and body butter",
            "Ayurvedic and therapeutic ointments",
            "Raw material for candle and soap making"
        ],
        "examples": [
            "Rich in chemical composition",
            "Acts as ghee substitute",
            "Organic butter"
        ],
        "ingredients": [],
        "recipe": [],
        "registration": "Registration Number: 838, Date: 2021"
    },
    {
        "name": "Copper Products (Tamta Craft)",
        "category": "Handicraft",
        "region": "Almora",
        "description": "Traditional copper utensils and ritual vessels crafted by the ancient Tamta copper artisans of Almora using hand-beating and engraving methods.",
        "uses": [
            "Storing drinking water (known for health benefits)",
            "Religious rituals and temple ceremonies",
            "Decorative kitchenware and utensils"
        ],
        "examples": [
            "Copper jug",
            "Traditional Gagar (water vessel)",
            "Pooja thali"
        ],
        "ingredients": [],
        "recipe": [],
        "registration": "Registration Number: 839, Date: 2021"
    },
    {
        "name": "Chaulai (Ramdana)",
        "category": "Agricultural Product",
        "region": "Garhwal and Kumaon Hills",
        "description": "Nutrient-dense Amaranth grain (Ramdana) grown organically on the hill slopes of Uttarakhand. High in protein, fiber, and gluten-free.",
        "uses": [
            "Preparation of nutritious daily porridge",
            "Traditional sweets (Chaulai Laddus)",
            "Nutritious food during fasts"
        ],
        "examples": [
            "Gluten-free",
            "Rich in protein",
            "High fiber"
        ],
        "ingredients": [],
        "recipe": [],
        "registration": "Registration Number: 840, Date: 2023"
    },
    {
        "name": "Jhangora (Barnyard Millet)",
        "category": "Agricultural Product",
        "region": "Garhwal Hills",
        "description": "Himalayan barnyard millet grown organically in the high-altitude fields. Famous for its low glycemic index, rich mineral content, and digestive benefits.",
        "uses": [
            "Nutritious daily breakfast porridge",
            "Traditional kheer dessert (Jhangore ki Kheer)",
            "Healthy gluten-free rice substitute"
        ],
        "examples": [
            "Low glycemic index",
            "Rich in minerals",
            "High fiber"
        ],
        "ingredients": [],
        "recipe": [],
        "registration": "Registration Number: 841, Date: 2023"
    },
    {
        "name": "Uttarakhand Lal Chawal (Red Rice)",
        "category": "Agricultural Product",
        "region": "Purola, Uttarkashi district",
        "description": "Indigenous red-grained rice variety cultivated organically in the Yamuna and Tons river valleys. Famous for its reddish bran layer, high iron content, and nutty taste.",
        "uses": [
            "Healthy dietary substitute for white rice",
            "Himalayan traditional meals"
        ],
        "examples": [
            "High iron content",
            "Reddish bran layer",
            "Nutty flavor"
        ],
        "ingredients": [],
        "recipe": [],
        "registration": "Registration Number: 842, Date: 2023"
    },
    {
        "name": "Mandua (Finger Millet)",
        "category": "Agricultural Product",
        "region": "Garhwal and Kumaon Hills",
        "description": "Nutrient-dense finger millet (Ragi) organically grown on mountain slopes. Exceptionally rich in calcium, iron, and fiber.",
        "uses": [
            "Preparing traditional flatbreads (Mandua ki Roti)",
            "Nutritious baby food formulations",
            "Local sweet recipes"
        ],
        "examples": [
            "High calcium and iron",
            "Rich in dietary fiber",
            "Gluten-free"
        ],
        "ingredients": [],
        "recipe": [],
        "registration": "Registration Number: 843, Date: 2023"
    },
    {
        "name": "Almora Lakhori Mirchi",
        "category": "Agricultural Product",
        "region": "Lakhori, Almora",
        "description": "Small, highly pungent yellow-colored chilli variety unique to the Lakhori region of Almora. Used as a flavoring agent in local cooking.",
        "uses": [
            "Spice powder and culinary flavoring",
            "Traditional pickles and hot sauces"
        ],
        "examples": [
            "High pungency",
            "Yellow color",
            "Small size"
        ],
        "ingredients": [],
        "recipe": [],
        "registration": "Registration Number: 844, Date: 2023"
    },
    {
        "name": "Uttarakhand Berinag Tea",
        "category": "Agricultural Product",
        "region": "Berinag, Pithoragarh",
        "description": "Premium Orthodox black tea variety harvested from the historic tea gardens of Berinag. Known for its rich aroma, color, and unique Himalayan flavor.",
        "uses": [
            "Refreshing daily beverage",
            "Healthy antioxidant-rich drink"
        ],
        "examples": [
            "Orthodox variety",
            "Rich aroma",
            "Unique tea liquor"
        ],
        "ingredients": [],
        "recipe": [],
        "registration": "Registration Number: 845, Date: 2023"
    },
    {
        "name": "Ramnagar Nainital Litchi",
        "category": "Agricultural Product",
        "region": "Ramnagar, Nainital district",
        "description": "Juicy, sweet, and highly aromatic litchi fruits grown in the fertile Terai-Bhabhar belt of Ramnagar. Features high pulp content and rich sweetness.",
        "uses": [
            "Direct fresh fruit consumption",
            "Production of juices, squashes, and preserves"
        ],
        "examples": [
            "Juicy pulp",
            "Rich sweetness",
            "Highly aromatic"
        ],
        "ingredients": [],
        "recipe": [],
        "registration": "Registration Number: 846, Date: 2023"
    },
    {
        "name": "Ramgarh Nainital Aadu (Peach)",
        "category": "Agricultural Product",
        "region": "Ramgarh, Nainital district",
        "description": "Juicy and extremely sweet peaches cultivated in the high-altitude orchards of Ramgarh fruit belt, known as the fruit bowl of Kumaon.",
        "uses": [
            "Direct fresh fruit consumption",
            "Jams, squashes, and fruit preserves"
        ],
        "examples": [
            "Extremely sweet",
            "Juicy texture",
            "Rich flavor"
        ],
        "ingredients": [],
        "recipe": [],
        "registration": "Registration Number: 847, Date: 2023"
    },
    {
        "name": "Uttarakhand Malta Fruit",
        "category": "Agricultural Product",
        "region": "Garhwal and Kumaon Hills",
        "description": "Organic citrus fruit rich in Vitamin C, widely grown on the terraced hill slopes. Known for its tangy-sweet flavor.",
        "uses": [
            "Fresh juice consumption",
            "Orange squashes and marmalades",
            "Traditional citrus salads (Malta Sanna)"
        ],
        "examples": [
            "Rich in Vitamin C",
            "Tangy-sweet taste",
            "Citrus aroma"
        ],
        "ingredients": [],
        "recipe": [],
        "registration": "Registration Number: 848, Date: 2023"
    },
    {
        "name": "Uttarakhand Pahari Toor Dal",
        "category": "Agricultural Product",
        "region": "Hill slopes of Uttarakhand",
        "description": "Pigeon peas grown organically on mountain slopes. Contains high protein, rich minerals, and cooks into a thick, delicious dal.",
        "uses": [
            "Preparation of traditional Pahari dal dishes",
            "High-protein vegetarian meals"
        ],
        "examples": [
            "High protein",
            "Rich minerals",
            "Cooks into a thick dal"
        ],
        "ingredients": [],
        "recipe": [],
        "registration": "Registration Number: 849, Date: 2023"
    },
    {
        "name": "Uttarakhand Gahat (Horse Gram)",
        "category": "Agricultural Product",
        "region": "Hill slopes of Uttarakhand",
        "description": "High-altitude horse gram variety widely known for its medicinal values, particularly for dissolving kidney stones and keeping the body warm in winter.",
        "uses": [
            "Medicinal dietary soups (Gahat Shorba)",
            "Traditional dal preparations",
            "Stuffed flatbreads (Gahat ki Stuffed Roti)"
        ],
        "examples": [
            "Medicinal value",
            "Dissolves kidney stones",
            "Body warming properties"
        ],
        "ingredients": [],
        "recipe": [],
        "registration": "Registration Number: 850, Date: 2023"
    },
    {
        "name": "Uttarakhand Kala Bhat",
        "category": "Agricultural Product",
        "region": "Garhwal and Kumaon Hills",
        "description": "Organic black soybean variety packed with proteins, iron, and antioxidants. A highly revered staple of traditional Kumaoni and Garhwali diets.",
        "uses": [
            "Preparation of Bhat ki Churkani (traditional gravy)",
            "Preparation of Chainsoo (ground soybean dish)"
        ],
        "examples": [
            "High protein",
            "Rich in iron",
            "Rich in antioxidants"
        ],
        "ingredients": [],
        "recipe": [],
        "registration": "Registration Number: 851, Date: 2023"
    },
    {
        "name": "Uttarakhand Bichhu Buti (Nettle) Fabric",
        "category": "Textile",
        "region": "Chamoli, Uttarkashi",
        "description": "Eco-friendly, highly durable textile woven from the natural bast fibers extracted from the stinging Himalayan nettle plant (Bichhu Ghas).",
        "uses": [
            "Eco-friendly garments and apparel",
            "Home furnishings and textiles",
            "Handicraft accessories and bags"
        ],
        "examples": [
            "Eco-friendly",
            "Highly durable bast fiber",
            "Breathable texture"
        ],
        "ingredients": [],
        "recipe": [],
        "registration": "Registration Number: 852, Date: 2023"
    },
    {
        "name": "Rangwali Pichhoda (Kumaon)",
        "category": "Textile",
        "region": "Kumaon Region",
        "description": "Traditional hand-dyed saffron/yellow Kumaoni dupatta adorned with a central swastika/deity motif and outer red polka dots, representing matrimonial auspiciousness.",
        "uses": [
            "Traditional wear for Kumaoni brides",
            "Auspicious religious and cultural ceremonies",
            "Festive celebrations"
        ],
        "examples": [
            "Saffron-yellow base",
            "Auspicious red polka dots",
            "Swastika motif"
        ],
        "ingredients": [],
        "recipe": [],
        "registration": "Registration Number: 853, Date: 2023"
    },
    {
        "name": "Chamoli Wooden Ramman Mask",
        "category": "Handicraft",
        "region": "Chamoli district",
        "description": "Hand-carved wooden masks representing various Hindu deities and characters, used specifically in the UNESCO-recognized Ramman religious ritual theatre of Chamoli.",
        "uses": [
            "Ramman festival performance masks",
            "Ritualistic religious objects",
            "Traditional wall decor and souvenirs"
        ],
        "examples": [
            "Deity mask (Rama/Ganesha)",
            "Mythological character mask"
        ],
        "ingredients": [],
        "recipe": [],
        "registration": "Registration Number: 855, Date: 2023"
    },
    {
        "name": "Uttarakhand Likhai (Wood Carving)",
        "category": "Handicraft",
        "region": "Kumaon Region",
        "description": "Exquisite style of traditional architectural wood carving on door frames, window panes, and lintels, featuring rich floral and geometrical motifs.",
        "uses": [
            "Traditional Kumaoni door frame ornamentations",
            "Decorative architectural panels",
            "Interior home decor and souvenirs"
        ],
        "examples": [
            "Carved door lintel",
            "Carved window panel frame",
            "Decorative wooden bracket"
        ],
        "ingredients": [],
        "recipe": [],
        "registration": "Registration Number: 856, Date: 2023"
    },
    {
        "name": "Uttarakhand Buransh Sharbat",
        "category": "Agricultural Product",
        "region": "Chamoli, Tehri",
        "description": "Refreshing floral syrup concentrate prepared from the crimson petals of the Rhododendron arboreum (Buransh), the state flower of Uttarakhand. Rich in antioxidants.",
        "uses": [
            "Refreshing beverage syrup",
            "Natural antioxidant drink"
        ],
        "examples": [
            "Antioxidant-rich",
            "Crimson color",
            "Refreshing beverage"
        ],
        "ingredients": [],
        "recipe": [],
        "registration": "Registration Number: 866, Date: 2023"
    },
    {
        "name": "Nainital Mombatti (Candle)",
        "category": "Handicraft",
        "region": "Nainital",
        "description": "Famous hand-molded decorative candles with unique colorful layers, floral structures, and traditional designs, produced by the artisans of Nainital.",
        "uses": [
            "Decorative illumination",
            "Souvenirs and gifting",
            "Festive celebrations"
        ],
        "examples": [
            "Layered multi-color candle",
            "Floral patterned candle",
            "Sculpted decorative candle"
        ],
        "ingredients": [],
        "recipe": [],
        "registration": "Registration Number: 868, Date: 2023"
    },
    {
        "name": "Bal Mithai",
        "category": "Food Product",
        "region": "Almora",
        "description": "Traditional sweet of Uttarakhand.",
        "uses": [
            "Festivals",
            "Gifts",
            "Traditional celebrations"
        ],
        "examples": [],
        "ingredients": [
            "Khoya",
            "Sugar",
            "Sugar balls"
        ],
        "recipe": [
            "Prepare khoya.",
            "Cook with sugar.",
            "Shape into bars.",
            "Coat with sugar balls."
        ],
        "registration": "Registered in 2023"
    }
]

# Ensure directory exists
DATA_DIR.mkdir(parents=True, exist_ok=True)

# Write output file
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(master_dataset, f, indent=2, ensure_ascii=False)

print(f"Master dataset successfully written with {len(master_dataset)} records.")
