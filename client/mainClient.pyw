import threading, Tkinter, ImageTk, thread
from socket import *
import ttk

#Homegrown Modules
from ListFns import *
from MenuFns import *
from FirstPerson import *
from SecondPerson import *

WindowTitle = 'BITS Chat'

HOST = getServer()[1]
PORT = int(getServer()[2])

s = socket(AF_INET, SOCK_STREAM)

def MainClientClose():
    try:
        s.sendall("CVATP_CLOSE")
        s.close()
        base.destroy()
    except:
        base.destroy()

def makeVidCall(event):
    s.sendall("CVATP_VCALL")
    if type(event) == unicode:
        name = event.split("@")[1]
        ip = event.split("@")[2]
    else:
        name = actPeers[1][event.widget.find_closest(event.x, event.y)[0]/7]
        ip = actPeers[3][event.widget.find_closest(event.x, event.y)[0]/7]
    s.sendall(name + "@" + ip)
    HOSTSOCK = s
    fPerson = FPV(name+"@"+ip,HOSTSOCK,base)

###################### this opens when user clicks on Audio Call on the User List ####################
def makeAudCall(event,base):
    s.sendall("CVATP_ACALL")
    if type(event) == unicode:
        name = event.split("@")[1]
        ip = event.split("@")[2]
    else:
        name = actPeers[1][event.widget.find_closest(event.x, event.y)[0]/7]
        ip = actPeers[3][event.widget.find_closest(event.x, event.y)[0]/7]
    s.sendall(name + "@" + ip)
    HOSTSOCK = s
    fPerson = FPA(name+"@"+ip,HOSTSOCK,base)
    
#####################################################################################################

def acceptAudio(popup,host,cliObj):
    sHOST = host.split("@")[1]
    sPORT = 50001
    audioSock = socket(AF_INET, SOCK_STREAM)
    audioSock.connect((sHOST, sPORT))
    audioSock.sendall("CVATP_ACALL_ACCEPT")
    popup.destroy()

    client = SPA(host,cliObj,base)

def rejectAudio(popup,host,cliObj):
    HOST = host.split("@")[1]
    PORT = 50001
    audioSock = socket(AF_INET, SOCK_STREAM)
    audioSock.connect((HOST, PORT))
    audioSock.sendall("CVATP_ACALL_REJECT")
    audioSock.close()
    popup.destroy()

def FPRejectAudio(host, cliObj):
    HOST = host.split("@")[1]
    PORT = 50001
    audioSock = socket(AF_INET, SOCK_STREAM)
    audioSock.connect((HOST, PORT))
    audioSock.sendall("CVATP_ACALL_REJECT")
    audioSock.close()

def acceptVideo(popup,host,cliObj):
    sHOST = host.split("@")[1]
    sPORT = 50001
    audioSock = socket(AF_INET, SOCK_STREAM)
    audioSock.connect((sHOST, sPORT))
    audioSock.sendall("CVATP_VCALL_ACCEPT")
    popup.destroy()
    client = SPV(host,cliObj,base)

def rejectVideo(popup,host,cliObj):
    HOST = host.split("@")[1]
    PORT = 50001
    audioSock = socket(AF_INET, SOCK_STREAM)
    audioSock.connect((HOST, PORT))
    audioSock.sendall("CVATP_VCALL_REJECT")
    audioSock.close()
    popup.destroy()

def FPRejectVideo(host, cliObj):
    HOST = host.split("@")[1]
    PORT = 50001
    audioSock = socket(AF_INET, SOCK_STREAM)
    audioSock.connect((HOST, PORT))
    audioSock.sendall("CVATP_VCALL_REJECT")
    audioSock.close()

def AudioDialog(base, host, cliObj):
    popup = Frame(base, name="cliAccRejWin", width=300, height=395,bg="#FFFFFF")
    popup.place(x=0,y=160)
    Label(popup, text=host.split("@")[0], fg="#000000", font=("Arial", 20, "normal"), bg="#FFFFFF").place(relx=0.5, rely=0.1, anchor=CENTER)
    Label(popup, text="Audio Call", fg="#AA0998", font=("Arial", 17, "normal"), bg="#FFFFFF").place(relx=0.5, rely=0.55, anchor=CENTER)
    userIcon = Label(popup, width=10, height=4, bg="#EEEEEE")
    userIcon.place(relx=0.5, rely=0.325, anchor=CENTER)
    
    yes = Button(popup, text="Accept",font=("Arial", 11, "normal"), fg="#FFFFFF", bg="#555555",relief=FLAT, width=10,command=lambda:acceptAudio(popup,host,cliObj))
    yes.place(relx=0.25, rely=0.8, anchor=CENTER)
    no = Button(popup, text="Reject",font=("Arial", 11, "normal"), fg="#FFFFFF", bg="#555555",relief=FLAT, width=10,command=lambda:rejectAudio(popup,host,cliObj))
    no.place(relx=0.75, rely=0.8, anchor=CENTER)

def VideoDialog(base, host, cliObj):
    popup = Frame(base, name="cliAccRejWin", width=300, height=395,bg="#FFFFFF")
    popup.place(x=0,y=160)
    Label(popup, text=host.split("@")[0], fg="#000000", font=("Arial", 20, "normal"), bg="#FFFFFF").place(relx=0.5, rely=0.1, anchor=CENTER)
    Label(popup, text="Video Call", fg="#AA0998", font=("Arial", 17, "normal"), bg="#FFFFFF").place(relx=0.5, rely=0.55, anchor=CENTER)
    userIcon = Label(popup, width=10, height=4, bg="#EEEEEE")
    userIcon.place(relx=0.5, rely=0.325, anchor=CENTER)
    
    yes = Button(popup, text="Accept",font=("Arial", 11, "normal"), fg="#FFFFFF", bg="#555555",relief=FLAT, width=10,command=lambda:acceptVideo(popup,host,cliObj))
    yes.place(relx=0.25, rely=0.8, anchor=CENTER)
    no = Button(popup, text="Reject",font=("Arial", 11, "normal"), fg="#FFFFFF", bg="#555555",relief=FLAT, width=10,command=lambda:rejectVideo(popup,host,cliObj))
    no.place(relx=0.75, rely=0.8, anchor=CENTER)

base = Tk()
height = base.winfo_screenheight()
width = base.winfo_screenwidth()
posX = width-500
base.title(WindowTitle)
base.geometry("300x570+"+str(posX)+"+50")
base.resizable(width=FALSE, height=TRUE)
base.minsize(300,570)

bdrop = Frame(base, width=300, height=155, bg="#FFFFFF")
bdrop.place(x=0,y=0)

frame=Frame(base,width=300,height=395, bg="#FFFFFF")
frame.place(x=0,y=155)

#Create a Chat window
ChatLog = Text(base, bd=0, bg="white", height="3", width="50", font="Arial",)
ChatLog.insert(END, "Connecting to "+ HOST+":"+str(PORT)+ "...\n")
ChatLog.config(state=DISABLED)

#logo of the application
logoIcon = ImageTk.PhotoImage(file='img/logo_small.png')
logo = Tkinter.Canvas(bdrop, bg="white", bd=0, highlightthickness=0)
logo.place(x=15,y=-5, height=110, width=155, anchor=NW)
logo.create_image(0,0, image = logoIcon, anchor = NW, tags=["call","vcall"])

#setting label
settings = Button(bdrop, text="Settings", fg="blue",bg="white", cursor="hand2", font=("Helvetica", 9, "underline"),anchor=NW,relief=FLAT, command=lambda:winSettings(base))
settings.place(x=205,y=1)

#help label
vhelp = Button(bdrop, text="Help", fg="blue",bg="white", cursor="hand2", font=("Helvetica", 9, "underline"),anchor=NW,relief=FLAT, command=lambda:winHelp())
vhelp.place(x=260,y=1)

#color of status
colState = Canvas(bdrop,bg="white", width=10, height=10, bd=0, highlightthickness=0)
colState.create_oval(0, 0, 9, 9, fill="#00DD00", width=0)
colState.place(x=16,y=86,anchor=NW)

#name of the user
name = Label(bdrop, text=getUserData()['name'], fg="black",bg="white", cursor="hand2" ,anchor=NW, font=("Helvetica", 10, "normal"))
name.place(x=28,y=80)

#status of the user
stat = StringVar(bdrop)
def stateChanged(*args):
    if stat.get() == "Available":
        color = "#00DD00"
    elif stat.get() == "Busy":
        color = "#DD0000"
    elif stat.get() == "On Call":
        color = "#FF8000"
    elif stat.get() == "Idle":
        color = "#AAAAAA"
    colState.create_oval(0, 0, 9, 9, fill=color, width=0)
    saveSettings(getUserData()['name'],getUserData()['email'],stat.get(),getUserData()['description'])
    s.sendall("CVATP_CHANGE")
    s.sendall(str(getUserData()))
stat.set("Available")
stat.trace("w",stateChanged)

status = ttk.Combobox(bdrop, values=("Available", "Busy", "On Call", "Idle"), textvariable=stat)
status.config(width=15, height=4, state='readonly', font=("Helvetica", 10)) 
status.place(x=30,y=100)

#magnifying glass icon
imSearch = ImageTk.PhotoImage(file = "img/search.png")
serCan = Tkinter.Canvas(bdrop, bg="#FFFFFF", bd=0, highlightthickness=1, highlightbackground="#999999")
serCan.place(x=3,y=128,height=27,width=28)
serCan.create_image(4,3, image = imSearch, anchor = NW, tags=["call","vcall"])

#search bar
search = Text(bdrop, width=25, bd=2, relief=GROOVE, padx=3, pady=4, height=1, font=("Helvetica", 10, "normal"))
search.place(x=30,y=128)
Tkinter.Canvas(bdrop, bg="#FFFFFF", bd=0, highlightthickness=0).place(x=30,y=129,height=25,width=2)

#Tkinter.Canvas(bdrop, bg="#000000", bd=0, highlightthickness=0).place(x=140,y=105,height=16,width=16)

#filter option
variable = StringVar(bdrop)
variable.set("Name")
serFilter = OptionMenu(bdrop, variable, "Name", "Hostel", "Tag")
serFilter.config(bd=2,highlightthickness=0,relief=GROOVE, width=6, height=1, padx=6) 
serFilter.place(x=218,y=128)

cPeerList = Tkinter.Canvas(frame,scrollregion=(0, 0, 285, 2000), bg="#FFFFFF", bd=0, highlightthickness=0)
vbar=ttk.Scrollbar(frame,orient=VERTICAL)
vbar.place(x=283,y=5, height=390)
vbar.config(command=cPeerList.yview)
cPeerList.config(yscrollcommand=vbar.set)
cPeerList.place(x=-1,y=5,height=550,width=285)

cPeerList.bind('<Motion>', lambda event:motion(event,cPeerList))
cPeerList.bind('<Leave>', lambda event:onMouseOut(event,cPeerList))

cPeerList.tag_bind("call", '<Enter>', lambda event:toCall(event,cPeerList))
cPeerList.tag_bind("call", '<Leave>', lambda event:noCall(event,cPeerList))

cPeerList.tag_bind("vcall", '<Button-1>', makeVidCall)
cPeerList.tag_bind("acall", '<Button-1>', lambda event:makeAudCall(event,base))

#connection status
connState = Label(base, text="Connecting "+HOST+":"+str(PORT), width=53, fg="#555555",bg="white", anchor=NW, font=("Helvetica", 8, "normal"))
connState.place(x=0,y=551)

base.protocol("WM_DELETE_WINDOW",MainClientClose)

class MainClient(object):
    def __init__(self):
        thread = threading.Thread(target=self.ReceiveData, args=())
        thread.daemon = True
        thread.start()

    def ReceiveData(self):
        try:
            s.connect((HOST, PORT))
            connState.config(text="Connected "+HOST+":"+str(PORT), fg="#33AA33")
            s.sendall("CVATP_START")
            s.sendall(str(getUserData()))
        except:
            connState.config(text="Unable To Connect "+HOST+":"+str(PORT), fg="#DD3333")
            return
        while 1:
            try:
                data = s.recv(1024)
            except:
                break
            if data != '':
                if data == "CVATP_ACALL":
                    data = s.recv(1024)
                    AudioDialog(base,data,self)

                elif data == "CVATP_VCALL":
                    data = s.recv(1024)
                    VideoDialog(base,data,self)
                    
                elif data == "CVATP_AC_S_DCON":
                    FPRejectAudio(s.recv(1024),self)
                    base.nametowidget("cliAccRejWin").place(x=0,y=600)

                elif data == "CVATP_VC_S_DCON":
                    FPRejectVideo(s.recv(1024),self)
                    base.nametowidget("cliAccRejWin").place(x=0,y=600)
                else:
                    LoadOtherUsers(cPeerList, data)
            else:
                break
        s.close()

client = MainClient()
base.mainloop()
