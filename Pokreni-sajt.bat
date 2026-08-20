@echo off
cd /d "%~dp0"
title Eurobroker web sajt
where python >nul 2>nul && (set "PY=python") || (set "PY=py")
echo ==================================================
echo    EUROBROKER - lokalni web sajt
echo    Adresa:  http://127.0.0.1:8790/
echo    Zaustavljanje: zatvorite ovaj prozor ili Ctrl+C
echo ==================================================
echo.
echo Pokrecem server i otvaram pregledac...
start "" /min cmd /c "timeout /t 2 >nul & start http://127.0.0.1:8790/"
%PY% .devserver.py
echo.
echo Server je zaustavljen.
pause
