// home page
import { useRouter } from "next/router";
import FileUpload from "./components/FileUpload";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import DummyText from "./components/dummyText";
import { useDispatch, useSelector } from "react-redux";
import { setTextandTitle } from "../../redux/reducer/analyzerSlice";
import AuthService from "../../services/auth.service";
import NotificationService from "../../services/notification.service";
import { setUserInfo } from "../../redux/reducer/authReducer";
import ActionIcons from "./components/actionIcons/ActionIcons";
import CustomModal from "../../components/ui/CustomModal";
import Loader from "../../components/ui/Loader";
import { Cookies } from "react-cookie";
import { Box } from "@mui/material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import MarkdownRenderer from "../../components/ui/MarkdownRenderer";

function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { analyzedText, analyzedTitle, analyzedUuid, analysisArray } = useSelector(
    (state: any) => state?.analyze
  );
  const [value, setValue] = React.useState(0);
  const [hideMeta, setHideMeta] = useState(true); //hide and show meta data
  const [exportData, setExportData] = useState("");
  const { incoming } = router.query;
  const cookies = new Cookies();
  const token = cookies.get("deep-access");
  const headers = {
    "deep-token": token,
  };
  const { assessment } = useSelector((state: any) => state.analyze)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (typeof incoming === "string") {
        try {
          const [routeId, routeName] = incoming.split("&");
          let url;
          const BASE_URL = `http://${process.env.NEXT_PUBLIC_SERVER_IP_ADDRESS}:${process.env.NEXT_PUBLIC_IRP_API_PORT}`;
          switch (routeName) {
            case "summarizer":
              // url = `http://192.81.213.226:81/82/summary/${routeId}`;
              url = `${BASE_URL}/${process.env.NEXT_PUBLIC_SUMMARIZER_API_ROUTE}/summary/${routeId}`;
              break;
            case "translator":
              // url = `http://192.81.213.226:81/83/translation/${routeId}`;
              url = `${BASE_URL}/${process.env.NEXT_PUBLIC_TRANSLATOR_API_ROUTE}/translation/${routeId}`;
              break;
            case "factcheck":
              // url = `http://192.81.213.226:81/84/fact/${routeId}`;
              url = `${BASE_URL}/${process.env.NEXT_PUBLIC_FACT_CHECKER_API_ROUTE}/fact/${routeId}`;
              break;
            case "irp":
              // url = `http://192.81.213.226:81/84/fact/${routeId}`;
              url = `${BASE_URL}/${process.env.NEXT_PUBLIC_FACT_CHECKER_API_ROUTE}/fact/${routeId}`;
              break;
            case "deepchat":
              // url = `http://192.81.213.226:81/85/deepchat/${routeId}`;
              url = `${BASE_URL}/${process.env.NEXT_PUBLIC_DEEP_CHAT_API_ROUTE}/deepchat/${routeId}`;
              break;
            case "analyzer":
              // url = `http://192.81.213.226:810/analysis/${routeId}`;
              url = `${BASE_URL}/${process.env.NEXT_PUBLIC_ANALYZER_API_ROUTE}/analysis/${routeId}`;
              break;
            case "interrogator":
              // url = `http://192.81.213.226:81/87/interrogation/message/${routeId}`;
              url = `${BASE_URL}/${process.env.NEXT_PUBLIC_INTERROGATOR_API_ROUTE}/interrogation/message/${routeId}`;
              break;
            case "collab":
              url = `${BASE_URL}/${process.env.NEXT_PUBLIC_COLLAB_API_ROUTE}/api/v1/doc/${routeId}`;
              break;
            default:
              throw new Error("Invalid routeName");
          }

          const response = await fetch(url, {
            method: "GET",
            headers: headers,
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          let transformedData = '';
          
          // Handle collab case separately since it has a different data structure
          if (routeName === 'collab') {
            const collabData: string[] = data?.data?.data?.ops.map((el) => el.insert);
            transformedData = collabData.join(' ');
          } else {
            transformedData = data?.data?.textTranslation || data?.data?.confidence?.content5wh || data?.data?.summaryArray?.[0]?.summary || data?.data?.answer || '';
          }
          
          // Transform the data with emphasis markers if analysisArray exists
          if (analysisArray?.length > 0) {
            analysisArray.forEach(item => {
              const keyword = item.name;
              const coloredKeyword = `*${keyword}*`;
              // Replace occurrences of the keyword with the colored keyword
              const regex = new RegExp(keyword, 'g');
              transformedData = transformedData.replace(regex, coloredKeyword);
            });
          }
          
          setExportData(transformedData);
          setLoading(false);
        } catch (error: any) {
          console.error("Error:", error);
          NotificationService.error({
            message: "Error!",
            addedText: <p>{`${error.message}, please try again`}</p>,
            position: "top-center",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [incoming, analysisArray]);

  useEffect(() => {
    dispatch(
      setTextandTitle({
        text: "",
        title: "",
      })
    );
  }, []);
  useEffect(() => {
    setLoading(true);
    try {
      AuthService?.getUserViaAccessToken()
        .then((response) => {
          setLoading(false);
          if (response?.status) {
            dispatch(setUserInfo(response?.data));
          }
        })
        .catch((err) => {
          NotificationService?.error({
            message: "Error",
            addedText: "Could not fetch user data",
            position: "top-center",
          });
        });
    } catch (err) {
      console.log(err);
    }
  }, []);

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
    <div className="pb-5">
      {loading && (
        <CustomModal
          style="md:w-[30%] w-[90%] relative top-[20%] rounded-xl mx-auto pt-3 px-3 pb-5"
          closeModal={() => setLoading(false)}
        >
          <div className="flex justify-center items-center mt-[10rem]">
            <Loader />
          </div>
        </CustomModal>
      )}
      {/* <h1 className="text-2xl pl-10 font-bold">Add Content</h1> */}
      <FileUpload exportData={exportData} />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Analyzer" {...a11yProps(0)} />
          <Tab label="Assessment" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <div className="bg-sirp-secondary2 h-[100%] mx-5 rounded-[1rem]">
        <CustomTabPanel value={value} index={0}>
          {analyzedText ?
            <div>
              <ActionIcons docId={analyzedUuid} />
              <div className="bg-white border mt-3 mx-10 rounded-[1rem]">
                {hideMeta == true && (
                  <div className="pl-5 p-5">
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
                {hideMeta == false && (
                  // <h1 className="md:text-lg font-bold pl-5 pb-2">
                  //   {analyzedTitle}
                  // </h1>
                  <MarkdownRenderer
                    content={analyzedTitle}
                    className="text-[24px] font-bold uppercase text-justify pl-10 pb-1 leading-8 break-normal"
                  />
                )}
              </div>
              <div className="mx-5">
                <MarkdownRenderer 
                  content={exportData} 
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
                <h1 className="font-[700] text-2xl">No Analyzed Content yet</h1>
                <span className='text-gray-400'>Copy and paste content or Upload a file to be Analyzed</span>
              </div>
            </div>
          }
        </CustomTabPanel>
      </div>
      <CustomTabPanel value={value} index={1}>
        {assessment?.length > 0 ?
          <div className="my-4 bg-white border border-r-[10px] rounded-lg shadow-md border-sirp-primaryLess2 p-7">
            {/* {assessment?.split('\n').map((paragraph, i) => (
              <p key={i} className="text-[14px] text-justify   pl-10 pb-1 leading-8 break-normal "> {paragraph} </p>
            ))} */}
            <MarkdownRenderer
              content={assessment}
              className="text-[14px] text-justify pl-10 pb-1 leading-8 break-normal"
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
    </div>
  );
}

export default Home;
