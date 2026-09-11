# =============================================================================
# Script: tools/actualizar_musica.ps1
# Paradice Juegos - Auto-indexador de Música, Géneros y Álbumes
# =============================================================================

[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$projectRoot = Split-Path -Parent $scriptDir
$musicDir = Join-Path $projectRoot "music"
$outputJs = Join-Path $projectRoot "js\config\music-catalog.js"

if (-not (Test-Path $musicDir)) {
    Write-Error "No se encontro el directorio de musica en: $musicDir"
    exit 1
}

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host " PARADICE MUSIC - ESCANEO Y GENERACION DE CATALOGO   " -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "Escaneando archivos en: $musicDir" -ForegroundColor Yellow

$audioExtensions = @('.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac')
$allFiles = Get-ChildItem -Path $musicDir -Recurse -File | Where-Object {
    $audioExtensions -contains $_.Extension.ToLower()
}

Write-Host "Se encontraron $($allFiles.Count) pistas de audio." -ForegroundColor Green

$genreIcons = @{
    'todos'       = [char]0x2728 # Sparkles ✨
    'eurodance'   = [char]0xD83E + [char]0xDE80 # 🪩
    'reggaeton'   = [char]0xD83D + [char]0xDD25 # 🔥
    'rock'        = [char]0xD83C + [char]0xDFB8 # 🎸
    'electronica' = [char]0x26A1 # ⚡
    'electro'     = [char]0x26A1 # ⚡
    'salsa'       = [char]0xD83C + [char]0xDF34 # 🌴
    'pop'         = [char]0x2B50 # ⭐
    'urbano'      = [char]0xD83D + [char]0xDD25 # 🔥
    'latino'      = [char]0xD83C + [char]0xDF34 # 🌴
    'hiphop'      = [char]0xD83C + [char]0xDFA4 # 🎤
    'house'       = [char]0xD83C + [char]0xDFA7 # 🎧
}

function Get-Slug([string]$text) {
    $s = $text.ToLower().Trim()
    $s = $s -replace '[áàäâ]', 'a'
    $s = $s -replace '[éèëê]', 'e'
    $s = $s -replace '[íìïî]', 'i'
    $s = $s -replace '[óòöô]', 'o'
    $s = $s -replace '[úùüû]', 'u'
    $s = $s -replace '[ñ]', 'n'
    $s = $s -replace '[^a-z0-9]+', '-'
    $s = $s.Trim('-')
    if (-not $s) { $s = 'varios' }
    return $s
}

function Clean-Name([string]$rawName) {
    $name = [System.IO.Path]::GetFileNameWithoutExtension($rawName).Trim()
    $name = $name -replace '^\d{1,4}\s*[-_.]*\s*', ''
    $name = $name.Trim(' ', '-', '_', '.')
    return $name
}

$tracks = @()
$genreMap = [System.Collections.Generic.Dictionary[string, hashtable]]::new()
$trackIndex = 1

foreach ($file in $allFiles) {
    $relPath = $file.FullName.Substring($projectRoot.Length + 1).Replace('\', '/')
    $folderRel = $file.DirectoryName.Substring($musicDir.Length).Trim('\', '/')

    $genreId = ""
    $genreName = ""
    $albumName = ""

    if (-not $folderRel) {
        $filename = $file.Name
        if ($filename -match '^0*([0-9]{1,3})\b') {
            $num = [int]$matches[1]
            if ($num -ge 1 -and $num -le 100) {
                $genreId = "eurodance"
                $genreName = "Eurodance 90s"
                $albumName = "Eurodance 90s Hits"
            } else {
                $genreId = "reggaeton"
                $genreName = "Reggaeton Clasico"
                $albumName = "Urbano Clasico"
            }
        } else {
            $genreId = "reggaeton"
            $genreName = "Reggaeton Clasico"
            $albumName = "Urbano Clasico"
        }
    } else {
        $parts = $folderRel -split '[\\/]'
        if ($parts.Count -eq 1) {
            $genreName = $parts[0]
            $genreId = Get-Slug $genreName
            $albumName = $genreName
        } else {
            $genreName = $parts[0]
            $genreId = Get-Slug $genreName
            $albumName = $parts[1]
        }
    }

    if (-not $genreMap.ContainsKey($genreId)) {
        $icon = [char]0xD83C + [char]0xDFB5 # 🎵
        foreach ($k in $genreIcons.Keys) {
            if ($genreId.Contains($k)) {
                $icon = $genreIcons[$k]
                break
            }
        }
        $genreMap[$genreId] = @{
            id    = $genreId
            name  = $genreName
            icon  = $icon
            count = 0
        }
    }
    $genreMap[$genreId].count++

    $clean = Clean-Name $file.Name
    $artist = "Paradice Music"
    $title = $clean

    if ($clean -match '^(.*?)\s*[-]\s*(.*)$') {
        $candidateArtist = $matches[1].Trim()
        $candidateTitle = $matches[2].Trim()
        if ($candidateArtist -and $candidateTitle) {
            $artist = $candidateArtist
            $title = $candidateTitle
        }
    }

    $trackId = "track-{0:D3}" -f $trackIndex
    $trackIndex++

    $tracks += [pscustomobject]@{
        id       = $trackId
        filename = $file.Name
        path     = $relPath
        title    = $title
        artist   = $artist
        genre    = $genreId
        album    = $albumName
    }
}

$genresList = @()
$genresList += [pscustomobject]@{
    id    = 'todos'
    name  = 'Todos los Generos'
    icon  = ([char]0x2728)
    count = $tracks.Count
}

foreach ($g in ($genreMap.Values | Sort-Object -Property name)) {
    $genresList += [pscustomobject]@{
        id    = $g.id
        name  = $g.name
        icon  = $g.icon
        count = $g.count
    }
}

$catalogObject = [pscustomobject]@{
    updatedAt = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    total     = $tracks.Count
    genres    = $genresList
    tracks    = $tracks
}

$json = $catalogObject | ConvertTo-Json -Depth 6

$banner = @"
/**
 * Paradice Music Catalog
 * Generado automaticamente por tools/actualizar_musica.ps1
 * Ultima actualizacion: $($catalogObject.updatedAt)
 * Total de pistas: $($catalogObject.total)
 * 
 * Para actualizar tras agregar canciones o carpetas, ejecuta:
 *   actualizar_musica.bat
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    const cat = factory();
    root.PARADICE_MUSIC_CATALOG = cat;
    root.MusicCatalog = cat;
  }
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this), function () {
  'use strict';
  return (
"@

$footer = @'
);
});
'@

$finalContent = $banner + "`n" + $json + $footer

$configDir = Split-Path -Parent $outputJs
if (-not (Test-Path $configDir)) {
    New-Item -ItemType Directory -Path $configDir -Force | Out-Null
}

[System.IO.File]::WriteAllText($outputJs, $finalContent, [System.Text.Encoding]::UTF8)

Write-Host "`n¡Catalogo generado exitosamente!" -ForegroundColor Green
Write-Host "Archivo guardado en: $outputJs" -ForegroundColor White
Write-Host "`nResumen de Generos:" -ForegroundColor Cyan
foreach ($g in $genresList) {
    Write-Host "  $($g.icon) $($g.name) ($($g.id)): $($g.count) canciones" -ForegroundColor Yellow
}
