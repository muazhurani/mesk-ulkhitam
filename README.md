# Mesk Ul-Khitam README

Welcome to the Mesk Ul-Khitam project! Mesk Ul-Khitam is an open-source application designed to generate video clips with selected verses from the Quran. This project integrates Quranic text with audio recitations, allowing users to create personalized videos with spiritual significance.

## Features

- **Dynamic Quran Verse Selection**: Users can select specific chapters and verses from the Quran for video generation.
- **Audio Integration**: Each verse is accompanied by its audio recitation, providing an immersive experience.
- **Background Video Customization**: Users can choose a background video for their generated clip, adding a visual dimension to the audio and text.
- **Web Interface**: The application offers a user-friendly web interface for easy navigation and operation.
- **Verse image generation**: The application offers a user-friendly web interface for easy navigation and operation.

## How to Use

### Requirements

To run Mesk Ul-Khitam, ensure you have the following installed:
- Python 3.x
- Flask
- MoviePy
- JSON

### Installation

1. Clone the repository:
   ```
   git clone [repository URL]
   ```
2. Install dependencies:
   ```
   pip install Flask moviepy
   ```

### Running the Application

1. Navigate to the cloned directory.
2. Run the Flask application:
   ```
   python app.py
   ```
3. Open a web browser and go to `http://localhost:5550/index` to access the application.

### Using the Web Interface

- **Home Page (`/index`)**: Start here for an introduction and instructions.
- **Verse Generator (`/verse-generator`)**: Select the desired verses and background video.
- **Generate Video**: After selection, click the 'Generate Video' button to start the creation process.

### API Endpoints

- `/get-quran-data`: Fetches the complete Quran data in JSON format.
- `/get-chapters`: Retrieves a list of Quran chapters.
- `/get-verses/<int:chapter>`: Fetches verses from a specific chapter.
- `/generate-video`: Endpoint for generating the video based on user selections.

### Adding Custom Content

- **Background Videos**: Add your background videos to the `video` folder.
- **Audio**:  You can download all verses pre-cut using everyayah.com, then use the script: new-reader-sort-files.py to sort them, finaly you can place them in "audio" folder

## Contributing

As an open-source project, contributions are welcome and appreciated. You can contribute in several ways:
- Submitting bug reports or feature requests.
- Improving documentation.
- Submitting pull requests for code enhancements.

## License

Mesk Ul-Khitam is released under [License Name], which allows for modification and distribution for both personal and commercial purposes.

## Contact

For questions or support, please contact me at: muaxhurani@mail.com.

---

We hope Mesk Ul-Khitam helps you in creating meaningful and inspirational Quranic video content. Your feedback and contributions are highly valued in this journey!