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
import Link from "next/link";

function Call(props: { appId: string; channelName: string }) {
  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );

  return (
    <AgoraRTCProvider client={client}>
      <Videos channelName={props.channelName} AppID={props.appId} />
      <div className="fixed z-10 bottom-0 left-0 right-0 flex justify-center pb-4">
        <a
          className="px-5 py-3 text-base font-medium text-center text-white bg-red-400 rounded-lg hover:bg-red-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 w-40"
          href="/"
        >
          End Call
        </a>
      </div>
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

  // Remote users and their audio tracks
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

  // Play remote audio tracks
  audioTracks.map((track) => track.play());

  // Handle loading state for devices
  const deviceLoading = isLoadingMic || isLoadingCam;

  if (deviceLoading) {
    return (
      <div className="flex flex-col items-center pt-40">
        Loading devices...
      </div>
    );
  }

  // Handle device access errors
  if (micError || camError) {
    return (
      <div className="flex flex-col items-center pt-40 text-red-500">
        {micError && <p>Error accessing microphone: {micError.message}</p>}
        {camError && <p>Error accessing camera: {camError.message}</p>}
        <p>Please ensure your devices are not in use by another application.</p>
      </div>
    );
  }

  // Dynamic grid layout for video tracks
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
        {/* Local video track */}
        <LocalVideoTrack
          track={localCameraTrack}
          play={true}
          className="w-full h-full"
        />

        {/* Remote video tracks */}
        {remoteUsers.map((user) => (
          <RemoteUser user={user} key={user.uid} />
        ))}
      </div>
    </div>
  );
}

export default Call;
