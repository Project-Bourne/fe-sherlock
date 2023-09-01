import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import CustomModal from "../../../../components/ui/CustomModal";
import SummarizeSettings from "../ModalPopUp/summarizeSettings";

const FileUploadSection = ({ file, handleDeleteFile, isLoading }) => {
  const router = useRouter();

  const [SummarizeSetting, setSummarizeSetting] = useState(false);

  return (
    <>
      <div className="p-10 flex align-middle items-center border-red-500 w-full flex-col justify-center">
        <div className="p-5 flex md:w-[50%] w-[100%] align-middle justify-between bg-sirp-lightGrey border-2 border-sirp-dashbordb1 rounded-[15px]">
          <div className="flex align-middle items-center justify-center">
            <span className="rounded-full bg-sirp-primaryLess2 flex align-middle justify-center w-[40px] h-[40px]">
              <Image
                src={require(`../../../../../public/icons/file.svg`)}
                alt="upload image"
                width={20}
                height={20}
                priority
              />
            </span>
            <div className="mx-4">
              <span>{file?.name}</span>
              <div>
                <span className="text-xs text-[#6B7280]">{file?.size}KB .</span>
                <span className="text-xs text-[#6B7280]">100% uploaded</span>
              </div>
            </div>
          </div>
          <span
            className="rounded-full bg-[#FEE2E2] flex align-middle justify-center w-[70px] h-[40px]"
            onClick={handleDeleteFile}
          >
            <Image
              src={require(`../../../../../public/icons/red-delete.svg`)}
              alt="upload image"
              width={18}
              height={18}
              priority
            />
          </span>
        </div>
        {!isLoading && (
          <div
            className="flex md:w-[50%] w-[100%] align-middle justify-end  mt-4"
            onClick={() => router.push("/home/analyzed")}
            style={{ cursor: "pointer" }}
          >
            <div  className="p-5 flex w-[35%] align-middle justify-center bg-[#4582C4]  border-2 text-white rounded-[15px] font-extrabold">
              <span> <Image
                src={require(`../../../../../public/icons/circle.svg`)}
                alt="upload image"
                width={20}
                height={20}
                priority
                className="rotate-animation"
              /></span>
              <span className="ml-3">Analyzing</span>
            </div>
          </div>
        )}
      </div>
      {SummarizeSetting && (
        <CustomModal
          style="bg-white md:w-[30%] w-[90%] relative top-[20%] rounded-xl mx-auto pt-3 px-3 pb-5"
          closeModal={() => setSummarizeSetting(false)}
        >
          <SummarizeSettings />
        </CustomModal>
      )}
    </>
  );
};

export default FileUploadSection;
