import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Lottie from "lottie-react";
import { fetchUserGifts, giftsActions } from "../../../store/giftsSlice";
import TgsPlayer from "../../common/TgsPlayer";

function GiftCard({ userGift }) {
  const [lottieData, setLottieData] = useState(null);
  const [lottieLoading, setLottieLoading] = useState(false);
  const [upgradedLottieData, setUpgradedLottieData] = useState(null);
  const [patternLottieData, setPatternLottieData] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const gift = userGift.gift;

  useEffect(() => {
    // Загружаем оригинальную анимацию
    if ((gift?.animationType === "lottie" || gift?.animationType === "json") && gift?.animationUrl) {
      setLottieLoading(true);
      fetch(gift.animationUrl)
        .then((res) => res.json())
        .then((data) => setLottieData(data))
        .catch(() => setLottieData(null))
        .finally(() => setLottieLoading(false));
    }
    // Загружаем upgraded анимацию если есть
    if (userGift.isUpgraded && (userGift.upgradeModel?.animationType === "lottie" || userGift.upgradeModel?.animationType === "json") && userGift.upgradeModel?.animationUrl) {
      fetch(userGift.upgradeModel.animationUrl)
        .then((res) => res.json())
        .then((data) => setUpgradedLottieData(data))
        .catch(() => setUpgradedLottieData(null));
    }
    // Загружаем паттерн если есть
    if (userGift.isUpgraded && userGift.upgradePattern?.patternUrl) {
      fetch(userGift.upgradePattern.patternUrl)
        .then((res) => res.json())
        .then((data) => setPatternLottieData(data))
        .catch(() => setPatternLottieData(null));
    }
  }, [gift, userGift]);

  const renderGiftPreview = () => {
    const animData = userGift.isUpgraded && upgradedLottieData ? upgradedLottieData : lottieData;
    const animGift = userGift.isUpgraded && userGift.upgradeModel ? userGift.upgradeModel : gift;

    // TGS анимация
    if (animGift?.animationType === "tgs" && animGift?.tgsUrl) {
      return (
        <TgsPlayer
          src={animGift.tgsUrl}
          size={88}
          loop={isHovered}
          autoplay={isHovered}
        />
      );
    }

    // Lottie JSON анимация
    if ((animGift?.animationType === "lottie" || animGift?.animationType === "json") && animGift?.animationUrl) {
      if (lottieLoading) {
        return <div className="w-[5.5rem] h-[5.5rem] animate-pulse bg-white/20 rounded-lg" />;
      }
      if (animData) {
        return (
          <Lottie
            animationData={animData}
            loop={isHovered}
            autoplay={isHovered}
            className="w-[5.5rem] h-[5.5rem]"
          />
        );
      }
    }

    // GIF анимация
    if (animGift?.animationType === "gif" && animGift?.animationUrl) {
      return (
        <img
          src={animGift.animationUrl}
          alt={gift?.name}
          className="w-[5.5rem] h-[5.5rem] object-contain"
        />
      );
    }

    // Emoji только если есть
    if (gift?.emoji) {
      return <span className="text-[3.5rem]">{gift.emoji}</span>;
    }

    return null;
  };

  const backdrop = userGift.isUpgraded && userGift.upgradeBackdrop;
  const pattern = userGift.isUpgraded && userGift.upgradePattern;

  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-[0.5rem] min-h-[7.5rem] p-[0.625rem] pt-[0.875rem] rounded-[0.625rem] cursor-pointer overflow-hidden transition-all hover:brightness-95 ${
        userGift.isUpgraded ? 'ring-1 ring-purple-500/50' : 'bg-secondary-light-text'
      }`}
      style={backdrop ? {
        background: `linear-gradient(135deg, ${backdrop.centerColor} 0%, ${backdrop.edgeColor} 100%)`,
      } : {}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Pattern overlay - grid of repeating icons */}
      {pattern && patternLottieData && (
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <div className="absolute inset-[-50%] grid grid-cols-5 gap-[0.5rem]" style={{ transform: 'rotate(-15deg)' }}>
            {[...Array(25)].map((_, i) => (
              <div key={i} className="w-[2.5rem] h-[2.5rem]">
                <Lottie
                  animationData={patternLottieData}
                  loop={false}
                  autoplay={false}
                  className="w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ribbon - removed */}

      {/* Unique badge */}
      {userGift.isUpgraded && (
        <div className="absolute top-[0.3rem] left-[0.3rem] bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[0.7rem] px-[0.4rem] py-[0.1rem] rounded-full font-semibold z-10">
          #{userGift.uniqueNum}
        </div>
      )}

      {/* Hidden indicator */}
      {!userGift.isDisplayed && (
        <div className="absolute top-[0.25rem] left-[0.25rem] grid place-items-center w-[2rem] h-[2rem] rounded-full text-[1.25rem] text-white bg-black/30 backdrop-blur-sm z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        </div>
      )}

      {/* Gift Preview */}
      <div className="relative flex items-center justify-center shrink-0 w-[5.5rem] h-[5.5rem] z-[1]">
        {renderGiftPreview()}
      </div>

      {/* Gift Name */}
      <span 
        className="text-[1.1rem] font-medium text-center truncate w-full z-[1]"
        style={backdrop ? { color: backdrop.textColor } : {}}
      >
        {gift?.name || "Gift"}
      </span>

      {/* From */}
      <span 
        className="text-[1rem] truncate w-full text-center -mt-[0.25rem] z-[1]"
        style={backdrop ? { color: backdrop.textColor, opacity: 0.8 } : {}}
      >
        {userGift.isAnonymous
          ? "Anonymous"
          : userGift.from?.name || userGift.from?.username || "Someone"}
      </span>
    </div>
  );
}

function ProfileGiftsTab({ userId, hideGifts }) {
  const dispatch = useDispatch();
  const { userGifts } = useSelector((state) => state.giftsReducer);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      dispatch(fetchUserGifts(userId)).finally(() => setLoading(false));
    }
    return () => {
      dispatch(giftsActions.clearUserGifts());
    };
  }, [userId, dispatch]);

  if (hideGifts) {
    return (
      <div className="flex flex-col items-center justify-center h-[20rem] text-secondary-text">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="4em"
          height="4em"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="mb-[1rem] opacity-50"
        >
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
        <p className="text-[1.4rem]">Gifts are hidden</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[20rem]">
        <div className="w-[3rem] h-[3rem] border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!userGifts || userGifts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[20rem] text-secondary-text">
        <span className="text-[4rem] mb-[1rem]">🎁</span>
        <p className="text-[1.4rem]">No gifts yet</p>
      </div>
    );
  }

  return (
    <div className="p-[1rem]">
      <div className="grid grid-cols-3 gap-[0.5rem]">
        {userGifts.map((userGift) => (
          <GiftCard key={userGift._id} userGift={userGift} />
        ))}
      </div>
    </div>
  );
}

export default ProfileGiftsTab;
