# Project Changelog - feature/knowledge-base-recipe-upgrade

All notable changes implemented in the Uttarakhand GI Tag Web application during this upgrade are documented below.

---

## Frontend

### Pages Added/Modified
- **[NEW]** `app/chat/page.tsx` - Created a modern, responsive chatbot UI.
  - Interactive chat container with auto-scrolling message bubbles.
  - Suggestions chips (`List all GI tags`, `Tell me about Ringaal Craft`, `What is Munsyari Rajma`, etc.) to guide the user.
  - Category filtering buttons to easily filter products.
  - Speech Recognition (Web Speech API) Integration for voice search.
  - Voice-listening overlay and warning pop-ups.
  - Integration with `sonner` for toast notifications.
  - Hydration-safe rendering components.
- **[MODIFY]** `app/layout.tsx`
  - Added `suppressHydrationWarning` on the `<html>` element to suppress browser extension-induced mismatches.

### Components Added/Modified
- **[MODIFY]** `components/navigation.tsx`
  - Integrated "AI Chat" link `/chat` to the site navigation header.

### UI/UX Improvements
- Aesthetically pleasant dark mode color scheme matching the project theme.
- Responsive layout that auto-resizes cleanly on mobile, tablet, and desktop viewports.
- Enhanced scrolling behavior and bubble animations.

---

## Backend

### APIs Added/Modified
- **[NEW]** `POST /chat` - Main endpoint accepting a query, verifying scope, identifying intents, extracting GI tags, retrieving details/recipes, caching, and responding.
- **[NEW]** `GET /health` - Health check reporting startup status and document index size.
- **[NEW]** `GET /tags` - Returns a list of supported category tags.

### Services Updated
- **[NEW]** `uttarakhand_chatbot/main.py` - FastAPI server entrypoint.
- **[NEW]** `uttarakhand_chatbot/intent_detector.py` - Custom intent detector utilizing fuzzy match logic.
- **[NEW]** `uttarakhand_chatbot/response_generator.py` - Formatter for details and recipes.
- **[NEW]** `uttarakhand_chatbot/search_engine.py` - TF-IDF based semantic similarity vectorizer.
- **[NEW]** `uttarakhand_chatbot/cache_manager.py` - Light cache system storing previous query-response pairs.
- **[NEW]** `uttarakhand_chatbot/scraper.py` - Fetch online resources if matching details are missing.

### Database Logic Updated
- Data retrieval is powered entirely by the JSON collections in `uttarakhand_chatbot/data/`.
- Dynamic recipe rendering logic checks if a GI tag product belongs to a food-related category before formatting recipe steps.

---

## Chatbot

### New Intents
- `LIST_GI_TAGS` - Triggers when the user asks to list all tags.
- `TAG_DETAILS` - Triggers when the user queries about a specific GI tag.
- `RECIPE_QUERY` - Triggers when the user requests a recipe, preparation steps, or cooking uses of a food/agricultural product.

### Recipe Query Support
- Designed formatting rules for recipe queries, returning:
  - Recipe Title
  - GI Product name
  - Region of cultivation/origin
  - Recipe Description
  - Bulleted Ingredients
  - Numbered Preparation Steps
  - Product Uses
  - Traditional Significance

### Fuzzy Matching Improvements
- Integrated `rapidfuzz` library for high-performance string similarity.
- Combines `fuzz.ratio`, `fuzz.token_sort_ratio`, `fuzz.partial_ratio`, and `fuzz.partial_token_sort_ratio`.
- Added query pre-processing to filter common prefixes/suffixes (e.g. "recipe of", "how to cook", "tell me about").
- Resolved matching failures on typos/common product variations (e.g., matching "Tejpatta" when user types "tejpat" or "recepie of tejpatta").

### Knowledge Base Enhancements
- Scoped all queries strictly to Uttarakhand GI tags.
- Any queries outside of the 27 GI tags return the exact response: `"Not a valid Uttarakhand GI Tag query."`

---

## Database

### Collections Added
- `uttarakhand_chatbot/data/master_gi_dataset.json` - Core master dataset containing registration info, description, region, and recipes.
- `uttarakhand_chatbot/data/knowledge_base.json` - Secondary corpus containing supplemental details for TF-IDF indexing.

### Schema Updates
- Standardized all 27 GI Tag entries to conform to the new database schema:
```json
{
  "name": "String",
  "category": "String",
  "region": "String",
  "description": "String",
  "uses": ["Array of Strings"],
  "examples": ["Array of Strings"],
  "ingredients": ["Array of Strings"],
  "recipe": ["Array of Strings"],
  "recipe_title": "String",
  "recipe_description": "String",
  "registration": "String"
}
```

### Seed Data Changes
- Added full recipe, ingredient list, and cooking details to all 18 food, agricultural, spice, and herbal GI tag products:
  - Uttarakhand Tejpatta
  - Basmati Rice
  - Munsyari Rajma
  - Mandua
  - Jhangora
  - Gahat Dal
  - Lal Chawal (Red Rice)
  - Kala Bhatt (Black Soybean)
  - Bichhu Buti Tea / Nettle
  - Buransh Juice
  - Malta Fruit
  - Pahadi Tor/Toor Dal
  - Pahadi Nimbu
  - Ramgarh Arhu (Peach)
  - Nainital Aloo (Potato)
  - Almora Lakhori Chili
  - Berinag Tea
  - Bal Mithai & Singori (traditional sweets)
