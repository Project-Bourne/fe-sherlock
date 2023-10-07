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

function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { analyzedText, analyzedTitle, analyzedUuid } = useSelector(
    (state: any) => state.analyze
  );
  const [hideMeta, setHideMeta] = useState(true); //hide and show meta data
const [exportData, setExportData] = useState("");
  const { incoming } = router.query;
  const cookies = new Cookies();
  const token = cookies.get("deep-access");
  const headers = {
    "deep-token": token,
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (typeof incoming === "string") {
        try {
          const [routeId, routeName] = incoming.split("&");
          let url;
          console.log(routeName);
          console.log(routeId);

          switch (routeName) {
            case "summarizer":
              url = `http://192.81.213.226:81/82/summary/${routeId}`;
              break;
            case "translator":
              url = `http://192.81.213.226:81/83/translation/${routeId}`;
              break;
            case "factcheck":
              url = `http://192.81.213.226:81/84/fact/${routeId}`;
              break;
            case "deepchat":
              url = `http://192.81.213.226:81/85/deepchat/${routeId}`;
              break;
            case "analyzer":
              url = `http://192.81.213.226:81/81/analysis/${routeId}`;
              break;
            case "interrogator":
              url = `http://196700:h/${routeId}`;
              break;
            case "collab":
              url = `http://192.81.213.226:81/86/api/v1/${routeId}`;
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
          switch (routeName) {
            case "translator":
              setExportData(data?.data?.textTranslation);
              break;
            case "factcheck":
              setExportData(data?.data?.confidence?.content);
              break;
           
              case 'summarizer':
                setExportData(data?.data?.summaryArray[0].summary);
                break;
            case "deepchat":
            case "interrogator":
            case "collab":
              break;
            default:
              break;
          }
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
  }, [incoming]);

  console.log(exportData);


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
      AuthService.getUserViaAccessToken()
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
      <FileUpload  exportData = {exportData}/>
      <div className="bg-sirp-secondary2 h-[100%] mx-5 rounded-[1rem]">
        {analyzedText ? (
          <div>
            <ActionIcons docId={analyzedUuid} />
            <div className="bg-white border mt-3 mx-10 rounded-[1rem]">
              {/* <Min_and_Max_icon maxOnClick={handleMax} minOnClick={handleMin} /> */}
              {hideMeta == true && (
                <div className="pl-5 p-5">
                  <p className="text-md text-gray-500">Title</p>
                  <h1 className="md:text-3xl text-[14px]">{analyzedTitle}</h1>
                </div>
              )}
              {hideMeta == false && ( //hide and show meta data
                <h1 className="md:text-lg font-bold pl-5 pb-2">
                  {analyzedTitle}
                </h1>
              )}
            </div>
            <div className=" mx-5">
              <DummyText />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center flex-col gap-4 h-[60vh]">
            <div className="flex items-center justify-centery w-[50%] font-bold flex-col p-3 rounded-[1rem] gap-3 text-xl ">
              <span>
                {" "}
                <Image
                  src={require(`../../../public/icons/no_history.svg`)}
                  alt="upload image"
                  width={150}
                  height={150}
                  priority
                />
              </span>
              <h1 className="font-[700] text-2xl">No Analyzed Content yet</h1>
              <span className="text-gray-400">
                Copy and paste content or Upload a file to be Analyzed
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
