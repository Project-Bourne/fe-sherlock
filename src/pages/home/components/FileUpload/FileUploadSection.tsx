import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

const FileUploadSection = ({ file, handleDeleteFile, isLoading }) => {
  const router = useRouter();

  return (
    <>
      <div className="p-10 flex align-middle items-center border-red-500 w-full flex-col justify-center">
        <div className="p-5 flex md:w-[50%] w-[100%] align-middle justify-between bg-sirp-lightGrey border-2 border-sirp-dashbordb1 rounded-[15px]">
          <div className="flex align-middle items-center justify-center">
            <span className="rounded-full bg-sirp-primaryLess2 flex align-middle justify-center w-[40px] h-[40px]">
              <Image
                src={require(`../../../../assets/icons/file.svg`)}
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
            className="rounded-full bg-[#FEE2E2] flex align-middle justify-center w-[40px] h-[40px]"
            onClick={handleDeleteFile}
          >
            <Image
              src={require(`../../../../assets/icons/red-delete.svg`)}
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
            onClick={() => router.push('/home/analyedcontent/analyedcontent')} //navigate to Analyezed_content page
            style={{ cursor: 'pointer' }}
          >
            <div className="p-5 cursor-pointer flex md:w-[30%] w-[50%] align-middle justify-center bg-sirp-primary text-white rounded-[15px] font-extrabold">
              <span className="ml-3">Analyze</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FileUploadSection;
