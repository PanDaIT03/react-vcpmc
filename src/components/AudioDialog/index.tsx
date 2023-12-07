import classNames from "classnames/bind";
import { Dispatch, SetStateAction, memo, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay, faVolumeLow, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";

import { images } from "~/assets";
import { Input } from "../Input";
import { formatTime } from "~/constants";

import styles from "~/sass/AudioDialog.module.scss";
const cx = classNames.bind(styles);

interface AudioDialogProps {
    source: string
    className?: string
    setVisible: Dispatch<SetStateAction<boolean>>
};

const backgroundURL =
    "https://res.cloudinary.com/dis180ycw/image/upload/c_scale,w_452/v1701317096/pexels-daniel-reche-3721941_n2uhdn.jpg";
const backgroundFullScreenURL =
    "https://res.cloudinary.com/dis180ycw/image/upload/c_scale,w_1920/v1701317096/pexels-daniel-reche-3721941_n2uhdn.jpg";

export const AudioDialog = memo(({
    source,
    className,
    setVisible
}: AudioDialogProps) => {
    if (!className) className = "";

    const classes = cx("wrapper", {
        [className]: className
    });

    const audioRef = useRef<HTMLAudioElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    const [isPlaying, setAudioPlaying] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [muted, setMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [rewind, setRewind] = useState(0);

    useEffect(() => {
        if (!isPlaying)
            audioRef.current?.pause();
        else
            audioRef.current?.play();
    }, [isPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.currentTime = rewind;
            setAudioPlaying(true);
        }
    }, [rewind]);

    useEffect(() => {
        let bgURL;
        if (isFullScreen) {
            containerRef.current?.requestFullscreen();
            bgURL = backgroundFullScreenURL;
        } else {
            document.fullscreenElement && document.exitFullscreen();
            bgURL = backgroundURL;
        };

        containerRef.current?.setAttribute('style', `
            background: url(${bgURL});
            background-position-y: 50%;
        `);
    }, [isFullScreen]);

    const handleClickFullScreen = () => {
        const current = document.fullscreenElement;
        setIsFullScreen(current ? false : true);
    };

    return (
        <div className={classes}>
            <div
                className={cx("content")}
                style={{ background: `url(${backgroundURL})` }}
                ref={containerRef}
            >
                {source !== ""
                    && <audio
                        autoPlay
                        src={source}
                        muted={muted}
                        ref={audioRef}
                        // controls
                        onPlay={() => setAudioPlaying(true)}
                        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
                    />}
                <div className="actions">
                    <div className={cx("action-top")}>
                        <img
                            alt="x-icon"
                            src={images.xCircle}
                            onClick={() => {
                                setVisible(false);
                                setIsFullScreen(false);
                            }}
                        />
                    </div>
                    <div className={cx("action-bottom")}>
                        <div className={cx("action-left")}>
                            <div
                                className={cx("play-pause")}
                                onClick={() => setAudioPlaying(!isPlaying)}
                            >
                                {isPlaying
                                    ? <FontAwesomeIcon icon={faPlay} />
                                    : <FontAwesomeIcon icon={faPause} />
                                }
                            </div>
                            <div className={cx("mute")}>
                                {!muted
                                    ? <FontAwesomeIcon
                                        icon={faVolumeLow}
                                        onClick={() => setMuted(!muted)}
                                    />
                                    : <FontAwesomeIcon
                                        icon={faVolumeXmark}
                                        onClick={() => setMuted(!muted)}
                                    />
                                }
                            </div>
                            <div className={(cx("duration"))}>
                                <span>{formatTime(currentTime)}</span>
                                <span> / </span>
                                <span>{formatTime(audioRef.current?.duration || 0)}</span>
                            </div>
                        </div>
                        <div className={cx("action-right")}>
                            <img
                                src={images.maximize}
                                alt="maximize-icon"
                                onClick={() => handleClickFullScreen()}
                            />
                        </div>
                    </div>
                </div>
                <div className={cx("progress")} ref={progressRef}>
                    <Input
                        type="range"
                        name="progess"
                        size="custom"
                        value={currentTime}
                        inputRef={inputRef}
                        min={0}
                        max={audioRef.current?.duration || 0}
                        steps={1}
                        onChange={(event) => setRewind(parseInt(event.target.value))}
                    />
                </div>
            </div>
        </div>
    );
});