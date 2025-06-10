from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import os
from src.deep_research import DeepSearch

app = FastAPI()

# Enable CORS to handle preflight OPTIONS requests
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

class ResearchRequest(BaseModel):
    query: str
    mode: str = "balanced"
    breadth: int = 3
    depth: int = 2

class FollowupRequest(BaseModel):
    query: str

@app.post("/followup")
async def get_followup_questions(request: FollowupRequest):
    api_key = os.getenv("GEMINI_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Missing GEMINI_KEY environment variable")
    
    try:
        # Create an instance of DeepSearch and use it to generate follow-up questions
        deep_search = DeepSearch(api_key)
        followup_questions = deep_search.generate_follow_up_questions(request.query)
        return {"questions": followup_questions}
    except Exception as e:
        print(f"Error generating followup questions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

class CombinedResearchRequest(BaseModel):
    query: str
    mode: str = "balanced"
    breadth: int = 3
    depth: int = 2
    followup_answers: list = []

@app.post("/research")
async def perform_research(request: CombinedResearchRequest):
    # Log the exact values received from the frontend
    print(f"Received research request with: query='{request.query}', mode='{request.mode}', breadth={request.breadth}, depth={request.depth}")
    
    api_key = os.getenv("GEMINI_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Missing GEMINI_KEY environment variable")
    
    # Validate mode
    valid_modes = ["fast", "balanced", "comprehensive"]
    if request.mode not in valid_modes:
        raise HTTPException(status_code=400, detail=f"Invalid mode. Must be one of: {', '.join(valid_modes)}")
    
    # Validate breadth and depth
    if request.breadth < 1 or request.breadth > 10:
        raise HTTPException(status_code=400, detail="Breadth must be between 1 and 10")
    if request.depth < 1 or request.depth > 5:
        raise HTTPException(status_code=400, detail="Depth must be between 1 and 5")
    
    # Log the values being used for the research
    print(f"Using values for research: mode='{request.mode}', breadth={request.breadth}, depth={request.depth}")
    
    # Combine the original query with followup answers if provided
    combined_query = request.query
    if request.followup_answers and len(request.followup_answers) > 0:
        questions_and_answers = "\n".join(
            [f"{qa['question']}: {qa['answer']}" for qa in request.followup_answers]
        )
        combined_query = f"Initial query: {request.query}\n\nFollow up questions and answers: {questions_and_answers}"
        print(f"Combined query with followup answers: {combined_query}")
    
    deep_search = DeepSearch(api_key, mode=request.mode)
    try:
        results = await deep_search.deep_research(
            query=combined_query, 
            breadth=request.breadth, 
            depth=request.depth, 
            learnings=[], 
            visited_urls={}
        )
        final_report = deep_search.generate_final_report(
            query=combined_query, 
            learnings=results["learnings"], 
            visited_urls=results["visited_urls"]
        )
        return {"result": final_report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8080, reload=True)
