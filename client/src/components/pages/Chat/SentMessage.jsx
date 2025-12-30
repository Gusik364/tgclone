import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { modalActions } from "../../../store/modalSlice";
import BubbleTail from "./BubbleTail";
import Message from "./Message";

function SentMessage({ message }) {
  const dispatch = useDispatch();
  const messageRef = useRef(null);
  const [pressTimer, setPressTimer] = useState(null);

  const handleContextMenu = (e) => {
    e.preventDefault();

    // Simple positioning relative to click
    const positions = {
      left: e.clientX,
      top: e.clientY,
    };

    dispatch(
      modalActions.openModal({
        type: "messageContextMenu",
        payload: { message, messageReceived: false },
        positions,
      })
    );
  };

  const handleTouchStart = (e) => {
    const timer = setTimeout(() => {
      handleContextMenu(e);
    }, 500);
    setPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  return (
    <div className="self-end">
      <div
        ref={messageRef}
        className="flex items-end max-w-[35rem] ml-[3rem]"
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Message
          messageData={message}
          className="bg-message rounded-br-none flex-grow"
        />
        <BubbleTail
          className={(message.messageType === "image" || message.messageType === "gift" || message.messageType === "sticker" || message.messageType === "premiumEmoji") && "hidden"}
          fillColor="fill-message stroke-message"
        />
      </div>
    </div>
  );
}

export default SentMessage;
