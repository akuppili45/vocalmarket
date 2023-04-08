import boto3
from dotenv import load_dotenv
import openai
import os
import smart_open

load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')

s3 = boto3.client('s3')
# bucket = s3.Bucket('audio-files-music')
# for object in bucket.objects.all():
#     print(object)

audio_file= smart_open.open('s3://audio-files-music/2f3534df-b802-4159-ad31-360f7fb87c0d/acf1133bd5f13fd0b020d8de6c540a9f/farfromgodvocals.mp3', 'rb')

transcript = openai.Audio.transcribe("whisper-1", audio_file)
transcript_text = transcript.text
# process file and return a new accapella object
def processFile(user_id, key, bpm, s3Path):
    s3.download_file('audio-files-music', s3Path, 'music.mp3')

