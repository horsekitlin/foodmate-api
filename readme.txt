Before

You must install python 3.7 or higher

Step1 install pip:
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python get-pip.py

Step2 install virtualenv:
pip install virtualenv
virtualenv --python=python3.7 .env

Step3 activate virtualenv:
source .env/bin/activate
pip install -r requirements.txt

Step4 flask run:
export FLASK_APP="foodmate:create_app()"
export FLASK_ENV=development
flask run