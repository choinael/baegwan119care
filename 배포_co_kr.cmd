@echo off
chcp 65001 >nul
echo [배관119케어.co.kr] 전국 지역 SEO 수정본을 GitHub에 등록합니다.
git add -A
git commit -m "전국 지역 키워드 및 시공사례 SEO 보강"
git push origin main
echo.
echo 완료되었습니다. 오류가 보이면 이 창을 캡처해서 보내주세요.
pause
