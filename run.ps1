# Build and run the safety-framework preview server
$imageName = "safety-framework"
$containerName = "safety-framework-preview"

# Stop and remove existing container if running
docker rm -f $containerName 2>$null

# Build the image
Write-Host "Building Docker image..." -ForegroundColor Cyan
docker build -t $imageName .

# Run the container
Write-Host "Starting preview server..." -ForegroundColor Cyan
docker run -d --name $containerName -p 4173:4173 $imageName

Write-Host "`nPreview available at: http://localhost:4173" -ForegroundColor Green
Write-Host "To stop: docker rm -f $containerName" -ForegroundColor Yellow
