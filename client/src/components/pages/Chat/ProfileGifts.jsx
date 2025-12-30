import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Lottie from "lottie-react";
import { fetchUserGifts, giftsActions } from "../../../store/giftsSlice";
import TgsPlayer from "../../common/TgsPlayer";

function GiftPreview({ gift, userGift }) {
  const [lottieData, setLottieData] = useState(null);
  const [loading, setLoading] = useState(false);
  const displayGift = userGift?.isUpgraded && userGift?.upgradeModel ? userGift.upgradeModel : gift;

  useEffect(() => {
    if ((displayGift?.animationType === "lottie" || displayGift?.animationType === "json") && displayGift?.animationUrl) {
      setLoading(true);
      fetch(displayGift.animationUrl)
        .then((res) => res.json())
        .then((data) => setLottieData(data))
        .catch(() => setLottieData(null))
        .finally(() => setLoading(false));
    }
  }, [displayGift]);

  // TGS анимация
  if (displayGift?.animationType === "tgs" && displayGift?.tgsUrl) {
    return <TgsPlayer src={displayGift.tgsUrl} size={50} loop={true} autoplay={true} />;
  }

  // Lottie/JSON анимация
  if ((displayGift?.animationType === "lottie" || displayGift?.animationType === "json") && displayGift?.animationUrl) {
    if (loading) {
      return <div className="w-[50px] h-[50px] animate-pulse bg-secondary-light-text/50 rounded-lg" />;
    }
    if (lottieData) {
      return <Lottie animationData={lottieData} loop={true} style={{ width: 50, height: 50 }} />;
    }
  }

  // GIF анимация
  if (displayGift?.animationType === "gif" && displayGift?.animationUrl) {
    return <img src={displayGift.animationUrl} alt={gift?.name} className="w-[50px] h-[50px] object-contain" />;
  }

  // Emoji только если есть
  if (gift?.emoji) {
    return <span className="text-[2.5rem]">{gift.emoji}</span>;
  }

  return null;
}

function ProfileGifts({ userId, hideGifts }) {
  const dispatch = useDispatch();
  const { userGifts } = useSelector((state) => state.giftsReducer);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserGifts(userId));
    }
    return () => {
      dispatch(giftsActions.clearUserGifts());
    };
  }, [userId, dispatch]);

  useEffect(() => {
    checkScroll();
  }, [userGifts]);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  // Если подарки скрыты
  if (hideGifts) {
    return (
      <div className="p-[1rem] border-t border-secondary-light-text mt-[1rem]">
        <h3 className="text-secondary-text text-[1.4rem] mb-[1rem]">
          🎁 Gifts
        </h3>
        <p className="text-secondary-text text-[1.3rem]">Gifts are hidden</p>
      </div>
    );
  }

  return (
    <div className="p-[1rem] border-t border-secondary-light-text mt-[1rem]">
      <h3 className="text-secondary-text text-[1.4rem] mb-[1rem]">
        🎁 Gifts {userGifts?.length > 0 ? `(${userGifts.length})` : ""}
      </h3>
      {userGifts && userGifts.length > 0 ? (
        <div className="relative">
          {/* Left scroll button */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-[3rem] h-[3rem] bg-primary rounded-full shadow-lg flex items-center justify-center hover:bg-secondary-light-text transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}

          {/* Gifts container */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-[1rem] overflow-x-auto scrollbar-hide px-[0.5rem] py-[0.5rem]"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {userGifts.map((userGift) => (
              <div
                key={userGift._id}
                className="flex flex-col items-center p-[1rem] bg-secondary-light-text rounded-lg min-w-[7rem] shrink-0"
                title={`From: ${userGift.from?.name || "Anonymous"}`}
              >
                <GiftPreview gift={userGift.gift} userGift={userGift} />
                <span className="text-[1.2rem] text-secondary-text mt-[0.5rem] whitespace-nowrap">
                  {userGift.gift?.name}
                </span>
              </div>
            ))}
          </div>

          {/* Right scroll button */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-[3rem] h-[3rem] bg-primary rounded-full shadow-lg flex items-center justify-center hover:bg-secondary-light-text transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}
        </div>
      ) : (
        <p className="text-secondary-text text-[1.3rem]">No gifts yet</p>
      )}
    </div>
  );
}

export default ProfileGifts;
