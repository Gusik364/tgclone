import EmojiPicker from "emoji-picker-react";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TgsPlayer from "../../common/TgsPlayer";

// Иконки категорий для premium emoji
const EMOJI_CATEGORIES = [
  { id: "recent", icon: "🕐", name: "Recent" },
  { id: "smileys", icon: "😀", name: "Smileys & People" },
  { id: "animals", icon: "🐱", name: "Animals & Nature" },
  { id: "food", icon: "🍔", name: "Food & Drink" },
  { id: "travel", icon: "🚌", name: "Travel & Places" },
  { id: "activities", icon: "⚽", name: "Activities" },
  { id: "objects", icon: "👕", name: "Objects" },
  { id: "symbols", icon: "🎵", name: "Symbols" },
  { id: "flags", icon: "🚩", name: "Flags" },
];

function EmojiModal({ emojiVisible, setEmojiVisible, addEmojiToMessage, onSendSticker, onSendPremiumEmoji }) {
  const [activeTab, setActiveTab] = useState("emoji"); // "emoji" | "premium" | "stickers"
  const [stickerPacks, setStickerPacks] = useState([]);
  const [selectedPack, setSelectedPack] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Premium emoji state
  const [emojiPacks, setEmojiPacks] = useState([]);
  const [selectedEmojiPack, setSelectedEmojiPack] = useState(null);
  const [emojiLoading, setEmojiLoading] = useState(false);
  const [recentEmojis, setRecentEmojis] = useState([]);

  // Загружаем стикерпаки при открытии вкладки
  useEffect(() => {
    if (activeTab === "stickers" && stickerPacks.length === 0) {
      loadStickerPacks();
    }
    if (activeTab === "premium" && emojiPacks.length === 0) {
      loadEmojiPacks();
    }
  }, [activeTab]);

  // Загружаем recent emojis из localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentPremiumEmojis");
    if (saved) {
      try {
        setRecentEmojis(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const loadStickerPacks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/admin/api/public/stickers");
      const data = await res.json();
      if (data.success && data.packs) {
        setStickerPacks(data.packs);
        if (data.packs.length > 0) {
          setSelectedPack(data.packs[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load sticker packs:", err);
    }
    setLoading(false);
  };

  const loadEmojiPacks = async () => {
    setEmojiLoading(true);
    try {
      const res = await fetch("/admin/api/public/emoji");
      const data = await res.json();
      if (data.success && data.packs) {
        setEmojiPacks(data.packs);
        if (data.packs.length > 0) {
          setSelectedEmojiPack(data.packs[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load emoji packs:", err);
    }
    setEmojiLoading(false);
  };

  const handleMouseMovement = (event) => {
    event.currentTarget.addEventListener("mouseleave", () => {
      setEmojiVisible(false);
    });
  };

  const handleStickerClick = (sticker) => {
    if (onSendSticker) {
      onSendSticker(sticker);
      setEmojiVisible(false);
    }
  };

  const handlePremiumEmojiClick = (emoji, pack) => {
    // Добавляем в recent
    const newRecent = [
      { ...emoji, packId: pack._id, packTitle: pack.title },
      ...recentEmojis.filter(e => e.customEmojiId !== emoji.customEmojiId)
    ].slice(0, 30);
    setRecentEmojis(newRecent);
    localStorage.setItem("recentPremiumEmojis", JSON.stringify(newRecent));

    if (onSendPremiumEmoji) {
      onSendPremiumEmoji(emoji, pack);
    }
  };

  // Рендер стикера/emoji в зависимости от типа
  const renderSticker = (sticker, size = "100%") => {
    if (sticker.type === "animated" || sticker.url?.endsWith(".tgs")) {
      return <TgsPlayer src={sticker.url} size={size} className="w-full h-full" />;
    }
    if (sticker.type === "video" || sticker.url?.endsWith(".webm")) {
      return (
        <video
          src={sticker.url}
          className="w-full h-full object-contain"
          autoPlay
          loop
          muted
          playsInline
        />
      );
    }
    return (
      <img
        src={sticker.url}
        alt={sticker.emoji || "sticker"}
        className="w-full h-full object-contain"
        loading="lazy"
      />
    );
  };

  // Рендер premium emoji
  const renderPremiumEmoji = (emoji, size = 32) => {
    if (emoji.type === "animated" || emoji.url?.endsWith(".tgs")) {
      return <TgsPlayer src={emoji.url} size={size} className="w-full h-full" />;
    }
    if (emoji.type === "video" || emoji.url?.endsWith(".webm")) {
      return (
        <video
          src={emoji.url}
          className="w-full h-full object-contain"
          autoPlay
          loop
          muted
          playsInline
        />
      );
    }
    return (
      <img
        src={emoji.url}
        alt={emoji.emoji || "emoji"}
        className="w-full h-full object-contain"
        loading="lazy"
      />
    );
  };

  return (
    <AnimatePresence>
      {emojiVisible && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className={`absolute bottom-[9rem] left-0 w-[40rem] origin-bottom-left sm:static sm:origin-bottom mt-[.5rem] sm:!scale-100 sm:!duration-[1000ms] sm:w-full ${
            !emojiVisible ? "sm:scale-y-0" : "sm:scale-y-100"
          }`}
          id="emojiPicker"
          onMouseEnter={handleMouseMovement}
        >
          {/* Tabs */}
          <div className="flex bg-primary rounded-t-xl border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("emoji")}
              className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                activeTab === "emoji"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
              }`}
            >
              😀 Emoji
            </button>
            <button
              onClick={() => setActiveTab("premium")}
              className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                activeTab === "premium"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
              }`}
            >
              ✨ Premium
            </button>
            <button
              onClick={() => setActiveTab("stickers")}
              className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                activeTab === "stickers"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
              }`}
            >
              🎨 Stickers
            </button>
          </div>

          {/* Content */}
          {activeTab === "emoji" ? (
            <EmojiPicker
              width="100%"
              lazyLoadEmojis={true}
              onEmojiClick={addEmojiToMessage}
            />
          ) : activeTab === "premium" ? (
            <div className="bg-primary rounded-b-xl" style={{ height: "350px" }}>
              {emojiLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : emojiPacks.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Нет доступных premium emoji
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  {/* Category icons bar */}
                  <div className="flex gap-1 p-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                    {emojiPacks.map((pack) => (
                      <button
                        key={pack._id}
                        onClick={() => setSelectedEmojiPack(pack)}
                        className={`shrink-0 w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center transition-all ${
                          selectedEmojiPack?._id === pack._id
                            ? "bg-blue-100 dark:bg-blue-900"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                        title={pack.title}
                      >
                        {pack.thumbnail ? (
                          pack.packType === "animated" ? (
                            <TgsPlayer src={pack.thumbnail} size={28} />
                          ) : (
                            <img
                              src={pack.thumbnail}
                              alt={pack.title}
                              className="w-7 h-7 object-contain"
                            />
                          )
                        ) : (
                          <span className="text-xl">✨</span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Emoji grid */}
                  <div className="flex-1 overflow-y-auto p-2">
                    {/* Recent section */}
                    {recentEmojis.length > 0 && !selectedEmojiPack && (
                      <div className="mb-4">
                        <div className="text-xs text-gray-500 mb-2 px-1 font-medium">
                          Recent
                        </div>
                        <div className="grid grid-cols-8 gap-1">
                          {recentEmojis.map((emoji, idx) => (
                            <button
                              key={`recent-${emoji.customEmojiId}-${idx}`}
                              onClick={() => {
                                const pack = emojiPacks.find(p => p._id === emoji.packId);
                                if (pack) handlePremiumEmojiClick(emoji, pack);
                              }}
                              className="aspect-square p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              title={emoji.packTitle}
                            >
                              {renderPremiumEmoji(emoji, 28)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Selected pack emojis */}
                    {selectedEmojiPack && (
                      <>
                        <div className="text-xs text-gray-500 mb-2 px-1 font-medium">
                          {selectedEmojiPack.title}
                        </div>
                        <div className="grid grid-cols-8 gap-1">
                          {selectedEmojiPack.emojis?.map((emoji, idx) => (
                            <button
                              key={emoji.customEmojiId || idx}
                              onClick={() => handlePremiumEmojiClick(emoji, selectedEmojiPack)}
                              className="aspect-square p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              {renderPremiumEmoji(emoji, 28)}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-primary rounded-b-xl" style={{ height: "350px" }}>
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : stickerPacks.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Нет доступных стикеров
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  {/* Pack selector */}
                  <div className="flex gap-1 p-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                    {stickerPacks.map((pack) => (
                      <button
                        key={pack._id}
                        onClick={() => setSelectedPack(pack)}
                        className={`shrink-0 w-10 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedPack?._id === pack._id
                            ? "border-blue-500"
                            : "border-transparent hover:border-gray-300"
                        }`}
                        title={pack.title}
                      >
                        {pack.thumbnail ? (
                          pack.packType === "animated" ? (
                            <TgsPlayer src={pack.thumbnail} size={36} />
                          ) : (
                            <img
                              src={pack.thumbnail}
                              alt={pack.title}
                              className="w-full h-full object-contain"
                            />
                          )
                        ) : (
                          <span className="text-lg">📦</span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Stickers grid */}
                  <div className="flex-1 overflow-y-auto p-2">
                    {selectedPack && (
                      <>
                        <div className="text-xs text-gray-500 mb-2 px-1">
                          {selectedPack.title}
                        </div>
                        <div className="grid grid-cols-5 gap-1">
                          {selectedPack.stickers?.map((sticker, idx) => (
                            <button
                              key={sticker.fileId || idx}
                              onClick={() => handleStickerClick(sticker)}
                              className="aspect-square p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              {renderSticker(sticker)}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default EmojiModal;
