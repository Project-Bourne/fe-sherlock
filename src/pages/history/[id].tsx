import React, { useEffect, useState } from "react";
import Image from "next/image";
import DummyText from "../home/components/dummyText";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from 'react-redux';
import AnalyzerService from "../../services/Analyzer.service"
import NotificationService from '../../services/notification.service';
import { setAssessment, setTextAnalysis } from "../../redux/reducer/analyzerSlice";
import ActionIcons from "../home/components/actionIcons/ActionIcons";
import CustomModal from "../../components/ui/CustomModal";
import Loader from "../../components/ui/Loader";
import { Box } from "@mui/material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';

function homecontent() {
  const router = useRouter()
  const dispatch = useDispatch();
  const [uuid, setUuid] = useState({})
  const [showLoader, setShowLoader] = useState(false)
  const { analyzedText, analyzedTitle, analysisArray } = useSelector((state: any) => state.analyze);
  const { id } = router.query
  const [value, setValue] = React.useState(0);
  const [hideMeta, setHideMeta] = useState(true); //hide and show meta data
  const handleMax = () => {
    setHideMeta(true);
  };
  const handleMin = () => {
    //hide and show meta data
    setHideMeta(false);
  };
  const { assessment } = useSelector((state: any) => state.analyze)
  useEffect(() => {
    const fetchSingleAnalysis = async () => {
      if (id) {
        try {
          setShowLoader(true);
          const request = await AnalyzerService.getAnalysisById(id);
          if (request.status) {
            dispatch(setTextAnalysis(request.data))
            dispatch(setAssessment(request.data.assessment))
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
        }
      } else {
        return
      }

    }
    fetchSingleAnalysis()
  }, [id])
  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }
  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

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
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Analyzer" {...a11yProps(0)} />
              <Tab label="Assessment" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <div className="w-full h-full">
            <CustomTabPanel value={value} index={0}>
              <div>          <div className=" mx-10 pt-[1.5rem] flex items-center justify-between">
                {/* <Image
              src={require("../../../public/icons/arrow-narrow-left 1.svg")}
              alt="documents"
              className="cursor-pointer pb-5"
              width={20}
              onClick={() => router.back()}
            /> */}
                <div></div>
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
                </div></div>
            </CustomTabPanel>
          </div>

          <CustomTabPanel value={value} index={1}>
            {assessment.length > 0 ?
              <div className="my-4 px-4 py-2 bg-white border rounded-lg shadow-md leading-10">
                {assessment}
              </div> :
              <div className="flex items-center justify-center flex-col gap-4 h-[60vh]">
                <div className="flex items-center justify-centery w-[50%] font-bold flex-col p-3 rounded-[1rem] gap-3 text-xl ">
                  <span> <Image
                    src={require(`../../../public/icons/no_history.svg`)}
                    alt="upload image"
                    width={150}
                    height={150}
                    priority
                  /></span>
                  <h1 className="font-[700] text-2xl">No Analysed Assessment yet</h1>
                  <span className='text-gray-400'>Copy and paste content or Upload a file to be Analyzed</span>
                </div>
              </div>
            }
          </CustomTabPanel>
        </>

      }

    </div>
  );
}

export default homecontent;