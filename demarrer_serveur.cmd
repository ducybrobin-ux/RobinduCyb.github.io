@echo off
title JDP_BC - serveur local HTTPS
cd /d "%~dp0"
echo.
echo   ==========================================
echo     Demarrage du serveur local JDP_BC
echo     Jeu de piste Biais Cognitif
echo     Double-cliquez pour ouvrir le site,
echo     fermez la fenetre (ou Ctrl+C) pour arreter.
echo   ==========================================
echo.
echo     Au 1er acces, acceptez l'avertissement
echo     de certificat pour activer GPS et camera.
echo.
start "" /b cmd /c "timeout /t 2 /nobreak >nul & start https://localhost:8443"
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0server.ps1" -Port 8080 -HttpsPort 8443
echo.
echo   Le serveur s'est arrete.
pause
