"""
config.py — Central Configuration for Uttarakhand Chatbot

All constants, paths, tag definitions, and keyword mappings are defined here.
Modify this file to tune behaviour without touching core logic.
"""

import os
from pathlib import Path

# ─────────────────────────────────────────────
# Directory Paths
# ─────────────────────────────────────────────
BASE_DIR: Path = Path(__file__).resolve().parent
DATA_DIR: Path = BASE_DIR / "data"
CACHE_DIR: Path = BASE_DIR / "cache"
LOG_DIR: Path = BASE_DIR / "logs"
KNOWLEDGE_BASE_FILE: Path = DATA_DIR / "knowledge_base.json"

# Ensure directories exist at import time
for _dir in (DATA_DIR, CACHE_DIR, LOG_DIR):
    _dir.mkdir(parents=True, exist_ok=True)

# ─────────────────────────────────────────────
# FastAPI Settings
# ─────────────────────────────────────────────
FASTAPI_HOST: str = "0.0.0.0"
FASTAPI_PORT: int = 8001
CORS_ORIGINS: list[str] = [
    "http://localhost:3000",   # Next.js dev server
    "http://127.0.0.1:3000",
    "*",                       # Allow all during development
]

# ─────────────────────────────────────────────
# Supported Tags (16 categories)
# ─────────────────────────────────────────────
SUPPORTED_TAGS: list[str] = [
    "food",
    "festival",
    "tourism",
    "wildlife",
    "culture",
    "dance",
    "music",
    "history",
    "temple",
    "adventure",
    "district",
    "personality",
    "language",
    "craft",
    "flora",
    "fauna",
]

# ─────────────────────────────────────────────
# Tag → Keyword Mapping (for intent detection)
# Each tag maps to a list of related words/phrases.
# These are matched against lemmatised user tokens.
# ─────────────────────────────────────────────
TAG_KEYWORDS: dict[str, list[str]] = {
    "food": [
        "food", "dish", "recipe", "cuisine", "cook", "eat", "meal",
        "ingredient", "sweet", "snack", "breakfast", "lunch", "dinner",
        "delicacy", "prepare", "traditional food", "local food",
        "kafuli", "phaanu", "chainsoo", "bhatt", "dubuk",
        "singodi", "bal mithai", "jhangora", "mandua", "gahat",
        "aloo ke gutke", "kumaoni raita", "baadi", "kandalee ka saag",
        "roat", "arsa",
    ],
    "festival": [
        "festival", "celebration", "fair", "mela", "pooja", "puja",
        "ceremony", "ritual", "tradition", "celebrate", "festive",
        "kumbh", "harela", "phool dei", "ghee sankranti",
        "nanda devi raj jat", "uttarayani", "bissu", "bagwal",
        "makar sankranti", "basant panchami", "olgia",
    ],
    "tourism": [
        "tourism", "travel", "visit", "place", "destination",
        "sightseeing", "tourist", "trip", "tour", "attraction",
        "nainital", "mussoorie", "rishikesh", "haridwar", "dehradun",
        "auli", "chopta", "valley of flowers", "jim corbett",
        "ranikhet", "almora", "lansdowne", "mukteshwar", "kausani",
        "binsar", "pithoragarh", "chamoli",
    ],
    "wildlife": [
        "wildlife", "animal", "bird", "sanctuary", "national park",
        "species", "endangered", "conservation", "tiger", "leopard",
        "elephant", "deer", "musk deer", "snow leopard", "himalayan black bear",
        "corbett", "rajaji", "govind", "nanda devi biosphere",
        "kedarnath wildlife sanctuary",
    ],
    "culture": [
        "culture", "tradition", "custom", "heritage", "lifestyle",
        "folk", "art", "cultural", "pahari", "garhwali", "kumaoni",
        "wedding", "marriage", "ceremony", "social", "community",
    ],
    "dance": [
        "dance", "folk dance", "traditional dance", "dancing",
        "chholiya", "langvir nritya", "barada nati", "pandav nritya",
        "jhora", "chanchari", "chhapeli", "jhumelia", "mukhota",
        "harul", "thadiya",
    ],
    "music": [
        "music", "song", "folk song", "instrument", "musical",
        "singer", "melody", "tune", "dhol", "damau", "turri",
        "ransingha", "hurka", "hudka", "mashakbeen", "algoza",
        "folk music", "pahari song", "jagar",
    ],
    "history": [
        "history", "historical", "ancient", "kingdom", "dynasty",
        "ruler", "king", "queen", "war", "battle", "colonial",
        "british", "garhwal kingdom", "kumaon kingdom", "chand dynasty",
        "panwar dynasty", "tehri state", "independence",
    ],
    "temple": [
        "temple", "shrine", "mandir", "dham", "pilgrimage",
        "religious", "sacred", "deity", "god", "goddess",
        "kedarnath", "badrinath", "gangotri", "yamunotri",
        "char dham", "panch kedar", "panch prayag", "jageshwar",
        "baijnath", "tungnath", "neelkanth mahadev",
    ],
    "adventure": [
        "adventure", "trek", "trekking", "hiking", "rafting",
        "camping", "mountaineering", "skiing", "paragliding",
        "bungee", "climbing", "expedition", "trail",
        "roopkund", "kuari pass", "valley of flowers trek",
        "har ki dun", "brahmatal", "kedarkantha", "chandrashila",
        "dayara bugyal",
    ],
    "district": [
        "district", "city", "town", "region", "area",
        "tehsil", "block", "village", "capital",
        "dehradun", "haridwar", "nainital", "almora", "pithoragarh",
        "chamoli", "rudraprayag", "uttarkashi", "tehri garhwal",
        "pauri garhwal", "bageshwar", "champawat", "udham singh nagar",
    ],
    "personality": [
        "personality", "person", "leader", "freedom fighter",
        "celebrity", "famous", "notable", "poet", "writer",
        "politician", "activist", "hero",
        "gaura devi", "sunderlal bahuguna", "govind ballabh pant",
        "harak deo joshi", "sumitranandan pant", "ruskin bond",
        "nain singh rawat", "badri dutt pandey",
    ],
    "language": [
        "language", "dialect", "tongue", "speak", "script",
        "word", "phrase", "vocabulary",
        "garhwali", "kumaoni", "jaunsari", "hindi", "pahari",
    ],
    "craft": [
        "craft", "handicraft", "handloom", "weaving", "painting",
        "embroidery", "woodwork", "pottery", "artwork", "artisan",
        "ringaal", "aipan", "thulma", "wool", "shawl",
        "copper", "brass", "bamboo craft",
    ],
    "flora": [
        "flora", "plant", "tree", "flower", "herb",
        "botanical", "vegetation", "forest", "medicinal plant",
        "rhododendron", "buransh", "deodar", "oak", "pine",
        "brahma kamal", "saussurea", "orchid",
    ],
    "fauna": [
        "fauna", "animal", "bird", "insect", "reptile",
        "mammal", "fish", "butterfly", "species",
        "monal", "snow leopard", "himalayan tahr", "barking deer",
        "musk deer", "golden eagle", "cheer pheasant", "koklass",
    ],
}

# ─────────────────────────────────────────────
# Uttarakhand-related Contextual Keywords
# Used by the intent detector to confirm relevance.
# ─────────────────────────────────────────────
UTTARAKHAND_CONTEXT_KEYWORDS: list[str] = [
    "uttarakhand", "uttaranchal", "garhwal", "kumaon", "kumaoni",
    "garhwali", "pahari", "devbhoomi", "dev bhoomi",
    "gi tag", "gi tags", "gi product", "gi products", "geographical indication",
    # Major cities and districts
    "dehradun", "haridwar", "rishikesh", "nainital", "mussoorie",
    "almora", "pithoragarh", "chamoli", "rudraprayag", "uttarkashi",
    "tehri", "pauri", "bageshwar", "champawat", "udham singh nagar",
    # Famous places
    "kedarnath", "badrinath", "gangotri", "yamunotri", "auli",
    "roopkund", "valley of flowers", "jim corbett", "rajaji",
    "chopta", "tungnath", "kausani", "mukteshwar", "binsar",
    "ranikhet", "lansdowne",
    # Rivers
    "ganga", "yamuna", "alaknanda", "bhagirathi", "mandakini",
    "saryu", "kali", "ramganga", "tons",
]

# ─────────────────────────────────────────────
# Search Engine Settings
# ─────────────────────────────────────────────
SIMILARITY_THRESHOLD: float = 0.15      # Minimum cosine similarity to consider a match
MAX_SEARCH_RESULTS: int = 5             # Maximum results to return

# ─────────────────────────────────────────────
# Cache Settings
# ─────────────────────────────────────────────
CACHE_TTL_HOURS: int = 24               # Cache time-to-live in hours

# ─────────────────────────────────────────────
# Web Scraping Settings
# ─────────────────────────────────────────────
SCRAPER_USER_AGENTS: list[str] = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0",
]
SCRAPER_TIMEOUT: int = 15               # Request timeout in seconds
MAX_SCRAPE_URLS: int = 3                # Maximum URLs to try scraping
MAX_CONTENT_LENGTH: int = 5000          # Max characters of extracted content to store

# ─────────────────────────────────────────────
# Logging Settings
# ─────────────────────────────────────────────
LOG_FILE: Path = LOG_DIR / "chatbot.log"
LOG_FORMAT: str = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
LOG_DATE_FORMAT: str = "%Y-%m-%d %H:%M:%S"

# ─────────────────────────────────────────────
# 27 Registered GI Tags of Uttarakhand
# ─────────────────────────────────────────────
GI_TAGS_LIST: list[str] = [
    "Uttarakhand Tejpatta",
    "Basmati Rice",
    "Aipan Art",
    "Munsiyari White Kidney Beans (Rajma)",
    "Ringal Craft",
    "Thulma Blanket",
    "Bhotiya Dann (Rug)",
    "Kumaon Chiura (Chyura) Oil",
    "Copper Products (Tamta Craft)",
    "Chaulai (Ramdana)",
    "Jhangora (Barnyard Millet)",
    "Uttarakhand Lal Chawal (Red Rice)",
    "Mandua (Finger Millet)",
    "Almora Lakhori Mirchi",
    "Uttarakhand Berinag Tea",
    "Ramnagar Nainital Litchi",
    "Ramgarh Nainital Aadu (Peach)",
    "Uttarakhand Malta Fruit",
    "Uttarakhand Pahari Toor Dal",
    "Uttarakhand Gahat (Horse Gram)",
    "Uttarakhand Kala Bhat",
    "Uttarakhand Bichhu Buti (Nettle) Fabric",
    "Rangwali Pichhoda (Kumaon)",
    "Chamoli Wooden Ramman Mask",
    "Uttarakhand Likhai (Wood Carving)",
    "Uttarakhand Buransh Sharbat",
    "Nainital Mombatti (Candle)"
]

