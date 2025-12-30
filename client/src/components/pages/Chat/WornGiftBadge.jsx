import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import TgsPlayer from "../../common/TgsPlayer";

function WornGiftBadge({ gift, userGift, size = 24 }) {
  const [lottieData, setLottieData] = useState(null);
  const [modelLottieData, setModelLottieData] = useState(null);

  const isUpgraded = userGift?.isUpgraded;
  const upgradeModel = userGift?.upgradeModel;

  useEffect(() => {
    // Загружаем анимацию обычного подарка
    if ((gift?.animationType === "lottie" || gift?.animationType === "json") && gift?.animationUrl) {
      fetch(gift.animationUrl)
        .then((res) => res.json())
        .then((data) => setLottieData(data))
        .catch(() => setLottieData(null));
    }
  }, [gift]);

  useEffect(() => {
    // Загружаем анимацию NFT модели
    if ((upgradeModel?.animationType === "lottie" || upgradeModel?.animationType === "json") && upgradeModel?.animationUrl) {
      fetch(upgradeModel.animationUrl)
        .then((res) => res.json())
        .then((data) => setModelLottieData(data))
        .catch(() => setModelLottieData(null));
    }
  }, [upgradeModel]);

  if (!gift) return null;

  // NFT Model (TGS)
  if (isUpgraded && upgradeModel?.animationType === "tgs" && upgradeModel?.tgsUrl) {
    return (
      <div className="shrink-0 drop-shadow-lg">
        <TgsPlayer src={upgradeModel.tgsUrl} size={size} loop={true} autoplay={true} />
      </div>
    );
  }

  // NFT Model (Lottie/JSON)
  if (isUpgraded && (upgradeModel?.animationType === "lottie" || upgradeModel?.animationType === "json") && modelLottieData) {
    return (
      <div className="shrink-0 drop-shadow-lg">
        <Lottie
          animationData={modelLottieData}
          loop={true}
          style={{ width: size, height: size }}
        />
      </div>
    );
  }

  // Regular TGS
  if (gift?.animationType === "tgs" && gift?.tgsUrl) {
    return (
      <div className="shrink-0 drop-shadow-lg">
        <TgsPlayer src={gift.tgsUrl} size={size} loop={true} autoplay={true} />
      </div>
    );
  }

  // Regular Lottie/JSON
  if ((gift?.animationType === "lottie" || gift?.animationType === "json") && lottieData) {
    return (
      <div className="shrink-0 drop-shadow-lg">
        <Lottie
          animationData={lottieData}
          loop={true}
          style={{ width: size, height: size }}
        />
      </div>
    );
  }

  // GIF
  if (gift?.animationType === "gif" && gift?.animationUrl) {
    return (
      <img
        src={gift.animationUrl}
        alt={gift.name}
        className="shrink-0 drop-shadow-lg"
        style={{ width: size, height: size, objectFit: "contain" }}
      />
    );
  }

  // Emoji fallback только если есть
  if (gift?.emoji) {
    return (
      <span 
        className="shrink-0 drop-shadow-lg" 
        style={{ fontSize: size * 0.9 }}
      >
        {gift.emoji}
      </span>
    );
  }

  return null;
}

export default WornGiftBadge;
