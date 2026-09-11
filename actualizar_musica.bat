@echo off
chcp 65001 > nul
title Paradice Music - Actualizador de Catalogo
echo ======================================================
echo    PARADICE JUEGOS - ACTUALIZADOR DE CATALOGO MUSICAL  
echo ======================================================
echo.
echo Escaneando la carpeta /music y actualizando generos y albumes...
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\actualizar_musica.ps1"

echo.
echo ======================================================
echo  Proceso finalizado. Puedes cerrar esta ventana.
echo ======================================================
pause
