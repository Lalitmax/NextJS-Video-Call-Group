"use client"
import { FC } from "react";
import { useParams } from "next/navigation";
import Call from "@/components/Call";

const Page: FC = () => {
    const params = useParams();
    const channelName = params.channelName as string;

    return (
        <main className="flex w-full flex-col">
            <p className="absolute z-10 mt-2 ml-12 text-2xl font-bold text-gray-900">
                Channel: {channelName}
            </p>

            <Call appId={process.env.PUBLIC_AGORA_APP_ID!} channelName={channelName} />
        </main>
    );
};

export default Page;
