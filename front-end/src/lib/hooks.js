import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getNewAccessToken } from "../services/auth";
import { getAllTask, getTask } from "../services/task";

export function useUser() {
  var { data, error } = useQuery("new-access-token", getNewAccessToken, {
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });

  return {
    loading: !data && !error,
    error: error || data?.error,
    user: data?.user,
    accessToken: data?.accessToken,
    success: data?.success,
  };
}

export function useTasks() {
  var { accessToken } = useUser();
  var { data, error, isFetching } = useQuery(
    "tasks",
    () => getAllTask(accessToken),
    {
      enabled: accessToken != null,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
    }
  );

  return {
    loading: !data && !error && isFetching,
    error: error || data?.error,
    tasks: data?.tasks,
    success: data?.success,
  };
}

export function useTask() {
  var { accessToken } = useUser();
  var { taskId } = useParams();
  var { data, error, isFetching } = useQuery(
    ["task", taskId],
    () => getTask(taskId, accessToken),
    {
      enabled: accessToken != null && taskId != null,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
    }
  );

  return {
    loading: !data && !error && isFetching,
    error: error || data?.error,
    task: data?.task,
    success: data?.success,
  };
}

/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useOutsideAlerter(ref, onOutsideClick) {
  useEffect(
    function alertOnOutsideClick() {
      function handleOutsideClick(event) {
        // Outside click
        if (ref.current && !ref.current.contains(event.target)) {
          onOutsideClick();
        }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleOutsideClick);

      return function unbindEvent() {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    },
    [ref, onOutsideClick]
  );
}

/**
 * Hook for managing dropdown state (outside click, open/close)
 */
export function useDropdown() {
  var wrapperRef = useRef(null);
  var [isOpen, setIsOpen] = useState(false);

  useOutsideAlerter(wrapperRef, function updateDropdownOnOutsideClick() {
    setIsOpen(false);
  });

  return { wrapperRef, isOpen, setIsOpen };
}
