import axios from "axios";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
import useSession from "./use-session";
import useUser from "./use-user";
import useLoginModal from "./use-login-modal";

const useFollow = (userId: string) => {
  const { data: session, mutate: mutateSession } = useSession();
  const { mutate: mutateFetchedUser } = useUser(userId);
  const { data: currentUser, mutate: mutateCurrentUser } = useUser(
    session?.user?.id
  );

  const loginModal = useLoginModal();

  const isFollowing = useMemo(() => {
    const list = currentUser?.followingIds || [];

    return list.includes(userId);
  }, [currentUser, userId]);

  const toggleFollow = useCallback(async () => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    try {
      let request;

      if (isFollowing) {
        request = () =>
          axios.delete("/api/follow", {
            data: {
              userId,
            },
          });
      } else {
        request = () => axios.post("/api/follow", { userId });
      }

      await request();
      mutateSession();
      mutateCurrentUser();
      mutateFetchedUser();

      toast.success("Success");
    } catch (error) {
      toast.error("Something went wrong");
    }
  }, [
    currentUser,
    isFollowing,
    userId,
    mutateSession,
    mutateCurrentUser,
    mutateFetchedUser,
    loginModal,
  ]);

  return {
    isFollowing,
    toggleFollow,
  };
};

export default useFollow;
