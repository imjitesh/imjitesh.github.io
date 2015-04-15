from distutils.core import setup
import py2exe
#import cv2
from PIL import Image, ImageTk
import Tkinter as tk
from ListFns import *
from MenuFns import *
from FirstPerson import *
from SecondPerson import *
import ttk
#from multiprocessing import Process, Queue

Mydata_files = [('files', ['C:\Python27\Projects\python_bits_chat\jitesh\servData.xml'])]



setup(
    windows=['mainClient.pyw'],
    data_files = Mydata_files

)

