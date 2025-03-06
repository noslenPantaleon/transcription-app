from ..constants import UPLOAD_DIRECTORY
import os


def create_upload_directory():
    if not os.path.exists(UPLOAD_DIRECTORY):
        os.makedirs(UPLOAD_DIRECTORY)