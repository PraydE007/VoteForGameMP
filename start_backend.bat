@echo off
chcp 65001 > nul
echo ========================================================
echo   VoteForMP - Запуск Python Backend сервера
echo ========================================================
echo.
cd /d "%~dp0"

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ПОМИЛКА] Python не знайдено в PATH! Будь ласка, встановіть Python.
    pause
    exit /b 1
)

echo Встановлення / оновлення необхідних пакетів...
python -m pip install -r backend\requirements.txt

echo.
echo Запуск сервера FastAPI на http://localhost:8000 ...
echo (Щоб зупинити сервер, натисніть Ctrl+C)
echo.
python backend\main.py
pause

