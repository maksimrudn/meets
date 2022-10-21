import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as signalR from '@microsoft/signalr';
import WebRTCService, { IRoomInfo } from '../../api/WebRTCService';

import './WebRTC.scss';

interface IWebRTCProps {
    isCaller: boolean
    receiverId: any
}

export default function WebRTC(props: IWebRTCProps) {
    const [roomData, setRoomData] = useState<IRoomInfo>({} as IRoomInfo);
    //const [connection, setConnection] = useState<signalR.HubConnection>({} as signalR.HubConnection);

    //const [roomNameTxt]
    const roomNameTxt = useRef<HTMLInputElement>();
    const createRoomBtn = useRef<HTMLButtonElement>();
    const roomTable = useRef<HTMLTableElement>();
    const connectionStatusMessage = useRef<HTMLParagraphElement>();

    const localVideo = useRef<HTMLVideoElement>();
    const remoteVideo = useRef<HTMLVideoElement>();

    //let webRTCService: {} as ;

    //let createRoomOnclick: () => void;
    let joinRoomOnClick: (room: IRoomInfo) => void;

    useEffect(() => {
        let webRTCService = new WebRTCService(
            roomNameTxt.current,
            createRoomBtn.current,
            roomTable.current,
            connectionStatusMessage.current,
            localVideo.current,
            remoteVideo.current,
            //roomsData,
            setRoomData
        );

        //createRoomOnclick = webRTCService.createRoom;
        joinRoomOnClick = webRTCService.joinRoom;

        webRTCService.grabWebCamVideo();
        webRTCService.startServerSignaling();

        if (props.isCaller) {
            webRTCService.createRoom(props.receiverId);
        } else {
            webRTCService.joinRoom(roomData);
        }

        return () => {
            webRTCService.leaveRoom();
        };
    });

    //useEffect(() => {

    //}, [connection]);

    return (
        <div className="WebRTC" hidden>

            <div className="RoomCreate">
                <label>Room Name:</label>
                <input type="text" id="roomNameTxt" ref={roomNameTxt} />
                {/*<button id="createRoomBtn" ref={createRoomBtn} onClick={() => createRoomOnclick()}>Create</button>*/}
            </div>

            {/********************************************************************************
             * данные о созданных комнатах:
             * - ид комнаты
             * - название
             * - кнопка для подкючения
             *
             * (ориг. ипольз. datatables.net)
             ********************************************************************************/}
            {/*<div className="Rooms" hidden>*/}
            {/*    <table id="roomTable" className="display" style={{ width: '100%' }} ref={roomTable}>*/}
            {/*        <thead>*/}
            {/*            <tr>*/}
            {/*                <th>Room ID</th>*/}
            {/*                <th>Name</th>*/}
            {/*                <th></th>*/}
            {/*            </tr>*/}
            {/*        </thead>*/}
            {/*        <tbody>*/}
            {/*            {roomsData.length > 0 && roomsData.map(item =>*/}
            {/*                <tr>*/}
            {/*                    <th>{item.roomId}</th>*/}
            {/*                    <th>{item.name}</th>*/}
            {/*                    <th><button className="JoinButton" onClick={() => joinRoomOnClick(item)}>Join!</button></th>*/}
            {/*                </tr>*/}
            {/*            )}*/}
            {/*        </tbody>*/}
            {/*    </table>*/}
            {/*</div>*/}

            <div className="borderLine"></div>

            {/********************************************************************************
             * VideoChat:
             * - connectionStatusMessage статус подключения
             * - localVideo захваченое видео текущего пользователя (sender)
             * - remoteVideo захваченное видео подключенного пользователя (receiver)
             ********************************************************************************/}
            <div className="VideoChat">
                <div className="ConnectionStatus">
                    <p id="connectionStatusMessage" ref={connectionStatusMessage}>*You can create your own room or join the other room.</p>
                </div>
                <h5>Video chat</h5>
                <div className="VideoArea">
                    <video id="localVideo" autoPlay playsInline ref={localVideo}></video>
                    <video id="remoteVideo" autoPlay playsInline ref={remoteVideo}></video>
                </div>

                {/**       file sharing       **/}
                {/*<h5>File sharing</h5>
                <div id="fileShare">
                    <input type="file" id="fileInput" />
                    <button id="sendFileBtn" className="sendFileBtn">Send</button>
                </div>
                <table id="fileTable" className="fileTable">
                    <thead>
                        <tr>
                            <th>Received Files</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>*/}
            </div>

        </div>
    );
}