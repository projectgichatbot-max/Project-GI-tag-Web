# Deployment Guide for feature/knowledge-base-recipe-upgrade

This guide details the deployment process, installation requirements, database configuration, and verification steps for the Uttarakhand GI Tag chatbot and recipe upgrade feature branch.

## Project and Branch Information
- **Repository Name:** Project-GI-tag-Web
- **Deployment Branch:** `feature/knowledge-base-recipe-upgrade`

---

## File Changes Overview

### Frontend Files Modified/Added
- **Modified:**
  - `app/layout.tsx` - Added `suppressHydrationWarning` on the `<html>` tag to prevent browser extension attributes (such as password managers or translators) from triggering Next.js hydration errors.
  - `components/navigation.tsx` - Added the "AI Chat" link navigation item pointing to the `/chat` route.
- **Added:**
  - `app/chat/page.tsx` - The main, responsive chatbot interface page containing suggestions, state management, toast notifications, voice recognition, and clean message rendering.
  - `lib/chatbot-api.ts` - Frontend helper library for sending queries to the FastAPI chatbot backend with configurable timeouts and exponential retries.

### Backend & Chatbot Files Added
- `uttarakhand_chatbot/main.py` - FastAPI entrypoint containing `/chat`, `/health`, and `/tags` endpoints, lifespan manager, NLTK initialization, caching integration, and routing for search queries.
- `uttarakhand_chatbot/intent_detector.py` - NLP intent detection engine using RapidFuzz for fuzzy matching, filler word filters, product overrides, and classification (intents: `LIST_GI_TAGS`, `TAG_DETAILS`, `RECIPE_QUERY`).
- `uttarakhand_chatbot/response_generator.py` - Formatter engine structured to generate detailed text responses for GI tag queries and formatted cooking recipes.
- `uttarakhand_chatbot/search_engine.py` - TF-IDF vectorizer and search manager that builds an index of the knowledge base to support matching.
- `uttarakhand_chatbot/config.py` - Environment and logging configuration settings.
- `uttarakhand_chatbot/cache_manager.py` - Light memory/JSON cache to store responses and speed up recurrent queries.
- `uttarakhand_chatbot/scraper.py` - Fallback web scraper for scraping real-time information.
- `uttarakhand_chatbot/requirements.txt` - Python backend package requirements list.

### Database Updates
- `uttarakhand_chatbot/data/master_gi_dataset.json` - Updated schema to support recipe information. Extended 18 food/agricultural/spice/herbal GI products with `recipe_title`, `recipe_description`, `ingredients`, and `recipe` arrays.
- `uttarakhand_chatbot/data/knowledge_base.json` - Textual knowledge base data used for indexing.

---

## Installation & Setup

### 1. Frontend Setup
Ensure you have Node.js (v18+) installed.
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### 2. Backend Setup
Ensure you have Python (v3.9+) installed. We recommend using a virtual environment.
```bash
# Navigate to the chatbot directory
cd uttarakhand_chatbot

# Create a virtual environment
python -m venv venv
# Activate virtual environment:
# On Windows (cmd):
venv\Scripts\activate.bat
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

---

## Environment Variables
No custom environment variables are strictly required to start the app. The defaults are loaded automatically from `uttarakhand_chatbot/config.py`.
- **FastAPI Port:** `8001` (by default)
- **FastAPI Host:** `127.0.0.1` (by default)
- **CORS Allowed Origins:** `["http://localhost:3000"]`

---

## Database Migration & Seed Instructions
This application does not use a SQL database. The data is stored in the local JSON collection:
- File path: `uttarakhand_chatbot/data/master_gi_dataset.json`
- Database changes are pre-seeded directly in the file. No database migrations, SQL, or external document-store seeds need to be executed.

---

## Merge Instructions

> [!WARNING]
> Do NOT merge directly into the `main` or production branch. Keep this branch isolated for review.

When the repository owner is ready to merge:
1. Fetch latest remote branches:
   ```bash
   git fetch origin
   ```
2. Checkout the target branch (e.g. `main` or `staging`):
   ```bash
   git checkout main
   git pull origin main
   ```
3. Merge the feature branch:
   ```bash
   git merge feature/knowledge-base-recipe-upgrade
   ```
4. Verify the merge by building both the frontend and running the backend server tests.

---

## Rollback Instructions
If any issues are discovered post-merge:
1. Revert the merge commit:
   ```bash
   git revert -m 1 <merge-commit-hash>
   ```
2. Push the reverted branch to remote:
   ```bash
   git push origin main
   ```
