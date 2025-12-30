import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../../../store/modalSlice";
import { chatActions } from "../../../store/chatSlice";
import useSocket from "../../../hooks/useSocket";

function MessageContextMenu() {
  const dispatch = useDispatch();
  const { socketEmit } = useSocket();
  const { type, payload, positions } = useSelector((state) => state.modalReducer);
  const userId = useSelector((state) => state.userReducer.user._id);
  const chatRoomId = useSelector((state) => state.chatReducer.currentChatRoom?._id);

  if (type !== "messageContextMenu" || !payload?.message) return null;

  const { message } = payload;
  const isMyMessage = message.sender?.toString() === userId?.toString();

  if (!isMyMessage) return null;

  const handleClose = () => {
    dispatch(modalActions.closeModal());
  };

  const handleDelete = (deleteFor) => {
    socketEmit("user:deleteMessage", {
      chatRoomId,
      messageId: message._id,
      day: message.day,
      deleteFor,
    });

    // Update local state
    dispatch(chatActions.deleteMessage({
      messageId: message._id,
      day: message.day,
      deleteFor,
    }));

    handleClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={handleClose}
      />
      
      {/* Menu */}
      <div
        className="fixed z-50 bg-primary rounded-xl shadow-xl overflow-hidden min-w-[20rem]"
        style={{
          left: Math.min(positions?.left || 0, window.innerWidth - 220),
          top: Math.min(positions?.top || 0, window.innerHeight - 120),
        }}
      >
        <button
          onClick={() => handleDelete("me")}
          className="w-full px-[1.5rem] py-[1.2rem] text-left text-[1.4rem] hover:bg-secondary-light-text transition-colors flex items-center gap-[1rem]"
        >
          <span className="text-[1.6rem]">🗑️</span>
          Удалить у меня
        </button>
        <button
          onClick={() => handleDelete("everyone")}
          className="w-full px-[1.5rem] py-[1.2rem] text-left text-[1.4rem] hover:bg-secondary-light-text transition-colors text-red-500 flex items-center gap-[1rem]"
        >
          <span className="text-[1.6rem]">🗑️</span>
          Удалить у всех
        </button>
      </div>
    </>
  );
}

export default MessageContextMenu;
