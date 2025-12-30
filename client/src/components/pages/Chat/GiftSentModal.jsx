import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Lottie from "lottie-react";
import { giftsActions } from "../../../store/giftsSlice";

function GiftPreview({ gift, size = 100 }) {
  const [lottieData, setLottieData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ((gift?.animationType === "lottie" || gift?.animationType === "json") && gift?.animationUrl) {
      setLoading(true);
      fetch(gift.animationUrl)
        .then((res) => res.json())
        .then((data) => setLottieData(data))
        .catch(() => setLottieData(null))
        .finally(() => setLoading(false));
    }
  }, [gift]);

  if ((gift?.animationType === "lottie" || gift?.animationType === "json") && gift?.animationUrl) {
    if (loading) {
      return <div style={{ width: size, height: size }} className="animate-pulse bg-white/20 rounded-lg" />;
    }
    if (lottieData) {
      return (
        <Lottie
          animationData={lottieData}
          loop={true}
          style={{ width: size, height: size }}
        />
      );
    }
  }

  if (gift?.animationType === "gif" && gift?.animationUrl) {
    return (
      <img
        src={gift.animationUrl}
        alt={gift.name}
        style={{ width: size, height: size, objectFit: "contain" }}
      />
    );
  }

  if (gift?.emoji) {
    return <span style={{ fontSize: size * 0.8 }}>{gift.emoji}</span>;
  }

  return null;
}

function GiftSentModal() {
  const dispatch = useDispatch();
  const { sentGiftData } = useSelector((state) => state.giftsReducer);
  const [showDetails, setShowDetails] = useState(false);

  if (!sentGiftData) return null;

  const { gift, toUser, fromUser, message } = sentGiftData;

  const handleClose = () => {
    dispatch(giftsActions.clearSentGiftData());
    setShowDetails(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="relative w-[35rem] overflow-hidden">
        {/* Карточка подарка */}
        <div 
          className="rounded-2xl p-[2rem] text-center"
          style={{
            background: "linear-gradient(135deg, #4a9d9a 0%, #3d8b88 100%)",
          }}
        >
          {/* Лейбл "подарок" */}
          <div className="absolute top-[2rem] right-[2rem] bg-white/20 px-[1rem] py-[0.3rem] rounded-full">
            <span className="text-white text-[1.2rem]">подарок</span>
          </div>

          {/* Анимация подарка */}
          <div className="flex justify-center mb-[1.5rem] mt-[1rem]">
            <GiftPreview gift={gift} size={120} />
          </div>

          {/* Текст */}
          <h2 className="text-white text-[2rem] font-semibold mb-[0.5rem]">
            Подарок для {toUser?.name || toUser?.username}
          </h2>
          <p className="text-white/80 text-[1.4rem] mb-[2rem]">
            {gift?.name}
          </p>

          {/* Кнопка Просмотр */}
          {!showDetails ? (
            <button
              onClick={() => setShowDetails(true)}
              className="bg-white/20 hover:bg-white/30 text-white px-[3rem] py-[1rem] rounded-full text-[1.4rem] font-semibold transition-all"
            >
              Просмотр
            </button>
          ) : (
            <div className="bg-white/10 rounded-xl p-[1.5rem] text-left">
              <div className="mb-[1rem]">
                <span className="text-white/60 text-[1.2rem]">От:</span>
                <p className="text-white text-[1.4rem] font-semibold">
                  {fromUser?.name || fromUser?.username}
                </p>
              </div>
              {message && (
                <div>
                  <span className="text-white/60 text-[1.2rem]">Сообщение:</span>
                  <p className="text-white text-[1.4rem]">{message}</p>
                </div>
              )}
              {!message && (
                <p className="text-white/60 text-[1.3rem] italic">Без сообщения</p>
              )}
            </div>
          )}
        </div>

        {/* Кнопка закрыть */}
        <button
          onClick={handleClose}
          className="w-full mt-[1rem] bg-white/10 hover:bg-white/20 text-white py-[1.2rem] rounded-xl text-[1.4rem] transition-all"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}

export default GiftSentModal;
