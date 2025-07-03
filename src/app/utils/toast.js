import toast from 'react-hot-toast';

export const showToast = (message, type = 'info', options = {}) => {
  switch (type) {
    case 'success':
      toast.success(message, options);
      break;
    case 'error':
      toast.error(message, options);
      break;
    case 'warning':
      toast.warn(message, options);
      break;
    case 'info':
      toast.info(message, options);
      break;
    case 'loading':
      return toast.loading(message, options);
    case 'update':
      // For react-hot-toast, update is typically done by calling toast.success/error/etc. on the toastId
      // and passing the new message and options. The 'isLoading' property is not directly used here.
      // We assume options.toastId is provided for updates.
      if (options.toastId) {
        if (options.type === 'success') {
          toast.success(message, { id: options.toastId, ...options });
        } else if (options.type === 'error') {
          toast.error(message, { id: options.toastId, ...options });
        } else if (options.type === 'info') {
          toast.info(message, { id: options.toastId, ...options });
        } else if (options.type === 'warning') {
          toast.warn(message, { id: options.toastId, ...options });
        } else {
          toast(message, { id: options.toastId, ...options });
        }
      }
      break;
    default:
      toast(message, options);
  }
};