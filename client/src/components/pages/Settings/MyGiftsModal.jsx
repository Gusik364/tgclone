import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Lottie from "lottie-react";
import { fetchMyGifts, wearGift, unwearGift, convertGift, upgradeGift, fetchStarsBalance, toggleGiftDisplay, transferGift } from "../../../store/giftsSlice";
import { userActions } from "../../../store/userSlice";
import starIcon from "../../../assets/star.png";
import TgsPlayer from "../../common/TgsPlayer";

function GiftPreview({ gift, userGift, size = 60 }) {
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
    return <TgsPlayer src={displayGift.tgsUrl} size={size} loop={true} autoplay={true} />;
  }
  // Lottie/JSON анимация
  if ((displayGift?.animationType === "lottie" || displayGift?.animationType === "json") && displayGift?.animationUrl) {
    if (loading) {
      return <div style={{ width: size, height: size }} className="animate-pulse bg-secondary-light-text rounded-lg" />;
    }
    if (lottieData) {
      return <Lottie animationData={lottieData} loop={true} style={{ width: size, height: size }} />;
    }
  }
  // GIF анимация
  if (displayGift?.animationType === "gif" && displayGift?.animationUrl) {
    return <img src={displayGift.animationUrl} alt={gift?.name} style={{ width: size, height: size, objectFit: "contain" }} />;
  }
  // Emoji как fallback
  if (gift?.emoji) {
    return <span style={{ fontSize: size * 0.8 }}>{gift.emoji}</span>;
  }
  return null;
}

function MyGiftsModal({ visible, onClose }) {
  const dispatch = useDispatch();
  const { myGifts, stars } = useSelector((state) => state.giftsReducer);
  const user = useSelector((state) => state.userReducer.user);
  const [selectedGift, setSelectedGift] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showUpgradeConfirm, setShowUpgradeConfirm] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (visible) {
      dispatch(fetchMyGifts());
      dispatch(fetchStarsBalance());
      // Загружаем контакты для передачи
      fetch("/api/contacts", { credentials: "include" })
        .then(res => res.json())
        .then(data => setContacts(data.data?.contacts || []))
        .catch(() => setContacts([]));
    }
  }, [visible, dispatch]);

  const handleWear = async (giftId) => {
    setLoading(true);
    try {
      await dispatch(wearGift(giftId)).unwrap();
      dispatch(userActions.setWornGift(giftId));
      dispatch(fetchMyGifts());
      setSelectedGift(null);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleUnwear = async () => {
    setLoading(true);
    try {
      await dispatch(unwearGift()).unwrap();
      dispatch(userActions.setWornGift(null));
      dispatch(fetchMyGifts());
      setSelectedGift(null);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleConvert = async (giftId) => {
    setLoading(true);
    try {
      await dispatch(convertGift(giftId)).unwrap();
      dispatch(fetchMyGifts());
      setSelectedGift(null);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleUpgrade = async (giftId) => {
    setLoading(true);
    try {
      const result = await dispatch(upgradeGift(giftId)).unwrap();
      dispatch(fetchMyGifts());
      setSelectedGift(result.userGift);
      setShowUpgradeConfirm(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to upgrade");
    }
    setLoading(false);
  };

  const handleToggleDisplay = async (giftId) => {
    setLoading(true);
    try {
      const result = await dispatch(toggleGiftDisplay(giftId)).unwrap();
      dispatch(fetchMyGifts());
      setSelectedGift(prev => prev ? { ...prev, isDisplayed: result.isDisplayed } : null);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleTransfer = async (toUserId) => {
    setLoading(true);
    try {
      await dispatch(transferGift({ giftId: selectedGift._id, toUserId })).unwrap();
      dispatch(fetchMyGifts());
      setSelectedGift(null);
      setShowTransferModal(false);
      setSearchQuery("");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to transfer");
    }
    setLoading(false);
  };

  const filteredContacts = contacts.filter(c => {
    const name = c.contactDetails?.name || c.name || "";
    const username = c.contactDetails?.username || "";
    const query = searchQuery.toLowerCase();
    return name.toLowerCase().includes(query) || username.toLowerCase().includes(query);
  });

  if (!visible) return null;

  const isWorn = (giftId) => user?.wornGift === giftId;
  const canUpgrade = selectedGift?.gift?.canUpgrade && !selectedGift?.isUpgraded && !selectedGift?.isConverted;
  const upgradePrice = selectedGift?.gift?.upgradePrice || 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-primary rounded-xl w-[40rem] max-h-[80vh] overflow-hidden shadow-xl">
        <div className="flex items-center p-[1.5rem] border-b border-secondary-light-text">
          {selectedGift ? (
            <button onClick={() => { setSelectedGift(null); setShowUpgradeConfirm(false); }} className="text-accent text-[1.5rem] flex items-center gap-[0.5rem]">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              Back
            </button>
          ) : <div className="w-[6rem]" />}
          <h2 className="text-[1.8rem] font-semibold flex-1 text-center">My Gifts</h2>
          <button onClick={onClose} className="text-secondary-text hover:text-primary-text w-[6rem] text-right">✕</button>
        </div>

        {selectedGift ? (
          <div className="p-[1.5rem] max-h-[60vh] overflow-y-auto">
            {selectedGift.isUpgraded && (
              <div className="flex justify-center mb-[1rem]">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-[1.2rem] py-[0.4rem] rounded-full text-[1.2rem] font-semibold">✨ #{selectedGift.uniqueNum}</span>
              </div>
            )}
            <div className="flex flex-col items-center py-[2rem] rounded-xl mb-[1rem]" style={selectedGift.isUpgraded && selectedGift.upgradeBackdrop ? { background: `linear-gradient(135deg, ${selectedGift.upgradeBackdrop.centerColor} 0%, ${selectedGift.upgradeBackdrop.edgeColor} 100%)` } : {}}>
              <GiftPreview gift={selectedGift.gift} userGift={selectedGift} size={100} />
              <h3 className="text-[2rem] font-semibold mt-[1rem]" style={selectedGift.isUpgraded && selectedGift.upgradeBackdrop ? { color: selectedGift.upgradeBackdrop.textColor || '#fff' } : {}}>{selectedGift.gift?.name}</h3>
              {selectedGift.isUpgraded && (
                <div className="flex flex-wrap gap-[0.5rem] mt-[1rem] justify-center">
                  {selectedGift.upgradeModel && <span className="bg-white/20 px-[0.8rem] py-[0.3rem] rounded-full text-[1.1rem]" style={{ color: selectedGift.upgradeBackdrop?.textColor || '#666' }}>{selectedGift.upgradeModel.name}</span>}
                  {selectedGift.upgradePattern && <span className="bg-white/20 px-[0.8rem] py-[0.3rem] rounded-full text-[1.1rem]" style={{ color: selectedGift.upgradeBackdrop?.textColor || '#666' }}>{selectedGift.upgradePattern.name}</span>}
                  {selectedGift.upgradeBackdrop && <span className="bg-white/20 px-[0.8rem] py-[0.3rem] rounded-full text-[1.1rem]" style={{ color: selectedGift.upgradeBackdrop?.textColor || '#666' }}>{selectedGift.upgradeBackdrop.name}</span>}
                </div>
              )}
            </div>
            <p className="text-secondary-text text-[1.3rem] text-center">From: {selectedGift.from?.name || "Anonymous"}</p>
            {selectedGift.message && <p className="text-[1.4rem] mt-[1rem] text-center italic">"{selectedGift.message}"</p>}
            <p className="text-secondary-text text-[1.2rem] mt-[1rem] flex items-center justify-center gap-[0.3rem]">Value: <img src={starIcon} alt="star" className="w-[1.4rem] h-[1.4rem]" /> {selectedGift.gift?.price}</p>

            {!selectedGift.isConverted && (
              <div className="flex flex-col gap-[1rem] mt-[1.5rem]">
                {canUpgrade && !showUpgradeConfirm && (
                  <button onClick={() => setShowUpgradeConfirm(true)} className="w-full py-[1.2rem] bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-[1.5rem] hover:opacity-90 transition-colors flex items-center justify-center gap-[0.5rem]">
                    ✨ Upgrade {upgradePrice > 0 && <span className="flex items-center gap-[0.3rem]">for <img src={starIcon} alt="star" className="w-[1.4rem] h-[1.4rem]" /> {upgradePrice}</span>}
                  </button>
                )}
                {showUpgradeConfirm && (
                  <div className="bg-secondary-light-text rounded-xl p-[1.5rem]">
                    <p className="text-[1.4rem] text-center mb-[1rem]">Upgrade this gift to a unique collectible? You'll receive random attributes that determine its rarity.</p>
                    {upgradePrice > 0 && <p className="text-center text-secondary-text text-[1.3rem] mb-[1rem]">Cost: <img src={starIcon} alt="star" className="w-[1.4rem] h-[1.4rem] inline" /> {upgradePrice}{stars < upgradePrice && <span className="text-danger ml-[0.5rem]">(Not enough Stars)</span>}</p>}
                    <div className="flex gap-[1rem]">
                      <button onClick={() => setShowUpgradeConfirm(false)} className="flex-1 py-[1rem] bg-secondary-light-text border border-secondary-text/30 rounded-xl font-semibold text-[1.4rem]">Cancel</button>
                      <button onClick={() => handleUpgrade(selectedGift._id)} disabled={loading || stars < upgradePrice} className="flex-1 py-[1rem] bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-[1.4rem] disabled:opacity-50">{loading ? "..." : "Upgrade"}</button>
                    </div>
                  </div>
                )}
                {!showUpgradeConfirm && (
                  <>
                    {isWorn(selectedGift._id) ? (
                      <button onClick={handleUnwear} disabled={loading} className="w-full py-[1.2rem] bg-secondary-light-text text-primary-text rounded-xl font-semibold text-[1.5rem] disabled:opacity-50 hover:bg-secondary-light-text/70 transition-colors">{loading ? "..." : "Take Off"}</button>
                    ) : (
                      <button onClick={() => handleWear(selectedGift._id)} disabled={loading} className="w-full py-[1.2rem] bg-accent text-white rounded-xl font-semibold text-[1.5rem] disabled:opacity-50 hover:bg-accent/90 transition-colors">{loading ? "..." : "Wear"}</button>
                    )}
                    
                    {/* Show/Hide button */}
                    <button 
                      onClick={() => handleToggleDisplay(selectedGift._id)} 
                      disabled={loading} 
                      className="w-full py-[1.2rem] bg-secondary-light-text text-primary-text rounded-xl font-semibold text-[1.5rem] disabled:opacity-50 hover:bg-secondary-light-text/70 transition-colors flex items-center justify-center gap-[0.5rem]"
                    >
                      {loading ? "..." : (
                        <>
                          {selectedGift.isDisplayed ? (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                              </svg>
                              Hide from Profile
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                              Show in Profile
                            </>
                          )}
                        </>
                      )}
                    </button>

                    {/* Transfer button */}
                    <button 
                      onClick={() => setShowTransferModal(true)} 
                      disabled={loading} 
                      className="w-full py-[1.2rem] bg-secondary-light-text text-primary-text rounded-xl font-semibold text-[1.5rem] disabled:opacity-50 hover:bg-secondary-light-text/70 transition-colors flex items-center justify-center gap-[0.5rem]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 1l4 4-4 4" />
                        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                        <path d="M7 23l-4-4 4-4" />
                        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                      </svg>
                      Transfer
                    </button>

                    {!selectedGift.isUpgraded && (
                      <button onClick={() => handleConvert(selectedGift._id)} disabled={loading} className="w-full py-[1.2rem] bg-secondary-light-text text-primary-text rounded-xl font-semibold text-[1.5rem] disabled:opacity-50 hover:bg-secondary-light-text/70 transition-colors flex items-center justify-center gap-[0.5rem]">
                        {loading ? "..." : <>Convert to <img src={starIcon} alt="star" className="w-[1.4rem] h-[1.4rem]" /> {Math.floor(selectedGift.gift?.price * (selectedGift.gift?.convertRate || 0.85))}</>}
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
            {selectedGift.isConverted && <p className="text-center text-secondary-text text-[1.4rem] mt-[1.5rem]">This gift has been converted to {selectedGift.convertedStars} Stars</p>}
          </div>
        ) : (
          <div className="p-[1.5rem] max-h-[50rem] overflow-y-auto">
            {myGifts.length === 0 ? (
              <p className="text-center text-secondary-text py-[3rem] text-[1.4rem]">You don't have any gifts yet</p>
            ) : (
              <div className="grid grid-cols-3 gap-[1rem]">
                {myGifts.map((userGift) => (
                  <button key={userGift._id} onClick={() => setSelectedGift(userGift)} className={`flex flex-col items-center p-[1.5rem] rounded-xl transition-all relative ${userGift.isConverted ? "opacity-50 bg-secondary-light-text/50" : userGift.isUpgraded ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 ring-1 ring-purple-500/50" : "bg-secondary-light-text hover:bg-secondary-light-text/70"} ${isWorn(userGift._id) ? "ring-2 ring-accent" : ""}`}>
                    {isWorn(userGift._id) && <span className="absolute top-[0.5rem] right-[0.5rem] text-[1rem] bg-accent text-white px-[0.5rem] py-[0.2rem] rounded-full">Worn</span>}
                    {userGift.isUpgraded && !isWorn(userGift._id) && <span className="absolute top-[0.5rem] right-[0.5rem] text-[0.9rem] bg-gradient-to-r from-purple-500 to-pink-500 text-white px-[0.5rem] py-[0.2rem] rounded-full">#{userGift.uniqueNum}</span>}
                    <GiftPreview gift={userGift.gift} userGift={userGift} size={50} />
                    <span className="text-[1.3rem] mt-[0.5rem]">{userGift.gift?.name}</span>
                    <span className="text-[1.1rem] text-secondary-text">{userGift.from?.name || "Anonymous"}</span>
                  </button>
                ))}
              </div>
            )}
            <p className="text-secondary-text text-[1.2rem] text-center mt-[1.5rem]">Tap a gift to wear it or upgrade for unique attributes.</p>
          </div>
        )}
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
          <div className="bg-primary rounded-xl w-[35rem] max-h-[60vh] overflow-hidden shadow-xl">
            <div className="flex items-center justify-between p-[1.5rem] border-b border-secondary-light-text">
              <h3 className="text-[1.6rem] font-semibold">Передать подарок</h3>
              <button onClick={() => { setShowTransferModal(false); setSearchQuery(""); }} className="text-secondary-text hover:text-primary-text text-[1.8rem]">✕</button>
            </div>
            
            <div className="p-[1rem]">
              <input
                type="text"
                placeholder="Поиск контакта..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-[1.2rem] py-[1rem] bg-secondary-light-text rounded-xl text-[1.4rem] outline-none"
              />
            </div>

            <div className="max-h-[35rem] overflow-y-auto p-[1rem] pt-0">
              {filteredContacts.length === 0 ? (
                <p className="text-center text-secondary-text py-[2rem] text-[1.4rem]">Контакты не найдены</p>
              ) : (
                filteredContacts.map((contact) => {
                  const contactUser = contact.contactDetails || contact;
                  return (
                    <button
                      key={contactUser._id}
                      onClick={() => handleTransfer(contactUser._id)}
                      disabled={loading}
                      className="w-full flex items-center gap-[1rem] p-[1rem] hover:bg-secondary-light-text rounded-xl transition-colors disabled:opacity-50"
                    >
                      <img
                        src={contactUser.avatar || "/default-avatar.png"}
                        alt={contactUser.name}
                        className="w-[4rem] h-[4rem] rounded-full object-cover"
                      />
                      <div className="text-left">
                        <p className="font-semibold text-[1.4rem]">{contactUser.name || contactUser.username}</p>
                        <p className="text-secondary-text text-[1.2rem]">@{contactUser.username}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyGiftsModal;
