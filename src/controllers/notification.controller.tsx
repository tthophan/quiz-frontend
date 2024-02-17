"use client";
import React from "react";
import { ToastOptions, toast } from "react-toastify";
type NotificationProps = {
  message: string;
  icon?: React.ReactNode;
};
const commonOptions: ToastOptions = {
  position: "top-right",
  autoClose: 1500,
  pauseOnFocusLoss: false,
  pauseOnHover: false,
  closeOnClick: true,
  hideProgressBar: true,
  className: "mb-2",
};

const openSuccessNotification = (config: NotificationProps): void => {
  toast(config.message, {
    ...commonOptions,
    type: "success",
  });
};

const openInfoNotification = (config: NotificationProps): void => {
  toast(config.message, {
    ...commonOptions,
    type: "info",
  });
};

const openWarningNotification = (config: NotificationProps): void => {
  toast(config.message, {
    ...commonOptions,
    type: "warning",
  });
};

const openErrorNotification = (config: NotificationProps): void => {
  toast(config.message, {
    ...commonOptions,
    type: "error",
  });
};

export const notificationController = {
  success: openSuccessNotification,
  info: openInfoNotification,
  warning: openWarningNotification,
  error: openErrorNotification,
};
