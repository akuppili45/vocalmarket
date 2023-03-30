import boto3

dynamo_client = boto3.client('dynamodb')
dynamo_resource = boto3.resource('dynamodb')

SongTable = dynamo_resource.Table('YourTestTable')

def get_items():
    return dynamo_client.scan(
        TableName='YourTestTable'
    )

def addSong(artist, songTitle):
    return SongTable.put_item(
        Item = {
            'Artist': artist,
            'SongTitle': songTitle
        }
    )    
