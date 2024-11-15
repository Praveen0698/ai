"use client";
import React, { useEffect, useState } from "react";
import { MdHistory } from "react-icons/md";
import { getConversation } from "./api/SidebarApi";

// Define types for the response data
interface Message {
  _id: string;
  author: {
    role: string;
  };
  content: {
    content_type: string;
    parts: string[];
  };
  status: boolean;
  parent: string | null;
  child: string | null;
  conversation_id: string;
  updated_at: string | null;
  deleted_at: string | null;
  created_at: string;
  __v: number;
}

interface Conversation {
  _id: string;
  title: string;
  messages: Message[];
  status: boolean;
  user_id: string;
  updated_at: string | null;
  deleted_at: string | null;
  created_at: string;
  __v: number;
}

interface ConversationsByPeriod {
  [key: string]: Conversation[];
}

type HistoricalProps = {
  setMessageId?: React.Dispatch<React.SetStateAction<string | null>>;
  setId: React.Dispatch<React.SetStateAction<string>>;
  setSessionFlag?: React.Dispatch<React.SetStateAction<boolean>>;
  sessionFlag?: boolean;
  id?: string;
};

const Historical: React.FC<HistoricalProps> = ({
  sessionFlag,
  setMessageId,
  setSessionFlag,
  id,
  setId,
}) => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("access") || ""
  );
  const [conversations, setConversations] = useState<ConversationsByPeriod>({});
  const [dataCheck, setDataCheck] = useState(false);
  const handleGetConversation = async () => {
    if (!accessToken) return;
    try {
      const response = await getConversation(accessToken); // Pass token as needed
      const data = await response.json();

      if (data.message === "No conversations found") {
        setDataCheck(false);
      } else if (data.success === false) {
        setDataCheck(false);
      } else {
        setConversations(data);
        setDataCheck(true);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  // const token = localStorage.getItem("access") || "";

  useEffect(() => {
    if (accessToken) {
      handleGetConversation();
    }
  }, [accessToken]);

  useEffect(() => {
    if (sessionFlag) {
      handleGetConversation();
      setSessionFlag?.(false);
    }
  }, [sessionFlag]);

  return (
    <div className="flex justify-start items-start flex-col gap-2 mt-10">
      {dataCheck ? (
        <>
          <p className=" pl-5 font-medium text-lg flex justify-start items-center gap-3">
            <MdHistory /> Historial
          </p>
          <div className="pl-5 history-container flex h-[420px] overflow-y-scroll justify-start items-start ml-8 gap-3 flex-col">
            {Object.entries(conversations).map(([timePeriod, convList]) => (
              <div key={timePeriod} className="w-[100%] flex flex-col gap-2">
                <p className="font-semibold text-sm text-[#0066FF]">
                  {timePeriod}
                </p>
                {convList.length > 0 ? (
                  convList.map((conversation) => (
                    <div
                      key={conversation._id}
                      className=" flex flex-col gap-1"
                    >
                      <p
                        onClick={() => {
                          setMessageId?.(conversation._id);
                          setId(conversation._id);
                          localStorage.setItem(
                            "conversation_id",
                            conversation._id
                          );
                        }}
                        className={`pl-1 py-1 ${
                          conversation._id === id ? "bg-[#99b5e0]" : "bg-[none]"
                        } rounded-md hover:bg-[#99b5e0] font-medium cursor-pointer text-sm text-[#4C4C4C]`}
                      >
                        {conversation.title}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#4C4C4C] ml-4">
                    No conversations.
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Historical;
