import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Lottie from "lottie-react";
import {
  fetchGifts,
  fetchStarsBalance,
  sendGift,
  giftsActions,
} from "../../../store/giftsSlice";
import starIcon from "../../../assets/star.png";
import TgsPlayer from "../../common/TgsPlayer";
import Image from "../../globals/Image";

function GiftPreview({ gift, size = 60 }) {
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

  if (gift?.animationType === "tgs" && gift?.tgsUrl) {
    return <TgsPlayer src={gift.tgsUrl} size={size} loop={true} autoplay={true} />;
  }

  if ((gift?.animationType === "lottie" || gift?.animationType === "json") && gift?.animationUrl) {
    if (loading) {
      return <div style={{ width: size, height: size }} className="animate-pulse bg-secondary-light-text rounded-lg" />;
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

function SendGiftModal() {
  const dispatch = useDispatch();
  const { sendGiftModal, selectedUserId, selectedUserData, catalog, stars } = useSelector(
    (state) => state.giftsReducer
  );
  const user = useSelector((state) => state.userReducer.user);
  const [selectedGift, setSelectedGift] = useState(null);
  const [step, setStep] = useState("catalog"); // "catalog" или "customize"
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [makeUnique, setMakeUnique] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sendGiftModal) {
      dispatch(fetchGifts());
      dispatch(fetchStarsBalance());
    }
  }, [sendGiftModal, dispatch]);

  const handleClose = () => {
    dispatch(giftsActions.closeSendGiftModal());
    setSelectedGift(null);
    setStep("catalog");
    setMessage("");
    setIsAnonymous(false);
    setMakeUnique(false);
    setError("");
  };

  const handleBack = () => {
    setStep("catalog");
    setMessage("");
    setIsAnonymous(false);
    setMakeUnique(false);
    setError("");
  };

  const handleSelectGift = (gift) => {
    if (stars < gift.price) return;
    setSelectedGift(gift);
    setMakeUnique(false);
    setStep("customize");
  };

  // Общая цена с учётом upgrade
  const totalPrice = selectedGift ? selectedGift.price + (makeUnique && selectedGift.canUpgrade ? (selectedGift.upgradePrice || 0) : 0) : 0;

  const handleSend = async () => {
    if (!selectedGift) return;
    if (stars < totalPrice) {
      setError("Not enough Stars");
      return;
    }

    setSending(true);
    setError("");

    try {
      await dispatch(
        sendGift({
          giftId: selectedGift._id,
          toUserId: selectedUserId,
          message,
          isAnonymous,
          withUpgrade: makeUnique && selectedGift.canUpgrade,
        })
      ).unwrap();
      
      dispatch(giftsActions.setSentGiftData({
        gift: selectedGift,
        toUser: selectedUserData,
        fromUser: user,
        message: message,
        isAnonymous: isAnonymous,
      }));
      
      handleClose();
    } catch (err) {
      setError(err.message || "Failed to send gift");
    } finally {
      setSending(false);
    }
  };

  if (!sendGiftModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-primary rounded-xl w-[40rem] max-h-[80vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center p-[1.5rem] border-b border-secondary-light-text">
          {step === "customize" ? (
            <button
              onClick={handleBack}
              className="text-accent text-[1.5rem] flex items-center gap-[0.5rem]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
              Back
            </button>
          ) : (
            <div className="w-[6rem]" />
          )}
          <h2 className="text-[1.8rem] font-semibold flex-1 text-center">Send a Gift</h2>
          <button
            onClick={handleClose}
            className="text-secondary-text hover:text-primary-text w-[6rem] text-right"
          >
            ✕
          </button>
        </div>

        {step === "catalog" ? (
          <>
            {/* Gift catalog */}
            <div className="p-[1.5rem] max-h-[50rem] overflow-y-auto">
              <div className="grid grid-cols-3 gap-[1rem]">
                {catalog.map((gift) => (
                  <button
                    key={gift._id}
                    onClick={() => handleSelectGift(gift)}
                    className={`flex flex-col items-center p-[1.5rem] rounded-xl transition-all ${
                      stars < gift.price 
                        ? "opacity-50 cursor-not-allowed" 
                        : "bg-secondary-light-text hover:bg-secondary-light-text/70"
                    }`}
                    disabled={stars < gift.price}
                  >
                    <GiftPreview gift={gift} size={50} />
                    <span className="text-[1.3rem] mt-[0.5rem]">{gift.name}</span>
                    <span className="text-[1.2rem] text-secondary-text flex items-center gap-[0.2rem]">
                      <img src={starIcon} alt="star" className="w-[1.2rem] h-[1.2rem]" /> {gift.price}
                    </span>
                    {gift.totalSupply && (
                      <span className="text-[1rem] text-secondary-text">
                        {gift.totalSupply - gift.soldCount} left
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {catalog.length === 0 && (
                <p className="text-center text-secondary-text py-[2rem]">
                  No gifts available
                </p>
              )}
            </div>

            {/* Balance */}
            <div className="p-[1.5rem] border-t border-secondary-light-text">
              <div className="flex items-center justify-center gap-[0.5rem] text-[1.4rem]">
                <span className="text-secondary-text">Your balance:</span>
                <img src={starIcon} alt="star" className="w-[1.6rem] h-[1.6rem]" />
                <span className="font-semibold">{stars}</span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Customize step */}
            <div className="p-[1.5rem]">
              <p className="text-secondary-text text-[1.3rem] uppercase tracking-wide mb-[1rem]">
                Customize your gift
              </p>

              {/* Preview card */}
              <div className="bg-[#5BA97E] rounded-2xl p-[1.5rem] mb-[1.5rem]">
                <p className="text-white/90 text-[1.3rem] text-center mb-[1rem]">
                  <span className="font-semibold text-white">{user?.name || user?.username}</span> sent you a gift for {selectedGift?.price} Stars
                </p>
                
                <div className="bg-[#4A9A6E] rounded-xl p-[2rem] flex flex-col items-center">
                  <GiftPreview gift={selectedGift} size={80} />
                  
                  <p className="text-white text-[1.4rem] mt-[1.5rem] flex items-center gap-[0.5rem]">
                    Gift from
                    {!isAnonymous && (
                      <span className="flex items-center gap-[0.3rem]">
                        <Image 
                          src={user?.avatar} 
                          alt={user?.name} 
                          className="w-[2rem] h-[2rem] rounded-full"
                        />
                        <span className="font-semibold">{user?.name || user?.username}</span>
                      </span>
                    )}
                    {isAnonymous && <span className="font-semibold">Anonymous</span>}
                  </p>
                  <p className="text-white/70 text-[1.2rem] text-center mt-[0.5rem]">
                    Display this gift on your page<br/>or convert it to {Math.floor(selectedGift?.price * 0.9)} Stars.
                  </p>
                  
                  <button className="mt-[1rem] px-[2rem] py-[0.5rem] bg-white/20 rounded-full text-white text-[1.3rem]">
                    View
                  </button>
                </div>
              </div>

              {/* Message input */}
              <div className="bg-secondary-light-text rounded-xl flex items-center px-[1rem] mb-[1.5rem]">
                <input
                  type="text"
                  placeholder="Enter Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={255}
                  className="flex-1 p-[1rem] bg-transparent text-[1.4rem] outline-none"
                />
                <span className="text-[1.6rem]">😊</span>
              </div>

              {/* Hide My Name toggle */}
              <div className="bg-secondary-light-text rounded-xl p-[1.2rem] mb-[0.5rem]">
                <div className="flex items-center justify-between">
                  <span className="text-[1.5rem] font-medium">Hide My Name</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-[4.4rem] h-[2.4rem] bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-[2rem] after:w-[2rem] after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
              </div>
              <p className="text-secondary-text text-[1.2rem] px-[0.5rem] mb-[1.5rem]">
                Hide my name and message from visitors to {selectedUserData?.name || selectedUserData?.username}'s profile. {selectedUserData?.name || selectedUserData?.username} will still see your name and message.
              </p>

              {/* Make Unique toggle - only show if gift can be upgraded */}
              {selectedGift?.canUpgrade && (
                <>
                  <div className="bg-secondary-light-text rounded-xl p-[1.2rem] mb-[0.5rem]">
                    <div className="flex items-center justify-between">
                      <span className="text-[1.5rem] font-medium flex items-center gap-[0.5rem]">
                        Make Unique for
                        <img src={starIcon} alt="star" className="w-[1.6rem] h-[1.6rem]" />
                        {selectedGift.upgradePrice || 0}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={makeUnique}
                          onChange={(e) => setMakeUnique(e.target.checked)}
                          disabled={stars < totalPrice}
                          className="sr-only peer"
                        />
                        <div className="w-[4.4rem] h-[2.4rem] bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-[2rem] after:w-[2rem] after:transition-all peer-checked:bg-purple-500 peer-disabled:opacity-50"></div>
                      </label>
                    </div>
                  </div>
                  <p className="text-secondary-text text-[1.2rem] px-[0.5rem] mb-[1.5rem]">
                    The gift will become a unique collectible with random attributes.
                  </p>
                </>
              )}

              {/* Error */}
              {error && (
                <p className="text-danger text-[1.3rem] mb-[1rem]">{error}</p>
              )}

              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={sending || stars < totalPrice}
                className="w-full py-[1.4rem] bg-accent text-white rounded-xl font-semibold text-[1.6rem] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/90 transition-colors flex items-center justify-center gap-[0.5rem]"
              >
                {sending ? "Sending..." : (
                  <>
                    Send a Gift for
                    <img src={starIcon} alt="star" className="w-[1.6rem] h-[1.6rem]" />
                    {totalPrice}
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SendGiftModal;
