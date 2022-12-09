export interface CreatePeerConnectionProps {
    remoteDescription?: string;
    iceServers?: RTCIceServer[];
    onChannelOpen: () => any;
    onMessageReceived: (message: string) => any;
}
export interface CreatePeerConnectionResponse {
    localDescription: string;
    setAnswerDescription: (answerDescription: string) => void;
    sendMessage: (message: string) => void;
}
export declare function createPeerConnection({ remoteDescription, iceServers, onChannelOpen, onMessageReceived, }: CreatePeerConnectionProps): Promise<CreatePeerConnectionResponse>;
