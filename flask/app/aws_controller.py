import boto3
from boto3.dynamodb.conditions import Key

import generateTopic
import json

from accapella import Accapella
from accapellaListing import AccapellaListing


dynamo_client = boto3.client('dynamodb')
dynamo_resource = boto3.resource('dynamodb')

SongTable = dynamo_resource.Table('YourTestTable')
UserTable = dynamo_resource.Table('UserTable')

def get_resource():
    return dynamo_resource

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
def addUser(user):
    return UserTable.put_item(
        Item = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'password_hash': user.password_hash
        }
    )
def getUserById(id):
    return UserTable.query(KeyConditionExpression=Key('id').eq(id))['Items'][0]

def getUserByEmail(email):
    return UserTable.query(IndexName='email-index', KeyConditionExpression=Key('email').eq(email))['Items'][0]

def get_users():
    return dynamo_client.scan(
        TableName='UserTable'
    )

def update_asset_status(user_id, username, listing):  
    result = UserTable.update_item(
        Key={
            'id': user_id,
            'username': username
        },
        UpdateExpression="SET postedAccapellas = list_append(if_not_exists(postedAccapellas, :i), :i)",
        ExpressionAttributeValues={
            ':i': [listing]
        },
        ReturnValues="UPDATED_NEW"
    )
    if result['ResponseMetadata']['HTTPStatusCode'] == 200 and 'Attributes' in result:
        return result['Attributes']

class Encoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Accapella):
            return {'accapella': obj.__dict__}
        return super().default(obj)


aca = generateTopic.processFile('2f3534df-b802-4159-ad31-360f7fb87c0d', 'Far From God', 'C min', 123, 50, '2f3534df-b802-4159-ad31-360f7fb87c0d/acf1133bd5f13fd0b020d8de6c540a9f/farfromgodvocals.mp3')
json_listing = json.loads(json.dumps(aca.__dict__, cls=Encoder))

update_asset_status('2f3534df-b802-4159-ad31-360f7fb87c0d', 'akuppili', json_listing)


