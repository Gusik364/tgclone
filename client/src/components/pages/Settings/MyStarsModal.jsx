import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStarsBalance } from "../../../store/giftsSlice";
import starIcon from "../../../assets/star.png";

function MyStarsModal({ visible, onClose, stars }) {
  const dispatch = useDispatch();
  const { stars: starsBalance } = useSelector((state) => state.giftsReducer);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      dispatch(fetchStarsBalance());
      loadTransactions();
    }
  }, [visible, dispatch]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stars/transactions", { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions || []);
      }
    } catch (err) {
      console.error("Failed to load transactions:", err);
    }
    setLoading(false);
  };

  if (!visible) return null;

  const displayStars = starsBalance ?? stars ?? 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-primary rounded-xl w-[40rem] max-h-[80vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-[1.5rem] border-b border-secondary-light-text">
          <div className="w-[3rem]" />
          <h2 className="text-[1.8rem] font-semibold">My Stars</h2>
          <button onClick={onClose} className="text-secondary-text hover:text-primary-text text-[2rem]">
            ✕
          </button>
        </div>

        {/* Balance */}
        <div className="p-[2rem] flex flex-col items-center border-b border-secondary-light-text">
          <div className="flex items-center gap-[1rem]">
            <span className="text-[4rem]">⭐</span>
            <span className="text-[4rem] font-bold">{displayStars}</span>
          </div>
          <p className="text-secondary-text text-[1.4rem] mt-[0.5rem]">Your balance</p>
        </div>

        {/* Info */}
        <div className="p-[1.5rem] border-b border-secondary-light-text">
          <div className="bg-secondary-light-text rounded-xl p-[1.5rem]">
            <h3 className="font-semibold text-[1.5rem] mb-[1rem]">What are Stars?</h3>
            <ul className="text-[1.3rem] text-secondary-text space-y-[0.8rem]">
              <li className="flex items-start gap-[0.8rem]">
                <span>🎁</span>
                <span>Buy gifts for your friends</span>
              </li>
              <li className="flex items-start gap-[0.8rem]">
                <span>✨</span>
                <span>Upgrade gifts to unique collectibles</span>
              </li>
              <li className="flex items-start gap-[0.8rem]">
                <span>💫</span>
                <span>Convert received gifts back to Stars</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Transactions */}
        <div className="p-[1.5rem] max-h-[30rem] overflow-y-auto">
          <h3 className="font-semibold text-[1.5rem] mb-[1rem]">Recent Activity</h3>
          
          {loading ? (
            <div className="flex justify-center py-[2rem]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-center text-secondary-text py-[2rem] text-[1.4rem]">
              No transactions yet
            </p>
          ) : (
            <div className="space-y-[1rem]">
              {transactions.map((tx, idx) => (
                <div 
                  key={tx._id || idx} 
                  className="flex items-center justify-between p-[1rem] bg-secondary-light-text rounded-xl"
                >
                  <div className="flex items-center gap-[1rem]">
                    <span className="text-[2rem]">
                      {tx.type === "gift_convert" && "🔄"}
                      {tx.type === "gift_purchase" && "🎁"}
                      {tx.type === "gift_upgrade" && "✨"}
                      {tx.type === "admin_grant" && "👑"}
                      {!["gift_convert", "gift_purchase", "gift_upgrade", "admin_grant"].includes(tx.type) && "⭐"}
                    </span>
                    <div>
                      <p className="font-semibold text-[1.3rem]">{tx.description || tx.type}</p>
                      <p className="text-secondary-text text-[1.1rem]">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`font-semibold text-[1.4rem] ${tx.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                    {tx.amount > 0 ? "+" : ""}{tx.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyStarsModal;
