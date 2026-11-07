@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Install Node.js 22 or newer, then run this file again.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm was not found. Reinstall Node.js 22 or newer with npm enabled.
  pause
  exit /b 1
)

if not exist "node_modules\vite\bin\vite.js" (
  echo Installing game dependencies...
  call npm install
  if errorlevel 1 (
    echo Dependency installation failed.
    pause
    exit /b 1
  )
)

call :WaitForPreview
if not errorlevel 1 (
  echo Game preview is already running. Opening it now...
  start "" "http://127.0.0.1:5173/?demo=1"
  exit /b 0
)

echo Starting Pham Tu game preview...
start "Pham Tu Game" /D "%~dp0" cmd /k "npm run dev"

call :WaitForPreview
if errorlevel 1 (
  echo The game server did not start. Check the Pham Tu Game window for errors.
  pause
  exit /b 1
)

start "" "http://127.0.0.1:5173/?demo=1"
exit /b 0

:WaitForPreview
for /L %%i in (1,1,45) do (
  powershell -NoProfile -Command "try { $r = Invoke-WebRequest -UseBasicParsing -TimeoutSec 2 'http://127.0.0.1:5173/'; if ($r.StatusCode -eq 200) { exit 0 } } catch { }; exit 1" >nul 2>nul
  if not errorlevel 1 exit /b 0
  timeout /t 1 /nobreak >nul
)
exit /b 1
