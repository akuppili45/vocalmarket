import boto3
from boto3.dynamodb.conditions import Key

import generateTopic
import json

from accapella import Accapella
from accapellaListing import AccapellaListing
from random import shuffle
from decimal import Decimal


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

def add_accapella_listing(user_id, username, listing):  
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
    return "Unable to update"

def add_bought_accapella(user_id, username, bought_dict):  
    result = UserTable.update_item(
        Key={
            'id': user_id,
            'username': username
        },
        UpdateExpression="SET boughtAccapellas = list_append(if_not_exists(boughtAccapellas, :i), :i)",
        ExpressionAttributeValues={
            ':i': [bought_dict]
        },
        ReturnValues="UPDATED_NEW"
    )
    if result['ResponseMetadata']['HTTPStatusCode'] == 200 and 'Attributes' in result:
        return result['Attributes']
    return "Unable to update"

def get_all_posted_accapellas():
    response = UserTable.scan(AttributesToGet=['postedAccapellas'])['Items']
    list_to_return = []
    for acaGroup in response:
        if 'postedAccapellas' not in  acaGroup:
            continue
        for aca in acaGroup['postedAccapellas']:
            print(aca['user_id'], flush=True)
            list_to_return.append(aca)
    shuffle(list_to_return)
    return list_to_return

def get_all_posted_accapellas_except_user(user_id):
    response = UserTable.scan(AttributesToGet=['postedAccapellas'])['Items']
    list_to_return = []
    for acaGroup in response:
        if 'postedAccapellas' not in  acaGroup:
            continue
        for aca in acaGroup['postedAccapellas']:
            if(aca['user_id'] != user_id):
                list_to_return.append(aca)
    shuffle(list_to_return)
    return list_to_return

def get_bought(user_id):
    boughtListings = UserTable.scan(AttributesToGet=['boughtAccapellas'])['Items'][0]['boughtAccapellas']
    finalList = []
    print(getUserById(user_id)['username'], flush=True)
    for listing in boughtListings:
        listing['original_owner_username'] = getUserById(listing['original_owner'])['username']
        finalList.append(listing)
        

    return finalList


class Encoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Accapella):
            return {'accapella': obj.__dict__}
        elif isinstance(obj, Decimal):
            return str(obj)
        return super().default(obj)

# print(get_all_posted_accapellas())


