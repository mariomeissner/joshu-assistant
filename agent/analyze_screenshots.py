import os
from PIL import Image
import google.generativeai as genai


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


def analyze_screenshots(image_dir):

    # Setup model with tools
    model = genai.GenerativeModel("gemini-1.5-flash-latest", tools=[setup_schemas()])

    # Get and sort image files
    files = sorted(
        [f for f in os.listdir(image_dir) if f.endswith((".png", ".jpg", ".jpeg"))]
    )

    # Process each image
    results = []
    for file in files:
        try:
            image = Image.open(os.path.join(image_dir, file))
            result = model.generate_content(
                [
                    "describe the screenshot and what the user is doing with the mouse",
                    image,
                ]
            )
            results.append(result)
            print(f"Processed {file} successfully")
        except Exception as e:
            print(f"Error processing {file}: {str(e)}")

    # Generate action history
    actions = "# Action History\n\n"
    for i, result in enumerate(results):
        for candidate in result.candidates:
            part = candidate.content.parts[0]
            actions += f"## Action {i+1}\n{str(part.function_call)}\n\n"

    return actions


action_history_example = """# Action History\\n\\n## Action 1\\nname: \"screenshot_data\"\\nargs {\\n  fields {\\n    key: \"programs_in_scene\"\\n    value {\\n      list_value {\\n        values {\\n          struct_value {\\n            fields {\\n              key: \"program_type\"\\n              value {\\n                string_value: \"email\"\\n              }\\n            }\\n            fields {\\n              key: \"program_name\"\\n              value {\\n                string_value: \"Email Client\"\\n              }\\n            }\\n            fields {\\n              key: \"program_info\"\\n              value {\\n                string_value: \"{\\\\\"status\\\\\": \\\\\"Syncing\\\\\"}\"\\n              }\\n            }\\n            fields {\\n              key: \"program_description\"\\n              value {\\n                string_value: \"An email client application.\"\\n              }\\n            }\\n            fields {\\n              key: \"is_active\"\\n              value {\\n                bool_value: true\\n              }\\n            }\\n          }\\n        }\\n      }\\n    }\\n  }\\n  fields {\\n    key: \"mouse_action\"\\n    value {\\n      string_value: \"The mouse cursor is hovering over the right panel.\"\\n    }\\n  }\\n  fields {\\n    key: \"general_scene_description\"\\n    value {\\n      string_value: \"The screenshot shows an email client application. The inbox is empty, and a message displays \\\\\"What a productive day! You\\\\\\\\\\\\\\\'ve accomplished a lot\\\\\". The client is currently syncing.\"\\n    }\\n  }\\n}\\n\\n## Action 2\\nname: \"screenshot_data\"\\nargs {\\n  fields {\\n    key: \"programs_in_scene\"\\n    value {\\n      list_value {\\n        values {\\n          struct_value {\\n            fields {\\n              key: \"program_type\"\\n              value {\\n                string_value: \"email\"\\n              }\\n            }\\n            fields {\\n              key: \"program_name\"\\n              value {\\n                string_value: \"Mail\"\\n              }\\n            }\\n            fields {\\n              key: \"program_description\"\\n              value {\\n                string_value: \"Email client application\"\\n              }\\n            }\\n            fields {\\n              key: \"is_active\"\\n              value {\\n                bool_value: true\\n              }\\n            }\\n          }\\n        }\\n      }\\n    }\\n  }\\n  fields {\\n    key: \"mouse_action\"\\n    value {\\n      string_value: \"The mouse is idle.\"\\n    }\\n  }\\n  fields {\\n    key: \"general_scene_description\"\\n    value {\\n      string_value: \"The screenshot shows an email client application. The inbox is empty and displays a congratulatory message: \\\\\"What a productive day! You\\\\\\\\\\\\\\\'ve accomplished a lot\\\\\". The application is currently syncing.\"\\n    }\\n  }\\n}\\n\\n## Action 3\\nname: \"screenshot_data\"\\nargs {\\n  fields {\\n    key: \"programs_in_scene\"\\n    value {\\n      list_value {\\n        values {\\n          struct_value {\\n            fields {\\n              key: \"program_type\"\\n              value {\\n                string_value: \"email\"\\n              }\\n            }\\n            fields {\\n              key: \"program_name\"\\n              value {\\n                string_value: \"Mail\"\\n              }\\n            }\\n            fields {\\n              key: \"program_description\"\\n              value {\\n                string_value: \"Email client open with no emails present, showing a congratulatory message about having a productive day.\"\\n              }\\n            }\\n            fields {\\n              key: \"is_active\"\\n              value {\\n                bool_value: true\\n              }\\n            }\\n          }\\n        }\\n      }\\n    }\\n  }\\n  fields {\\n    key: \"mouse_action\"\\n    value {\\n      string_value: \"The mouse cursor is hovering over the \\\\\"Sync\\\\\" button.\"\\n    }\\n  }\\n  fields {\\n    key: \"general_scene_description\"\\n    value {\\n      string_value: \"The screenshot shows an email client with no emails in the inbox. The email client displays a hot air balloon image and the text \\\\\"What a productive day! You\\\\\\\\\\\\\\\'ve accomplished a lot\\\\\".\"\\n    }\\n  }\\n}\\n\\n## Action 4\\nname: \"screenshot_data\"\\nargs {\\n  fields {\\n    key: \"programs_in_scene\"\\n    value {\\n      list_value {\\n        values {\\n          struct_value {\\n            fields {\\n              key: \"program_type\"\\n              value {\\n                string_value: \"email\"\\n              }\\n            }\\n            fields {\\n              key: \"program_name\"\\n              value {\\n                string_value: \"Email Client\"\\n              }\\n            }\\n            fields {\\n              key: \"program_info\"\\n              value {\\n                string_value: \"{\\\\\"sender\\\\\": \\\\\"Fujitsu\\\\\", \\\\\"subject\\\\\": \\\\\"Rescheduling Meeting\\\\\", \\\\\"content\\\\\": \\\\\"Hi, Can we reschedule our meeting one hour later, from 2024-11-17 1...\\\\\"}\"\\n              }\\n            }\\n            fields {\\n              key: \"program_description\"\\n              value {\\n                string_value: \"An email from Fujitsu regarding rescheduling a meeting.\"\\n              }\\n            }\\n            fields {\\n              key: \"is_active\"\\n              value {\\n                bool_value: true\\n              }\\n            }\\n          }\\n        }\\n      }\\n    }\\n  }\\n  fields {\\n    key: \"mouse_action\"\\n    value {\\n      string_value: \"Hovering over the Sync button\"\\n    }\\n  }\\n  fields {\\n    key: \"general_scene_description\"\\n    value {\\n      string_value: \"The screenshot shows an email client with a request to reschedule a meeting. The user is about to click the Sync button.\"\\n    }\\n  }\\n}\\n\\n## Action 5\\nname: \"screenshot_data\"\\nargs {\\n  fields {\\n    key: \"programs_in_scene\"\\n    value {\\n      list_value {\\n        values {\\n          struct_value {\\n            fields {\\n              key: \"program_type\"\\n              value {\\n                string_value: \"email\"\\n              }\\n            }\\n            fields {\\n              key: \"program_name\"\\n              value {\\n                string_value: \"Email Client\"\\n              }\\n            }\\n            fields {\\n              key: \"program_info\"\\n              value {\\n                string_value: \"{\\\\\"sender\\\\\": \\\\\"Fujitsu\\\\\", \\\\\"subject\\\\\": \\\\\"Rescheduling Meeting\\\\\", \\\\\"content\\\\\": \\\\\"Hi, Can we reschedule our meeting one hour later, from 2024-11-17 1...\\\\\", \\\\\"time\\\\\": \\\\\"12:59\\\\\"}\"\\n              }\\n            }\\n            fields {\\n              key: \"program_description\"\\n              value {\\n                string_value: \"An email client displaying a message about rescheduling a meeting.\"\\n              }\\n            }\\n            fields {\\n              key: \"is_active\"\\n              value {\\n                bool_value: true\\n              }\\n            }\\n          }\\n        }\\n      }\\n    }\\n  }\\n  fields {\\n    key: \"mouse_action\"\\n    value {\\n      string_value: \"Hovering over the email content.\"\\n    }\\n  }\\n  fields {\\n    key: \"general_scene_description\"\\n    value {\\n      string_value: \"The screenshot shows an email client. The user is reading an email about rescheduling a meeting.\"\\n    }\\n  }\\n}\\n\\n## Action 6\\nname: \"screenshot_data\"\\nargs {\\n  fields {\\n    key: \"programs_in_scene\"\\n    value {\\n      list_value {\\n        values {\\n          struct_value {\\n            fields {\\n              key: \"program_type\"\\n              value {\\n                string_value: \"email\"\\n              }\\n            }\\n            fields {\\n              key: \"program_name\"\\n              value {\\n                string_value: \"Email Client\"\\n              }\\n            }\\n            fields {\\n              key: \"program_info\"\\n              value {\\n                string_value: \"{\\\\\"subject\\\\\": \\\\\"Rescheduling Meeting\\\\\", \\\\\"sender\\\\\": \\\\\"Fujitsu <fujitsu.fujitsuxxx@gmail.com>\\\\\", \\\\\"recipient\\\\\": \\\\\"kta.yasuda@gmail.com\\\\\", \\\\\"body\\\\\": \\\\\"Hi,\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\nCan we reschedule our meeting one hour later,\\\\\\\\\\\\\\\\nfrom 2024-11-17 16:00~17:00 to\\\\\\\\\\\\\\\\n17:00~18:00?\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\nThank you,\\\\\\\\\\\\\\\\nFujitsu\\\\\"}\"\\n              }\\n            }\\n            fields {\\n              key: \"program_description\"\\n              value {\\n                string_value: \"An email client open to a message thread.\"\\n              }\\n            }\\n            fields {\\n              key: \"is_active\"\\n              value {\\n                bool_value: true\\n              }\\n            }\\n          }\\n        }\\n      }\\n    }\\n  }\\n  fields {\\n    key: \"mouse_action\"\\n    value {\\n      string_value: \"The mouse cursor is hovering over the email body text.\"\\n    }\\n  }\\n  fields {\\n    key: \"general_scene_description\"\\n    value {\\n      string_value: \"The screenshot shows an email client with an email thread open. The user is reading an email about rescheduling a meeting.\"\\n    }\\n  }\\n}\\n\\n## Action 7\\nname: \"screenshot_data\"\\nargs {\\n  fields {\\n    key: \"programs_in_scene\"\\n    value {\\n      list_value {\\n        values {\\n          struct_value {\\n            fields {\\n              key: \"program_type\"\\n              value {\\n                string_value: \"calendar\"\\n              }\\n            }\\n            fields {\\n              key: \"program_name\"\\n              value {\\n                string_value: \"Calendar\"\\n              }\\n            }\\n            fields {\\n              key: \"program_info\"\\n              value {\\n                string_value: \"{\\\\\"date\\\\\": \\\\\"November 16, 2024\\\\\", \\\\\"events\\\\\": [{\\\\\"time\\\\\": \\\\\"13:01\\\\\", \\\\\"title\\\\\": \\\\\"Client Meeting: Fujitsu\\\\\"}, {\\\\\"time\\\\\": \\\\\"13:01\\\\\", \\\\\"title\\\\\": \\\\\"Important Meeting with Boss\\\\\"}]}\"\\n              }\\n            }\\n            fields {\\n              key: \"program_description\"\\n              value {\\n                string_value: \"A calendar application.\"\\n              }\\n            }\\n            fields {\\n              key: \"is_active\"\\n              value {\\n                bool_value: true\\n              }\\n            }\\n          }\\n        }\\n      }\\n    }\\n  }\\n  fields {\\n    key: \"mouse_action\"\\n    value {\\n      string_value: \"The mouse cursor is hovering over the \\\\\"Client Meeting: Fujitsu\\\\\" entry.\"\\n    }\\n  }\\n  fields {\\n    key: \"general_scene_description\"\\n    value {\\n      string_value: \"The screenshot shows a calendar application open on a computer. The calendar is displaying the week of November 11th to 17th, 2024.  The current date is Saturday, November 16th. Two meetings are scheduled for Saturday: one with Fujitsu and another, marked as important, with the user\\\\\\\\\\\\\\\'s boss. The current time is 1:01 PM. The location is set to New York, NY, and the weather is 10°C (feels like 16°C) with a low of 7°C.\"\\n    }\\n  }\\n}\\n\\n"""


def get_prompt_for_summarizer(action_history):
    prompt = f"""You will process a series of employee actions extracted from screenshots. `# Action History` holds the list of activities for executing this task. Some information in the activity list is not obvious to the newcomers. 

    Your task is to comprehend each activity and infer the abstract overview concept, capturing what each task is about, and why each task is performed. Find a series of actions of what has been done. Then, infer the non-obvious in-depth as to WHY each action is taken.  

    Extract the reasoning behind each action and decision in bullet points. Think step by step and write it in the #Thinking section. Finally, comprehend key important lessons from this interaction in the #Lesson section.

    input: {action_history}
    output:"""

    # removing the example output, as it seems to be mixing this with the actual input
    # input: {action_history_example}

    # output: - Tanaka-san receives an email from a client to reschedule a meeting with the boss.
    # - Boss is very important and we can\'t just simply change his time.
    # - Tanaka-san knows that the client is very important and we need to prioritize the client.
    # - Tanaka-san prioritizes the client. Per their request, Tanaka moved the meeting with them despite it clashes with another important meeting with the boss

    return prompt


def generate(prompt):
    model = genai.GenerativeModel(
        "gemini-1.5-flash-002",
        system_instruction=[
            """Your task is to understand how an employee executes a task."""
        ],
    )

    generation_config = {
        "max_output_tokens": 8192,
        "temperature": 1,
        "top_p": 0.95,
    }

    responses = model.generate_content(
        [prompt],
        generation_config=generation_config,
        stream=False,
    )

    output = ""
    for response in responses:
        output += response.text

    return output


def main():
    API_KEY = "AIzaSyBHHuU66zwhgvoGVD16GL1hLGPGRy2Y0JA"
    genai.configure(api_key=API_KEY)

    current_dir = os.getcwd()
    image_dir = os.path.join(current_dir, "final_images")

    # Ensure image directory exists
    if not os.path.exists(image_dir):
        print(f"Error: Directory {image_dir} does not exist")
        return

    try:
        print("running history")
        action_history = analyze_screenshots(image_dir)
        print("complete")
        print("running gen")
        prompt = get_prompt_for_summarizer(action_history)
        output = generate(prompt)
        print("output: ", output)

        output_file = "screenshot_analysis.md"
        with open(output_file, "w") as f:
            f.write("# Action History \n\n")
            f.write(action_history)
            f.write("# Generation \n\n")
            f.write(output)
        print(f"Analysis complete. Results saved to {output_file}")

    except Exception as e:
        print(f"An error occurred: {str(e)}")


if __name__ == "__main__":
    main()
