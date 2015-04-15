from Tkinter import *
from xml.dom.minidom import parse
import xml.dom.minidom

actPeers = [[],[],[],[]]

def GetInternalIP():
    return str(gethostbyname(getfqdn()))

def getServer():
    DOMTree = xml.dom.minidom.parse("servData.xml")
    collection = DOMTree.documentElement
    servData = []
    servers = collection.getElementsByTagName("server")
    for server in servers:
        servData.append(server.getAttribute("title"))
        ip = server.getElementsByTagName('ip')[0]
        servData.append(ip.childNodes[0].data)
        port = server.getElementsByTagName('port')[0]
        servData.append(port.childNodes[0].data)
        description = server.getElementsByTagName('description')[0]
        servData.append(description.childNodes[0].data)
    return servData

def getUserData():
    DOMTree = xml.dom.minidom.parse("userData.xml")
    collection = DOMTree.documentElement
    userData = {'name':'','status':'','email':'','description':''}
    users = collection.getElementsByTagName("user")
    for user in users:
        nick = user.getElementsByTagName('nick')[0]
        userData['name'] = nick.childNodes[0].data
        status = user.getElementsByTagName('status')[0]
        userData['status'] = status.childNodes[0].data
        email = user.getElementsByTagName('email')[0]
        userData['email'] = email.childNodes[0].data
        description = user.getElementsByTagName('description')[0]
        userData['description'] = description.childNodes[0].data
    return userData

    	
def LoadConnectionInfo(ChatLog, EntryText):
    if EntryText != '':
        ChatLog.config(state=NORMAL)
        if ChatLog.index('end') != None:
            ChatLog.insert(END, EntryText+'\n')
            ChatLog.config(state=DISABLED)
            ChatLog.yview(END)

def LoadOtherUsers(cPeerList, data):
    if data != '':
        DOMTree = xml.dom.minidom.parseString(data)
        collection = DOMTree.documentElement
        peers = collection.getElementsByTagName("user")
        cPeerList.delete(ALL)
        #actPeers = [[],[],[],[]]
        i=0
        for peer in peers:
            ip = peer.getElementsByTagName('ip')[0].childNodes[0].data
            user = peer.getElementsByTagName('name')[0].childNodes[0].data
            port = peer.getElementsByTagName('port')[0].childNodes[0].data
            status = peer.getElementsByTagName('status')[0].childNodes[0].data
            #if user == getUserData()['name']:
            #    continue
            if 1==1:
                if status == "Available":
                    color = "#00DD00"
                elif status == "Busy":
                    color = "#DD0000"
                elif status == "On Call":
                    color = "#FF8000"
                elif status == "Idle":
                    color = "#AAAAAA"
                actPeers[0].append(i)
                actPeers[1].append(user)
                actPeers[2].append(status)
                actPeers[3].append(ip)
                coord = 0,50*i,284,50+50*i
                actPeers[0][-1] = cPeerList.create_rectangle(coord, fill="#FFFFFF", tags="peerClick", outline="#DDDDDD")
                cPeerList.create_text(33,7+50*i,anchor=NW,font=("Arial",10, "normal"), text=user)
                cPeerList.create_oval(16, 10+50*i, 25, 19+50*i, fill=color, width=0)
                cPeerList.create_text(33,27+50*i,anchor=NW,font=("Arial",10, "normal"),text=status, fill="#777777")
                cPeerList.create_text(240,15+50*i,font=("Arial",9, "bold"), text="Video Call", fill="#09AA98",tags=["call","vcall"])
                cPeerList.create_text(240,35+50*i,font=("Arial",9, "bold"), text="Audio Call", fill="#AA0998",tags=["call","acall"])
                i = i+1

def noCall(event,cPeerList):
    cPeerList.config(cursor="left_ptr")

def toCall(event,cPeerList):
    cPeerList.config(cursor="hand2")

def onMouseOut(event,cPeerList):
    for peer in actPeers[0]:
        cPeerList.itemconfig(peer,fill="#FFFFFF")

def motion(event,cPeerList):
    x, y = event.x, event.y
    peerIndex = y/50
    for peer in actPeers[0]:
        if (actPeers[0].index(peer) == peerIndex) and x<283:
            cPeerList.itemconfig(actPeers[0][peerIndex],fill="#EEEEEE")
        else:
            cPeerList.itemconfig(peer,fill="#FFFFFF")

