import * as signalR from '@microsoft/signalr';

export interface IRoomInfo {
    roomId: any
    name: string
    //button: JSX.Element | string
}

export default class WebRTCService {
    private _roomNameTxt: HTMLInputElement;
    private _createRoomBtn: HTMLButtonElement;
    private _roomTable: HTMLTableElement;
    private _connectionStatusMessage: HTMLParagraphElement;
    //private _fileInput;
    //private _sendFileBtn;
    //private _fileTable;
    private _localVideo: HTMLVideoElement;
    private _remoteVideo: HTMLVideoElement;

    //private _roomsData: IRoomInfo[];
    private _setRoomsData: (roomsData: IRoomInfo[]) => void;

    connection;
    private _peerConnection;

    private _myRoomId: any;
    private _localStream: any; // MediaStream
    private _remoteStream: any; // MediaStream
    //private _fileReader;
    private _isInitiator = false;
    private _hasRoomJoined = false;


    constructor(roomNameTxt: HTMLInputElement,
        createRoomBtn: HTMLButtonElement,
        roomTable: HTMLTableElement,
        connectionStatusMessage: HTMLParagraphElement,
        localVideo: HTMLVideoElement,
        remoteVideo: HTMLVideoElement,
        //roomsData: IRoomInfo[],
        setRoomsData: (roomsData: IRoomInfo[]) => void
    ) {
        this._roomNameTxt = roomNameTxt;
        this._createRoomBtn = createRoomBtn;
        this._roomTable = roomTable;
        this._connectionStatusMessage = connectionStatusMessage;
        this._localVideo = localVideo;
        this._remoteVideo = remoteVideo;
        //this._roomsData = roomsData;
        this._setRoomsData = setRoomsData;

        this.connection = new signalR.HubConnectionBuilder().withUrl('/WebRTCHub').build();
        /****************************************************************************
         * WebRTC соединение может не работать из-за NAT и брэндмауэра (ограничит. сетей)
         * чтобы спавиться с NAT и брэндмауэрами, обычно используются серверы STUN и TURN
         *
         * (в примере используется только stun сервер в конфигурации при создании RTCPeerConnection)
         ***************************************************************************/
        //const configuration = {
        //    'iceServers': [{
        //        'urls': 'stun:stun.l.google.com:19302'
        //    }]
        //};
        this._peerConnection = new RTCPeerConnection(); // configuration
    }

    /****************************************************************************
    * Signaling server
    ****************************************************************************/

    // Connect to the signaling server
    startServerSignaling = () => {
        this.connection.start().then(() => {
            // room updated
            this.connection.on('updateRoom', (data) => {
                let obj: IRoomInfo[] = JSON.parse(data);
                this._setRoomsData(obj);
                //$(roomTable).DataTable().clear().rows.add(obj).draw();
            });

            // room created
            this.connection.on('created', (roomId) => {
                console.log('Created room', roomId);
                this._roomNameTxt.disabled = true;
                this._createRoomBtn.disabled = true;
                this._hasRoomJoined = true;
                this._connectionStatusMessage.innerText = 'You created Room ' + roomId + '. Waiting for participants...';
                this._myRoomId = roomId;
                this._isInitiator = true;
            });

            // user has joined room
            this.connection.on('joined', (roomId) => {
                console.log('This peer has joined room', roomId);
                this._myRoomId = roomId;
                this._isInitiator = false;
            });

            // error
            this.connection.on('error', (message) => {
                alert(message);
            });

            this.connection.on('ready', () => {
                console.log('Socket is ready');
                this._roomNameTxt.disabled = true;
                this._createRoomBtn.disabled = true;
                this._hasRoomJoined = true;
                this._connectionStatusMessage.innerText = 'Connecting...';
                this._createPeerConnection(this._isInitiator); //configuration
            });

            this.connection.on('message', (message) => {
                console.log('Client received message:', message);
                this._signalingMessageCallback(message);
            });

            this.connection.on('leave', () => {
                console.log(`Peer leaving room.`);
                // If peer did not create the room, re-enter to be creator.
                this._connectionStatusMessage.innerText = `Other peer left room ${this._myRoomId}.`;
            });

            //window.addEventListener('unload', () => {
            //    if (this._hasRoomJoined) {
            //        console.log(`Unloading window. Notifying peers in ${this._myRoomId}.`);
            //        this.connection.invoke("LeaveRoom", this._myRoomId).catch(function (err) {
            //            return console.error(err.toString());
            //        });
            //    }
            //});

            //Get room list.
        //    connection.invoke("GetRoomInfo").catch(function (err) {
        //        return console.error(err.toString());
        //    });
        }).catch((err) => {
            return console.error(err.toString());
        });
    }

    /****************************************************************************
    * Leave room (useEffect)
    ****************************************************************************/
    leaveRoom = () => {
        if (this._hasRoomJoined) {
            console.log(`Unloading window. Notifying peers in ${this._myRoomId}.`);
            this.connection.invoke("LeaveRoom", this._myRoomId).catch(function (err) {
                return console.error(err.toString());
            });
        }
    }

    /****************************************************************************
    * Room management
    ****************************************************************************/
    createRoomBtnOnClick = () => {
        let name = this._roomNameTxt.value;
        this.connection.invoke("CreateRoom", name).catch(function (err) {
            return console.error(err.toString());
        });
    }

    joinRoomBtnOnClick = (room: IRoomInfo) => {
        if (this._hasRoomJoined) {
            alert('You already joined the room. Please use a new tab or window.');
        } else {
            //var data = $(roomTable).DataTable().row($(this).parents('tr')).data();
            this.connection.invoke("Join", room.roomId).catch(function (err) {
                return console.error(err.toString());
            });
        }
    }

    /****************************************************************************
    * User media (webcam)
    ****************************************************************************/

    grabWebCamVideo = () => {
        console.log('Getting user media (video) ...');
        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        })
            .then(this._gotStream)
            .catch(function (e) {
                alert('getUserMedia() error: ' + e.name);
            });
    }

    private _gotStream = (stream: MediaStream) => {
        console.log('getUserMedia video stream URL:', stream);
        this._localStream = stream;
        // addStream -> addTrack
        this._peerConnection.addTrack(this._localStream);
        this._localVideo.srcObject = stream;
    }

    /****************************************************************************
    * WebRTC peer connection and data channel
    ****************************************************************************/

    private _dataChannel: any; // RTCDataChannel

    private _signalingMessageCallback = (message: any) => {
        if (message.type === 'offer') {
            console.log('Got offer. Sending answer to peer.');
            this._peerConnection.setRemoteDescription(new RTCSessionDescription(message), function () { },
                this._logError);
            this._peerConnection.createAnswer(this._onLocalSessionCreated, this._logError);

        } else if (message.type === 'answer') {
            console.log('Got answer.');
            this._peerConnection.setRemoteDescription(new RTCSessionDescription(message), function () { },
                this._logError);

        } else if (message.type === 'candidate') {
            this._peerConnection.addIceCandidate(new RTCIceCandidate({
                candidate: message.candidate
            }));

        }
    }

    private _createPeerConnection = (isInitiator: boolean, config?: any) => {
        console.log('Creating Peer connection as initiator?', isInitiator, 'config:',
            config);

        // send any ice candidates to the other peer
        this._peerConnection.onicecandidate = (event) => {
            console.log('icecandidate event:', event);
            if (event.candidate) {
                // Trickle ICE
                //sendMessage({
                //    type: 'candidate',
                //    label: event.candidate.sdpMLineIndex,
                //    id: event.candidate.sdpMid,
                //    candidate: event.candidate.candidate
                //});
            } else {
                console.log('End of candidates.');
                // Vanilla ICE
                this._sendMessage(this._peerConnection.localDescription);
            }
        };

        this._peerConnection.ontrack = (event) => {
            console.log('icecandidate ontrack event:', event);
            this._remoteVideo.srcObject = event.streams[0];
        };

        if (isInitiator) {
            console.log('Creating Data Channel');
            this._dataChannel = this._peerConnection.createDataChannel('sendDataChannel');
            this._onDataChannelCreated(this._dataChannel);

            console.log('Creating an offer');
            this._peerConnection.createOffer(this._onLocalSessionCreated, this._logError);
        } else {
            this._peerConnection.ondatachannel = (event) => {
                console.log('ondatachannel:', event.channel);
                this._dataChannel = event.channel;
                this._onDataChannelCreated(this._dataChannel);
            };
        }
    }

    private _onLocalSessionCreated = (desc: any) => {
        console.log('local session created:', desc);
        this._peerConnection.setLocalDescription(desc, function () {
            // Trickle ICE
            //console.log('sending local desc:', peerConn.localDescription);
            //sendMessage(peerConn.localDescription);
        }, this._logError);
    }

    private _onDataChannelCreated = (channel: RTCDataChannel) => {
        console.log('onDataChannelCreated:', channel);

        channel.onopen = () => {
            console.log('Channel opened!!!');
            this._connectionStatusMessage.innerText = 'Channel opened!!';
            //fileInput.disabled = false;
        };

        channel.onclose = () => {
            console.log('Channel closed.');
            this._connectionStatusMessage.innerText = 'Channel closed.';
        }

        //channel.onmessage = this._onReceiveMessageCallback();
    }


    /****************************************************************************
    * Send message to signaling server
    ****************************************************************************/
    private _sendMessage = (message: any) => {
        console.log('Client sending message: ', message);
        this.connection.invoke("SendMessage", this._myRoomId, message).catch(function (err) {
            return console.error(err.toString());
        });
    }

    /****************************************************************************
    * Auxiliary functions
    ****************************************************************************/
    private _logError = (err: any) => {
        if (!err) return;
        if (typeof err === 'string') {
            console.warn(err);
        } else {
            console.warn(err.toString(), err);
        }
    }
}



//let connection = new signalR.HubConnectionBuilder().withUrl('/WebRTCHub').build();

/****************************************************************************
* Initial setup
****************************************************************************/

/****************************************************************************
 * WebRTC соединение может не работать из-за NAT и брэндмауэра (ограничит. сетей)
 * чтобы спавиться с NAT и брэндмауэрами, обычно используются серверы STUN и TURN
 * 
 * (в примере используется только stun сервер в конфигурации при создании RTCPeerConnection)
 ***************************************************************************/
//const configuration = {
//    'iceServers': [{
//        'urls': 'stun:stun.l.google.com:19302'
//    }]
//};

//const peerConn = new RTCPeerConnection(); // configuration

function startServerSignaling() {

}