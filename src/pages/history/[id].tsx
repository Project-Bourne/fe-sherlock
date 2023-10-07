import React, { useEffect, useState } from "react";
import Image from "next/image";
import DummyText from "../home/components/dummyText";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from 'react-redux';
import AnalyzerService from "../../services/Analyzer.service"
import NotificationService from '../../services/notification.service';
import { setTextAnalysis } from "../../redux/reducer/analyzerSlice";
import ActionIcons from "../home/components/actionIcons/ActionIcons";
import CustomModal from "../../components/ui/CustomModal";
import Loader from "../../components/ui/Loader";

function homecontent() {
  const router = useRouter()
  const dispatch = useDispatch();
  const [uuid, setUuid] = useState({})
  const [showLoader, setShowLoader] = useState(false)
  const { analyzedText, analyzedTitle, analysisArray } = useSelector((state: any) => state.analyze);
  const { id } = router.query
  const [hideMeta, setHideMeta] = useState(true); //hide and show meta data
  const handleMax = () => {
    setHideMeta(true);
  };
  const handleMin = () => {
    //hide and show meta data
    setHideMeta(false);
  };

  useEffect(() => {
    const fetchSingleAnalysis = async () => {
      if (id) {
        try {
          setShowLoader(true);
          const request = await AnalyzerService.getAnalysisById(id);
          if (request.status) {
            dispatch(setTextAnalysis(request.data))
            setUuid(request?.data?.uuid)
            setShowLoader(false);
          } else {
            setShowLoader(false);
            router.push('/history');
            NotificationService.error({
              message: "Error!",
              addedText: <p>{request.message}. please try again</p>,
            });
          }
        } catch (error) {
          setShowLoader(false);
          console.log(error);
        }
      } else {
        return
      }

    }
    fetchSingleAnalysis()
  }, [id])


  return (
    <div className="bg-sirp-secondary2 h-[100%] mx-5 rounded-[1rem]">
      {showLoader ? (
        <CustomModal
          style="md:w-[30%] w-[90%] relative top-[20%] rounded-xl mx-auto pt-3 px-3 pb-5"
          closeModal={() => setShowLoader(false)}
        >
          <div className="flex justify-center items-center mt-[10rem]">
            <Loader />
          </div>
        </CustomModal>
      ) :
        <>
          <div className="flex md:justify-between  flex-wrap md:px-5 md:py-1 ">
          </div>


          <div className=" mx-10 mt-[1rem] flex items-center justify-between">
            <Image
              src={require("../../../public/icons/arrow-narrow-left 1.svg")}
              alt="documents"
              className="cursor-pointer pb-5"
              width={20}
              onClick={() => router.back()}
            />
            <ActionIcons docId={uuid} />
          </div>

          <div>
            <div className="bg-white border my-[1rem] mx-10 rounded-[1rem]">
              {hideMeta == true && (
                <div className="pl-5 py-5">
                  <p className="text-md text-gray-500">Title:</p>
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
            <div className="pb-10 mx-5">
              <DummyText />
            </div>
          </div></>

      }

    </div>
  );
}

export default homecontent;
