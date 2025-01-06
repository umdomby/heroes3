import React from "react";
import {Dialog} from "@/components/ui";
import {DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {FileVideo} from "lucide-react";

interface Props {
    video: string
}

export const VideoYouTube: React.FC<Props> = ({video}) => {

    let text = video.replace("watch?v=", "embed/");

    return (
        <Dialog>
            <DialogTrigger><FileVideo className="h-5" /></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription>
                        <iframe src={text+"?autoplay=1"} width='100%' height='300px' allow='autoplay'   allowFullScreen/>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

