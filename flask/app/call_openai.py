from flask import Flask
from dotenv import load_dotenv
import openai
import os
load_dotenv()
app = Flask(__name__)
openai.api_key = os.getenv('OPENAI_API_KEY')

audio_file= open("/com.docker.devenvironments.code/flask/app/audio_files/Far From God [vocals].mp3", "rb")
transcript = openai.Audio.transcribe("whisper-1", audio_file)
@app.route('/transcript')
def get_transcript():
	return transcript.text
@app.route('/topics')
def get_topics():
	response = openai.Completion.create(
	model="text-davinci-003",
	prompt="List the themes discussed in these lyrics separated by a /:\n" + transcript.text,
	temperature=0.7,
	max_tokens=256,
	top_p=1,
	frequency_penalty=0,
	presence_penalty=0
	)
	return response.choices[0].text

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=8000)
