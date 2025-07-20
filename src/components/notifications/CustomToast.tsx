import {
  ToastContainer,
  toast,
  ToastOptions,
  TypeOptions,
} from "react-toastify";

export function showToast(
  message: string,
  type: TypeOptions = "default",
  options?: ToastOptions
) {
  toast(message, { type, ...options });
}

export function CustomToastContainer() {
  return <ToastContainer position="top-right" autoClose={3000} />;
}
