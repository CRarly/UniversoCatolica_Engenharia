@echo off
title Desafio Estrutural - Engenharia Civil
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo O Node.js nao foi encontrado.
  echo Instale a versao 22 LTS ou superior em https://nodejs.org/
  echo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Preparando o jogo pela primeira vez...
  call npm install
  if errorlevel 1 (
    echo Nao foi possivel instalar os componentes do jogo.
    pause
    exit /b 1
  )
)

start "" "http://localhost:5173"
call npm run dev:local
pause
