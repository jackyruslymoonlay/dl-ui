:: Verify node.js installed
where node 2>nul >nul
IF %ERRORLEVEL% NEQ 0 (
  echo Missing node.js executable, please install node.js, if already installed make sure it can be reached from current environment.
  goto error
)

SET ARTIFACTS=%~dp0%artifacts
SET DEPLOYMENT_SOURCE=%~dp0%.
SET DEPLOYMENT_TARGET=%ARTIFACTS%\wwwroot

npm install
npm run build:prod
xcopy "%DEPLOYMENT_SOURCE%/dist" "%DEPLOYMENT_TARGET%"