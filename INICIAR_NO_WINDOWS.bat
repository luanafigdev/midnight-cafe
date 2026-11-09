@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo O Node.js nao foi encontrado. Instale-o antes de iniciar o jogo.
  pause
  exit /b 1
)
npm.cmd run dev
pause
