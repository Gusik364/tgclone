import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import TgsPlayer from "../../common/TgsPlayer";
import starIcon from "../../../assets/star.png";
import MessageReadStatus from "./MessageReadStatus";

function GiftAnimation({ giftDetails, size = 80 }) {
  const [lottieData, setLottieData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ((giftDetails?.animationType === "lottie" || giftDetails?.animationType === "json") && giftDetails?.animationUrl) {
      setLoading(true);
      fetch(giftDetails.animationUrl)
        .then((res) => res.json())
        .then((data) => setLottieData(data))
        .catch(() => setLottieData(null))
        .finally(() => setLoading(false));
    }
  }, [giftDetails]);

  if (giftDetails?.animationType === "tgs" && giftDetails?.tgsUrl) {
    return <TgsPlayer src={giftDetails.tgsUrl} size={size} loop={true} autoplay={true} />;
  }

  if ((giftDetails?.animationType === "lottie" || giftDetails?.animationType === "json") && giftDetails?.animationUrl) {
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

  if (giftDetails?.giftEmoji) {
    return <span style={{ fontSize: size * 0.8 }}>{giftDetails.giftEmoji}</span>;
  }

  return null;
}

function GiftMessage({ messageData, messageReceived }) {
  const { giftDetails } = messageData;
  
  const isMyGift = !messageReceived; // Я отправил подарок
  const convertStars = Math.floor((giftDetails?.price || 0) * (giftDetails?.convertRate || 0.85));

  return (
    <div className="w-[28rem]">
      <div 
        className="rounded-2xl overflow-hidden"
        style={{
          background: isMyGift 
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
            : "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
        }}
      >
        {/* Header */}
        <div className="px-[1.5rem] pt-[1.5rem] pb-[1rem] text-center">
          <p className="text-white/90 text-[1.3rem]">
            {isMyGift ? (
              <>You sent a gift</>
            ) : (
              <>You received a gift</>
            )}
          </p>
        </div>

        {/* Gift card */}
        <div className="mx-[1rem] mb-[1rem] bg-white/20 backdrop-blur rounded-xl p-[1.5rem]">
          <div className="flex flex-col items-center">
            <GiftAnimation giftDetails={giftDetails} size={80} />
            
            <p className="text-white font-semibold text-[1.5rem] mt-[1rem]">
              {giftDetails?.giftName}
            </p>
            
            <div className="flex items-center gap-[0.3rem] text-white/80 text-[1.3rem] mt-[0.5rem]">
              <img src={starIcon} alt="star" className="w-[1.4rem] h-[1.4rem]" />
              <span>{giftDetails?.price}</span>
            </div>

            {giftDetails?.message && (
              <p className="text-white/90 text-[1.3rem] mt-[1rem] text-center italic">
                "{giftDetails.message}"
              </p>
            )}

            {giftDetails?.isAnonymous && !isMyGift && (
              <p className="text-white/70 text-[1.2rem] mt-[0.5rem]">
                From Anonymous
              </p>
            )}
          </div>
        </div>

        {/* Actions for recipient */}
        {messageReceived && (
          <div className="px-[1rem] pb-[1rem]">
            <p className="text-white/70 text-[1.1rem] text-center mb-[0.8rem]">
              Display on your profile or convert to {convertStars} Stars
            </p>
          </div>
        )}

        {/* Time & status */}
        <div className="px-[1.5rem] pb-[1rem]">
          <MessageReadStatus
            readStatus={messageData.readStatus}
            deliveredStatus={messageData.deliveredStatus}
            messageReceived={messageReceived}
            time={messageData.timeSent}
            className="text-white/70"
          />
        </div>
      </div>
    </div>
  );
}

export default GiftMessage;
