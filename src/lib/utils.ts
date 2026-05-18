import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import toast from "react-hot-toast";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


// Premium theme-adaptive custom toast configuration & helper methods
const toastStyle = {
  borderRadius: '14px',
  background: 'var(--card)',
  color: 'var(--foreground)',
  border: '1px solid var(--border)',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
  fontSize: '12.5px',
  fontWeight: '600',
  padding: '12px 16px',
};


export const customToast = {
  loading: (message: string) => {
    return toast.loading(message, { style: toastStyle });
  },
  success: (message: string, toastId?: string) => {
    return toast.success(message, {
      id: toastId,
      style: toastStyle,
      iconTheme: {
        primary: '#10b981', // Emerald green
        secondary: 'var(--card)',
      }
    });
  },
  error: (message: string, toastId?: string) => {
    return toast.error(message, {
      id: toastId,
      style: toastStyle,
      iconTheme: {
        primary: '#f43f5e', // Rose red
        secondary: 'var(--card)',
      }
    });
  },
  promise: <T>(
    promise: Promise<T>,
    msgs: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: any) => string);
    },
    opts?: any
  ) => {
    return toast.promise(
      promise,
      msgs,
      {
        ...opts,
        style: toastStyle,
        success: {
          ...opts?.success,
          iconTheme: {
            primary: '#10b981',
            secondary: 'var(--card)',
          }
        },
        error: {
          ...opts?.error,
          iconTheme: {
            primary: '#f43f5e',
            secondary: 'var(--card)',
          }
        }
      }
    );
  }
};
