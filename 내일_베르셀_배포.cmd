@echo off
chcp 65001 >nul
echo [배관119케어.co.kr] 수정본을 Vercel 프로덕션에 배포합니다.
npx vercel --prod --archive=tgz
echo.
echo Ready 또는 Aliased가 표시되면 배포가 완료된 것입니다.
pause
