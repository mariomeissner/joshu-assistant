from fastapi import FastAPI, UploadFile, File
from PIL import Image
import io
import google.generativeai as genai
from .analyze_screenshots import setup_schemas

app = FastAPI()

@app.post("/analyze-image/")
async def analyze_image(image: UploadFile = File(...)):
    try:
        # Configure Gemini API
        API_KEY = "AIzaSyBHHuU66zwhgvoGVD16GL1hLGPGRy2Y0JA"
        genai.configure(api_key=API_KEY)

        # Setup model with tools
        model = genai.GenerativeModel("gemini-1.5-flash-latest", tools=[setup_schemas()])

        # Read and process the uploaded image
        contents = await image.read()
        pil_image = Image.open(io.BytesIO(contents))

        # Generate analysis
        result = model.generate_content(
            ["describe the screenshot and what the user is doing with the mouse", pil_image]
        )

        # Extract the function call data from the first candidate
        analysis = str(result.candidates[0].content.parts[0].function_call)

        return {"status": "success", "analysis": analysis}

    except Exception as e:
        return {"status": "error", "message": str(e)}