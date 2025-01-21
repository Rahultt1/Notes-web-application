## Deployment on Google Cloud Run

1. **Build the Docker image**:
   ```bash
   docker build -t gcr.io/<your-project-id>/note-app .
   ```

2. **Push the Docker image to Google Container Registry**:
   ```bash
   docker push gcr.io/<your-project-id>/note-app
   ```

3. **Deploy the image to Google Cloud Run**:
   ```bash
   gcloud run deploy note-app --image gcr.io/<your-project-id>/note-app --platform managed --region <your-region> --allow-unauthenticated
   ```

4. **Test the deployed application** by visiting the URL provided after deployment.
