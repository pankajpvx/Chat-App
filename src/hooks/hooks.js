import { useEffect, useLayoutEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { getUniqueValues } from "../utils/features";

const useAsyncMutation = (mutationHook) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mutate] = mutationHook();

  const executeMutation = async (toastMessage, ...args) => {
    setIsLoading(true);
    const toastId = toast.loading(toastMessage || "Updating data...");
    try {
      const res = await mutate(...args);
      if (res.data) {
        toast.success(res.data.message || "updated data successfully", {
          id: toastId,
        });
        setData(res.data);
      } else {
        toast.error(res.error.data.message || "something went wrong", {
          id: toastId,
        });
      }
    } catch (e) {
      console.log(e);
      toast.error("something went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return [executeMutation, data, isLoading];
};

const useSocketEvents = (socket, handlers) => {
  useEffect(() => {
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [handlers]);
};

const useInfiniteScrollToTop = ({
  oldMessagesChunk,
  page,
  setPage,
  containerRef,
}) => {
  const [data, setData] = useState([]);
  const [isBottom, setIsBottom] = useState(false);
  const prevContainerHeightRef = useRef(null);
  const hasMore = page < oldMessagesChunk.data?.totalPages;

  useEffect(() => {
    if (
      !oldMessagesChunk.isLoading &&
      oldMessagesChunk.isSuccess &&
      oldMessagesChunk.status === "fulfilled"
    ) {
      if (oldMessagesChunk.data.messages.length > 0) {
        setData((prev) =>
          getUniqueValues([...oldMessagesChunk.data.messages, ...prev], "_id")
        );
      }
    }
  }, [oldMessagesChunk]);

  useEffect(() => {
    if (page === 1 && data.length > 0 && !isBottom) {
      if (containerRef?.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
        setIsBottom(true);
      }
    }
  }, [data]);

  useLayoutEffect(() => {
    if (page > 1 && containerRef.current) {
      const currentScrollHeight = containerRef.current.scrollHeight;
      const prevScrollHeight = prevContainerHeightRef.current || 0;
      if (currentScrollHeight > prevScrollHeight) {
        const scrollOffset = currentScrollHeight - prevScrollHeight;
        containerRef.current.scrollTop += scrollOffset;
      }
    }
  }, [data]);

  function handlePagination(entries) {
    const entry = entries[0];
    if (entry.isIntersecting && hasMore && !oldMessagesChunk.isLoading) {
      prevContainerHeightRef.current = containerRef.current.scrollHeight;
      setPage((prev) => prev + 1);
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(handlePagination);
    if (isBottom && hasMore && containerRef?.current) {
      const firstElement = [...containerRef.current.childNodes].at(0);
      observer.observe(firstElement);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [isBottom]);

  return { data, hasMore, setData, setIsBottom };
};

export { useAsyncMutation, useSocketEvents, useInfiniteScrollToTop };
