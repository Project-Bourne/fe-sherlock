import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Breadcrumbs } from "@/components/ui";
import ActionIcons from "../components/actionIcons/ActionIcon";
import MinAndMaxIcon from "../components/Min_Max_icon";
import MetaData from "../components/MetaData";
import DummyText from "../components/dummyText";

function Crawled() {
  const router = useRouter();
  const [hideMeta, setHideMeta] = useState(true); //hide and show meta data
  const handleMax = () => {
    setHideMeta(true);
  };
  const handleMin = () => {
    //hide and show meta data
    setHideMeta(false);
  };
  return (
    <div className="bg-sirp-secondary2 h-[100%] mx-5 rounded-[1rem]">
      <div className="flex md:justify-between  flex-wrap md:px-5 md:py-5 ">
        <div>
          <Image
            src={require("../../../assets/icons/arrow-narrow-left 1.svg")} // return back to home page
            alt="documents"
            className="cursor-pointer pb-5"
            width={20}
            onClick={() => router.back()}
          />

          {/* the name goes here  */}
          <h1 className="text-2xl">Peter Duru</h1>
        </div>
        {/* action  buton to the right side */}
        <ActionIcons />
        <Breadcrumbs />
        <div className="bg-white border my-[3rem] mx-5 rounded-[1rem] w-[100%]">
          <MinAndMaxIcon maxOnClick={handleMax} minOnClick={handleMin} />
          {hideMeta === true && <MetaData />}
          {hideMeta === false && ( // hide and show meta data
            <h1 className="md:text-lg font-bold pl-5 pb-2">
              22 Insightful quotes from our speakers (link to recording at the
              end){" "}
            </h1>
          )}
        </div>
        <div className="my-10 mx-5">
          {/* dummy text goes here */}
          <DummyText />
        </div>
      </div>
    </div>
  );
}

export default Crawled;
