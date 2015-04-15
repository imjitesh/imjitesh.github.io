import socket
import sys
from thread import *

HOST = ''
PORT = 402

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
print 'Server created'

try:
    s.bind((HOST, PORT))

except socket.error, msg:
    print 'Bind failed. Error code: ' + str(msg[0]) + ' Message ' + msg[1]
    sys.exit()

s.listen(10)

conn = []
addr = []
names = []
statuses = []

def onlineusers(conn, addr):
    server_reply = "<users>"
    for ip in addr:
        server_reply = server_reply + "<user><ip>"+ip[0]+"</ip><port>"+str(ip[1])+"</port><name>"+names[addr.index(ip)]+ "</name><status>"+statuses[addr.index(ip)]+"</status></user>"
    server_reply = server_reply+"</users>"
    return server_reply

def clientthread(connn,caddr):
    try:
        while True:
            reply = connn.recv(1024)
            if reply:
                if reply == 'CVATP_CLOSE':
                    try:
                        connn.shutdown(1)
                        names.remove(names[conn.index(connn)])
                        conn.remove(connn)
                        addr.remove(caddr)
                        break
                    except:
                        print "Connection Close Error"
                if reply == 'CVATP_START':
                    try:
                        userData = eval(connn.recv(1024))
                        names.append(userData['name'])
                        statuses.append(userData['status'])
                        for client in conn:
                            client.send(onlineusers(conn,addr))
                    except:
                        print "Connection Start Error"
                if reply == 'CVATP_ACALL':
                    try:
                        dest = connn.recv(1024)
                        destUser = dest.split("@")[0]
                        client = conn[names.index(destUser)]
                        client.send("CVATP_ACALL")
                        srcUser = names[conn.index(connn)]
                        client.send(srcUser+"@"+caddr[0])
                    except:
                        print "Audio Call Error"
                if reply == 'CVATP_VCALL':
                    try:
                        dest = connn.recv(1024)
                        destUser = dest.split("@")[0]
                        client = conn[names.index(destUser)]
                        client.send("CVATP_VCALL")
                        srcUser = names[conn.index(connn)]
                        client.send(srcUser+"@"+caddr[0])
                    except:
                        print "Video Call Error"
                if reply == "CVATP_ACALL_REJECT":
                    try:
                        src = conn.recv(1024)
                        srcUser = src.split("@")[0]
                        host = conn[names.index(srcUser)]
                        host.send("CVATP_ACALL_REJECT")
                    except:
                        print "Audio Call Reject Error"
                if reply == "CVATP_VCALL_REJECT":
                    try:
                        src = conn.recv(1024)
                        srcUser = src.split("@")[0]
                        host = conn[names.index(srcUser)]
                        host.send("CVATP_VCALL_REJECT")
                    except:
                        print "Video Call Reject Error"
                if reply == "CVATP_CHANGE":
                    userData = eval(connn.recv(1024))
                    statuses[names.index(userData['name'])] = userData['status']
                if reply == "CVATP_AC_S_DCON":
                    try:
                        dest = connn.recv(1024)
                        destUser = dest.split("@")[0]
                        client = conn[names.index(destUser)]
                        client.send("CVATP_AC_S_DCON")
                        srcUser = names[conn.index(connn)]
                        client.send(srcUser+"@"+caddr[0])
                    except:
                        print "Audio Call Disconnected Error"

                if reply == "CVATP_VC_S_DCON":
                    try:
                        dest = connn.recv(1024)
                        destUser = dest.split("@")[0]
                        client = conn[names.index(destUser)]
                        client.send("CVATP_VC_S_DCON")
                        srcUser = names[conn.index(connn)]
                        client.send(srcUser+"@"+caddr[0])
                    except:
                        print "Audio Call Disconnected Error"
                if not reply:
                    break
        
        connn.close()
    except:
            connn.shutdown(1)
            names.remove(names[conn.index(connn)])
            conn.remove(connn)
            addr.remove(caddr)
            print "Client went haywire"

while True:
    cli, add = s.accept()
    conn.append(cli)
    addr.append(add)

    start_new_thread(clientthread ,(cli,add))
    
s.close()
