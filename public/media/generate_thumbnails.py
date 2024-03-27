import os
import shutil
from PIL import Image, ImageOps

# Define the input and output directories
input_directory = "files"
output_directory = "thumbnails"

# Create the output directory if it doesn't exist
if not os.path.exists(output_directory):
    os.makedirs(output_directory)

# Iterate through each project folder in the input directory
for project_folder in os.listdir(input_directory):
    # Skip the icons folder
    if project_folder == "icons":
        continue

    project_path = os.path.join(input_directory, project_folder)

    # Skip files in the input directory that are not folders
    if not os.path.isdir(project_path):
        continue

    # Create a subfolder in the output directory for thumbnails
    thumbnail_folder = os.path.join(output_directory, project_folder)
    if not os.path.exists(thumbnail_folder):
        os.makedirs(thumbnail_folder)
    else:
        # Clear the existing thumbnails in the folder
        shutil.rmtree(thumbnail_folder)
        os.makedirs(thumbnail_folder)

    # Iterate through each image file in the project folder
    for image_file in os.listdir(project_path):
        image_path = os.path.join(project_path, image_file)

        # Skip non-image files
        if not image_file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
            continue

        # Open the image and resize it while maintaining aspect ratio
        with Image.open(image_path) as img:
            # Resize the image with the desired height while preserving aspect ratio
            img.thumbnail((img.width, 400))
            # Add padding if necessary to make the image square
            img_padded = ImageOps.pad(img, (img.width, 400), color='white')
            # Save the resized image (maintaining aspect ratio) to the thumbnail folder
            thumbnail_path = os.path.join(thumbnail_folder, image_file)
            img_padded.save(thumbnail_path)

print("Thumbnails created successfully!")
