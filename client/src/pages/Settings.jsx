import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import CTAIconWrapper from "../components/globals/CTAIconWrapper";
import Header from "../components/globals/Header";
import IconWrapper from "../components/globals/IconWrapper";
import ActivePage from "../components/pages/Sidebar/ActivePage";
import useSettings from "../hooks/useSettings";
import { sidebarActions } from "../store/sidebarSlice";
import { modalActions } from "../store/modalSlice";
import * as Yup from "yup";
import FormField from "../components/globals/FormField";
import LogoutModal from "../components/pages/Settings/LogoutModal";
import DeleteAccountModal from "../components/pages/Settings/DeleteAccountModal";
import MyGiftsModal from "../components/pages/Settings/MyGiftsModal";
import MyStarsModal from "../components/pages/Settings/MyStarsModal";
import useUpload from "../hooks/useUpload";
import Image from "../components/globals/Image";

const formSchema = Yup.object().shape({
  name: Yup.string().required("Field is required"),
  username: Yup.string(),
});

function Settings() {
  const dispatch = useDispatch();
  const { user, updateProfile, updateProfileState } = useSettings();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMyGiftsModal, setShowMyGiftsModal] = useState(false);
  const [showMyStarsModal, setShowMyStarsModal] = useState(false);

  const { handleFileUpload, fileUploadState } = useUpload(
    (uploadData) => {
      updateProfile({ avatar: uploadData.public_id });
    },
    ["Image"]
  );

  return (
    <ActivePage
      activePageName="settings"
      className="custom-scrollbar overflow-y-scroll flex flex-col"
    >
      <Header className="px-[1.5rem] flex items-center">
        <IconWrapper
          onClick={() =>
            dispatch(
              sidebarActions.changeActivePage({ newActivePage: "chatList" })
            )
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M19 11H7.14l3.63-4.36a1 1 0 1 0-1.54-1.28l-5 6a1.19 1.19 0 0 0-.09.15c0 .05 0 .08-.07.13A1 1 0 0 0 4 12a1 1 0 0 0 .07.36c0 .05 0 .08.07.13a1.19 1.19 0 0 0 .09.15l5 6A1 1 0 0 0 10 19a1 1 0 0 0 .64-.23a1 1 0 0 0 .13-1.41L7.14 13H19a1 1 0 0 0 0-2Z"
              className="stroke-transparent"
            />
          </svg>
        </IconWrapper>
        <h2 className="text-[2rem] font-semibold ml-[3rem]">Settings</h2>
        <IconWrapper
          onClick={() =>
            dispatch(
              modalActions.openModal({
                type: "logoutModal",
                positions: { top: 50, right: 15 },
              })
            )
          }
          className="ml-auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0-4 0zm0-6a2 2 0 1 0 4 0a2 2 0 0 0-4 0zm0 12a2 2 0 1 0 4 0a2 2 0 0 0-4 0z"
            />
          </svg>
        </IconWrapper>
      </Header>
      {user.username && (
        <>
          {/* Avatar */}
          <div
            className={`relative ${
              (fileUploadState === "loading" ||
                updateProfileState === "loading") &&
              "opacity-30"
            }`}
          >
            <Image
              src={user.avatar}
              alt={user.username}
              className="w-full h-[35rem] object-cover"
            />
            <CTAIconWrapper
              onClick={(event) =>
                event.currentTarget.querySelector("#avatar").click()
              }
              className="absolute bottom-[2rem] right-[2rem] cursor-pointer"
            >
              <input
                type="file"
                name="avatar"
                id="avatar"
                hidden
                onChange={handleFileUpload}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <g
                  fill="none"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="13" r="3" />
                  <path d="M5 7h2a2 2 0 0 0 2-2a1 1 0 0 1 1-1h2m9 7v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2m10-1h6m-3-3v6" />
                </g>
              </svg>
            </CTAIconWrapper>
          </div>
          {/* Details */}
          <Formik
            validationSchema={formSchema}
            initialValues={{
              name: user.name,
              bio: user.bio,
              username: user.username,
            }}
            onSubmit={updateProfile}
          >
            {({ values, errors }) => (
              <Form
                className="mt-[3rem] px-[1.5rem] flex flex-col gap-[3rem] flex-grow"
                autoComplete="off"
              >
                <FormField
                  value={values.name}
                  error={errors.name}
                  name="name"
                  required={true}
                  labelName="Name"
                />
                <FormField
                  value={values.username}
                  name="username"
                  required={false}
                  labelName="Username"
                />
                <FormField
                  value={values.bio}
                  name="bio"
                  required={false}
                  labelName="Bio"
                />
                <button
                  className={`bg-cta-icon text-center mt-auto py-[1rem] mb-[1rem] uppercase font-semibold rounded-xl text-white ${
                    !(
                      values.name !== user.name ||
                      values.lastName !== user.lastName ||
                      values.phoneNumber !== user.phoneNumber ||
                      values.bio !== user.bio
                    ) && "opacity-60"
                  }`}
                >
                  Update Profile
                </button>

                {/* My Stars Button */}
                <button
                  type="button"
                  onClick={() => setShowMyStarsModal(true)}
                  className="bg-primary text-center py-[1.2rem] mb-[0.5rem] font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-[1rem] px-[1.5rem]"
                >
                  <span className="text-[2rem]">⭐</span>
                  <span>My Stars</span>
                  <span className="ml-auto text-secondary-text">{user.stars || 0}</span>
                </button>

                {/* My Gifts Button */}
                <button
                  type="button"
                  onClick={() => setShowMyGiftsModal(true)}
                  className="bg-accent text-center py-[1rem] mb-[1rem] uppercase font-semibold rounded-xl text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-[0.5rem]"
                >
                  My Gifts
                </button>

                {/* Delete Account Button */}
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-danger text-center py-[1rem] mb-[2rem] uppercase font-semibold rounded-xl text-white hover:opacity-90 transition-opacity"
                >
                  Delete Account
                </button>
              </Form>
            )}
          </Formik>
        </>
      )}

      <LogoutModal />
      <DeleteAccountModal 
        visible={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
      />
      <MyGiftsModal
        visible={showMyGiftsModal}
        onClose={() => setShowMyGiftsModal(false)}
      />
      <MyStarsModal
        visible={showMyStarsModal}
        onClose={() => setShowMyStarsModal(false)}
        stars={user.stars || 0}
      />
    </ActivePage>
  );
}

export default Settings;
