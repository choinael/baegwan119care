@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo [배관119케어.co.kr] 상담 전용 홈페이지 수정본을 GitHub에 등록합니다.
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo.
  echo 이 폴더는 GitHub에서 clone한 폴더가 아닙니다.
  echo 압축파일로 받은 경우에는 내일_베르셀_배포.cmd를 사용하세요.
  pause
  exit /b 1
)
git status --short
git add -- index.html vercel.json robots.txt favicon.ico favicon.png favicon.svg GitHub_원본_준비.cmd 미리보기_co_kr.cmd 배포_co_kr.cmd 내일_베르셀_배포.cmd 수정안내.txt
git diff --cached --stat
git commit -m "배관119케어 co.kr 상담 전용 사이트로 개편"
git push origin main
echo.
echo 완료되었습니다. Vercel이 GitHub와 연결되어 있으면 자동 배포됩니다.
echo 오류가 보이면 이 창을 캡처해서 보내주세요.
pause
