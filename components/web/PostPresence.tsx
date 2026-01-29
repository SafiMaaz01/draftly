"use client";

import { api } from "@/convex/_generated/api";
import usePresence from "@convex-dev/presence/react";
import FacePile from "@convex-dev/presence/facepile";
import { Id } from "@/convex/_generated/dataModel";

interface PostPresenceProps {
  roomId: Id<"posts">;
  userId: string;
}
export function PostPresence({ roomId, userId }: PostPresenceProps) {
  const presenceState = usePresence(api.presence, roomId, userId);

  if (!presenceState || presenceState.length === 0) {
    return null;
  }

  return (
    // <div className="flex items-center gap-2">
    //   <p className="text-sm tracking-wide text-muted-foreground">
    //     Vieweing Now
    //   </p>
    //   <div className="text-black">
    //     <FacePile presenceState={presenceState} />
    //   </div>
    // </div>

    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="flex items-center gap-1">
        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        Viewing now
      </span>

      <FacePile presenceState={presenceState} />
    </div>
  );
}
