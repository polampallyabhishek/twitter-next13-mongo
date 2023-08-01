import { BsTwitter } from "react-icons/bs";

import { useEffect } from "react";
import useUser from "@/hooks/use-user";
import useSession from "@/hooks/use-session";
import useNotifications from "@/hooks/use-notifications";

const NotificationsFeed = () => {
  const { data: session } = useSession();
  const { data: currentUser, mutate: mutateCurrentUser } = useUser(
    session?.user?.id
  );
  const { data: fetchedNotifications = [] } = useNotifications(currentUser?.id);

  useEffect(() => {
    mutateCurrentUser();
  }, [mutateCurrentUser]);

  if (fetchedNotifications.length === 0) {
    return (
      <div className="text-neutral-600 text-center p-6 text-xl">
        No notifications
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {fetchedNotifications.map((notification: Record<string, any>) => (
        <div
          key={notification.id}
          className="flex flex-row items-center p-6 gap-4 border-b-[1px] border-neutral-800"
        >
          <BsTwitter color="white" size={32} />
          <p className="text-white">{notification.body}</p>
        </div>
      ))}
    </div>
  );
};

export default NotificationsFeed;
