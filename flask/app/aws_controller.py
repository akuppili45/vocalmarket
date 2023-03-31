import boto3
from boto3.dynamodb.conditions import Key

dynamo_client = boto3.client('dynamodb')
dynamo_resource = boto3.resource('dynamodb')

SongTable = dynamo_resource.Table('YourTestTable')
UserTable = dynamo_resource.Table('UserTable')

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
