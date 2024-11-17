import os
from fastapi import FastAPI, UploadFile, File
from PIL import Image
import io
import google.generativeai as genai
from typing import List
from fastapi.middleware.cors import CORSMiddleware

# Import the helper functions
from analyze_screenshots import setup_schemas, get_prompt_for_summarizer, generate

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/analyze-image/")
async def analyze_image(images: list[UploadFile] = File(...)):
    try:
        # Configure Gemini API
        API_KEY = os.getenv("GOOGLE_GENERATIVE_AI_API_KEY")
        genai.configure(api_key=API_KEY)

        # Setup model with tools
        model = genai.GenerativeModel("gemini-1.5-pro-latest", tools=[setup_schemas()])

        # Process each image and collect results
        action_results = []
        for image in images:
            contents = await image.read()
            pil_image = Image.open(io.BytesIO(contents))

            result = model.generate_content(
                [
                    "describe the screenshot and what the user is doing with the mouse",
                    pil_image,
                ]
            )

            analysis = str(result.candidates[0].content.parts[0].function_call)
            action_results.append({"filename": image.filename, "analysis": analysis})

        # Create action history format
        action_history = "# Action History\n\n"
        for i, result in enumerate(action_results):
            action_history += f"## Action {i+1}\n{result['analysis']}\n\n"

        # Generate summary using the prompt
        prompt = get_prompt_for_summarizer(action_history)
        summary = generate(prompt)

        return {
            "status": "success",
            "summary": summary,
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}
