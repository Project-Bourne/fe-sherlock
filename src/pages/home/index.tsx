// home page
import { useRouter } from "next/router";
import FileUpload from "./components/FileUpload";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import DummyText from "./components/dummyText";
import { useDispatch, useSelector } from 'react-redux';
import { setTextandTitle, setAssessment } from "../../redux/reducer/analyzerSlice";
import AuthService from "../../services/auth.service";
import NotificationService from "../../services/notification.service";
import { setUserInfo } from "../../redux/reducer/authReducer";
import ActionIcons from "./components/actionIcons/ActionIcons";
import { Box } from "@mui/material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import MarkdownRenderer from "../../components/ui/MarkdownRenderer";

function Home() {
  const router = useRouter()
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true)
  const [exportData, setExportData] = useState("");
  const { analyzedText, analyzedTitle, analyzedUuid } = useSelector((state: any) => state.analyze);
  const [value, setValue] = React.useState(0);
  const [hideMeta, setHideMeta] = useState(true); //hide and show meta data
  const handleMax = () => {
    setHideMeta(true);
  };
  const { assessment } = useSelector((state: any) => state.analyze)

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  useEffect(() => {
    dispatch(setTextandTitle({
      text: '',
      title: '',
    }))
    dispatch(setAssessment(''))
  }, [])
  useEffect(() => {
    setLoading(true);
    try {
      AuthService
        .getUserViaAccessToken()
        .then((response) => {
          setLoading(false);
          if (response?.status) {
            dispatch(setUserInfo(response?.data));
          }
        })
        .catch((err) => {
          NotificationService.error({
            message: "Error",
            addedText: "Could not fetch user data",
            position: "top-center",
          });
        });
    } catch (err) {
      console.log(err);
    }
  }, []);

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
    <div className='pb-5'>
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
                    <h1 className="md:text-3xl text-[14px]">
                      {analyzedTitle}
                    </h1>
                  </div>
                )}
                {hideMeta == false && (
                  <h1 className="md:text-lg font-bold pl-5 pb-2">
                    {analyzedTitle}
                  </h1>
                )}
              </div>
              <div className=" mx-5">
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
        </CustomTabPanel>
      </div>
      <CustomTabPanel value={value} index={1}>
        {assessment?.length > 0 ?
          <div className="my-4 bg-white border border-r-[10px] rounded-lg shadow-md border-sirp-primaryLess2 p-7">
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
