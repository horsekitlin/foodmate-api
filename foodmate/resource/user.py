from foodmate import app, firebaseDb, firebase
from foodmate.model.user import User as UserModel
from flask_restplus import Resource, reqparse, fields, marshal_with
from firebase_admin import auth as adminAuth
import requests, urllib3
from requests.exceptions import HTTPError
from instance.config import app_config
import firebase_admin

pyAuth = firebase.auth()

def min_length_str(min_length):
    def validate(s):
        if s is None:
            raise Exception("input required")
        if not isinstance(s, (int, str)):
            raise Exception("format error")
        s = str(s)
        if len(s) >= min_length:
            return s
        raise Exception("String must be at least %i characters long" % min_length)
    return validate

class Auth(Resource):

    parser = reqparse.RequestParser()
    parser.add_argument(
        "email", type = str, required = True 
    )
    parser.add_argument(
        "password", type = str, required = True
    )


    def post(self):  # 1.1 POST /auth/login
        """
        User Login
        """
        try:
            jsonData = Auth.parser.parse_args()
            print(jsonData)
            userLogin = pyAuth.sign_in_with_email_and_password(jsonData["email"], jsonData["password"])
            return {
                "message":"login succssed",
                "userInfo":userLogin
            }
        except requests.exceptions.HTTPError:
            return {
                "message":"OOPS! Somthing Wrong~~"
            }
    

    def get(self, id_token):   #1.6 /auth/id_token
        """
        Get Uid
        """
        print(id_token)
        try:
            find_user = pyAuth.get_account_info(id_token)
            type(find_user)
            return {
                "message":"Susscced",
                "userInfo":{
                    "user":find_user["users"]
                }
            }
        except requests.exceptions.HTTPError:
            return {
                    "message":"INVALID_ID_TOKEN",
                }

class UserList(Resource):

    def get(self):
        """
        取得用戶列表
        """
        user_list = UserModel.get_user_list()
        print(user_list)
        if user_list:
            for user in user_list:
                return {
                    "user_list": [u.as_dict() for u in user_list]
                        }

class SendEmail(Resource):

    parser = reqparse.RequestParser()
    parser.add_argument(
        "email", type = str
    )
    def post(self):   # 1.3 POST /user/forgotPassword
        """
        Forgot Password
        """
        try:
            data = SendEmail.parser.parse_args()
            print(data)
            pyAuth.send_password_reset_email(data["email"])
            return {
                "message":"email: The email of the user whose password is to be reset."
                }
        except adminAuth.exceptions.InvalidArgumentError:
            return {
                "message":"Error while calling adminAuth service (MISSING_EMAIL):"
            }

class User(Resource):

    parser = reqparse.RequestParser()
    parser.add_argument(
        "phone_number", type = min_length_str(10)
    )
    parser.add_argument(
        "password", type = min_length_str(8)
    )
    parser.add_argument(
        "re_password", type = min_length_str(8)
    )
    parser.add_argument(
        "email", type = str
    )
    parser.add_argument(
        "display_name", type = min_length_str(3)
    )
    parser.add_argument(
        "photo_url"
    )
    parser.add_argument(
        "disabled", type = bool
    )
    parser.add_argument(
        "id_token", type = str
    )

    def post(self):   # 1.4 POST /user/create
        """
        Register
        """
        jsonData = User.parser.parse_args()
        print(jsonData)
        if jsonData["password"] == jsonData["re_password"]:
            try:
                newUser = adminAuth.create_user(
                    email = jsonData["email"],
                    password = jsonData["password"],
                    phone_number = jsonData["phone_number"]
                    )
                getUser = adminAuth.get_user_by_email(newUser.email)
                userInfo = UserModel(
                    uid = getUser.uid,
                    email = getUser.email,
                    phone_number = getUser.phone_number,
                    displayName = getUser.display_name,
                    gender = "0",
                    soulFood = "0",
                    disabled = getUser.disabled,
                    isAlbum = False,
                    isCamera = False,
                    isNotification = False,
                    createTime = getUser.user_metadata.creation_timestamp,
                    lastSignInTime = getUser.user_metadata.last_sign_in_timestamp
                )
                UserModel.add(userInfo)
                return {
                    "message":"create suscced",
                    "userInfo":{
                        "uid":userInfo.uid,
                        "email":userInfo.email,
                        "phone_number":userInfo.phone_number,
                        "createTime":userInfo.createTime
                    }
                    },201
            except adminAuth.PhoneNumberAlreadyExistsError:
                    return {
                        "message":"Phone Number Already Exists"
                    }
            except firebase_admin.exceptions.InvalidArgumentError as err:
                print(err)
                return {
                    "message":err.__str__()
                }
        else:
            return {
                "message":"Password Is Different, Plz Try Again"
            }

    
    def delete(self,uid):   # 1.5 delete /user/delete
        """
        Delete Account
        """
        try:
            adminAuth.delete_user(uid)
            return {
                "message":"Delete Successed"}
        except adminAuth.UserNotFoundError:
            return {
                    "message":"User Not Found",
                }

    
    def put(self, uid):  # 2.3 PUT /user/uid
        """
        Update Member Information
        """
        try :
            find_user = adminAuth.get_user(uid)
            if find_user:
                data = User.parser.parse_args()
                print(data)
                userUpdate = adminAuth.update_user(
                    find_user.uid,
                    phone_number = data["phone_number"],
                    display_name = data["display_name"],
                    photo_url = data["photo_url"],
                    disabled = data["disabled"]
                )
                return {
                    "message":"Sucessfully updated user",
                    "user":{
                        "uid":userUpdate.uid,
                        "display_name":userUpdate.display_name,
                        "photo_url":userUpdate.photo_url,
                        "disabled":userUpdate.disabled
                    }
                }
            else:
                return {"message": "user not found"}, 204
        except adminAuth.UserNotFoundError:
            return {
                    "message":"User Not Found",
                }

    def get(self, uid):   #2.5 /user/uid
        """
        Get Member Detail
        """
        # jsonData = User.parser.parse_args()
        print(uid)
        try:
            find_user = adminAuth.get_user(uid) #檢查 firebase 是否有此 uid
            if find_user: 
                getUser = UserModel.get_by_uid(find_user.uid) # 從 Mysql 取得會員資料
                print(getUser.as_dict())
                return {
                    "message":"Susscced",
                    "userInfo":getUser.as_dict()
                }
        except adminAuth.UserNotFoundError:
            return {
                    "message":"User ID does not exist."
                }
        except ValueError:
            return {
                "message":"User ID is None, empty or malformed."
            }