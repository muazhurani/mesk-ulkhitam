from flask import Flask, render_template, request, redirect, url_for, jsonify, send_from_directory
from moviepy.editor import ImageClip, AudioFileClip, CompositeVideoClip, concatenate_videoclips, VideoFileClip
from moviepy.audio.fx.all import audio_normalize
import json
import os

app = Flask(__name__, template_folder='.')

@app.route('/index')
def index():
    return render_template('/index.html')

@app.route('/verse-generator')
def verse_generator():
    return render_template('/verse-generator.html')

@app.route('/js/<filename>')
def get_js(filename):
    return send_from_directory('js', filename)

@app.route('/icons/<filename>')
def icons(filename):
    return send_from_directory('icons', filename)


@app.route('/thumbnails/<filename>')
def thumbnails(filename):
    return send_from_directory('thumbnails', filename)

@app.route('/get-quran-data')
def get_quran_data():
    with open('Quran.json', 'r', encoding='utf-8-sig') as file:
        quran_data = json.load(file)
    return jsonify(quran_data)

@app.route('/get-chapters')
def get_chapters():
    with open('Quran.json', 'r', encoding='utf-8-sig') as file:
        data = json.load(file)
    
    chapters = {entry['id']: 'Chapter ' + str(entry['id']) for entry in data}
    
    return chapters

@app.route('/get-verses/<int:chapter>')
def get_verses(chapter):
    with open('Quran.json', 'r', encoding='utf-8-sig') as file:
        data = json.load(file)
    
    verses = {}
    for entry in data:
        if entry['id'] == chapter:
            for item in entry['array']:
                verses[item['id']] = 'Verse ' + str(item['id'])
    
    return jsonify(verses)


@app.route('/generate-video', methods=['POST'])
def generate_video():
    background_video_filename = request.form['background_video']
    background_video_path = os.path.join('video', background_video_filename)

    chapter = int(request.form['chapter'])
    start_verse = int(request.form['start_verse'])
    end_verse = int(request.form['end_verse'])

    with open('Quran.json', 'r', encoding='utf-8-sig') as file:
        data = json.load(file)

    resolution = (1080, 1920)
    clips = []
    start_time = 0

    for entry in data:
        if entry['id'] == chapter:
            for item in entry['array']:
                if start_verse <= item['id'] <= end_verse:
                    image_path = f'./image/{entry["id"]}/{item["id"]}.png'
                    audio_path = f'./audio/{str(chapter).zfill(3)}/{str(item["id"]).zfill(3)}.mp3'

                    audio_clip = AudioFileClip(audio_path).fx(audio_normalize).subclip(0, -0.20).audio_fadeout(0.1)

                    image_clip = ImageClip(image_path, duration=audio_clip.duration).set_opacity(0.7).resize(newsize=resolution)

                    image_clip = image_clip.set_start(start_time)
                    audio_clip = audio_clip.set_start(start_time)

                    clips.append(image_clip.set_audio(audio_clip))

                    start_time += audio_clip.duration

    background_video = VideoFileClip(background_video_path).resize(height=resolution[1]).set_opacity(0.7)

    if background_video.size[0] > resolution[0]:
        background_video = background_video.crop(x_center=background_video.size[0]/2, width=resolution[0])

    total_duration = start_time
    background_video = background_video.set_duration(total_duration)

    final_clip = CompositeVideoClip([background_video] + clips, size=resolution)

    os.makedirs('generated_videos', exist_ok=True)

    final_video_path = os.path.join('generated_videos', f'chapter_{chapter}_video.mp4')

    final_clip.write_videofile(final_video_path, fps=24, codec='libx264', audio_codec='aac')

    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True, port=5550)
