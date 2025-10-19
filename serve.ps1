<#
serve.ps1 - simple PowerShell static server (no Python required)
Run from the repository root in PowerShell:
.
  .\serve.ps1

This script serves files from the repository directory on http://localhost:8000/
Press Ctrl-C to stop.
#>

param(
    [int]$Port = 8000
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $root

Write-Host "Starting PowerShell static server at http://localhost:$Port/ (Ctrl-C to stop)"

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    Write-Error "Failed to start HttpListener. Another process may be using port $Port or permission denied."
    throw
}

while ($listener.IsListening) {
    $context = $listener.GetContext()
    Start-Job -ArgumentList $context, $root -ScriptBlock {
        param($context, $root)
        try {
            $req = $context.Request
            $resp = $context.Response
            $path = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath.TrimStart('/'))
            if ([string]::IsNullOrEmpty($path)) { $path = 'index.html' }
            $file = Join-Path $root $path

            if (Test-Path $file) {
                $bytes = [System.IO.File]::ReadAllBytes($file)
                $ext = [System.IO.Path]::GetExtension($file).ToLowerInvariant()
                switch ($ext) {
                    '.html' { $mime = 'text/html' }
                    '.css'  { $mime = 'text/css' }
                    '.js'   { $mime = 'application/javascript' }
                    '.svg'  { $mime = 'image/svg+xml' }
                    '.png'  { $mime = 'image/png' }
                    '.jpg'  { $mime = 'image/jpeg' }
                    '.jpeg' { $mime = 'image/jpeg' }
                    default { $mime = 'application/octet-stream' }
                }
                $resp.ContentType = $mime
                $resp.ContentLength64 = $bytes.Length
                $resp.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $resp.StatusCode = 404
                $msg = "Not Found"
                $buf = [System.Text.Encoding]::UTF8.GetBytes($msg)
                $resp.OutputStream.Write($buf,0,$buf.Length)
            }
        } catch {
            # ignore per-request errors
        } finally {
            $context.Response.OutputStream.Close()
        }
    } | Out-Null
}

$listener.Stop()
