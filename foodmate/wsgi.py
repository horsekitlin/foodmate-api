import os
import sys

sys.path.insert(0, os.getcwd())

from foodmate import create_app

application = create_app(config_name="production")