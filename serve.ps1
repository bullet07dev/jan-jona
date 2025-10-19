# serve.ps1 - simple helper to preview the static site using Python's http.server
# Run from the repository root in PowerShell:
# .\serve.ps1

$port = 8000
Write-Host "Starting static server at http://localhost:$port/ (Ctrl-C to stop)"
# Prefer python3 if available, fall back to python
$python = 'python3'
if (-not (Get-Command $python -ErrorAction SilentlyContinue)) {
    $python = 'python'
}
& $python -m http.server $port
