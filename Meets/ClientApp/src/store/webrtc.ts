import { AppThunk, RootState } from './createStore';
import { createAction, createSlice } from '@reduxjs/toolkit';
import WebRTCService, { IRoomInfo } from '../api/WebRTCService';
import * as signalR from '@microsoft/signalr';

interface IWebRTCService {
    connection: signalR.HubConnection
    startServerSignaling: () => void
    leaveRoom: () => void
    createRoom: (reveiverId: any) => void
    joinRoom: (room: IRoomInfo) => void
    grabWebCamVideo: () => void
}

export interface IWebRTCState {
    //webRTCService: IWebRTCService
    connectionStatusMessage: string
    _localVideo: HTMLVideoElement
    _remoteVideo: HTMLVideoElement

    connection: signalR.HubConnection
    _peerConnection: RTCPeerConnection

    _myRoomId: any
    localStream: any // MediaStream
    remoteStream: any // MediaStream
    _isInitiator: boolean
    _hasRoomJoined: boolean

    _dataChannel: any // RTCDataChannel

    error: string | null
}

const initialState: IWebRTCState = {
    //webRTCService: {} as IWebRTCService,
    connectionStatusMessage: '',
    _localVideo: {} as HTMLVideoElement,
    _remoteVideo: {} as HTMLVideoElement,

    connection: {} as signalR.HubConnection,
    _peerConnection: {} as RTCPeerConnection,

    _myRoomId: 0,
    localStream: null,
    remoteStream: null,
    _isInitiator: false,
    _hasRoomJoined: false,

    _dataChannel: null,

    error: null
};

const webRTCSlice = createSlice({
    name: 'webrtc',
    initialState: initialState,
    reducers: {
        setConnectionStatusMessage: (state, action) => {
            state.connectionStatusMessage = action.payload;
        },
        setLocalVideoRef: (state, action) => {
            state._localVideo = action.payload;
        },
        setRemoteVideoRef: (state, action) => {
            state._remoteVideo = action.payload;
        },
        //////////////////////////////////////////////////////
        connectionCreated: (state, action: { payload: { newConnection: any, newPeerConnection: any } }) => {
            state.connection = action.payload.newConnection;
            state._peerConnection = action.payload.newPeerConnection;
        },
        //////////////////////////////////////////////////////
        setMyRoomId: (state, action) => {
            state._myRoomId = action.payload;
        },
        setLocalStream: (state, action) => {
            state.localStream = action.payload;
        },
        setRemoteStream: (state, action) => {
            state.remoteStream = action.payload;
        },
        setIsInitiator: (state, action) => {
            state._isInitiator = action.payload;
        },
        setHasRoomJoined: (state, action) => {
            state._hasRoomJoined = action.payload;
        },
        //////////////////////////////////////////////////////
        setDataChannel: (state, action) => {
            state._dataChannel = action.payload;
        },
        //////////////////////////////////////////////////////
        failed: (state, action) => {
            state.error = action.payload;
        }
    }
});

const { actions, reducer: webRTCReducer } = webRTCSlice;
const {
    setConnectionStatusMessage,
    setLocalVideoRef,
    setRemoteVideoRef,
    connectionCreated,
    setMyRoomId,
    setLocalStream,
    setRemoteStream,
    setIsInitiator,
    setHasRoomJoined,
    setDataChannel,
    failed
} = actions;

export const setLocalVideo = (localVideo: HTMLVideoElement): AppThunk => async (dispatch) => {
    await dispatch(setLocalVideoRef(localVideo));
}

export const setRemoteVideo = (remoteVideo: HTMLVideoElement): AppThunk => async (dispatch) => {
    await dispatch(setRemoteVideoRef(remoteVideo));
}

/****************************************************************************
* Создание signalR соединения и RTCPeer соединения
****************************************************************************/
export const createConnections = (): AppThunk => async (dispatch) => {
    try {
        //let webRTCService = new WebRTCService();
        //const rtcservice: IWebRTCService = { ...service };
        const newConnection = new signalR.HubConnectionBuilder().withUrl('/WebRTCHub').build();

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
        const newPeerConnection = new RTCPeerConnection();

        await dispatch(connectionCreated({ newConnection, newPeerConnection }));
    } catch (err: any) {
        dispatch(failed(err.message));
        throw err;
    }
};

/****************************************************************************
* Signaling server
****************************************************************************/
export const startSignalingServer = (): AppThunk => async (dispatch, getState) => {
    const rtc = getState().webrtc;

    try {
        await rtc.connection.start();

        rtc.connection.on('updateRoom', () => { //data
            //let obj: IRoomInfo = JSON.parse(data);
            //this._setRoomData(obj);

            //toast.info('Video call', {
            //    onClick: () => {
            //        this.joinRoom(obj);
            //    }
            //});
            //$(roomTable).DataTable().clear().rows.add(obj).draw();
        });

        // room created
        rtc.connection.on('created', async (meetingId) => {
            console.log('Created room', meetingId);
            //this._roomNameTxt.disabled = true;
            //this._createRoomBtn.disabled = true;
            await dispatch(setHasRoomJoined(true));
            await dispatch(setConnectionStatusMessage('You created Room ' + meetingId + '. Waiting for participants...'));
            await dispatch(setMyRoomId(meetingId));
            await dispatch(setIsInitiator(true));
            //this._hasRoomJoined = true;
            //this._connectionStatusMessage.innerText = 'You created Room ' + roomId + '. Waiting for participants...';
            //this._myRoomId = roomId;
            //this._isInitiator = true;
        });

        // user has joined room
        rtc.connection.on('joined', async (meetingId) => {
            console.log('This peer has joined room', meetingId);
            await dispatch(setMyRoomId(meetingId));
            await dispatch(setIsInitiator(false));
            //this._myRoomId = roomId;
            //this._isInitiator = false;
        });

        // error
        rtc.connection.on('error', (message) => {
            alert(message);
        });

        rtc.connection.on('ready', async () => {
            console.log('Socket is ready');
            //this._roomNameTxt.disabled = true;
            //this._createRoomBtn.disabled = true;
            await dispatch(setHasRoomJoined(true));
            await dispatch(setConnectionStatusMessage('Connecting...'));
            //this._hasRoomJoined = true;
            //this._connectionStatusMessage.innerText = 'Connecting...';
            await dispatch(_createPeerConnection(rtc._isInitiator));
            //this._createPeerConnection(this._isInitiator); //configuration
        });

        rtc.connection.on('message', async (message) => {
            console.log('Client received message:', message);
            await dispatch(_signalingMessageCallback(message));
            //this._signalingMessageCallback(message);
        });

        rtc.connection.on('leave', async () => {
            console.log(`Peer leaving room.`);
            // If peer did not create the room, re-enter to be creator.
            await dispatch(setConnectionStatusMessage(`Other peer left room ${rtc._myRoomId}.`));
            //this._connectionStatusMessage.innerText = `Other peer left room ${this._myRoomId}.`;
        });
    } catch (err: any) {
        dispatch(failed(err.message));
        throw err;
    }

};

/****************************************************************************
* Leave room (useEffect)
****************************************************************************/
export const leaveRoom = (): AppThunk => async (dispatch, getState) => {
    const rtc = getState().webrtc;

    if (rtc._hasRoomJoined) {
        console.log(`Unloading window. Notifying peers in ${rtc._myRoomId}.`);
        rtc.connection.invoke("LeaveRoom", rtc._myRoomId).catch(function (err) {
            return console.error(err.toString());
        });
    }
};

/****************************************************************************
* Room management
****************************************************************************/
export const createRoom = (meetingId: any, companionId: any): AppThunk => async (dispatch, getState) => {
    //let name = this._roomNameTxt.value;
    const rtc = getState().webrtc;

    rtc.connection.invoke("CreateRoom", meetingId, companionId).catch(function (err) {
        return console.error(err.toString());
    });
};

export const joinRoom = (meetingId: any): AppThunk => async (dispatch, getState) => {
    const rtc = getState().webrtc;

    if (rtc._hasRoomJoined) {
        alert('You already joined the room. Please use a new tab or window.');
    } else {
        //var data = $(roomTable).DataTable().row($(this).parents('tr')).data();
        rtc.connection.invoke("Join", meetingId).catch(function (err) {
            return console.error(err.toString());
        });
    }
};

/****************************************************************************
* User media (webcam)
****************************************************************************/

export const grabWebCamVideo = (): AppThunk => async (dispatch) => {
    console.log('Getting user media (video) ...');
    try {
        let stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        });

        await dispatch(_gotStream(stream));
    } catch (err: any) {
        dispatch(failed(err.message));
        throw err;
    }
};

const _gotStream = (stream: MediaStream): AppThunk => async (dispatch, getState) => {
    const rtc = getState().webrtc;

    console.log('getUserMedia video stream URL:', stream);
    await dispatch(setLocalStream(stream));
    //rtc._localStream = stream;
    // addStream -> addTrack
    rtc._peerConnection.addTrack(rtc.localStream);
    // здесь устаавливается стрим видео
    rtc._localVideo.srcObject = stream;
};

/****************************************************************************
* WebRTC peer connection and data channel
****************************************************************************/

//const _dataChannel: any; // RTCDataChannel

const _signalingMessageCallback = (message: any): AppThunk => async (dispatch, getState) => {
    const rtc = getState().webrtc;

    if (message.type === 'offer') {
        console.log('Got offer. Sending answer to peer.');
        rtc._peerConnection.setRemoteDescription(new RTCSessionDescription(message), function () { },
            _logError);

        try {
            let res = await rtc._peerConnection.createAnswer(); // this._onLocalSessionCreated, _logError
            await dispatch(_onLocalSessionCreated(res));
        } catch (err: any) {
            _logError(err);
        }

    } else if (message.type === 'answer') {
        console.log('Got answer.');
        rtc._peerConnection.setRemoteDescription(new RTCSessionDescription(message), function () { },
            _logError);

    } else if (message.type === 'candidate') {
        rtc._peerConnection.addIceCandidate(new RTCIceCandidate({
            candidate: message.candidate
        }));

    }
}

const _createPeerConnection = (isInitiator: boolean, config?: any): AppThunk => async (dispatch, getState) => {
    const rtc = getState().webrtc;

    console.log('Creating Peer connection as initiator?', isInitiator, 'config:', config);

    // send any ice candidates to the other peer
    rtc._peerConnection.onicecandidate = async (event) => {
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
            await dispatch(_sendMessage(rtc._peerConnection.localDescription));
            //this._sendMessage(rtc._peerConnection.localDescription);
        }
    };

    rtc._peerConnection.ontrack = async (event) => {
        console.log('icecandidate ontrack event:', event);
        await dispatch(setRemoteStream(event.streams[0]));
        // здесь устаавливается стрим видео
        rtc._remoteVideo.srcObject = event.streams[0];
    };

    if (isInitiator) {
        console.log('Creating Data Channel');
        //_dataChannel = this._peerConnection.createDataChannel('sendDataChannel');
        await dispatch(setDataChannel(rtc._peerConnection.createDataChannel('sendDataChannel')));
        await dispatch(_onDataChannelCreated(rtc._dataChannel));
        //this._onDataChannelCreated(rtc._dataChannel);

        console.log('Creating an offer');
        try {
            let res = await rtc._peerConnection.createOffer(); // this._onLocalSessionCreated, _logError
            await dispatch(_onLocalSessionCreated(res));
        } catch (err: any) {
            _logError(err);
        }
    } else {
        rtc._peerConnection.ondatachannel = async (event) => {
            console.log('ondatachannel:', event.channel);
            await dispatch(setDataChannel(event.channel));
            //this._dataChannel = event.channel;
            await dispatch(_onDataChannelCreated(rtc._dataChannel));
            //this._onDataChannelCreated(this._dataChannel);
        };
    }
}

const _onLocalSessionCreated = (desc: any): AppThunk => async (dispatch, getState) => {
    const rtc = getState().webrtc;

    console.log('local session created:', desc);
    rtc._peerConnection.setLocalDescription(desc, function () {
        // Trickle ICE
        //console.log('sending local desc:', peerConn.localDescription);
        //sendMessage(peerConn.localDescription);
    }, _logError);
}

const _onDataChannelCreated = (channel: RTCDataChannel): AppThunk => async (dispatch, getState) => {
    console.log('onDataChannelCreated:', channel);

    channel.onopen = async () => {
        console.log('Channel opened!!!');
        await dispatch(setConnectionStatusMessage('Channel opened!!'));
        //this._connectionStatusMessage.innerText = 'Channel opened!!';
        //fileInput.disabled = false;
    };

    channel.onclose = async () => {
        console.log('Channel closed.');
        await dispatch(setConnectionStatusMessage('Channel closed.'));
        //this._connectionStatusMessage.innerText = 'Channel closed.';
    }

    //channel.onmessage = this._onReceiveMessageCallback();
}


/****************************************************************************
* Send message to signaling server
****************************************************************************/
const _sendMessage = (message: any): AppThunk => async (dispatch, getState) => {
    const rtc = getState().webrtc;

    console.log('Client sending message: ', message);
    rtc.connection.invoke("SendMessage", rtc._myRoomId, message).catch(function (err) {
        return console.error(err.toString());
    });
}

/****************************************************************************
* Auxiliary functions
****************************************************************************/
const _logError = (err: any) => {
    if (!err) return;
    if (typeof err === 'string') {
        console.warn(err);
    } else {
        console.warn(err.toString(), err);
    }
}

export default webRTCReducer;