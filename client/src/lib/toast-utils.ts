import { toast } from "sonner";

// Scanner toasts (purple theme)
export const scannerToast = {
  success: (message: string, options?: any) => 
    toast.success(message, { 
      ...options, 
      className: "toast-scanner",
      style: { 
        background: "#9333ea", 
        color: "white",
        border: "1px solid #7c3aed"
      },
      descriptionClassName: "!text-white"
    }),
  error: (message: string, options?: any) => 
    toast.error(message, { 
      ...options, 
      className: "toast-scanner",
      style: { 
        background: "#9333ea", 
        color: "white",
        border: "1px solid #7c3aed"
      },
      descriptionClassName: "!text-white"
    }),
  warning: (message: string, options?: any) => 
    toast.warning(message, { 
      ...options, 
      className: "toast-scanner",
      style: { 
        background: "#9333ea", 
        color: "white",
        border: "1px solid #7c3aed"
      },
      descriptionClassName: "!text-white"
    }),
  info: (message: string, options?: any) => 
    toast.info(message, { 
      ...options, 
      className: "toast-scanner",
      style: { 
        background: "#9333ea", 
        color: "white",
        border: "1px solid #7c3aed"
      },
      descriptionClassName: "!text-white"
    }),
  // Generic toast with purple theme
  toast: (message: string, options?: any) => 
    toast(message, { 
      ...options, 
      className: "toast-scanner",
      style: { 
        background: "#9333ea", 
        color: "white",
        border: "1px solid #7c3aed"
      },
      descriptionClassName: "!text-white"
    })
};

// Generator toasts (green theme)
export const generatorToast = {
  success: (message: string, options?: any) => 
    toast.success(message, { 
      ...options, 
      className: "toast-generator",
      style: { 
        background: "#15803d", 
        color: "white",
        border: "1px solid #166534"
      },
      descriptionClassName: "!text-white"
    }),
  error: (message: string, options?: any) => 
    toast.error(message, { 
      ...options, 
      className: "toast-generator",
      style: { 
        background: "#15803d", 
        color: "white",
        border: "1px solid #166534"
      },
      descriptionClassName: "!text-white"
    }),
  warning: (message: string, options?: any) => 
    toast.warning(message, { 
      ...options, 
      className: "toast-generator",
      style: { 
        background: "#15803d", 
        color: "white",
        border: "1px solid #166534"
      },
      descriptionClassName: "!text-white"
    }),
  info: (message: string, options?: any) => 
    toast.info(message, { 
      ...options, 
      className: "toast-generator",
      style: { 
        background: "#15803d", 
        color: "white",
        border: "1px solid #166534"
      },
      descriptionClassName: "!text-white"
    }),
  // Generic toast with green theme
  toast: (message: string, options?: any) => 
    toast(message, { 
      ...options, 
      className: "toast-generator",
      style: { 
        background: "#15803d", 
        color: "white",
        border: "1px solid #166534"
      },
      descriptionClassName: "!text-white"
    })
};