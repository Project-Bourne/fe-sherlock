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
import MarkdownRenderer from "../../components/ui/MarkdownRenderer";

function homecontent() {
  const router = useRouter()
  const dispatch = useDispatch();
  const [uuid, setUuid] = useState({})
  const [showLoader, setShowLoader] = useState(false)
  const { analyzedText, analyzedTitle, analysisArray } = useSelector((state: any) => state.analyze);
  const { id } = router.query
  const [value, setValue] = React.useState(0);
  const [hideMeta, setHideMeta] = useState(true); //hide and show meta data
  const { assessment } = useSelector((state: any) => state.analyze)

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
            // Store the original texts
            let newText = request.data.text;
            let newTitle = request.data.title;
            let newAssessment = request.data.assessment;
            
            // Apply analysis array modifications if available
            if (request.data.analysisArray?.length > 0) {
              request.data.analysisArray.forEach(item => {
                const keyword = item.name;
                const coloredKeyword = `*${keyword}*`;
                // Replace occurrences of the keyword with the colored keyword in all texts
                const regex = new RegExp(keyword, 'g');
                newText = newText.replace(regex, coloredKeyword);
                newTitle = newTitle.replace(regex, coloredKeyword);
                if (newAssessment) {
                  newAssessment = newAssessment.replace(regex, coloredKeyword);
                }
              });
            }
            
            // Update the state with modified texts
            dispatch(setTextAnalysis({
              ...request.data,
              text: newText,
              title: newTitle,
              assessment: newAssessment
            }));
            setUuid(request?.data?.uuid);
            setShowLoader(false);
          } else {
            setShowLoader(false);
            router.replace('/history');
            NotificationService.error({
              message: "Error!",
              addedText: <p>{request.message}. please try again</p>,
            });
          }
        } catch (error) {
          setShowLoader(false);
        }
      }
    };
    fetchSingleAnalysis();
  }, [id]);

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
            {children}
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
              {analyzedText ?
                <div>
                  <ActionIcons docId={uuid} />
                  <div className="bg-white border mt-3 mx-10 rounded-[1rem]">
                    {hideMeta == true && (
                      <div className="pl-5 p-5">
                        <p className="text-md text-gray-500">Title</p>
                        <MarkdownRenderer
                          content={analyzedTitle}
                          className="text-[24px] font-bold uppercase text-justify pl-10 pb-1 leading-8 break-normal"
                          analysisArray={analysisArray}
                        />
                      </div>
                    )}
                    {hideMeta == false && (
                      <MarkdownRenderer
                        content={analyzedTitle}
                        className="text-[24px] font-bold uppercase text-justify pl-10 pb-1 leading-8 break-normal"
                        analysisArray={analysisArray}
                      />
                    )}
                  </div>
                  <div className="mx-5">
                    <MarkdownRenderer 
                      content={analyzedText} 
                      className="text-[14px] text-justify pl-10 pb-1 leading-8 break-normal"
                      analysisArray={analysisArray}
                    />
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
                    <h1 className="font-[700] text-2xl">No Analysed Assessment yet</h1>
                    <span className='text-gray-400'>Copy and paste content or Upload a file to be Analyzed</span>
                  </div>
                </div>
              }
            </CustomTabPanel>
          </div>

          <CustomTabPanel value={value} index={1}>
            {assessment?.length > 0 ?
              <div className="my-4 bg-white border border-r-[10px] rounded-lg shadow-md border-sirp-primaryLess2 p-7">
                <MarkdownRenderer
                  content={assessment}
                  className="text-[14px] text-justify pl-10 pb-1 leading-8 break-normal"
                  analysisArray={analysisArray}
                />
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