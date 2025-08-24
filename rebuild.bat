@echo off
echo Stopping and removing existing container...
docker-compose down

echo.
echo Removing old image (if it exists)...
docker rmi executivejetworldmap-aviation-planner

echo.
echo Building the new image...
docker-compose build

echo.
echo Starting the new container...
docker-compose up -d

echo.
echo Process complete. The application should be running at http://localhost:8080
pause
