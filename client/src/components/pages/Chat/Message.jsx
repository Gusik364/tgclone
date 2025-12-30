import React from "react";
import CallMessage from "./CallMessage";
import GiftMessage from "./GiftMessage";
import MessageReadStatus from "./MessageReadStatus";
import VoiceMessage from "./VoiceMessage";
import Image from "../../globals/Image";
import TgsPlayer from "../../common/TgsPlayer";

function Message({ messageData, className, messageReceived }) {
  // Gift messages
  if (messageData.messageType === "gift") {
    return (
      <GiftMessage
        messageData={messageData}
        messageReceived={messageReceived}
      />
    );
  }

  // Image messages
  if (messageData.messageType === "image") {
    return (
      <div className="w-[30rem] rounded-3xl overflow-hidden h-[34rem] relative">
        <Image
          className="w-full h-full object-cover"
          src={messageData.imageUrl}
          alt=""
        />
        <MessageReadStatus
          readStatus={messageData.readStatus}
          deliveredStatus={messageData.deliveredStatus}
          messageReceived={messageReceived}
          time={messageData.timeSent}
          className="absolute bottom-[1rem] right-[1rem] bg-secondary-light-text rounded-full !text-white"
        />
      </div>
    );
  }

  if (messageData.messageType === "voice") {
    return (
      <VoiceMessage
        deliveredStatus={messageData.deliveredStatus}
        messageReceived={messageReceived}
        voiceDuration={messageData.voiceNoteDuration}
        voiceNoteUrl={messageData.voiceNoteUrl}
        readStatus={messageData.readStatus}
        time={messageData.timeSent}
      />
    );
  }

  if (messageData.messageType === "call")
    //   Calls
    return (
      <CallMessage
        callDetails={messageData.callDetails}
        messageReceived={messageReceived}
        deliveredStatus={messageData.deliveredStatus}
        readStatus={messageData.readStatus}
        time={messageData.timeSent}
      />
    );

  // Sticker messages
  if (messageData.messageType === "sticker") {
    const isAnimated = messageData.stickerType === "animated" || messageData.stickerUrl?.endsWith(".tgs");
    const isVideo = messageData.stickerType === "video" || messageData.stickerUrl?.endsWith(".webm");
    
    return (
      <div className="relative">
        <div className="w-[12rem] h-[12rem]">
          {isAnimated ? (
            <TgsPlayer src={messageData.stickerUrl} size={120} />
          ) : isVideo ? (
            <video
              src={messageData.stickerUrl}
              className="w-full h-full object-contain"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img
              src={messageData.stickerUrl}
              alt="sticker"
              className="w-full h-full object-contain"
            />
          )}
        </div>
        <MessageReadStatus
          readStatus={messageData.readStatus}
          deliveredStatus={messageData.deliveredStatus}
          messageReceived={messageReceived}
          time={messageData.timeSent}
          className="absolute bottom-0 right-0"
        />
      </div>
    );
  }

  // Premium emoji messages
  if (messageData.messageType === "premiumEmoji") {
    const emoji = messageData.premiumEmoji;
    const isAnimated = emoji?.type === "animated" || emoji?.url?.endsWith(".tgs");
    const isVideo = emoji?.type === "video" || emoji?.url?.endsWith(".webm");
    
    return (
      <div className="relative">
        <div className="w-[6rem] h-[6rem]">
          {isAnimated ? (
            <TgsPlayer src={emoji?.url} size={60} />
          ) : isVideo ? (
            <video
              src={emoji?.url}
              className="w-full h-full object-contain"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img
              src={emoji?.url}
              alt="premium emoji"
              className="w-full h-full object-contain"
            />
          )}
        </div>
        <MessageReadStatus
          readStatus={messageData.readStatus}
          deliveredStatus={messageData.deliveredStatus}
          messageReceived={messageReceived}
          time={messageData.timeSent}
          className="absolute bottom-0 right-0"
        />
      </div>
    );
  }

  // if it's a text message
  return (
    <div
      className={`${className} p-[1.5rem] rounded-3xl sm:text-[1.4rem] overflow-hidden gap-[1rem] relative`}
    >
      <div
        dangerouslySetInnerHTML={{ __html: messageData.message }}
        className="font-semibold max-w-[25rem] mr-[3.5rem] break-words"
      ></div>
      <MessageReadStatus
        readStatus={messageData.readStatus}
        deliveredStatus={messageData.deliveredStatus}
        messageReceived={messageReceived}
        time={messageData.timeSent}
        className={`absolute right-[.8rem] bottom-[.5rem] ${
          messageData.deliveredStatus && "!text-secondary"
        }`}
      />
    </div>
  );
}

export default Message;
