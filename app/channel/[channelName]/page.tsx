import { FC } from "react";
import Call from "@/components/Call";

interface PageProps {
    params: {
        channelName: string;
    };
}

export const Page: FC<PageProps> = ({ params }) => {
    return (
        <main className="flex w-full flex-col">
            <p className="absolute z-10 mt-2 ml-12 text-2xl font-bold text-gray-900">
                {params.channelName}
            </p>
            <Call appId={process.env.PUBLIC_AGORA_APP_ID!} channelName={params.channelName} />
        </main>
    );
};

