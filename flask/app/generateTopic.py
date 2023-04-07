import boto3

s3 = boto3.resource('s3')
# bucket = s3.Bucket('audio-files-music')
# for object in bucket.objects.all():
#     print(object)


for bucket in s3.buckets.all():
    print(bucket.name)

def processFile(user_id, key, bpm, s3Path):
    pass

