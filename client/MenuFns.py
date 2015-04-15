from Tkinter import *
from ListFns import *

import ttk

def saveSettings(sNick,sMail,sStatus,sDesc,winSet=0):
    fData = file("userData.xml","w")
    fData.write("<users><user><nick>"+sNick+"</nick><status>"+sStatus+"</status><email>"+sMail+"</email><description>"+sDesc+"</description></user></users>")
    fData.close()
    if winSet == 0:
        pass
    else:
        winSet.destroy()

def closeWithoutSave(winSet):
    winSet.destroy()

def sConnect(sAdd, winCon):
    fData = file("servData.xml","w")
    fData.write("<servers><server title='VideoChatServer'><ip>"+sAdd.split(':')[0]+"</ip><port>"+sAdd.split(':')[1])
    fData.write("</port><description>Host for Video Chat in BITS Pilani</description></server></servers>")
    fData.close()
    winCon.destroy()

def winConnect(event):
    
    winCon = Tk()
    winCon.title("Connect To Server")
    winCon.geometry("350x80")
    winCon.resizable(width=FALSE, height=FALSE)

    frame = Frame(winCon, width=300, height=300, bg="#EEEEEE")
    frame.pack()

    Label(winCon, text="Address").place(x=10,y=10)
    add = Text(winCon, width=25, bd=2, height=1)
    add.place(x=10,y=30)
    
    okBut = Button(winCon, text="Ok", width=8, command=lambda: sConnect(add.get("1.0",'end-1c'),winCon))
    okBut.place(x=270,y=10)
    cancelBut = Button(winCon, text="Cancel", width=8)
    cancelBut.place(x=270,y=40)
    winCon.mainloop()

def winSettings(base):
    style = ttk.Style()
    style.map("C.TButton",
        foreground=[('pressed', 'red'), ('active', 'blue')],
        background=[('pressed', 'black'), ('active', 'white')]
    )
    winSet = Tk()
    winSet.title("Settings")
    winPosX = base.winfo_geometry().split("+")[1]
    winPosY = base.winfo_geometry().split("+")[2]
    winSet.geometry("700x500+"+str(int(winPosX)-300)+"+"+winPosY)
    winSet.resizable(width=FALSE, height=FALSE)

    frame1 = Frame(winSet, width=200, height=440, bg="#FFFFFF",bd=2,relief=GROOVE)
    frame1.place(x=10,y=10)

    frame2 = Frame(winSet, width=460, height=440, bg="#FFFFFF",bd=2,relief=GROOVE)
    frame2.place(x=230,y=10)

    w = LabelFrame(frame2, width=430,height=220,bd=1,text="General Information",bg="#FFF",font=("Helvetica", 9))
    w.place(x=10,y=10)

    Label(w, text="Name", font=("Helvetica", 9, "normal"),bg="#FFF").place(x=135,y=5,anchor=NE)
    nick = Text(w, width=38,highlightthickness=1,highlightbackground="#BBB",highlightcolor="#999", relief=FLAT, height=1,pady=3, font=("Helvetica", 9))
    nick.place(x=140,y=5)
    nick.insert(END,getUserData()['name'])

    Label(w, text="E-Mail", font=("Helvetica", 9, "normal"),bg="#FFF").place(x=135,y=40,anchor=NE)
    mail = Text(w, width=38,highlightthickness=1,highlightbackground="#BBB",highlightcolor="#999", relief=FLAT, height=1,pady=3, font=("Helvetica", 9))
    mail.place(x=140,y=40)
    mail.insert(END,getUserData()['email'])

    Label(w, text="Description", font=("Helvetica", 9, "normal"),bg="#FFF").place(x=135,y=75,anchor=NE)
    desc = Text(w, width=38,highlightthickness=1,highlightbackground="#BBB",highlightcolor="#999", relief=FLAT, height=1,pady=3, font=("Helvetica", 9))
    desc.place(x=140,y=75)
    desc.insert(END,getUserData()['description'])

    Label(w, text="Avatar", font=("Helvetica", 9),bg="#FFF").place(x=135,y=115,anchor=NE)
    
    okBut = ttk.Button(winSet, style="C.TButton", text="OK", width=9, command=lambda: saveSettings(nick.get("1.0",'end-1c'),mail.get("1.0",'end-1c'),getUserData()['status'],desc.get('1.0','end-1c'),winSet))
    okBut.place(x=540,y=460)
    cancelBut = ttk.Button(winSet, style="C.TButton", text="Cancel", width=9, command=lambda: closeWithoutSave(winSet))
    cancelBut.place(x=620,y=460)
    winSet.mainloop()

def winHelp():
    winSet = Toplevel()
    winSet.title("Settings")
    winSet.geometry("300x300")
    winSet.resizable(width=FALSE, height=FALSE)

    frame = Frame(winSet, width=300, height=300, bg="#EEEEEE")
    frame.place(x=0,y=0)

    Label(frame, text="Name", font=("Arial", 10, "normal")).place(x=10,y=20)
    nick = Text(frame, width=25, bd=2, height=1, font=("Arial", 10, "normal"))
    nick.place(x=60,y=22)
    nick.insert(END,getUserData()['name'])

    Label(frame, text="Email", font=("Arial", 10, "normal")).place(x=10,y=60)
    mail = Text(frame, width=25, bd=2, height=1, font=("Arial", 10, "normal"))
    mail.place(x=60,y=62)
    mail.insert(END,getUserData()['email'])

    Label(frame, text="Description", font=("Arial", 10, "normal")).place(x=10,y=100)
    desc = Text(frame, width=25, bd=2, height=1, font=("Arial", 10, "normal"))
    desc.place(x=60,y=122)
    desc.insert(END,getUserData()['description'])

    Label(frame, text="Avatar").place(x=10,y=165)
    
    okBut = Button(frame, text="Ok", width=5, command=lambda: saveSettings(nick.get("1.0",'end-1c'),getUserData()['status'],mail.get("1.0",'end-1c'),desc.get('1.0','end-1c'),winSet))
    okBut.place(x=100,y=250)
    cancelBut = Button(frame, text="Cancel", width=8, command=lambda: closeWithoutSave(winSet))
    cancelBut.place(x=170,y=250)
    winSet.mainloop()
