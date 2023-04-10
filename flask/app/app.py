from werkzeug.security import generate_password_hash, check_password_hash


from flask import Flask,render_template,flash,redirect, url_for,request, jsonify
import os

from flask_login import LoginManager, UserMixin, login_required, login_user,logout_user, current_user
from datetime import datetime

from flask_wtf import FlaskForm
from wtforms import StringField,PasswordField,SubmitField,BooleanField
from wtforms.validators import DataRequired,Email,EqualTo




import aws_controller

import sys

import json

import uuid

import generateTopic


app = Flask(__name__)


app.app_context().push()


SECRET_KEY = os.urandom(32)
app.config['SECRET_KEY'] = SECRET_KEY

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


@login_manager.user_loader
def load_user(user_id):
    user_json = aws_controller.getUserById(user_id)
    user = User(user_json['username'], user_json['email'])
    user.password_hash = user_json['password_hash']
    user.id = user_json['id']
    return user

@app.route('/')
@login_required
def login_required_route():
    return "logged in"
# post accapella listing
#'/postAccapella/<user_id>/<name>/<key>/<bpm>/<price>/<s3Path>'
# def postAccapellaListing(user_id, name, key, bpm, price, s3Path):
# http://127.0.0.1:5000/postAccapella/2f3534df-b802-4159-ad31-360f7fb87c0d/Far From God/C min/123/30/2f3534df-b802-4159-ad31-360f7fb87c0d,acf1133bd5f13fd0b020d8de6c540a9f,farfromgodvocals.mp3
@app.route('/postAccapella/<user_id>/<name>/<key>/<bpm>/<price>/<s3Path>', methods = ['GET'])
# @login_required
def postAccapellaListing(user_id, name, key, bpm, price, s3Path):
    accapellaListing = generateTopic.processFile(name, user_id, key, bpm, price, s3Path.replace(',', '/'))
    return accapellaListing.aca.topics


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
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user_json = json.loads(json.dumps(aws_controller.getUserByEmail(email = form.email.data)))
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

@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for('home'))

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

