import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

const useError = (errors = []) => {
  const ref = useRef([]);
  useEffect(() => {
    errors.forEach(({ isError, error, fallback }) => {
      if (isError) {
        if (fallback) fallback();
        else {
          const errorMessage = error?.data.message || "something went wrong";
          if (!ref.current.includes(errorMessage)) {
            toast.error(errorMessage);
            ref.current.push(errorMessage);
          }
        }
      }
    });
  }, [errors]);
};

export { useError };
