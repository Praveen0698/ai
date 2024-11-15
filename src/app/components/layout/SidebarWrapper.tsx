import React from "react";
import Sidebar from "../common/Sidebar";

type SidebarWrapperProps = {
  setMessageId?: React.Dispatch<React.SetStateAction<string | null>>;
  setNewChat?: React.Dispatch<React.SetStateAction<boolean>>;
  setSessionFlag?: React.Dispatch<React.SetStateAction<boolean>>;
  sessionFlag?: boolean;
};

// Conditionally pass props to Sidebar only if they exist in SidebarWrapperProps
const SidebarWrapper: React.FC<SidebarWrapperProps> = ({
  setMessageId,
  setNewChat,
  setSessionFlag,
  sessionFlag,
}) => {
  const sidebarProps = {
    ...(setMessageId && { setMessageId }),
    ...(setNewChat && { setNewChat }),
    ...(setSessionFlag && { setSessionFlag }),
    ...(sessionFlag !== undefined && { sessionFlag }),
  };

  return <Sidebar {...sidebarProps} />;
};

export default SidebarWrapper;
