# Use unified settings file
import pymysql
pymysql.install_as_MySQLdb()

from .settings import *  # noqa: F401, F403

