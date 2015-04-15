import pyaudio,threading
from socket import *
from Tkinter import *

class FPA(object):
    def __init__(self, dest, HOSTSOCK, base):
        self.destName = dest.split("@")[0]
        self.destIP = dest.split("@")[1]
        self.HOSTSOCK = HOSTSOCK
        self.p = pyaudio.PyAudio()
        self.outStream = self.p.open(format = pyaudio.paInt16,channels = 1,rate = 10240,output = True) #speaker stream
        self.breaker = 0
        self.close = 0
        thread = threading.Thread(target=self.run, args=())
        thread.daemon = True
        thread.start()
        self.top = Toplevel()
        self.top.title("In Call - "+self.destName)
        self.top.resizable(width=FALSE, height=FALSE)
        self.winPosX = base.winfo_geometry().split("+")[1]
        self.winPosY = base.winfo_geometry().split("+")[2]
        self.top.geometry("375x275+"+str(int(self.winPosX)-400)+"+"+self.winPosY)
        self.popup = Frame(self.top, width=375, height=275,bg="#FFFFFF")
        self.popup.place(x=0,y=0)

        self.colorBar = Canvas(self.popup,bg="#FF9500", height=7, width=375, highlightthickness=0)
        self.colorBar.place(x=0,y=0)

        self.callStatus = Label(self.popup, text="Calling...", fg="#555555", font=("Arial", 15), bg="#FFFFFF")
        self.callStatus.place(relx=0.5, rely=0.13, anchor=CENTER)
        Label(self.popup, text=self.destName, fg="#AA0998", font=("Arial", 15), bg="#FFFFFF").place(relx=0.5, rely=0.25, anchor=CENTER)

        userIcon = Label(self.popup, width=10, height=4, bg="#EEEEEE")
        userIcon.place(relx=0.5, rely=0.45, anchor=CENTER)
        self.closeCall = Button(self.popup, text="Disconnect", fg="#FFFFFF", bg="#777777", width=13,pady=3, relief=FLAT, font=("Arial", 10, "normal"),command=lambda:topCloseAudio(self))
        self.closeCall.place(x=60,y=210)
        sendIM = Button(self.popup, text="Send Message", fg="#FFFFFF", bg="#777777", width=13,pady=3, relief=FLAT, font=("Arial", 10, "normal"))
        sendIM.place(x=200,y=210)
        Label(self.popup, text="IM to be implemented soon",fg="#AAAAAA", font=("Arial", 8), bg="#FFFFFF").place(x=197,y=245)
        self.top.protocol("WM_DELETE_WINDOW",lambda:topCloseAudio(self))
 
    def run(self):
        self.audioSock = socket(AF_INET, SOCK_STREAM)
        try:
            self.audioSock.bind(('', 50001))
        except error, msg:
            print 'Bind failed. Error code: ' + str(msg[0]) + ' Message ' + msg[1]
            sys.exit()

        self.audioSock.listen(10)
        audCli, audAddr = self.audioSock.accept()
        cliReply = audCli.recv(1024)
        if cliReply == "CVATP_ACALL_REJECT" and self.close == 1:
            audCli.shutdown(1)
        elif cliReply == "CVATP_ACALL_REJECT" and self.close == 0:
            self.callStatus.config(text="Disconnected")
            self.closeCall.config(state=DISABLED)
            self.colorBar.config(bg="#EE0000")
            self.close = 1
            audCli.shutdown(1)
        elif cliReply == "CVATP_ACALL_ACCEPT":
            self.callStatus.config(text="In Call")
            self.colorBar.config(bg="#22DD22")
            audCli.shutdown(1)
            self.AudioSock()

    def AudioSock(self):
        self.close = 0
        chunk = 512
        inStream = self.p.open(format = pyaudio.paInt16,channels = 1,rate = 10240,input = True,frames_per_buffer = chunk) #microphone stream
        sPort = 50005
        backlog = 5
        size = 512
        audSock = socket(AF_INET, SOCK_STREAM)
        audSock.bind(('',sPort))
        audSock.listen(backlog)
        self.client, address = audSock.accept()
        while True:
            data = self.client.recv(size)
            if data == "CVATP_AC_C_DCON":
                self.closeCall.config(state=DISABLED)
                self.callStatus.config(text="Disconnected")
                self.colorBar.config(bg="#EE0000")
                self.client.close()
                self.close = 1
                break
            else:
                self.outStream.write(data)
            if self.breaker == 1:
                break
        self.outStream.stop_stream()

class FPV(object):
    def __init__(self, dest, HOSTSOCK, base):
        self.destName = dest.split("@")[0]
        self.destIP = dest.split("@")[1]
        self.HOSTSOCK = HOSTSOCK
        self.p = pyaudio.PyAudio()
        self.outStream = self.p.open(format = pyaudio.paInt16,channels = 1,rate = 10240,output = True) #speaker stream
        self.breaker = 0
        self.close = 0
        thread = threading.Thread(target=self.run, args=())
        thread.daemon = True
        thread.start()
        self.top = Toplevel()
        self.top.title("In Call - "+self.destName)
        self.top.resizable(width=FALSE, height=FALSE)
        self.winPosX = base.winfo_geometry().split("+")[1]
        self.winPosY = base.winfo_geometry().split("+")[2]
        self.top.geometry("375x275+"+str(int(self.winPosX)-400)+"+"+self.winPosY)
        self.popup = Frame(self.top, width=375, height=275,bg="#FFFFFF")
        self.popup.place(x=0,y=0)

        self.colorBar = Canvas(self.popup,bg="#FF9500", height=7, width=375, highlightthickness=0)
        self.colorBar.place(x=0,y=0)

        self.callStatus = Label(self.popup, text="Calling...", fg="#555555", font=("Arial", 15), bg="#FFFFFF")
        self.callStatus.place(relx=0.5, rely=0.13, anchor=CENTER)
        Label(self.popup, text=self.destName, fg="#AA0998", font=("Arial", 15), bg="#FFFFFF").place(relx=0.5, rely=0.25, anchor=CENTER)

        userIcon = Label(self.popup, width=10, height=4, bg="#EEEEEE")
        userIcon.place(relx=0.5, rely=0.45, anchor=CENTER)
        self.closeCall = Button(self.popup, text="Disconnect", fg="#FFFFFF", bg="#777777", width=13,pady=3, relief=FLAT, font=("Arial", 10, "normal"),command=lambda:topCloseVideo(self))
        self.closeCall.place(x=60,y=210)
        sendIM = Button(self.popup, text="Send Message", fg="#FFFFFF", bg="#777777", width=13,pady=3, relief=FLAT, font=("Arial", 10, "normal"))
        sendIM.place(x=200,y=210)
        Label(self.popup, text="IM to be implemented soon",fg="#AAAAAA", font=("Arial", 8), bg="#FFFFFF").place(x=197,y=245)
        self.top.protocol("WM_DELETE_WINDOW",lambda:topCloseVideo(self))
 
    def run(self):
        self.audioSock = socket(AF_INET, SOCK_STREAM)
        try:
            self.audioSock.bind(('', 50001))
        except error, msg:
            print 'Bind failed. Error code: ' + str(msg[0]) + ' Message ' + msg[1]
            sys.exit()

        self.audioSock.listen(10)
        audCli, audAddr = self.audioSock.accept()
        cliReply = audCli.recv(1024)
        if cliReply == "CVATP_VCALL_REJECT" and self.close == 1:
            audCli.shutdown(1)
        elif cliReply == "CVATP_VCALL_REJECT" and self.close == 0:
            self.callStatus.config(text="Disconnected")
            self.closeCall.config(state=DISABLED)
            self.colorBar.config(bg="#EE0000")
            self.close = 1
            audCli.shutdown(1)
        elif cliReply == "CVATP_VCALL_ACCEPT":
            self.callStatus.config(text="In Call")
            self.colorBar.config(bg="#22DD22")
            audCli.shutdown(1)
            self.AudioSock()

    def AudioSock(self):
        self.close = 0
        chunk = 512
        inStream = self.p.open(format = pyaudio.paInt16,channels = 1,rate = 10240,input = True,frames_per_buffer = chunk) #microphone stream
        sPort = 50005
        backlog = 5
        size = 512
        audSock = socket(AF_INET, SOCK_STREAM)
        audSock.bind(('',sPort))
        audSock.listen(backlog)
        self.client, address = audSock.accept()
        while True:
            data = self.client.recv(size)
            if data == "CVATP_VC_C_DCON":
                self.closeCall.config(state=DISABLED)
                self.callStatus.config(text="Disconnected")
                self.colorBar.config(bg="#EE0000")
                self.client.close()
                self.close = 1
                break
            else:
                self.outStream.write(data)
            if self.breaker == 1:
                break
        self.outStream.stop_stream()

def topCloseAudio(obj):
    if obj.close == 0:
        try:
            obj.client.send("CVATP_AC_S_DCON")
            obj.breaker = 1
        except:
            obj.HOSTSOCK.sendall("CVATP_AC_S_DCON")
            obj.HOSTSOCK.sendall(obj.destName+"@"+obj.destIP)
            obj.close = 1
    else:
        pass
    obj.top.destroy()

def topCloseVideo(obj):
    if obj.close == 0:
        try:
            obj.client.send("CVATP_VC_S_DCON")
            obj.breaker = 1
        except:
            obj.HOSTSOCK.sendall("CVATP_VC_S_DCON")
            obj.HOSTSOCK.sendall(obj.destName+"@"+obj.destIP)
            obj.close = 1
    else:
        pass
    obj.top.destroy()



