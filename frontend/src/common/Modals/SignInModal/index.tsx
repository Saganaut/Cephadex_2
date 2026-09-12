import CephaLogoOne from "@assets/logos/CephaLogoOne.png";
import { useModal } from "@contexts/ModalContext";
import { Dialog, Transition } from "@headlessui/react";
import { DiscordLoginButton } from "@source/common/Modals/SignInModal/DiscordLogin/DiscordLoginButton";
import { GoogleLoginButton } from "@source/common/Modals/SignInModal/GoogleLogin/GoogleLoginButton";
import { MSLoginButton } from "@source/common/Modals/SignInModal/MSLogin/MSLoginButton";
import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";

const SignInModal: React.FC = () => {
  const { isSignInModalOpen, closeSignInModal, modalType } = useModal();
  const navigate = useNavigate();
  if (!isSignInModalOpen) {
    return null;
  }

  return (
    <div>
      <Transition appear show={isSignInModalOpen} as={Fragment}>
        <Dialog as="div" className="relative  z-50" onClose={closeSignInModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0  bg-black bg-opacity-[25%]" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative  w-full max-w-md overflow-hidden rounded-2xl bg-mariana-blue p-8 text-left align-middle text-white shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="my-6  flex justify-center text-2xl font-medium leading-6 text-white"
                  >
                    {modalType === "register"
                      ? "Register using"
                      : "Welcome back"}
                  </Dialog.Title>
                  <div>
                    <img
                      src={CephaLogoOne}
                      alt="Ceph Logo"
                      className="absolute left-0 top-0 mx-auto p-4"
                    />
                  </div>
                  <div
                    className="absolute right-2 top-2 cursor-pointer"
                    onClick={closeSignInModal}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <div className="mt-2 flex flex-col items-center justify-center space-y-4 text-black">
                    <div className="mt-2">
                      <GoogleLoginButton />
                    </div>
                    <div className="mt-2">
                      <DiscordLoginButton />
                    </div>
                    <div className="mt-2">
                      <MSLoginButton />
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="text-center text-xs text-white">
                      Click &quot;sign in&quot; to agree to our{" "}
                      <span
                        className="underline cursor-pointer"
                        onClick={() => {
                          navigate("/terms");
                        }}
                      >
                        terms and conditions
                      </span>{" "}
                      and acknowledge our{" "}
                      <span
                        className="underline cursor-pointer"
                        onClick={() => {
                          navigate("/privacy");
                        }}
                      >
                        privacy policy{" "}
                      </span>
                      applies to you.
                    </p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export { SignInModal };
