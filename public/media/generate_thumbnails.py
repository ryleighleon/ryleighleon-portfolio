import os
from PIL import Image

# Define the input and output directories
input_directory = "files"
output_directory = "thumbnails"

# Create the output directory if it doesn't exist
if not os.path.exists(output_directory):
    os.makedirs(output_directory)

# Define the desired thumbnail dimensions (e.g., square thumbnails)
thumbnail_width = 100
thumbnail_height = 100

# Iterate through each project folder in the input directory
for project_folder in os.listdir(input_directory):
    project_path = os.path.join(input_directory, project_folder)

    # Skip files in the input directory that are not folders
    if not os.path.isdir(project_path):
        continue

    # Create a subfolder in the output directory for thumbnails
    thumbnail_folder = os.path.join(output_directory, project_folder)
    if not os.path.exists(thumbnail_folder):
        os.makedirs(thumbnail_folder)

    # Iterate through each image file in the project folder
    for image_file in os.listdir(project_path):
        image_path = os.path.join(project_path, image_file)

        # Skip non-image files
        if not image_file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
            continue

        # Open the image and resize it while maintaining aspect ratio
        with Image.open(image_path) as img:
            img.thumbnail((thumbnail_width, thumbnail_height))

            # Calculate the position to center the thumbnail in a square canvas
            left = (thumbnail_width - img.width) // 2
            top = (thumbnail_height - img.height) // 2
            right = left + img.width
            bottom = top + img.height

            # Create a new square canvas and paste the resized image onto it
            square_canvas = Image.new('RGB', (thumbnail_width, thumbnail_height), (255, 255, 255))  # White background
            square_canvas.paste(img, (left, top, right, bottom))

            # Save the resized image (maintaining aspect ratio) to the thumbnail folder
            thumbnail_path = os.path.join(thumbnail_folder, image_file)
            square_canvas.save(thumbnail_path)

print("Thumbnails created successfully!")
