import React, { useState } from "react";
import Image from "next/image";
import BreadCrum from "../../components/ui/Breadcrumbs";
import Min_and_Max_icon from "./components/Min_Max_icon";
import DummyText from "./components/dummyText";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from 'react-redux';
import MarkdownRenderer from "../../components/ui/MarkdownRenderer";

function homecontent() {
  const router = useRouter()
  const dispatch = useDispatch();
  const { analyzedText, analyzedTitle, analysisArray } = useSelector((state: any) => state.analyze);

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
        <div className="">
          <Image
            src={require("../../../public/icons/arrow-narrow-left 1.svg")} // return back to home page
            alt="documents"
            className="cursor-pointer pb-5"
            width={20}
            onClick={() => router.back()} //navigate to Analyezed_content page
          />

          {/* the name goes here  */}
          <h1 className="text-2xl">Analysed Content</h1>
        </div>
        {/* run analyze buuton */}
        <div
          className="flex md:w-[15%] w-[50%] h-[3.5rem] rounded-[1rem] justify-center items-center bg-sirp-primary"
          onClick={() => router.replace("/home/content_id/crawled")} //navigate to Analyezed_content page
          style={{ cursor: "pointer" }}
        >
          <span className="text-white">Run Analyzer</span>
        </div>
      </div>
      {/* breadcrum section  */}
      <BreadCrum />
      {/* <BreadCrum /> */}

      {/* min and max */}
      <div className="bg-white border my-[3rem] mx-10 rounded-[1rem]">
        <Min_and_Max_icon maxOnClick={handleMax} minOnClick={handleMin} />
        {hideMeta == true && (
          <div className="pl-5 pb-5 mt-[5rem]">
            <p className="text-md text-gray-500">Title</p>
            {/* <h1 className="md:text-3xl text-[14px]">
              {analyzedTitle}
            </h1> */}
            <MarkdownRenderer
              content={analyzedTitle}
              className="text-[24px] font-bold uppercase text-justify pl-10 pb-1 leading-8 break-normal"
            />
          </div>
        )}
        {hideMeta == false && ( //hide and show meta data
          <div className="pl-5 pb-5 mt-[5rem]">
            <p className="text-md text-gray-500">Title</p>
            <MarkdownRenderer
              content={analyzedTitle}
              className="text-[24px] font-bold uppercase text-justify pl-10 pb-1 leading-8 break-normal"
            />
          </div>
        )}
      </div>
      <div className="py-10 mx-5">
        <DummyText />
      </div>
    </div>
  );
}

export default homecontent;
