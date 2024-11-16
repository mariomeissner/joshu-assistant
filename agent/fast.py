import os
from fastapi import FastAPI, UploadFile, File
from PIL import Image
import io
import google.generativeai as genai

app = FastAPI()


@app.post("/analyze-image/")
async def analyze_image(image: UploadFile = File(...)):
    try:
        # Configure Gemini API
        API_KEY = os.getenv("GOOGLE_GENERATIVE_AI_API_KEY")
        genai.configure(api_key=API_KEY)

        # Setup model with tools
        model = genai.GenerativeModel("gemini-1.5-pro-latest", tools=[setup_schemas()])

        # Read and process the uploaded image
        contents = await image.read()
        pil_image = Image.open(io.BytesIO(contents))

        # Generate analysis
        result = model.generate_content(
            [
                "describe the screenshot and what the user is doing with the mouse",
                pil_image,
            ]
        )

        # Extract the function call data from the first candidate
        analysis = str(result.candidates[0].content.parts[0].function_call)

        return {"status": "success", "analysis": analysis}

    except Exception as e:
        return {"status": "error", "message": str(e)}


def setup_schemas():
    # Define program schema
    programs = genai.protos.Schema(
        type=genai.protos.Type.OBJECT,
        properties={
            "program_name": genai.protos.Schema(type=genai.protos.Type.STRING),
            "program_description": genai.protos.Schema(
                type=genai.protos.Type.STRING, description="Description of the program"
            ),
            "is_active": genai.protos.Schema(
                type=genai.protos.Type.BOOLEAN,
                description="Whether the program is currently active",
            ),
            "program_type": genai.protos.Schema(
                type=genai.protos.Type.STRING,
                enum=["browser", "email", "chat", "calendar", "other"],
                description="Type of the program",
            ),
            "program_info": genai.protos.Schema(
                type=genai.protos.Type.STRING,
                description="valid json information about the program",
            ),
        },
        required=["program_name", "program_description", "program_type"],
    )

    # Define screenshot data schema
    screenshot_data_schema = genai.protos.Schema(
        type=genai.protos.Type.OBJECT,
        properties={
            "general_scene_description": genai.protos.Schema(
                type=genai.protos.Type.STRING,
                description="Description of screenshot and user activity in the scene",
            ),
            "programs_in_scene": genai.protos.Schema(
                type=genai.protos.Type.ARRAY,
                items=programs,
                description="An array of all programs running in the screenshot",
            ),
            "mouse_action": genai.protos.Schema(
                type=genai.protos.Type.STRING,
                description="what the user is doing with the mouse",
            ),
        },
        required=["general_scene_description", "programs_in_scene", "mouse_action"],
    )

    return genai.protos.FunctionDeclaration(
        name="screenshot_data",
        description="Get data about the screenshot and what the user is doing with the mouse",
        parameters=screenshot_data_schema,
    )