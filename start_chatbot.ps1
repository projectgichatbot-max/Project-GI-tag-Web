# start_chatbot.ps1
# Helper script to set up the Python venv and start the FastAPI chatbot server locally.
# LOCAL DEVELOPMENT ONLY — on Vercel the chatbot runs via app/api/ai-chat/route.ts

$chatbotDir = Join-Path $PSScriptRoot "uttarakhand_chatbot"
$venvDir    = Join-Path $chatbotDir "venv"
$pip        = Join-Path $venvDir "Scripts\pip.exe"
$python     = Join-Path $venvDir "Scripts\python.exe"
$req        = Join-Path $chatbotDir "requirements.txt"
$main       = Join-Path $chatbotDir "main.py"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Uttarakhand Chatbot — Local Dev Start " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Create venv if missing
if (-not (Test-Path $venvDir)) {
    Write-Host "`n[1/3] Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv $venvDir
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to create venv. Is Python 3.9+ installed?"
        exit 1
    }
    Write-Host "      Venv created at: $venvDir" -ForegroundColor Green
} else {
    Write-Host "`n[1/3] Venv already exists — skipping creation." -ForegroundColor Green
}

# 2. Install requirements
Write-Host "`n[2/3] Installing requirements..." -ForegroundColor Yellow
& $pip install -r $req --quiet
if ($LASTEXITCODE -ne 0) {
    Write-Error "pip install failed."
    exit 1
}
Write-Host "      All packages installed." -ForegroundColor Green

# 3. Start FastAPI server
Write-Host "`n[3/3] Starting FastAPI chatbot on http://localhost:8001 ..." -ForegroundColor Yellow
Write-Host "      Press Ctrl+C to stop." -ForegroundColor Gray
Write-Host ""
Set-Location $chatbotDir
& $python $main
