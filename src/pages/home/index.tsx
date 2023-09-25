// home page
import { useRouter } from "next/router";
import FileUpload from "./components/FileUpload";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import BreadCrum from "../../components/ui/Breadcrumbs";
import Min_and_Max_icon from "./components/Min_Max_icon";
import DummyText from "./components/dummyText";
import { useDispatch, useSelector } from 'react-redux';
import { setTextandTitle } from "../../redux/reducer/analyzerSlice";

function Home() {
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

  // useEffect(()=>{
  //   dispatch(setTextandTitle({
  //     text:'',
  //     title:'',
  //   }))
  // },[])
  const showTitle = false;
  console.log(router, "i am router");
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div className='pb-5'>
      {/* <h1 className="text-2xl pl-10 font-bold">Add Content</h1> */}
      <FileUpload />
      <div className="bg-sirp-secondary2 h-[100%] mx-5 rounded-[1rem]">
        <div className="flex md:justify-between  flex-wrap md:px-5 md:py-5 ">
          {/* <div className=""> */}
          {/* <Image
            src={require("../../../public/icons/arrow-narrow-left 1.svg")} // return back to home page
            alt="documents"
            className="cursor-pointer pb-5"
            width={20}
            onClick={() => router.back()} //navigate to Analyezed_content page
          /> */}

          {/* the name goes here  */}
          {/* <h1 className="text-2xl">Analysed Content</h1> */}
          {/* </div> */}
          {/* run analyze buuton */}

        </div>
        {/* breadcrum section  */}
        {/* <BreadCrum /> */}
        {/* <BreadCrum /> */}

        {/* min and max */}

        {analyzedText ?
          <div>
            <div className="bg-white border my-[3rem] mx-10 rounded-[1rem]">
              {/* <Min_and_Max_icon maxOnClick={handleMax} minOnClick={handleMin} /> */}
              {hideMeta == true && (
                <div className="pl-5 pb-5 mt-[5rem]">
                  <p className="text-md text-gray-500">Title</p>
                  <h1 className="md:text-3xl text-[14px]">
                    {analyzedTitle}
                  </h1>
                </div>
              )}
              {hideMeta == false && ( //hide and show meta data
                <h1 className="md:text-lg font-bold pl-5 pb-2">
                  {analyzedTitle}
                </h1>
              )}
            </div>
            <div className="py-10 mx-5">
              <DummyText />
            </div>
          </div>
          :
          <div className="flex items-center justify-center flex-col gap-4 h-[60vh]">
            <div className="flex items-center justify-centery w-[50%] font-bold flex-col p-3 rounded-[1rem] gap-3 text-xl ">
              <span> <Image
                src={require(`../../../public/icons/no_history.svg`)}
                alt="upload image"
                width={150}
                height={150}
                priority
              /></span>
              <h1 className="font-[700] text-2xl">No Analyzed Content yet</h1>
              <span className='text-gray-400'>Copy and paste content or Upload a file to be Analyzed</span>
            </div>
          </div>
        }

      </div>
    </div>
  );
}

export default Home;
