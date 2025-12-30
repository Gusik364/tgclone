import React from "react";
import { useDispatch } from "react-redux";
import { giftsActions } from "../../../store/giftsSlice";

function SendGiftButton({ userId, userData }) {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(giftsActions.openSendGiftModal({ userId, userData }));
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-[1rem] w-full hover:bg-secondary-light-text p-[.5rem] rounded-md transition-colors"
    >
      <span className="text-[2rem]">🎁</span>
      <span className="font-semibold text-accent">Send Gift</span>
    </button>
  );
}

export default SendGiftButton;
