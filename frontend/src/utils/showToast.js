let toastCallback = null;

export function showToast(message, type = 'success', duration = 3000) {
  if (toastCallback) {
    toastCallback({ message, type, duration });
  }
}

export function registerToast(callback) {
  toastCallback = callback;
}

export function unregisterToast() {
  toastCallback = null;
}