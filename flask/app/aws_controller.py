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

def get_posted_by_id(id):
    user = getUserById(id)
    # print(user, flush=True)
    if 'postedAccapellas' not in user:
        return []
    return user['postedAccapellas']
def add_accapella_listing(user_id, username, listing):
    listing['username'] = username
    result = UserTable.update_item(
        Key={
            'id': user_id,
            'username': username
        },
        UpdateExpression="SET postedAccapellas = list_append(if_not_exists(postedAccapellas, :empty_list), :i)",
        ExpressionAttributeValues={
            ':i': [listing],
            ':empty_list': []
        },
        ReturnValues="UPDATED_NEW"
    )
    if result['ResponseMetadata']['HTTPStatusCode'] == 200 and 'Attributes' in result:
        return result['Attributes']
    return "Unable to update"

def add_bought_accapella(user_id, username, bought_dict):
    bought_dict['username'] = username  
    result = UserTable.update_item(
        Key={
            'id': user_id,
            'username': username
        },
        UpdateExpression="SET boughtAccapellas = list_append(if_not_exists(boughtAccapellas, :empty_list), :i)",
        ExpressionAttributeValues={
            ':i': [bought_dict],
            ':empty_list': []
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
    bought = [x['listing_id'] for x in get_bought(user_id)]
    print(bought, flush=True)

    list_to_return = []
    for acaGroup in response:
        if 'postedAccapellas' not in  acaGroup:
            continue
        for aca in acaGroup['postedAccapellas']:
            # print(aca['user_id'], user_id)
            user = getUserById(aca['user_id'])
            aca['username'] = user['username']
            if(aca['user_id'] != user_id and aca['listing_id'] not in bought):
                list_to_return.append(aca)
    
    shuffle(list_to_return)
    return list_to_return

def get_bought(user_id):
    user = getUserById(user_id)
    # print(user, flush=True)
    if 'boughtAccapellas' in user:
        return user['boughtAccapellas']
    return []

def get_bought_and_unbought_by_id(current_user_id, query_id):
    curr_user = getUserById(current_user_id)
    query_user = getUserById(query_id)
    # if 'postedAccapellas' not in query_user or 'boughtAccapellas' not in curr_user:
    #     return []
    bought_ids = [] if 'boughtAccapellas' not in curr_user else [x['listing_id'] for x in curr_user['boughtAccapellas']]
    bought = []
    not_bought = []
    if 'postedAccapellas' in query_user:
        for l in query_user['postedAccapellas']:
            if l['listing_id'] in bought_ids:
                bought.append(l)
            else:
                not_bought.append(l)
    return [bought, not_bought]

class Encoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Accapella):
            return {'accapella': obj.__dict__}
        elif isinstance(obj, Decimal):
            return str(obj)
        return super().default(obj)

# print(get_all_posted_accapellas())


