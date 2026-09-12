// app/toastMiddleware.js
import { PopupItemSimple } from "@common/Toasts/PopupItemSimple";
import { type Middleware } from "@reduxjs/toolkit";
import { HelmSpinner } from "@source/common/Animations/Spinners/HelmSpinner";
import React from "react";
import { cssTransition, toast } from "react-toastify";

import { toastyActions } from "./toastyActions";

const fade = cssTransition({
  enter: "fade-in-toast",
  exit: "fade-out-toast",
});

const toastMiddleware: Middleware = (store) => (next) => (action) => {
  const actionType = action.type as string;

  if (toastyActions.includes(actionType)) {
    if (actionType.endsWith("/fulfilled")) {
      const toastMessage =
        action.payload?.message ?? "Operation completed successfully.";

      const frenchToast = {
        message: toastMessage,
        title: "Success!",
      };

      toast.success(<PopupItemSimple frenchToast={frenchToast} />, {
        toastId: action.meta?.requestId,
        containerId: "toastContainer",
        closeOnClick: true,
      });
    } else if (actionType.endsWith("/rejected")) {
      const toastMessage = action.payload?.message ?? "Operation failed.";
      const frenchToast = {
        message: toastMessage,
        title: "Error!",
      };

      toast.error(<PopupItemSimple frenchToast={frenchToast} />, {
        toastId: action.meta?.requestId,
        containerId: "toastContainer",
        closeOnClick: true,
      });
    }
  }

  if (actionType.endsWith("/pending")) {
    toast(<HelmSpinner />, {
      containerId: "loadingSpinner",
      // position: "bottom-right",
      toastId: action.meta?.requestId + "loading",
      className: "custom-loading-toast fade-in-toast ",
      hideProgressBar: true,
      closeButton: false,
      transition: fade,
    });
  } else if (actionType.endsWith("/fulfilled")) {
    toast.dismiss(action.meta?.requestId + "loading");
  } else if (actionType.endsWith("/rejected")) {
    toast.dismiss(action.meta?.requestId + "loading");
  } else if (actionType.endsWith("/error")) {
    toast.dismiss(action.meta?.requestId + "loading");
  }
  return next(action);
};

export { toastMiddleware };
