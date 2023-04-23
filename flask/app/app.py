from werkzeug.security import generate_password_hash, check_password_hash


from flask import Flask,render_template,flash,redirect, url_for,request, jsonify, session, g
import os

from flask_login import LoginManager, UserMixin, login_required, login_user,logout_user, current_user
from datetime import datetime

from flask_wtf import FlaskForm
from wtforms import StringField,PasswordField,SubmitField,BooleanField
from wtforms.validators import DataRequired,Email,EqualTo
from flask_cors import CORS, cross_origin



import aws_controller

import sys

import json

import uuid

import generateTopic

from flask.sessions import SecureCookieSessionInterface
from flask_session import Session




app = Flask(__name__)
SECRET_KEY = os.urandom(32)
app.secret_key = SECRET_KEY

SESSION_TYPE = 'filesystem'
app.config.from_object(__name__)

Session(app)
CORS(app, supports_credentials=True, origin='http://localhost:3000/')

app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = True


app.app_context().push()


login_manager = LoginManager()
login_manager.init_app(app)


class User(UserMixin):
    def __init__(self, username, email, *args, **kwargs):
        super(UserMixin, self).__init__()
        self.id = str(uuid.uuid4())
        self.username = username
        self.email = email
        self.postedAccapellas = []
        self.boughtAccapellas = []

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self,password):
	    return check_password_hash(self.password_hash,password)



class RegistrationForm(FlaskForm):
    username = StringField('username', validators =[DataRequired()])
    email = StringField('Email', validators=[DataRequired(),Email()])
    password1 = PasswordField('Password', validators = [DataRequired()])
    password2 = PasswordField('Confirm Password', validators = [DataRequired(),EqualTo('password1')])
    submit = SubmitField('Register')

class LoginForm(FlaskForm):
    email = StringField('Email',validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember = BooleanField('Remember Me',validators= [DataRequired()])
    submit = SubmitField('Login')


toggle = False

@login_manager.user_loader
def load_user(user_id):
    user_json = aws_controller.getUserById(user_id)
    user = User(user_json['username'], user_json['email'])
    user.password_hash = user_json['password_hash']
    user.id = user_json['id']
    return user


@app.route('/users/<id>')
def get_user(user_id):
    user_json = aws_controller.getUserById(user_id)
    return user_json

@app.route('/')
@login_required
def login_required_route():
    return "logged in"
# post accapella listing
#'/postAccapella/<user_id>/<name>/<key>/<bpm>/<price>/<s3Path>'
# def postAccapellaListing(user_id, name, key, bpm, price, s3Path):
# http://127.0.0.1:5000/postAccapella/2f3534df-b802-4159-ad31-360f7fb87c0d/Far From God/C min/123/30/2f3534df-b802-4159-ad31-360f7fb87c0d,acf1133bd5f13fd0b020d8de6c540a9f,farfromgodvocals.mp3
@app.route('/postAccapella/<user_id>/<name>/<key>/<bpm>/<price>/<s3Path>', methods = ['PUT'])
# @login_required
def postAccapellaListing(user_id, name, key, bpm, price, s3Path):
    print(current_user, flush=True)
    user_json = aws_controller.getUserById(user_id)
    accapellaListing = generateTopic.processFile(user_id, name, key, bpm, price, s3Path.replace(',', '/'))
    json_listing = json.loads(json.dumps(accapellaListing.__dict__, cls=aws_controller.Encoder))
    return aws_controller.add_accapella_listing(user_id, user_json['username'], json_listing)

@app.route('/getAccapellas', methods = ['GET', 'POST'])
def getAccapellas():
    print(current_user, flush=True)
    listing_dict = {'listings': aws_controller.get_all_posted_accapellas()}
    return json.dumps(listing_dict, cls=aws_controller.Encoder)
    # return 'hey'


@app.route('/home')
def home():
    return render_template('index.html', data=current_user)


@app.route('/register', methods = ['POST','GET'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username =form.username.data, email = form.email.data)
        user.set_password(form.password1.data)
        aws_controller.addUser(user)
        return redirect(url_for('login'))
    return render_template('registration.html', form=form)

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
    user.postedAccapellas = user_json['postedAccapellas']
    # print(user.id)
    if user is not None and user.check_password(entered_password):
        # print(type(current_user))
        # print(current_user.is_authenticated)
        login_user(user)
        session['curr'] = 'curr'
        print('login', flush=True)
        print(session.get('curr'), flush=True)
        # request.Session()
        # print(type(json.loads(json.dumps(current_user.__dict__))))
        return json.loads(json.dumps(current_user.__dict__))
    return None

@app.route("/logout", methods=['GET', 'POST'])
# @login_required
@cross_origin()
def logout():
    print(session.get('curr'), flush=True)
    logout_user()
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

