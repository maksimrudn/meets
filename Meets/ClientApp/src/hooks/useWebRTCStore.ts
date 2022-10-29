import { useDispatch, useSelector } from "react-redux";
import WebRTCService from "../api/WebRTCService";
import { RootState } from "../store/createStore";
import {
    createConnections,
    createRoom,
    grabWebCamVideo,
    IWebRTCState,
    joinRoom,
    leaveRoom,
    setLocalVideo,
    setRemoteVideo,
    startSignalingServer
} from "../store/webrtc";

interface IWebRTCStore extends IWebRTCState {
    createConnections: () => Promise<void> //service: WebRTCService
    startSignalingServer: () => Promise<void>
    leaveRoom: () => Promise<void>
    createRoom: (meetingId: any, companionId: any) => Promise<void>
    joinRoom: (meetingId: any) => Promise<void>
    grabWebCamVideo: () => Promise<void>

    setLocalVideo: (localVideo: HTMLVideoElement) => Promise<void>
    setRemoteVideo: (remoteVideo: HTMLVideoElement) => Promise<void>
}

function useWebRTCStore(): IWebRTCStore {
    const webrtc = useSelector((state: RootState) => state.webrtc);
    const dispatch = useDispatch();

    return {
        ...webrtc,
        createConnections: async () => { await dispatch(createConnections()); },
        startSignalingServer: async () => { await dispatch(startSignalingServer()); },
        leaveRoom: async () => { await dispatch(leaveRoom()); },
        createRoom: async (meetingId, companionId) => { await dispatch(createRoom(meetingId, companionId)); },
        joinRoom: async (meetingId) => { await dispatch(joinRoom(meetingId)); },
        grabWebCamVideo: async () => { await dispatch(grabWebCamVideo()); },
        setLocalVideo: async (localVideo) => { await dispatch(setLocalVideo(localVideo)); },
        setRemoteVideo: async (remoteVideo) => { await dispatch(setRemoteVideo(remoteVideo)); },
    };
}

export default useWebRTCStore;