import { FC } from "react";
import Call from "@/components/Call";

 interface PageProps {
  params: {
    channelName: string;
  };
}

const Page: FC<PageProps> = ({ params }) => {
  return (
    <main className="flex w-full flex-col">
      {/* Displaying the channel name */}
      <p className="absolute z-10 mt-2 ml-12 text-2xl font-bold text-gray-900">
        Channel: {params.channelName}
      </p>
      
      {/* Call component for video call */}
      <Call appId={process.env.PUBLIC_AGORA_APP_ID!} channelName={params.channelName} />
    </main>
  );
};

export default Page;
