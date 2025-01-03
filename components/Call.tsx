"use client";

import AgoraRTC, {
  AgoraRTCProvider,
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";
import { useState } from "react";

function Call(props: { appId: string; channelName: string }) {
  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );

  return (
    <AgoraRTCProvider client={client}>
      <Videos channelName={props.channelName} AppID={props.appId} />
    </AgoraRTCProvider>
  );
}

function Videos(props: { channelName: string; AppID: string }) {
  const { AppID, channelName } = props;

  // Local tracks for microphone and camera
  const { isLoading: isLoadingMic, localMicrophoneTrack, error: micError } =
    useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack, error: camError } =
    useLocalCameraTrack();

  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  // Publish local tracks
  usePublish([localMicrophoneTrack, localCameraTrack]);

  // Join the channel
  useJoin({
    appid: AppID,
    channel: channelName,
    token: null,
  });

  // Access the RTC client
  const client = useRTCClient();

  // State for camera and microphone
  const [isCameraOn, setCameraOn] = useState(true);
  const [isMicOn, setMicOn] = useState(true);

  // Toggle camera
  const toggleCamera = () => {
    if (localCameraTrack) {
      localCameraTrack.setEnabled(!isCameraOn);
      setCameraOn(!isCameraOn);
    }
  };

  // Toggle microphone
  const toggleMic = () => {
    if (localMicrophoneTrack) {
      localMicrophoneTrack.setEnabled(!isMicOn);
      setMicOn(!isMicOn);
    }
  };

  // Leave the call
  const handleLeave = async () => {
    if (client) {
      await client.leave();
      window.location.href = "/"; // Redirect to home or another page
    }
  };

  if (isLoadingMic || isLoadingCam) {
    return (
      <div className="flex flex-col items-center pt-40">
        Loading devices...
      </div>
    );
  }

  if (micError || camError) {
    return (
      <div className="flex flex-col items-center pt-40 text-red-500">
        {micError && <p>Error accessing microphone: {micError.message}</p>}
        {camError && <p>Error accessing camera: {camError.message}</p>}
        <p>Please ensure your devices are not in use by another application.</p>
      </div>
    );
  }

  const unit = "minmax(0, 1fr) ";

  return (
    <div className="flex flex-col justify-between w-full h-screen p-1">
      <div
        className={`grid gap-1 flex-1`}
        style={{
          gridTemplateColumns:
            remoteUsers.length > 9
              ? unit.repeat(4)
              : remoteUsers.length > 4
              ? unit.repeat(3)
              : remoteUsers.length > 1
              ? unit.repeat(2)
              : unit,
        }}
      >
        <LocalVideoTrack
          track={localCameraTrack}
          play={true}
          className="w-full h-full"
        />
        {remoteUsers.map((user) => (
          <RemoteUser user={user} key={user.uid} />
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={toggleCamera}
          className={`px-4 py-2 text-white rounded-lg ${
            isCameraOn ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-500"
          }`}
        >
          {isCameraOn ? "Stop Camera" : "Start Camera"}
        </button>
        <button
          onClick={toggleMic}
          className={`px-4 py-2 text-white rounded-lg ${
            isMicOn ? "bg-green-500 hover:bg-green-600" : "bg-gray-500"
          }`}
        >
          {isMicOn ? "Mute Mic" : "Unmute Mic"}
        </button>
        <button
          onClick={handleLeave}
          className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
        >
          Leave
        </button>
      </div>
    </div>
  );
}

export default Call;
