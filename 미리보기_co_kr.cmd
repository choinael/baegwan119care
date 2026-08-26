@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 배관119케어.co.kr 상담 전용 페이지를 브라우저에서 엽니다.
start "" "%~dp0index.html"
echo.
echo 수정할 파일: index.html
echo 저장한 뒤 이 파일을 다시 실행하면 변경 내용을 확인할 수 있습니다.
pause
