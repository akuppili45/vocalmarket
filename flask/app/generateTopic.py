import boto3
from dotenv import load_dotenv
import openai
import os
import smart_open
from accapella import Accapella
from accapellaListing import AccapellaListing
load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')

s3 = boto3.client('s3')









# transcript = openai.Audio.transcribe("whisper-1", audio_file)
# transcript_text = transcript.text
# process file and return a new accapella listing object
def processFile(user_id, name, key, bpm, price, s3Path):
    return AccapellaListing(user_id, Accapella(name, key, bpm, s3Path, getTopics(s3Path)), price)

def getTopics(s3Path):
    audio_file= smart_open.open('s3://audio-files-music/' + s3Path, 'rb')
    lyrics = openai.Audio.transcribe("whisper-1", audio_file).text
    topicsString = invokeCompletion(lyrics)
    return topicsString.split('/')

def invokeCompletion(lyrics):
    response = openai.Completion.create(
	model="text-davinci-003",
	prompt="List the themes discussed in these lyrics separated by a /:\n" + lyrics,
	temperature=0.7,
	max_tokens=256,
	top_p=1,
	frequency_penalty=0,
	presence_penalty=0
	)
    return response.choices[0].text

# aca_listing = processFile('2f3534df-b802-4159-ad31-360f7fb87c0d', 123, 'C min', 50, '2f3534df-b802-4159-ad31-360f7fb87c0d/acf1133bd5f13fd0b020d8de6c540a9f/farfromgodvocals.mp3')
# print(aca_listing.aca.topics)