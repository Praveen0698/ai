import React from "react";
import Image from "next/image";
import finderGirl from "../../../../public/assets/finder-girl.png";
import finderLogo from "../../../../public/assets/finderlogo.png";

const TextAuth = () => {
  return (
    <div className="relative px-[30px] py-[30px] w-[59.74%] bg-gradient-custom-1 h-screen">
      <Image
        src={finderLogo}
        alt="logo"
        className="w-[264.45px] h-[120.45px] mb-[60px] ml-5"
      />
      <div className="flex justify-evenly items-start flex-col gap-[55px]">
        <div>
          <h2
            className="text-[65.84px] w-[914px] font-inter font-medium text-[#000000]"
            style={{ lineHeight: "79.69px", letterSpacing: "0.005em" }}
          >
            Encuentra el producto <br />
            perfecto para ti con <br />{" "}
            <span className="text-[#0066FF]">Finderscope</span>
          </h2>
        </div>
        <p
          style={{ lineHeight: "34.46px", letterSpacing: "0.005em" }}
          className="text-[24.23px] text-[#000000] mt-[2.2rem] w-[560px] font-aptos font-semibold"
        >
          Gracias a nuestro software encontrarás aquello que necesitas en
          cuestión de segundos y de forma gratuita
        </p>
        <Image
          src={finderGirl}
          alt="logo"
          className="absolute w-[380px] h-[350px] right-0 bottom-[90px]"
        />
      </div>
    </div>
  );
};

export default TextAuth;
