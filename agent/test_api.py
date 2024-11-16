import requests
import os
# while running uvicorn agent.fast:app --reload
def test_image_analysis():
    url = "http://localhost:8000/analyze-image/"
    
    # Test cases
    def test_valid_image():
        image_path = "agent/final_images/output_01.png"
        if not os.path.exists(image_path):
            print(f"Error: Test image not found at {image_path}")
            return
            
        files = {
            "image": ("screenshot.png", open(image_path, "rb"), "image/png")
        }
        
        try:
            response = requests.post(url, files=files)
            print("\nValid Image Test:")
            print("Status Code:", response.status_code)
            print("Response:", response.json())
        except Exception as e:
            print(f"Error during valid image test: {str(e)}")

    def test_invalid_file():
        files = {
            "image": ("test.txt", b"This is not an image", "text/plain")
        }
        
        try:
            response = requests.post(url, files=files)
            print("\nInvalid File Test:")
            print("Status Code:", response.status_code)
            print("Response:", response.json())
        except Exception as e:
            print(f"Error during invalid file test: {str(e)}")

    def test_no_file():
        try:
            response = requests.post(url)
            print("\nNo File Test:")
            print("Status Code:", response.status_code)
            print("Response:", response.json())
        except Exception as e:
            print(f"Error during no file test: {str(e)}")

    # Run tests
    test_valid_image()
    test_invalid_file()
    test_no_file()

if __name__ == "__main__":
    test_image_analysis()