// import React, { useState, Dispatch, SetStateAction } from "react";
// import Image from "next/image";
// import finderlogo from "../../../../public/assets/finderlogo.png";
// import { LuArrowLeftToLine } from "react-icons/lu";
// import { MdOutlineMessage } from "react-icons/md";

// import { TbLayoutSidebarLeftCollapseFilled } from "react-icons/tb";
// import { ToastContainer } from "react-toastify";

// import Historical from "../sidebar/Historical";
// import ProfileToggle from "../sidebar/ProfileToggle";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import Loader from "./Loader";
// type SidebarProps = {
//   setMessageId: React.Dispatch<React.SetStateAction<string | null>>;
//   setNewChat: React.Dispatch<React.SetStateAction<boolean>>;
//   setSessionFlag: React.Dispatch<React.SetStateAction<boolean>>;
//   sessionFlag: boolean;
// };

// const Sidebar: React.FC<SidebarProps> = ({
//   setMessageId,
//   sessionFlag,
//   setNewChat,
//   setSessionFlag,
// }) => {
//   const searchParams = useSearchParams();
//   const guest = searchParams.get("guest") === "true"; // Check if the guest parameter is set to true
//   const [openSidebar, setOpenSidebar] = useState(false);
//   const router = useRouter();
//   const [loaderOpen, setLoaderOpen] = useState(false);
//   const pathname = usePathname(); // Gets the current path
//   const openLoader = () => {
//     setLoaderOpen(true);
//   };

//   const closeLoader = () => {
//     setLoaderOpen(false);
//   };

//   return (
//     <>
//       {openSidebar ? (
//         <TbLayoutSidebarLeftCollapseFilled
//           className="text-3xl text-[#367DFD] ml-5 cursor-pointer"
//           onClick={() => setOpenSidebar(false)}
//         />
//       ) : (
//         <div className="w-[18%] pl-5 flex flex-col justify-between h-[95vh]">
//           <div>
//             <div className="flex justify-between items-center mb-5">
//               <Image
//                 src={finderlogo}
//                 alt="logo"
//                 className="w-[100px] cursor-pointer"
//                 onClick={() => {
//                   if (!guest && pathname !== "/finderscope/v1/search") {
//                     openLoader();
//                     router.push("/finderscope/v1/search");
//                   }
//                 }}
//               />
//               <LuArrowLeftToLine
//                 className="text-xl font-bold cursor-pointer"
//                 onClick={() => setOpenSidebar(true)}
//               />
//             </div>
//             <div className="flex justify-start items-start flex-col gap-5">
//               <button
//                 onClick={() => setNewChat(true)}
//                 className="w-[100%] px-5 py-2 border-none outline-none font-medium text-sm rounded-full bg-white flex justify-start items-center gap-3"
//               >
//                 <MdOutlineMessage />
//                 Nuevo Chat
//               </button>
//             </div>
//             <Historical
//               setMessageId={setMessageId}
//               setSessionFlag={setSessionFlag}
//               sessionFlag={sessionFlag}
//             />
//           </div>
//           <Loader closeLoader={closeLoader} loaderOpen={loaderOpen} />
//           <ToastContainer />
//           <ProfileToggle />
//         </div>
//       )}
//     </>
//   );
// };

// export default Sidebar;

import React, { useState, useCallback } from "react";
import Image from "next/image";
import finderlogo from "../../../../public/assets/finderlogo.png";
import { LuArrowLeftToLine } from "react-icons/lu";
import { MdOutlineMessage } from "react-icons/md";
import { TbLayoutSidebarLeftCollapseFilled } from "react-icons/tb";
import { ToastContainer } from "react-toastify";
import Historical from "../sidebar/Historical";
import ProfileToggle from "../sidebar/ProfileToggle";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Loader from "./Loader";

type SidebarProps = {
  setMessageId?: React.Dispatch<React.SetStateAction<string | null>>;
  setNewChat?: React.Dispatch<React.SetStateAction<boolean>>;
  setSessionFlag?: React.Dispatch<React.SetStateAction<boolean>>;
  sessionFlag?: boolean;
};

const Sidebar: React.FC<SidebarProps> = React.memo(
  ({ setMessageId, sessionFlag = false, setNewChat, setSessionFlag }) => {
    const searchParams = useSearchParams();
    const guest = searchParams.get("guest") === "true"; // Check if the guest parameter is set to true
    const [openSidebar, setOpenSidebar] = useState(false);
    const router = useRouter();
    const [loaderOpen, setLoaderOpen] = useState(false);
    const pathname = usePathname(); // Gets the current path
    const [id, setId] = useState("");

    const openLoader = useCallback(() => {
      setLoaderOpen(true);
    }, []);

    const closeLoader = useCallback(() => {
      setLoaderOpen(false);
    }, []);

    return (
      <>
        {openSidebar ? (
          <TbLayoutSidebarLeftCollapseFilled
            className="text-3xl text-[#367DFD] ml-5 cursor-pointer"
            onClick={() => setOpenSidebar(false)}
          />
        ) : (
          <div className="w-[18%] pl-5 flex flex-col justify-between h-[95vh]">
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <Image
                  src={finderlogo}
                  alt="logo"
                  className="w-[100px] cursor-pointer"
                  onClick={() => {
                    if (!guest && pathname !== "/finderscope/v1/search") {
                      openLoader();
                      router.push("/finderscope/v1/search");
                    }
                  }}
                />
                <LuArrowLeftToLine
                  className="text-xl font-bold cursor-pointer"
                  onClick={() => setOpenSidebar(true)}
                />
              </div>
              <div className="flex justify-start items-start flex-col gap-5 mt-5">
                <button
                  onClick={() => {
                    setNewChat?.(true);
                    setMessageId?.(null);
                    setId("");
                  }}
                  className="w-[100%] px-5 py-2 border-none outline-none font-medium text-sm rounded-full bg-white flex justify-start items-center gap-3"
                >
                  <MdOutlineMessage />
                  Nuevo Chat
                </button>
              </div>
              <Historical
                setMessageId={setMessageId}
                setSessionFlag={setSessionFlag}
                sessionFlag={sessionFlag}
                id={id}
                setId={setId}
              />
            </div>
            <Loader closeLoader={closeLoader} loaderOpen={loaderOpen} />
            <ToastContainer />
            <ProfileToggle />
          </div>
        )}
      </>
    );
  }
);
Sidebar.displayName = "Sidebar";
export default Sidebar;
