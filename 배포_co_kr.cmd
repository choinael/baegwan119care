@echo off
chcp 65001 >nul
echo [배관119케어.co.kr] SEO·파비콘 보완 최종본을 GitHub에 등록합니다.
git add -A
git commit -m "네이버 진단 파비콘 및 대표 이미지 보완"
git push origin main
echo.
echo 완료되었습니다. 오류가 보이면 이 창을 캡처해서 보내주세요.
pause
