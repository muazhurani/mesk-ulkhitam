import os
import shutil

def sort_and_organize_files(src_directory):
    for filename in os.listdir(src_directory):
        if filename.endswith(".mp3"):
            folder_name, new_file_name = filename[:3], filename[3:6]

            new_dir_path = os.path.join(src_directory, folder_name)
            if not os.path.exists(new_dir_path):
                os.makedirs(new_dir_path)

            src_file_path = os.path.join(src_directory, filename)
            dst_file_path = os.path.join(new_dir_path, f"{new_file_name}.mp3")

            shutil.move(src_file_path, dst_file_path)

source_directory = "/path/to/your/mp3/files"
sort_and_organize_files(source_directory)