# Mini Researcher

A web application combining a React frontend and a FastAPI backend. This project enables users to perform research-related tasks powered by the Gemini API.

# Getting Started

## Frontend

### To start the frontend server (React):

npm run dev

## Backend

cd backend

### Create and activate a virtual environment

python -m venv venv

venv\Scripts\activate

### Install dependencies

pip install -r requirements.txt

### Create a .env file

GEMINI_KEY=your_api_key_here

### Start the backend server

python -m uvicorn api:app --host 0.0.0.0 --port 8080 --reload

## Tech Stack

Frontend: React + Vite

Backend: FastAPI (Python)

API: Gemini AI
