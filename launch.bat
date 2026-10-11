@echo off
chcp 65001 > nul
echo Side Note Editor を組み込んだ Chrome を起動中...
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" ^
  --load-extension="%~dp0\" ^
  --disable-extensions-except="%~dp0\" ^
  --user-data-dir="%~dp0..\temp-chrome-profile" ^
  --no-first-run ^
  --no-default-browser-check ^
  "https://www.google.com"
