import requests
import os
# while running uvicorn agent.fast:app --reload
def test_image_analysis():
    url = "https://screenshot-thing-production.up.railway.app/analyze-image/"
    
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


    # Run tests
    test_valid_image()

# test basic function using /test_route/
def test_basic_function():
    url = "http://screenshot-thing-production.up.railway.app/"
    response = requests.get(url, timeout=10)
    print(response.json())

if __name__ == "__main__":
    test_image_analysis()
    # test_basic_function()