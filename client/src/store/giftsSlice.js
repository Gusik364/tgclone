import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Получить каталог подарков
export const fetchGifts = createAsyncThunk("gifts/fetchGifts", async () => {
  const res = await fetch("/api/gifts", { credentials: "include" });
  const data = await res.json();
  return data.data.gifts;
});

// Получить подарки пользователя
export const fetchUserGifts = createAsyncThunk(
  "gifts/fetchUserGifts",
  async (userId) => {
    try {
      const res = await fetch(`/api/gifts/user/${userId}`, {
        credentials: "include",
      });
      const data = await res.json();
      return data.data?.gifts || [];
    } catch (err) {
      return [];
    }
  }
);

// Получить надетый подарок пользователя
export const fetchWornGift = createAsyncThunk(
  "gifts/fetchWornGift",
  async (userId) => {
    try {
      const res = await fetch(`/api/gifts/user/${userId}/worn`, {
        credentials: "include",
      });
      const data = await res.json();
      return data.data?.wornGift || null;
    } catch (err) {
      return null;
    }
  }
);

// Получить мои подарки
export const fetchMyGifts = createAsyncThunk("gifts/fetchMyGifts", async () => {
  const res = await fetch("/api/gifts/my", { credentials: "include" });
  const data = await res.json();
  return data.data.gifts;
});

// Получить баланс Stars
export const fetchStarsBalance = createAsyncThunk(
  "gifts/fetchStarsBalance",
  async () => {
    const res = await fetch("/api/gifts/stars", { credentials: "include" });
    const data = await res.json();
    return data.data.stars;
  }
);

// Отправить подарок
export const sendGift = createAsyncThunk(
  "gifts/sendGift",
  async ({ giftId, toUserId, message, isAnonymous, withUpgrade }) => {
    const res = await fetch("/api/gifts/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ giftId, toUserId, message, isAnonymous, withUpgrade }),
    });
    const data = await res.json();
    if (data.status !== "success") {
      throw new Error(data.message || "Failed to send gift");
    }
    return data.data;
  }
);

// Конвертировать подарок
export const convertGift = createAsyncThunk(
  "gifts/convertGift",
  async (giftId) => {
    const res = await fetch(`/api/gifts/${giftId}/convert`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    return data.data;
  }
);

// Надеть подарок
export const wearGift = createAsyncThunk(
  "gifts/wearGift",
  async (giftId) => {
    const res = await fetch(`/api/gifts/${giftId}/wear`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    return data.data;
  }
);

// Снять подарок
export const unwearGift = createAsyncThunk(
  "gifts/unwearGift",
  async () => {
    const res = await fetch(`/api/gifts/unwear`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    return data.data;
  }
);

// Получить превью upgrade
export const fetchUpgradePreview = createAsyncThunk(
  "gifts/fetchUpgradePreview",
  async (giftId) => {
    const res = await fetch(`/api/gifts/${giftId}/upgrade-preview`, {
      credentials: "include",
    });
    const data = await res.json();
    if (data.status !== "success") {
      throw new Error(data.message || "Failed to get upgrade preview");
    }
    return data.data;
  }
);

// Улучшить подарок до NFT
export const upgradeGift = createAsyncThunk(
  "gifts/upgradeGift",
  async (giftId) => {
    const res = await fetch(`/api/gifts/${giftId}/upgrade`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    if (data.status !== "success") {
      throw new Error(data.message || "Failed to upgrade gift");
    }
    return data.data;
  }
);

// Показать/скрыть подарок в профиле
export const toggleGiftDisplay = createAsyncThunk(
  "gifts/toggleGiftDisplay",
  async (giftId) => {
    const res = await fetch(`/api/gifts/${giftId}/toggle-display`, {
      method: "PATCH",
      credentials: "include",
    });
    const data = await res.json();
    if (data.status !== "success") {
      throw new Error(data.message || "Failed to toggle display");
    }
    return data.data;
  }
);

// Передать подарок другому пользователю
export const transferGift = createAsyncThunk(
  "gifts/transferGift",
  async ({ giftId, toUserId }) => {
    const res = await fetch(`/api/gifts/${giftId}/transfer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ toUserId }),
    });
    const data = await res.json();
    if (data.status !== "success") {
      throw new Error(data.message || "Failed to transfer gift");
    }
    return data.data;
  }
);

const initialState = {
  catalog: [],
  userGifts: [],
  myGifts: [],
  wornGift: null,
  upgradePreview: null,
  stars: 0,
  loading: false,
  error: null,
  sendGiftModal: false,
  selectedUserId: null,
  selectedUserData: null,
  sentGiftData: null,
};

const giftsSlice = createSlice({
  name: "gifts",
  initialState,
  reducers: {
    openSendGiftModal: (state, { payload }) => {
      state.sendGiftModal = true;
      state.selectedUserId = payload.userId;
      state.selectedUserData = payload.userData;
    },
    closeSendGiftModal: (state) => {
      state.sendGiftModal = false;
      state.selectedUserId = null;
      state.selectedUserData = null;
    },
    clearUserGifts: (state) => {
      state.userGifts = [];
      state.wornGift = null;
    },
    clearUpgradePreview: (state) => {
      state.upgradePreview = null;
    },
    setSentGiftData: (state, { payload }) => {
      state.sentGiftData = payload;
    },
    clearSentGiftData: (state) => {
      state.sentGiftData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGifts.fulfilled, (state, { payload }) => {
        state.catalog = payload;
      })
      .addCase(fetchUserGifts.fulfilled, (state, { payload }) => {
        state.userGifts = payload;
      })
      .addCase(fetchWornGift.fulfilled, (state, { payload }) => {
        state.wornGift = payload;
      })
      .addCase(fetchMyGifts.fulfilled, (state, { payload }) => {
        state.myGifts = payload;
      })
      .addCase(fetchStarsBalance.fulfilled, (state, { payload }) => {
        state.stars = payload;
      })
      .addCase(sendGift.fulfilled, (state, { payload }) => {
        state.stars = payload.newBalance;
        state.sendGiftModal = false;
      })
      .addCase(fetchUpgradePreview.fulfilled, (state, { payload }) => {
        state.upgradePreview = payload;
      })
      .addCase(upgradeGift.fulfilled, (state, { payload }) => {
        state.stars = payload.newBalance;
        // Обновляем подарок в списке
        const index = state.myGifts.findIndex(g => g._id === payload.userGift._id);
        if (index !== -1) {
          state.myGifts[index] = payload.userGift;
        }
      })
      .addCase(transferGift.fulfilled, (state, { payload }) => {
        // Удаляем подарок из списка (он теперь у другого пользователя)
        state.myGifts = state.myGifts.filter(g => g._id !== payload.userGift._id);
      });
  },
});

export const giftsActions = giftsSlice.actions;
export default giftsSlice.reducer;
