@echo off
chcp 65001 >nul
cd /d "%~dp0"
set "TARGET=%~dp0..\baegwan119care-GitHub"

where git >nul 2>&1
if errorlevel 1 (
  echo Git이 설치되어 있지 않습니다. https://git-scm.com 에서 Git을 먼저 설치하세요.
  pause
  exit /b 1
)

if exist "%TARGET%\.git" (
  echo 이미 GitHub 원본 폴더가 있습니다: %TARGET%
  echo 해당 폴더에 수정 파일을 복사하려면 기존 폴더를 다른 이름으로 바꾸고 다시 실행하세요.
  pause
  exit /b 1
)

echo GitHub에서 배관119케어.co.kr 원본을 내려받습니다.
git clone https://github.com/choinael/baegwan119care.git "%TARGET%"
if errorlevel 1 (
  echo GitHub 원본을 내려받지 못했습니다. 인터넷 연결과 GitHub 로그인을 확인하세요.
  pause
  exit /b 1
)

copy /Y "%~dp0index.html" "%TARGET%\index.html" >nul
copy /Y "%~dp0vercel.json" "%TARGET%\vercel.json" >nul
copy /Y "%~dp0robots.txt" "%TARGET%\robots.txt" >nul
copy /Y "%~dp0미리보기_co_kr.cmd" "%TARGET%\미리보기_co_kr.cmd" >nul
copy /Y "%~dp0배포_co_kr.cmd" "%TARGET%\배포_co_kr.cmd" >nul
copy /Y "%~dp0내일_베르셀_배포.cmd" "%TARGET%\내일_베르셀_배포.cmd" >nul
copy /Y "%~dp0수정안내.txt" "%TARGET%\수정안내.txt" >nul

echo.
echo 준비 완료: %TARGET%
echo 1. 해당 폴더에서 index.html을 수정합니다.
echo 2. 미리보기_co_kr.cmd로 확인합니다.
echo 3. 배포_co_kr.cmd로 GitHub에 등록합니다.
start "" "%TARGET%"
pause
