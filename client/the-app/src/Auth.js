export const handleError = (err, toast) => {
  toast.error(err, {
    position: "top-center",
  });
}

export const handleSuccess = (msg, toast) => {
  toast.success(msg, {
    position: "top-center",
  });
}

export const handleWarning = (msg, toast) => {
  toast.warn(msg, {
    position: "top-center",
  });
}
