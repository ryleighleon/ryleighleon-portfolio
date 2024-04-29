import os
import shutil
from PIL import Image, ImageOps

# Define the input and output directories
input_directory = "./public/media/files"
output_directory = "./public/media/thumbnails"

# Create the output directory if it doesn't exist
if not os.path.exists(output_directory):
    os.makedirs(output_directory)
else:
    # Clear the existing thumbnails in the output directory
    shutil.rmtree(output_directory)
    os.makedirs(output_directory)

# Define the maximum allowable image size in pixels
max_image_size = 178956970

# Iterate through each section folder in the input directory
for section_folder in os.listdir(input_directory):
    section_path = os.path.join(input_directory, section_folder)

    # Skip files in the input directory that are not folders
    if not os.path.isdir(section_path):
        continue

    # Iterate through each project folder in the section folder
    for project_folder in os.listdir(section_path):
        project_path = os.path.join(section_path, project_folder)

        # Skip files in the section folder that are not folders
        if not os.path.isdir(project_path):
            continue

        # Create a subfolder in the output directory for thumbnails
        thumbnail_folder = os.path.join(output_directory, section_folder, project_folder)
        if not os.path.exists(thumbnail_folder):
            os.makedirs(thumbnail_folder)

        # Iterate through each image file in the project folder
        for image_file in os.listdir(project_path):
            image_path = os.path.join(project_path, image_file)

            # Skip non-image files
            if not image_file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                continue

            try:
                # Open the image and check its size
                with Image.open(image_path) as img:
                    image_size = img.width * img.height

                    # Check if the image size exceeds the limit
                    if image_size > max_image_size:
                        # Calculate the new dimensions to resize the image
                        resize_ratio = (max_image_size / image_size) ** 0.5
                        new_width = int(img.width * resize_ratio)
                        new_height = int(img.height * resize_ratio)

                        # Resize the image to the new dimensions
                        img = img.resize((new_width, new_height))

                    # Resize the image with the desired height while preserving aspect ratio
                    img.thumbnail((img.width, 400))
                    # Add padding if necessary to make the image square
                    img_padded = ImageOps.pad(img, (img.width, 400), color='white')
                    # Save the resized image (maintaining aspect ratio) to the thumbnail folder
                    thumbnail_path = os.path.join(thumbnail_folder, image_file)
                    img_padded.save(thumbnail_path)

            except Exception as e:
                print(f"Error processing image '{image_file}': {e}")

print("Thumbnails created successfully!")
print("Input Directory:", os.path.abspath(input_directory))
print("Output Directory:", os.path.abspath(output_directory))