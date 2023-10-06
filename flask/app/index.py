from werkzeug.security import generate_password_hash, check_password_hash


from flask import Flask,render_template,flash,redirect, url_for,request, jsonify, session, g
import os

from datetime import datetime

from flask_cors import CORS, cross_origin



import aws_controller

import sys

import json

import uuid

import generateTopic

from flask.sessions import SecureCookieSessionInterface
# from flask_session import Session

import stripe


app = Flask(__name__)
SECRET_KEY = os.urandom(32)
app.secret_key = SECRET_KEY

SESSION_TYPE = 'filesystem'
app.config.from_object(__name__)

# Session(app)
CORS(app, supports_credentials=True, origin='http://localhost:3000/')

app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = True


app.app_context().push()

stripe_keys = {
    "secret_key": os.environ["STRIPE_SECRET_KEY"],
    "publishable_key": os.environ["STRIPE_PUBLISHABLE_KEY"],
    "endpoint_secret": os.environ["STRIPE_ENDPOINT_SECRET"], # new
}


stripe.api_key = stripe_keys["secret_key"]
endpoint_secret = 'whsec_9c7f8a94babb7cae926759a3ebcb95bef3db806b6c9f3c71c4488d963c46f194'




toggle = False

print("stub")
class User:
    def __init__(self, username, email, *args, **kwargs):
        self.id = str(uuid.uuid4())
        self.username = username
        self.email = email
        self.postedAccapellas = []
        self.boughtAccapellas = []

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self,password):
	    return check_password_hash(self.password_hash,password)





@app.route('/users/<id>')
def get_user(user_id):
    user_json = aws_controller.getUserById(user_id)
    return user_json

@app.route('/')
def login_required_route():
    return "logged in"
# post accapella listing
#'/postAccapella/<user_id>/<name>/<key>/<bpm>/<price>/<s3Path>'
# def postAccapellaListing(user_id, name, key, bpm, price, s3Path):
# http://127.0.0.1:5000/postAccapella/2f3534df-b802-4159-ad31-360f7fb87c0d/Far From God/C min/123/30/2f3534df-b802-4159-ad31-360f7fb87c0d,acf1133bd5f13fd0b020d8de6c540a9f,farfromgodvocals.mp3
@app.route('/postAccapella/<user_id>/<name>/<key>/<bpm>/<price>/<s3Path>', methods = ['PUT'])
# @login_required
def postAccapellaListing(user_id, name, key, bpm, price, s3Path):
    print('bpm', flush=True)
    stripe_prod = stripe.Product.create(name=name)
    
    stripe_price = stripe.Price.create(
        unit_amount=int(price) * 100,
        currency="usd",
        product=stripe_prod['id']
        )
    user_json = aws_controller.getUserById(user_id)
    accapellaListing = generateTopic.processFile(user_id, name, key, bpm, stripe_price, s3Path.replace(',', '/'))
    json_listing = json.loads(json.dumps(accapellaListing.__dict__, cls=aws_controller.Encoder))
    return aws_controller.add_accapella_listing(user_id, user_json['username'], json_listing)

@app.route('/getAccapellas/<user_id>', methods = ['GET', 'POST'])
def getAccapellas(user_id):
    # print(current_user, flush=True)
    listing_dict = {'listings': aws_controller.get_all_posted_accapellas_except_user(user_id)}
    return json.dumps(listing_dict, cls=aws_controller.Encoder)
    # return 'hey'


@app.route('/getBoughtAccapellas/<user_id>', methods = ['GET'])
def getBoughtAccapellas(user_id):
    listing_dict = {'bought': aws_controller.get_bought(user_id)}
    return json.dumps(listing_dict, cls=aws_controller.Encoder)

@app.route('/getPostedById/<id>', methods = ['GET'])
def getPostedById(id):
    return aws_controller.get_posted_by_id(id)

@app.route('/getProfile/<current_user_id>/<query_id>', methods = ['GET'])
def getProfile(current_user_id, query_id):
    return aws_controller.get_bought_and_unbought_by_id(current_user_id, query_id)

@app.route('/home')
def home():
    return render_template('index.html', data=current_user)


@app.route('/register', methods = ['POST','GET'])
def register():
    username = request.json['username']
    user_email = request.json['email']
    password = request.json['password']
    
    user = User(username =username, email = user_email)
    user.set_password(password)
    aws_controller.addUser(user)
    return json.loads(json.dumps(user.__dict__))

@app.route('/login', methods=['GET', 'POST'])
@cross_origin
def login():
    form = LoginForm()
    if form.validate_on_submit():
        u = aws_controller.getUserByEmail(email = form.email.data)
        user_json = json.loads(json.dumps(u, default=str))
        user = User(user_json['username'], user_json['email'])
        user.password_hash = user_json['password_hash']
        user.id = user_json['id']
        print(user.id)
        if user is not None and user.check_password(form.password.data):
            print(type(current_user))
            print(current_user.is_authenticated)

            login_user(user)
            e = current_user
            print(type(current_user))
            print(current_user.is_authenticated)
            print(e)

            next = request.args.get("next")
            return redirect(next or url_for('home'))
        flash('Invalid email address or Password.')    
    return render_template('login.html', form=form)

@app.route('/loginWithoutForm', methods=['GET', 'POST'])
@cross_origin()
def loginWithoutForm():
    print(request.json, flush=True)
    email = request.json['email']
    entered_password = request.json['password']
    u = aws_controller.getUserByEmail(email = email)
    user_json = json.loads(json.dumps(u, default=str))
    user = User(user_json['username'], user_json['email'])
    user.password_hash = user_json['password_hash']
    user.id = user_json['id']
    if('postedAccapellas' in user_json):
        user.postedAccapellas = user_json['postedAccapellas']
    # print(user.id)
    if user is not None and user.check_password(entered_password):
        # print(type(current_user))
        # print(current_user.is_authenticated)
        session['curr'] = 'curr'
        print('login', flush=True)
        print(session.get('curr'), flush=True)
        # request.Session()
        # print(type(json.loads(json.dumps(current_user.__dict__))))
        return json.loads(json.dumps(user.__dict__))
    return {"text": "Wrong password"}, 401

@app.route("/logout", methods=['GET', 'POST'])
# @login_required
@cross_origin()
def logout():
    print(session.get('curr'), flush=True)
    return json.loads(json.dumps({'logout': True}))
@app.route('/get-items')
def get_items():
    return jsonify(aws_controller.get_items())

@app.route('/postSong', methods=['POST'])
def addSong():
    print(request.data)
    data = json.loads(request.data)
    

    response = aws_controller.addSong(data['Artist'], data['SongTitle'])

    if (response['ResponseMetadata']['HTTPStatusCode'] == 200):
        return {
            'msg': 'Added successfully',
        }

    return {  
        'msg': 'Some error occcured',
        'response': response
    }


YOUR_DOMAIN = 'http://localhost:3000'

@app.route('/create-checkout-session/<user_id>/<price_id>/<name>/<original_owner>/<listing_id>/<s3Path>', methods=['POST'])
def create_checkout_session(user_id, price_id, name, original_owner, listing_id, s3Path):
    print('before check9ut', flush=True)
    stripe.api_key = stripe_keys["secret_key"]
    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    # Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    'price': price_id,
                    'quantity': 1,
                },
            ],
            mode='payment',
            success_url=YOUR_DOMAIN + '?success=true',
            cancel_url=YOUR_DOMAIN + '?canceled=true',
            metadata={'user_id': user_id, 'price_id': price_id, 'name': name, 'original_owner': original_owner, 's3Path': s3Path},
            payment_intent_data={
                "metadata": {'user_id': user_id, 'price_id': price_id, 'name': name, 'original_owner': original_owner, 'listing_id': listing_id, 's3Path': s3Path}
            }, # add metadata attribute
        )
    except Exception as e:
        return str(e)
    print(checkout_session.url, flush=True)
    if(checkout_session.url == YOUR_DOMAIN + '?success=true'):
            # name, artist they bought from, s3Path
            print('success', flush=True)
            bought_dict = {"name": name, "original_owner": original_owner, "s3Path": s3Path.replace(',', '/')}
            user_json = aws_controller.getUserById(user_id)
            aws_controller.add_bought_accapella(user_id, user_json['username'], bought_dict)
    return redirect(checkout_session.url, code=303)



@app.route('/webhook', methods=['POST'])
def webhook():
    print("inside webhook biatch")
    event = None
    payload = request.data
    sig_header = request.headers['STRIPE_SIGNATURE']
    # print('instahram', flush=True)
    try:
        event = json.loads(payload)
    except:
        print('⚠️  Webhook error while parsing basic request.' + str(e))
        return jsonify(success=False)
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        # Invalid payload
        raise e
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        raise e

    # Handle the event
    if event['type'] == 'payment_intent.succeeded':
        print('payment checkout succeeded', flush=True)
        payment_intent = event['data']['object']
        print(payment_intent['metadata'])
        fulfill_order(payment_intent['metadata']['user_id'], payment_intent['metadata']['price_id'], 
        payment_intent['metadata']['name'], payment_intent['metadata']['original_owner'], payment_intent['metadata']['listing_id'],
        payment_intent['metadata']['s3Path'])
    # ... handle other event types
    else:
        print('Unhandled event type {}'.format(event['type']))

    return jsonify(success=True)



def fulfill_order(user_id, price_id, name, original_owner, listing_id, s3Path):
    print("fulfilling order")
    bought_dict = {"name": name, "original_owner": original_owner, "listing_id": listing_id,  "s3Path": s3Path.replace(',', '/')}
    user_json = aws_controller.getUserById(user_id)
    aws_controller.add_bought_accapella(user_id, user_json['username'], bought_dict)


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
