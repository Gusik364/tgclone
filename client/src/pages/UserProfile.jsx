import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/globals/Header";
import IconWrapper from "../components/globals/IconWrapper";
import { userProfileActions } from "../store/userProfileSlice";
import { modalActions } from "../store/modalSlice";
import { fetchWornGift, giftsActions } from "../store/giftsSlice";
import useTime from "../hooks/useTime";
import Image from "../components/globals/Image";
import ProfileGiftsTab from "../components/pages/Chat/ProfileGiftsTab";
import SendGiftModal from "../components/pages/Chat/SendGiftModal";
import GiftSentModal from "../components/pages/Chat/GiftSentModal";
import WornGiftBadge from "../components/pages/Chat/WornGiftBadge";
import VerifiedBadge from "../components/common/VerifiedBadge";

function UserProfile() {
  const { visible, profile } = useSelector((state) => state.userProfileReducer);
  const { wornGift } = useSelector((state) => state.giftsReducer);
  const dispatch = useDispatch();
  const lastSeenTime = useTime(profile?.status?.lastSeen);
  const [activeTab, setActiveTab] = useState("info");

  const tabs = [
    { id: "info", label: "Info" },
    { id: "gifts", label: "Gifts" },
  ];

  // Don't render content if profile is empty
  const hasProfile = profile && (profile._id || profile.username);

  // Загружаем надетый подарок при открытии профиля
  useEffect(() => {
    if (visible && profile?._id) {
      dispatch(fetchWornGift(profile._id));
    }
    return () => {
      dispatch(giftsActions.clearUserGifts());
    };
  }, [visible, profile?._id, dispatch]);

  return (
    <div
      className={`bg-primary duration-200 ease-in-out ${
        visible
          ? "w-[40rem] sm:w-full xl:translate-x-0"
          : "w-0 xl:w-[40rem] xl:translate-x-[50rem]"
      } h-full shrink-0 xl:absolute xl:top-0 xl:right-0 xl:z-20 xl:shadow-lg xl:shadow-box-shadow flex flex-col overflow-hidden`}
    >
      {/* Header bar */}
      <Header className="flex items-center px-[1rem] shrink-0">
        <IconWrapper
          onClick={() => dispatch(userProfileActions.hideProfile())}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 32 32"
          >
            <path
              fill="currentColor"
              d="M24 9.4L22.6 8L16 14.6L9.4 8L8 9.4l6.6 6.6L8 22.6L9.4 24l6.6-6.6l6.6 6.6l1.4-1.4l-6.6-6.6L24 9.4z"
              strokeWidth={1}
              className="fill-secondary-text stroke-secondary-text"
            />
          </svg>
        </IconWrapper>
        <h2 className="text-[2rem] font-semibold ml-[2rem] mr-auto">Profile</h2>
        {hasProfile && profile.name && (
          <IconWrapper
            onClick={() =>
              dispatch(
                modalActions.openModal({
                  type: "deleteContactModal",
                  payload: { profile },
                })
              )
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 7v0a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v0M9 7h6M9 7H6m9 0h3m2 0h-2M4 7h2m0 0v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7"
                className="!fill-transparent !stroke-danger"
              />
            </svg>
          </IconWrapper>
        )}
      </Header>

      {/* Show empty state if no profile */}
      {!hasProfile ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-secondary-text text-[1.4rem]">Select a chat to view profile</p>
        </div>
      ) : (
        <>
          {/* Avatar */}
          <div className="h-[30rem] relative shrink-0">
            <Image
              src={profile.avatar}
              alt={profile.name || profile.username}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-[2rem] left-[2rem]">
              <div className="flex items-center gap-[0.8rem] flex-wrap">
                <p className="text-[2rem] font-semibold text-white drop-shadow-lg">
                  {profile.name || profile.username}
                </p>
                {profile.isScam && (
                  <span className="text-[1.2rem] px-[0.8rem] py-[0.2rem] bg-danger text-white rounded-md font-bold uppercase">
                    SCAM
                  </span>
                )}
                {profile.isVerified && <VerifiedBadge size={20} />}
                {profile.isBot && (
                  <span className="text-[1rem] px-[0.6rem] py-[0.2rem] bg-cta-icon text-white rounded-md font-medium">
                    BOT
                  </span>
                )}
                {wornGift && <WornGiftBadge gift={wornGift.gift} userGift={wornGift} size={28} />}
              </div>
              <p className="text-white/80 drop-shadow-lg mt-[0.2rem]">
                {profile.status?.online ? "Online" : `last seen at ${lastSeenTime}`}
              </p>
            </div>
          </div>

          {/* Tabs */}
          {!profile.isDeleted && (
            <div className="flex border-b border-secondary-light-text shrink-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-[1.2rem] text-[1.4rem] font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? "text-accent"
                      : "text-secondary-text hover:text-primary-text"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {profile.isDeleted ? (
              <div className="p-[1rem]">
                <div className="bg-danger/10 border border-danger/30 rounded-xl p-[1.5rem]">
                  <p className="text-danger text-[1.3rem] text-center">
                    This account has been deleted
                  </p>
                </div>
              </div>
            ) : activeTab === "info" ? (
              <div className="p-[1rem]">
                {/* Username with NFT Usernames */}
                <div className="flex items-center gap-[3rem] hover:bg-secondary-light-text p-[.5rem] rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 16 16"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      className="stroke-secondary-text"
                    >
                      <path d="M10.25 8c0 3.25 4 3.25 4 0A6.25 6.25 0 1 0 8 14.25c2.25 0 3.25-1 3.25-1" />
                      <circle cx="8" cy="8" r="2.25" />
                    </g>
                  </svg>
                  <div className="flex flex-col">
                    <span className="font-semibold text-accent">@{profile.username || "deleted"}</span>
                    {profile.nftUsernames && profile.nftUsernames.length > 0 && (
                      <span className="text-accent">
                        also {profile.nftUsernames.map(u => `@${u}`).join(', ')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Anonymous Number */}
                {profile.anonymousNumber && (
                  <div className="flex items-center gap-[3rem] hover:bg-secondary-light-text p-[.5rem] rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="shrink-0"
                    >
                      <path 
                        d="M22 16.92V19.92C22 20.48 21.56 20.93 21 20.99C20.83 21 20.67 21 20.5 21C10.29 21 2 12.71 2 2.5C2 2.33 2 2.17 2.01 2C2.07 1.44 2.52 1 3.08 1H6.08C6.57 1 6.99 1.35 7.07 1.83C7.14 2.27 7.26 2.7 7.43 3.11C7.56 3.43 7.48 3.79 7.23 4.04L5.39 5.88C6.86 8.55 9.45 11.14 12.12 12.61L13.96 10.77C14.21 10.52 14.57 10.44 14.89 10.57C15.3 10.74 15.73 10.86 16.17 10.93C16.65 11.01 17 11.43 17 11.92V14.92C17 15.47 16.55 15.92 16 15.92" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="stroke-secondary-text"
                      />
                    </svg>
                    <div className="flex flex-col">
                      <span className="font-semibold text-accent">+{profile.anonymousNumber}</span>
                      <span className="text-secondary-text">mobile</span>
                    </div>
                  </div>
                )}

                {/* Bio */}
                {profile.bio && (
                  <div className="flex items-center gap-[3rem] hover:bg-secondary-light-text p-[.5rem] rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      preserveAspectRatio="xMidYMid meet"
                      viewBox="0 0 32 32"
                      className="shrink-0"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="stroke-secondary-text"
                      >
                        <path d="M16 14v9m0-15v2" />
                        <circle cx="16" cy="16" r="14" />
                      </g>
                    </svg>
                    <div className="flex flex-col flex-grow">
                      <p className="font-semibold break-words pr-[2rem]">
                        {profile.bio}
                      </p>
                      <span className="text-secondary-text">Bio</span>
                    </div>
                  </div>
                )}

                {/* Verified by Major */}
                {profile.isVerified && (
                  <div className="flex items-start gap-[1.2rem] p-[1.2rem] mt-[1rem] bg-secondary-light-text/50 rounded-xl">
                    <img 
                      src="/major.png" 
                      alt="Major" 
                      className="w-[2.4rem] h-[2.4rem] shrink-0 mt-[0.2rem]"
                    />
                    <p className="text-[1.3rem] text-secondary-text leading-[1.5]">
                      This account is verified as official by the representatives of <span className="text-accent font-medium">Major</span>.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <ProfileGiftsTab userId={profile._id} hideGifts={profile.hideGifts} />
            )}
          </div>
        </>
      )}

      {/* Send Gift Modal */}
      <SendGiftModal />
      <GiftSentModal />
    </div>
  );
}

export default UserProfile;
