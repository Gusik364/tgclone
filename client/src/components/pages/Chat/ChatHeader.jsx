import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useChat from "../../../hooks/useChat";
import useTime from "../../../hooks/useTime";
import { chatActions } from "../../../store/chatSlice";
import { modalActions } from "../../../store/modalSlice";
import { userProfileActions } from "../../../store/userProfileSlice";
import { fetchWornGift, giftsActions } from "../../../store/giftsSlice";
import Header from "../../globals/Header";
import IconWrapper from "../../globals/IconWrapper";
import Image from "../../globals/Image";
import ActionsModal from "./ActionsModal";
import WornGiftBadge from "./WornGiftBadge";
import VerifiedBadge from "../../common/VerifiedBadge";

function ChatHeader({ chatProfile, className }) {
  const dispatch = useDispatch();
  const chatActive = useSelector((state) => state.chatReducer.active);
  const { wornGift } = useSelector((state) => state.giftsReducer);
  const lastSeenTime = useTime(chatProfile?.status?.lastSeen);

  // Загружаем надетый подарок пользователя
  useEffect(() => {
    if (chatProfile?._id) {
      dispatch(fetchWornGift(chatProfile._id));
    }
    return () => {
      dispatch(giftsActions.clearUserGifts());
    };
  }, [chatProfile?._id, dispatch]);

  return (
    <Header
      className={`flex items-center px-[2rem] bg-primary border-x border-border shrink-0 z-10 ${className}`}
    >
      <div className="flex items-center flex-grow">
        <IconWrapper
          id="chatActiveToggler"
          onClick={() => {
            if (chatActive) {
              dispatch(chatActions.setChatUnactive());
            } else {
              dispatch(chatActions.setChatActive());
            }
          }}
          className="chatArrow lg:flex mr-[2rem] hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
            className={`${!chatActive && "rotate-180"}`}
          >
            <path
              fill="currentColor"
              d="M19 11H7.14l3.63-4.36a1 1 0 1 0-1.54-1.28l-5 6a1.19 1.19 0 0 0-.09.15c0 .05 0 .08-.07.13A1 1 0 0 0 4 12a1 1 0 0 0 .07.36c0 .05 0 .08.07.13a1.19 1.19 0 0 0 .09.15l5 6A1 1 0 0 0 10 19a1 1 0 0 0 .64-.23a1 1 0 0 0 .13-1.41L7.14 13H19a1 1 0 0 0 0-2Z"
              className="stroke-transparent"
            />
          </svg>
        </IconWrapper>
        {/*  */}
        <div
          onClick={(event) => {
            if (window.innerWidth <= 1000) {
              if (chatActive) {
                event.stopPropagation();

                dispatch(userProfileActions.showProfile());
              }
            } else {
              dispatch(userProfileActions.showProfile());
            }
          }}
          className="flex-grow flex items-center  gap-[1.5rem] cursor-pointer"
        >
          <Image
            src={chatProfile.avatar}
            alt={chatProfile.name || chatProfile.username}
            className="w-[4.2rem] h-[4.2rem] rounded-full"
          />
          <div className="flex flex-col">
            <h2 className="font-semibold flex items-center gap-[0.6rem] flex-wrap">
              {chatProfile.name || chatProfile.username}
              {chatProfile.isScam && (
                <span className="text-[1rem] px-[0.6rem] py-[0.1rem] bg-danger text-white rounded-md font-bold uppercase">
                  SCAM
                </span>
              )}
              {chatProfile.isVerified && <VerifiedBadge size={18} />}
              {chatProfile.isBot && (
                <span className="text-[1rem] px-[0.6rem] py-[0.1rem] bg-cta-icon text-white rounded-md font-medium">
                  BOT
                </span>
              )}
              {wornGift && <WornGiftBadge gift={wornGift.gift} userGift={wornGift} size={22} />}
            </h2>
            {chatProfile.mode && (
              <span className="text-cta-icon italic text-[1.4rem] font-normal -translate-y-[.4rem]">
                {chatProfile.mode} {chatProfile.mode === "recording" && "audio"}
                ...
              </span>
            )}
            {!chatProfile.mode && (
              <span className="text-secondary text-[1.4rem] font-normal -translate-y-[.4rem]">
                {chatProfile.status?.online
                  ? "online"
                  : `last seen at ${lastSeenTime}`}
              </span>
            )}
          </div>
        </div>
      </div>
      <IconWrapper
        onClick={() => {
          dispatch(
            modalActions.openModal({
              type: "actionsModal",
              positions: { top: 60, right: 30 },
            })
          );
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 24 24"
          className="shrink-0"
        >
          <path
            fill="currentColor"
            d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0-4 0zm0-6a2 2 0 1 0 4 0a2 2 0 0 0-4 0zm0 12a2 2 0 1 0 4 0a2 2 0 0 0-4 0z"
            className="!stroke-transparent"
          />
        </svg>
      </IconWrapper>
      <ActionsModal chatProfile={chatProfile} />
    </Header>
  );
}

export default ChatHeader;
