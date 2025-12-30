import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useFetch from "../../../hooks/useFetch";

function DeleteAccountModal({ visible, onClose }) {
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { reqFn: deleteAccount, reqState } = useFetch(
    { method: "DELETE", url: "/profile/delete-account" },
    () => {
      // Успех - перенаправляем на страницу авторизации
      localStorage.clear();
      window.location.href = "/auth";
    },
    (err) => {
      setError(err.message || "Error deleting account");
    }
  );

  const handleDelete = async () => {
    setError("");
    await deleteAccount({ password });
  };

  const handleClose = () => {
    setStep(1);
    setPassword("");
    setError("");
    onClose();
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[2rem]"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-primary rounded-2xl p-[2.5rem] max-w-[40rem] w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {step === 1 && (
            <>
              <div className="text-center mb-[2rem]">
                <span className="text-[4rem]">⚠️</span>
                <h2 className="text-[2rem] font-bold mt-[1rem]">
                  Delete Account
                </h2>
                <p className="text-secondary-text mt-[1rem] text-[1.4rem]">
                  Are you sure you want to delete your account? This action cannot be undone.
                </p>
              </div>

              <div className="bg-danger/10 border border-danger/30 rounded-xl p-[1.5rem] mb-[2rem]">
                <p className="text-danger text-[1.3rem]">
                  <strong>Warning:</strong> All your data will be permanently deleted:
                </p>
                <ul className="text-danger text-[1.2rem] mt-[1rem] list-disc list-inside">
                  <li>Messages and chats</li>
                  <li>Contacts</li>
                  <li>Gifts and Stars</li>
                  <li>Profile information</li>
                </ul>
              </div>

              <div className="flex gap-[1rem]">
                <button
                  onClick={handleClose}
                  className="flex-1 py-[1.2rem] rounded-xl bg-secondary-light-text font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-[1.2rem] rounded-xl bg-danger text-white font-semibold"
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="text-center mb-[2rem]">
                <span className="text-[4rem]">🔐</span>
                <h2 className="text-[2rem] font-bold mt-[1rem]">
                  Confirm Deletion
                </h2>
                <p className="text-secondary-text mt-[1rem] text-[1.4rem]">
                  Enter your password to confirm account deletion
                </p>
              </div>

              {error && (
                <div className="bg-danger/10 border border-danger/30 rounded-xl p-[1rem] mb-[1.5rem]">
                  <p className="text-danger text-[1.3rem] text-center">{error}</p>
                </div>
              )}

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-[1.2rem] rounded-xl bg-secondary-light-text mb-[2rem] text-[1.4rem] outline-none focus:ring-2 focus:ring-danger"
              />

              <div className="flex gap-[1rem]">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-[1.2rem] rounded-xl bg-secondary-light-text font-semibold"
                  disabled={reqState === "loading"}
                >
                  Back
                </button>
                <button
                  onClick={handleDelete}
                  disabled={!password || reqState === "loading"}
                  className="flex-1 py-[1.2rem] rounded-xl bg-danger text-white font-semibold disabled:opacity-50"
                >
                  {reqState === "loading" ? "Deleting..." : "Delete Forever"}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default DeleteAccountModal;
