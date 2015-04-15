import pyaudio,threading
from socket import *
from Tkinter import *

class SPA(object):
    def __init__(self, sHost, cliObj, base):
        self.sHost = sHost
        self.cliObj = cliObj
        self.audSock = socket(AF_INET, SOCK_STREAM)
        self.audSock.connect((self.sHost.split("@")[1],50005))
        self.p = pyaudio.PyAudio()
        self.inStream = self.p.open(format = pyaudio.paInt16,channels = 1,rate = 10240,input = True,frames_per_buffer = 512) #microphone stream
        self.breaker = 0
        self.servClose = 0
        thread1 = threading.Thread(target=self.run, args=())
        thread1.daemon = True
        thread1.start()

        thread2 = threading.Thread(target=self.test, args=())
        thread2.daemon = True
        thread2.start()

        self.top = Toplevel()
        self.top.geometry("375x275")
        self.top.title("In Call - "+self.sHost.split("@")[0])
        self.top.resizable(width=FALSE, height=FALSE)
        self.winPosX = base.winfo_geometry().split("+")[1]
        self.winPosY = base.winfo_geometry().split("+")[2]
        self.top.geometry("375x275+"+str(int(self.winPosX)-400)+"+"+self.winPosY)
        self.popup = Frame(self.top, width=375, height=275,bg="#FFFFFF")
        self.popup.place(x=0,y=0)

        self.colorBar = Canvas(self.popup,bg="#22DD22", height=7, width=375, highlightthickness=0)
        self.colorBar.place(x=0,y=0)

        self.callStatus = Label(self.popup, text="In Call", fg="#555555", font=("Arial", 15, "normal"), bg="#FFFFFF")
        self.callStatus.place(relx=0.5, rely=0.13, anchor=CENTER)
        Label(self.popup, text=self.sHost.split("@")[0], fg="#AA0998", font=("Arial", 15, "normal"), bg="#FFFFFF").place(relx=0.5, rely=0.25, anchor=CENTER)

        userIcon = Label(self.popup, width=10, height=4, bg="#EEEEEE")
        userIcon.place(relx=0.5, rely=0.45, anchor=CENTER)

        self.closeCall = Button(self.popup, text="Disconnect", fg="#FFFFFF", bg="#777777", width=13,pady=3, relief=FLAT, font=("Arial", 10, "normal"),command=self.cliACDCon)
        self.closeCall.place(x=60,y=210)
        sendIM = Button(self.popup, text="Send Message", fg="#FFFFFF", bg="#777777", width=13,pady=3, relief=FLAT, font=("Arial", 10, "normal"))
        sendIM.place(x=200,y=210)
        Label(self.popup, text="IM to be implemented soon",fg="#AAAAAA", font=("Arial", 8, "normal"), bg="#FFFFFF").place(x=197,y=245)
        self.top.protocol("WM_DELETE_WINDOW",self.cliACDCon)

    def test(self):
        servData = self.audSock.recv(512)
        if servData == "CVATP_AC_S_DCON":
            self.callStatus.config(text="Disconnected")
            self.closeCall.config(state=DISABLED)
            self.colorBar.config(bg="#EE0000")
            self.breaker = 1
            self.servClose = 1
            self.cliObj.flagConn = 0
            self.audSock.close()
            self.inStream.stop_stream()
        
    def run(self):
        outStream = self.p.open(format = pyaudio.paInt16,channels = 1,rate = 10240,output = True) #speaker stream
        backlog = 5
        size = 1024
        while True:
            self.audSock.send(self.inStream.read(512))
            #outStream.write(audSock.recv(512))
            if self.breaker == 1:
                break
    def cliACDCon(self):
        self.breaker = 1
        if self.servClose == 0:
            self.audSock.send("CVATP_AC_C_DCON")
        self.audSock.close()
        self.cliObj.flagConn = 0
        self.top.destroy()

class SPV(object):
    def __init__(self, sHost, cliObj, base):
        self.sHost = sHost
        self.cliObj = cliObj
        self.audSock = socket(AF_INET, SOCK_STREAM)
        self.audSock.connect((self.sHost.split("@")[1],50005))
        self.p = pyaudio.PyAudio()
        self.inStream = self.p.open(format = pyaudio.paInt16,channels = 1,rate = 10240,input = True,frames_per_buffer = 512) #microphone stream
        self.breaker = 0
        self.servClose = 0
        thread1 = threading.Thread(target=self.run, args=())
        thread1.daemon = True
        thread1.start()

        thread2 = threading.Thread(target=self.test, args=())
        thread2.daemon = True
        thread2.start()

        self.top = Toplevel()
        self.top.geometry("375x275")
        self.top.title("In Call - "+self.sHost.split("@")[0])
        self.top.resizable(width=FALSE, height=FALSE)
        self.winPosX = base.winfo_geometry().split("+")[1]
        self.winPosY = base.winfo_geometry().split("+")[2]
        self.top.geometry("375x275+"+str(int(self.winPosX)-400)+"+"+self.winPosY)
        self.popup = Frame(self.top, width=375, height=275,bg="#FFFFFF")
        self.popup.place(x=0,y=0)

        self.colorBar = Canvas(self.popup,bg="#22DD22", height=7, width=375, highlightthickness=0)
        self.colorBar.place(x=0,y=0)

        self.callStatus = Label(self.popup, text="In Call", fg="#555555", font=("Arial", 15, "normal"), bg="#FFFFFF")
        self.callStatus.place(relx=0.5, rely=0.13, anchor=CENTER)
        Label(self.popup, text=self.sHost.split("@")[0], fg="#AA0998", font=("Arial", 15, "normal"), bg="#FFFFFF").place(relx=0.5, rely=0.25, anchor=CENTER)

        userIcon = Label(self.popup, width=10, height=4, bg="#EEEEEE")
        userIcon.place(relx=0.5, rely=0.45, anchor=CENTER)

        self.closeCall = Button(self.popup, text="Disconnect", fg="#FFFFFF", bg="#777777", width=13,pady=3, relief=FLAT, font=("Arial", 10, "normal"),command=self.cliACDCon)
        self.closeCall.place(x=60,y=210)
        sendIM = Button(self.popup, text="Send Message", fg="#FFFFFF", bg="#777777", width=13,pady=3, relief=FLAT, font=("Arial", 10, "normal"))
        sendIM.place(x=200,y=210)
        Label(self.popup, text="IM to be implemented soon",fg="#AAAAAA", font=("Arial", 8, "normal"), bg="#FFFFFF").place(x=197,y=245)
        self.top.protocol("WM_DELETE_WINDOW",self.cliACDCon)

    def test(self):
        servData = self.audSock.recv(512)
        if servData == "CVATP_VC_S_DCON":
            self.callStatus.config(text="Disconnected")
            self.closeCall.config(state=DISABLED)
            self.colorBar.config(bg="#EE0000")
            self.breaker = 1
            self.servClose = 1
            self.cliObj.flagConn = 0
            self.audSock.close()
            self.inStream.stop_stream()
        
    def run(self):
        outStream = self.p.open(format = pyaudio.paInt16,channels = 1,rate = 10240,output = True) #speaker stream
        backlog = 5
        size = 1024
        while True:
            self.audSock.send(self.inStream.read(512))
            #outStream.write(audSock.recv(512))
            if self.breaker == 1:
                break
    def cliACDCon(self):
        self.breaker = 1
        if self.servClose == 0:
            self.audSock.send("CVATP_VC_C_DCON")
        self.audSock.close()
        self.cliObj.flagConn = 0
        self.top.destroy()

