import Image from "next/image";

export const VideoThumbnail = () => {
    return (
        <div className="relative">
            {/* Thumbnail wrapper */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                <Image src="/placeholder.svg" alt="Thumbnail" fill className="size-full object-cover" />
            </div>
            {/* Video duration box*/}
        </div>
    );
};
