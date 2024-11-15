/*****
 @author: KayJayGlobal
 @purpose:This component handles merge of guest enquiry flow and actual user enquiry flow
******/
"use client";

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { useChat } from "ai/react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { BiLoaderAlt } from "react-icons/bi";
import Sidebar from "../../../../components/common/Sidebar";
import { conversationId, messagesPrompt, messagesSet } from "../api/SearchApi";
import NewLogo from "../../../../../../public/assets/newLogo.png";
import Laptop from "../../../../../../public/assets/laptop.png";
import Cart from "../../../../../../public/assets/cart.png";
import ChatForm from "../forms/ChatForm";
import QueryForm from "../forms/QueryForm";
import RenderListItem from "../subpage/RenderListItem";
import { marked } from "marked";
import "../style/markdown.css";
import SidebarWrapper from "@/app/components/layout/SidebarWrapper";

type GuestLoginProps = {
  setTotalMessages: Dispatch<SetStateAction<boolean>>;
};

interface MyJwtPayload extends JwtPayload {
  _id: string;
}

const MemoizedSidebar = React.memo(Sidebar);

const ChatMain: React.FC<GuestLoginProps> = ({ setTotalMessages }) => {
  const [isReload, setIsReload] = useState(false);
  const [messageId, setMessageId] = useState<string | null>(null);
  const [newChat, setNewChat] = useState(false);
  const [msgFlag, setMsgFlag] = useState(false);
  const [sessionFlag, setSessionFlag] = useState(false);

  const decodedToken = useMemo(() => {
    const token = localStorage.getItem("access") || "";
    return token ? jwtDecode<MyJwtPayload>(token) : null;
  }, []);

  const headers = useMemo(
    () => ({ "user-id": decodedToken?._id || "" }),
    [decodedToken]
  );

  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit: submitChat,
    isLoading,
    stop,
    reload,
    setInput,
    append,
  } = useChat({
    api: "/api/chat",
    headers,
    onError: (e) => console.log("Error:", e),
  });

  const chatParent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 2) setTotalMessages(true);
  }, [messages]);

  const handleConversationId = useCallback(
    (input: string) => {
      if (!decodedToken?._id) {
        console.error("Invalid or missing token");
        return;
      }
      conversationId({ user_id: decodedToken._id, title: input })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setSessionFlag(true);
            localStorage.setItem("conversation_id", data._id);
            messagesPrompt({
              content: input,
              role: "user",
              conversation_id: data._id,
            }).then((response) => response.json());
          }
        })
        .catch((error) => console.error("Error:", error));
    },
    [decodedToken]
  );

  const handleClick = useCallback(
    async (promptText: string) => {
      setInput(promptText);
      await append({ role: "user", content: promptText });
      setSessionFlag(true);
      handleConversationId(promptText);
      setInput("");
    },
    [append, handleConversationId, setInput]
  );

  useEffect(() => {
    const domNode = chatParent.current;
    if (domNode) domNode.scrollTop = domNode.scrollHeight;
  }, [messages]);

  const handleGetMessages = useCallback(() => {
    messagesSet(messageId)
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
        setMessageId(null);
      });
  }, [messageId, setMessages]);

  const handleSendMessages = useCallback(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
      messagesPrompt({
        content: lastMessage.content,
        role: lastMessage.role,
        conversation_id: localStorage.getItem("conversation_id"),
      })
        .then((response) => response.json())
        .catch((error) => console.error("Error:", error));
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsReload(false);
    if (messages.length === 0) {
      handleConversationId(input);
      setMsgFlag(true);
    } else if (input.length > 0 && messages.length > 1) {
      messagesPrompt({
        content: input,
        role: "user",
        conversation_id: localStorage.getItem("conversation_id"),
      })
        .then((response) => response.json())
        .catch((error) => console.error("Error:", error));
      setMsgFlag(true);
    }
    await submitChat(e);
  };

  useEffect(() => {
    if (messageId) handleGetMessages();
    if (newChat) {
      setMessages([]);
      setNewChat(false);
    }
  }, [msgFlag, messageId, newChat, handleGetMessages, setMessages]);

  useEffect(() => {
    if (!isLoading && msgFlag) {
      handleSendMessages();
      setMsgFlag(false);
    }
  }, [isLoading, msgFlag, handleSendMessages]);

  return (
    <div
      style={{
        background: "linear-gradient(-151.37deg, #EFF8FA 4.32%, #C5DCF7 95.61%",
      }}
      className="w-[100%] h-screen"
    >
      {/* <ChatNavbar /> Render the chat navbar */}
      <div className="flex justify-between items-start gap-5 pt-5 ">
        <SidebarWrapper
          setMessageId={setMessageId}
          setNewChat={setNewChat}
          setSessionFlag={setSessionFlag}
          sessionFlag={sessionFlag}
        />
        {/* Render the sidebar */}
        <div className="relative w-[100%] overflow-hidden bg-white h-[95vh] rounded-md mr-5">
          {/* Initial state when there are no messages */}
          {messages.length === 0 ? (
            <div
              className="w-[100%] h-[100%] flex justify-center items-center text-center flex-col p-5 chat-box-container"
              ref={chatParent} // Reference for scrolling
            >
              <h1 className="text-[#0066FF] text-[61px]">Finderscope</h1>
              <p
                className="w-[50%] text-lg text-[#878787] mt-5 font-normal"
                style={{ lineHeight: "20px" }}
              >
                Finderscope es una plataforma que te ayuda a encontrar el
                producto que mejor encaja con tus necesidades mediante
                asesoramiento, comparación de precios y experiencia del usuario
              </p>
              {/* Initial query form for user input */}
              <QueryForm
                input={input}
                handleSubmit={handleSubmit}
                handleInputChange={handleInputChange}
                setInput={setInput}
              />
              <div className="w-[851px] flex justify-center items-center gap-5">
                <div
                  onClick={() => handleClick("dishwasher with low noise")}
                  className="w-[50%] flex justify-start items-center pl-2.5 pr-5 py-2.5 gap-2.5 border-[1px] border-[#D6D6D6] rounded-md cursor-pointer"
                >
                  <Image src={Laptop} alt="Laptop" width={24} height={24} />
                  <p className="text-lg font-medium">
                    dishwasher with low noise
                  </p>
                </div>
                <div
                  onClick={() => handleClick("laptop under 2000 euros")}
                  className="w-[50%] flex justify-start items-center pl-2.5 pr-5 py-2.5 gap-2.5 border-[1px] border-[#D6D6D6] rounded-md cursor-pointer"
                >
                  <Image src={Cart} alt="cart" width={24} height={24} />
                  <p className="text-lg font-medium">laptop under 2000 euros</p>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`relative ${
                isReload ? "h-[80vh]" : "h-[85vh]"
              } bg-white w-[100%] px-[180px] overflow-y-scroll p-5  chat-box-container`}
              ref={chatParent} // Reference for scrolling
            >
              <div className="flex justify-start items-start mt-10">
                <Image src={NewLogo} alt="logo" width={40} height={25} />
                {/* Logo */}
                <p
                  id="chat-texteditor"
                  className="text-left px-3 bg-[#fff] rounded text-[#343541] inline-block font-normal text-[17.94px]"
                >
                  Welcome to Finderscope What would you like to Search?
                </p>
              </div>
              {messages.map((message, index) => {
                const match = message.content.match(
                  /```json\s*([\s\S]*?)\s*```/
                );
                const jsonContent = match ? match[1] : ""; // Extract JSON content if present

                const isRenderListItem = !!match; // Determine if content should be rendered as list
                const isLastAssistantMessage =
                  index + 1 === messages.length && message.role !== "assistant";
                const lastUserMessage = messages[messages.length - 2]?.content; // Get the last user message

                return (
                  <div
                    key={index}
                    style={{
                      textAlign: message.role === "user" ? "right" : "left", // Align based on message role
                      justifyContent:
                        message.role === "user" ? "flex-end" : "flex-start", // Align based on message role
                      float: message.role === "user" ? "right" : "left",
                      width: message.role === "user" ? "85%" : "90%",
                    }}
                    className="relative my-3 flex items-start overflow-x-scroll hide-scrollbar markdown-body"
                  >
                    {/* Show loading spinner for last assistant message */}
                    {isLastAssistantMessage && isLoading && (
                      <span className="absolute left-0 top-[22%] bg-transparent">
                        <BiLoaderAlt className="text-lg font-bold text-[#007bff] msg-loader" />
                      </span>
                    )}
                    {/* Render list item or normal message */}
                    {isRenderListItem ? (
                      <RenderListItem
                        items={jsonContent} // Render JSON content as list
                        userLastMsg={lastUserMessage} // Pass last user message for context
                        setInput={setInput} // Function to set input value
                      />
                    ) : (
                      <>
                        {message.role !== "user" ? (
                          <Image
                            src={NewLogo}
                            alt="logo"
                            className="inline-block "
                            width={40}
                            height={25}
                          />
                        ) : null}
                        <p
                          style={{
                            color: "#343541",
                            fontSize: "17.94px",
                            fontWeight: "400",
                            backgroundColor: isRenderListItem
                              ? "0"
                              : message.role === "user"
                              ? "#F4F4F4" // Background for user messages
                              : "white", // Background for assistant messages
                            padding: message.role === "user" ? "8px 20px" : "",
                            marginBottom: "0",
                          }}
                          className="typewriter px-3 mb-0 bg-[#fff] rounded text-[#343541] font-normal text-sm"
                        >
                          {message.role === "user" ? (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: marked.parse(message.content),
                              }}
                            />
                          ) : (
                            // Apply Typewriter only to the last message in the array
                            // index === messages.length - 1 ? (
                            //   <Typewriter
                            //     options={{
                            //       strings: message.content,
                            //       autoStart: true,
                            //       loop: false,
                            //       cursor: "",
                            //       delay: 14,
                            //     }}
                            //   />
                            // ) :
                            //  (
                            //   <span
                            //     dangerouslySetInnerHTML={{
                            //       __html: marked.parse(message.content),
                            //     }}
                            //   />
                            // )
                            <span
                              dangerouslySetInnerHTML={{
                                __html: marked.parse(message.content),
                              }}
                            />
                          )}
                        </p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {isReload ? (
            <div className="flex justify-center py-2.5">
              <button
                className="border-none outline-none px-2.5 rounded-3xl py-1 text-lg font-medium text-white cursor-pointer bg-[#000]"
                onClick={() => {
                  setIsReload(false);
                  reload();
                }}
              >
                Regenerate
              </button>
            </div>
          ) : null}
          {messages.length > 0 ? (
            <ChatForm
              handleSubmit={handleSubmit}
              input={input}
              handleInputChange={handleInputChange}
              isLoading={isLoading}
              stop={stop}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ChatMain; // Export the ChatMain component
