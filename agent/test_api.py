import requests
import os
from datetime import datetime
# while running uvicorn agent.fast:app --reload
def test_image_analysis():
    #url = "https://screenshot-thing-production.up.railway.app/analyze-image/"
    url = "http://localhost:8000/analyze-image/"
    
    # Test cases
    def test_valid_images():
        # List of test images
        image_paths = [
            "agent/final_images/output_01.png",
            "agent/final_images/output_02.png"  # Add more test images as needed
        ]
        
        # Verify all images exist
        for path in image_paths:
            if not os.path.exists(path):
                print(f"Error: Test image not found at {path}")
                return
        
        # Create list of file tuples for multiple uploads
        files = [
            ("images", (f"screenshot_{i}.png", open(path, "rb"), "image/png"))
            for i, path in enumerate(image_paths)
        ]
        
        try:
            response = requests.post(url, files=files)
            print("\nValid Images Test:")
            print("Status Code:", response.status_code)
            print("Response:", response.json())
        except Exception as e:
            print(f"Error during valid images test: {str(e)}")
        finally:
            # Clean up opened files
            for _, (_, file, _) in files:
                file.close()


    # Run tests
    test_valid_images()

# test basic function using /test_route/
def test_basic_function():
    url = "http://screenshot-thing-production.up.railway.app/"
    response = requests.get(url, timeout=10)
    print(response.json())

if __name__ == "__main__":
    # print start time
    start_time = datetime.now()
    print("Starting test at", start_time.strftime("%Y-%m-%d %H:%M:%S"))
    test_image_analysis()
    # end time
    end_time = datetime.now()
    print("Test took", end_time - start_time, "seconds")
    # test_basic_function()
