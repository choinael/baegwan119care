@echo off
chcp 65001 >nul
echo [배관119케어.co.kr] 지역별 서비스 SEO 최종본을 GitHub에 등록합니다.
git add -A
git commit -m "지역별 서비스 전용 페이지 및 카드 전체 클릭 적용"
git push origin main
echo.
echo 완료되었습니다. 오류가 보이면 이 창을 캡처해서 보내주세요.
pause
