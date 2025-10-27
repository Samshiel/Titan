# Titan - ML Image Labeling Application

A web application for reviewing and labeling images based on machine learning suggestions. 
The application presents images with ML-predicted labels and confidence scores, allowing users to confirm or correct the predictions.

## Features

- View images with ML-suggested labels and confidence scores
- Confirm ML suggestions or provide custom labels
- RESTful API with FastAPI backend
- Follows Web Accessibility standards
- Visual confidence indicators (color-coded from red to green)
- Dark mode support

## Tech Stack

**Backend:**
- Python 3.x with FastAPI
- SQLite database
- Uvicorn ASGI server
- Pydantic for data validation

**Frontend:**
- React 19
- Create React App
- http-proxy-middleware

**Infrastructure:**
- Docker & Docker Compose for containerization
- Multi-container setup with networking

---

## How to Build and Run

### Option 1: Using Docker Compose (Recommended)

**Prerequisites:**
- Docker and Docker Compose installed
- Ports 3000 and 8800 available

**Steps:**

1. Clone the repository and navigate to the project directory:
```bash
cd Titan
```

2. Build and start the containers:
```bash
docker-compose up --build
```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8800
   - API Documentation: http://localhost:8800/docs

4. To stop the application:
```bash
docker-compose down
```

### Option 2: Local Development (Without Docker)

**Prerequisites:**
- Python 3.8+
- Node.js 16+
- npm or yarn

**Backend Setup:**

1. Navigate to the backend directory:
```bash
cd backSrc
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Run the backend server:
```bash
python apiService.py
```
The backend will run on http://localhost:8800

**Frontend Setup:**

1. In a new terminal, navigate to the React app directory:
```bash
cd react-app
```

2. Install Node dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```
The frontend will run on http://localhost:3000

---

## API Endpoints

- `GET /api/images/next` - Get the next unreviewed image
- `GET /api/stats` - Get statistics about reviewed images
- `GET /api/reset` - Reset all reviews (clear database)
- `POST /api/labels` - Submit a label for an image

---

## Technical Choices and Assumptions

### Architecture Decisions

- For back-, front-end and database Architecture Decisions were based on suggestions made in the Document although for front-end no suggestion were made. Mainly been working on Angular but chose to go with React. React was abit new for me but nothing exceptionally hard.
- Tried to follow good code practices by example making front-end component based architecture for maintainability
- Used Pydantic to validate data
- Used `setupProxy.js` to avoid CORS issues during development
- Environment variable support for Docker vs local development


### Key Assumptions

1. **Mock Data**: The application uses static mock ML predictions. In production, this would be replaced with real ML model predictions.

2. **Single User**: No authentication or multi-user support. Although I think this would not be the case in production, and this would require authentication even if it still would be single-user application. Requests should be authenticated.

3. **Sequential Review**: Images are reviewed one at a time in order.

4. **Persistent Labels Only**: Once submitted, labels cannot be edited or deleted (only via database reset).

5. **In-Memory ML Suggestions**: ML suggestions are assumed to be pre-computed and loaded from mock data, not generated on-demand.

6. **Local Image URLs**: Image URLs in mock data point to external sources (Unsplash). In production, images would likely be stored locally or in object storage (S3, etc.).

---

## Future Improvements (Given Another Week)

**1. Front-end**
- Implement JWT-based authentication
- Allow editing previously submitted labels, if mistake was made by the user. (User would also be able to see image with the label he submitted)
- Support multiple users with different roles (reviewer, admin, ML engineer)
- Track who labeled each image for audit purposes
- Keyboard shortcuts for faster labeling (e.g., Enter to confirm, Tab to correct)
- Visualize statistics
- Support multiple languages

**2. Back-end**
- Integrate with actual ML model serving infrastructure
- Add pagination for large datasets assuming the ML model has huge datasets
- Add feedback loop to retrain models based on corrections
- Implement authentication
- Implement more validation rules, for PUT requests

**3. Database**
- Switch from SQLite to PostgreSQL

**4. Testing & Quality Assurance**
- Unit tests for backend API endpoints (pytest)
- Integration tests for database operations
- Frontend component tests (React Testing Library)
- End-to-end tests (Playwright or Cypress)

**5. Deployment & DevOps**
- CI/CD pipeline (GitHub Actions, GitLab CI)
- Kubernetes deployment configurations
- Monitoring and logging
- Automated backups and disaster recovery

---

## Development Notes

### Project Structure
```
Titan/
├── backSrc/              # Backend Python application
│   ├── apiService.py     # FastAPI application
│   ├── models.py         # Pydantic models
│   ├── mock_data.py      # Mock ML predictions
│   ├── requirements.txt  # Python dependencies
│   └── Dockerfile        # Backend container config
├── react-app/            # Frontend React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── App.js        # Main app component
│   │   └── setupProxy.js # Development proxy config
│   ├── package.json      # Node dependencies
│   └── Dockerfile        # Frontend container config
└── docker-compose.yml    # Multi-container orchestration
```

---

## License

This project is for educational purposes.

