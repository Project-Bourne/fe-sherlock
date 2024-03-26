import Image from "next/image";
import React, { useEffect, useState } from "react";
import FileUploadSection from "./FileUploadSection";
import { useDispatch, useSelector } from 'react-redux';
import AnalyzerService from "../../../../services/Analyzer.service"
import { useRouter } from 'next/router';
import NotificationService from '../../../../services/notification.service';
import { setTextAnalysis, setAssessment } from '../../../../redux/reducer/analyzerSlice';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import LoadingModal from './loadingModal';
import TextareaAutosize from 'react-textarea-autosize';
import { Cookies } from "react-cookie";


const FileUpload = ({ exportData }) => {
  const [formData, setFormData] = useState(exportData);
  const router = useRouter()
  const cookies = new Cookies();
  let access = "";
  if (typeof window !== "undefined") {
    access = cookies.get("deep-access");
  }
  const dispatch = useDispatch()
  const [file, setFile] = useState<File | null>(null);
  const [showLoader, setShowLoader] = useState(false)
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showReader, setShowReader] = useState(false);
  const [fileName, setFileName] = useState('')
  const { userInfo } = useSelector((state: any) => state?.auth);
  useEffect(() => {
    // Update formData when exportData changes
    setFormData(exportData);
  }, [exportData]);


  // console.log(formData, 'formdatannnnn')
  const handleChange = (e) => {
    const value = e.target.value;
    setFormData(value);
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log('Enter key pressed:', formData);
      let data = {
        text: formData,
      };
      setShowLoader(true);
      try {
        const request = await AnalyzerService.analyze(data);
        console.log(request)
        if (request.status) {
          dispatch(setTextAnalysis(request.data))
          dispatch(setAssessment(request.data.assessment))
          setShowLoader(false);
          setFormData('')
        } else {
          setShowLoader(false);
          router.replace('/home');
          NotificationService.error({
            message: "Error!",
            addedText: <p>{request.error}. please try again</p>,
          });
        }
      } catch (error) {
        setShowLoader(false);
        console.log(error);
      }
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Enter key pressed:', formData);
    let data = {
      text: formData,
    };
    setShowLoader(true);
    try {
      const request = await AnalyzerService.analyze(data);
      console.log(request)
      if (request.status) {
        dispatch(setTextAnalysis(request.data))
        dispatch(setAssessment(request.data.assessment))
        setShowLoader(false);
        setFormData('')
      } else {
        setShowLoader(false);
        router.replace('/home');
        NotificationService.error({
          message: "Error!",
          addedText: <p>{request.error}. please try again</p>,
        });
      }
    } catch (error) {
      setShowLoader(false);
      console.log(error);
    }
  }
  const handleDeleteFile = () => {
    setFile(null);
    setIsFileUploaded(false);
  };
  const handleTextareaChange = (e) => {
    setFormData(e.target.value);
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();

    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFileName(selectedFile.name)
      const fullName = `${userInfo.firstName} ${userInfo.lastName}`;
      const userId = userInfo.uuid
      if (!fullName || !userId || !selectedFile) return
      setIsFileUploaded(true)
      const formData = new FormData();
      formData.append('files', selectedFile);
      formData.append("userId", userId);
      formData.append("userName", fullName);
      setIsLoading(true);
      try {
        const res = await fetch('http://192.81.213.226:81/89/api/v1/uploads', {
          method: 'POST',
          body: formData,
          headers: {
            "deep-token": access,
          }
        })
        if (res.status === 403) {
          cookies.remove("deep-access");

          // Redirect to the login page
          window.location.replace("http://192.81.213.226:30/auth/login");
          return "Access forbidden. Redirecting to login page.";
        }
        const response = await res.json();
        console.log(response, 'response')
        if (response.status) {
          let newObj = {
            text: response.data[0].text,
            uri: response.data[0].uri,
          }
          let newResponse = await AnalyzerService.analyzeFile(newObj)
          if (newResponse.status) {
            dispatch(setTextAnalysis(newResponse.data))
            setIsLoading(false);
            setFormData("")
            setIsFileUploaded(false)
            // router.replace('/home/analyzed');
          } else {
            setIsLoading(false);
            setIsFileUploaded(false)
            console.log(newResponse, 'new')
            // router.replace('/home');
            NotificationService.error({
              message: "Error!",
              addedText: <p>{newResponse.error}. please try again</p>,
            });
          }
        } else {
          setIsLoading(false);
          setIsFileUploaded(false)
          NotificationService.error({
            message: "Error!",
            addedText: <p>Something went wrong. please try again</p>,
          });
          console.error('File upload failed.');
        }
      } catch (error) {
        console.log(error, 'error')
        setIsFileUploaded(false)
        setIsLoading(false);
        NotificationService.error({
          message: "Error!",
          addedText: <p>Something went wrong. please try again</p>,
        });
        console.error(error);
      }
    }
  }
  const handleClear = () => {
    setFormData("")
  }
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    setFile(droppedFile);
    if (droppedFile) {
      const formData = new FormData();
      formData.append('file', droppedFile);

      try {
        const response: any = await fetch('http://192.81.213.226:81/89/api/v1/upload', {
          method: 'POST',
          body: formData,
        });
        console.log(response);
        if (response.status) {
        } else {
          console.error('File upload failed.');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleClearInput = () => {
    setFormData("");
  };

  const closeModal = () => {
    setShowLoader(false)
  }

  return (
    <div className="m-5">
      {showLoader && <LoadingModal closeModal={closeModal} formData={formData} />}
      {isFileUploaded ?
        (
          <div className='p-10 flex align-middle items-center w-full flex-col justify-center'>
            <div className="p-5 flex w-[50%] align-middle justify-between bg-[#F3F5F6] border-2 border-[E8EAEC] rounded-[15px]">
              <div className='flex align-middle items-center justify-center'>
                <span className='rounded-full bg-[#E8F8FD] flex align-middle justify-center w-[40px] h-[40px]'>
                  <Image
                    src={require(`../../../../../public//icons/file.svg`)}
                    alt="upload image"
                    width={20}
                    height={20}
                    priority
                  />
                </span>
                <div className='mx-4'>
                  <span>{fileName}</span>
                  <div>
                    <span className='text-xs text-[#6B7280]'>{file?.size}KB .</span>
                    <span className='text-xs text-[#6B7280]'>100% uploaded</span>
                  </div>
                </div>
              </div>
              <span className='rounded-full bg-[#FEE2E2] flex align-middle justify-center w-[40px] h-[40px]' onClick={handleDeleteFile}>
                <Image
                  src={require(`../../../../../public//icons/red-delete.svg`)}
                  alt="upload image"
                  width={18}
                  height={18}
                  priority
                />
              </span>
            </div>
            <div className="flex w-[50%] align-middle justify-end  mt-4">
              {!isLoading && <div className="p-5 cursor-pointer flex w-[30%] align-middle justify-center bg-[#4582C4]  border-2 text-white rounded-[15px] font-extrabold">
                <span className='ml-3'>Analyze</span>
              </div>}
              {isLoading && <div className="p-5 flex w-[35%] align-middle justify-center bg-[#4582C4]  border-2 text-white rounded-[15px] font-extrabold">
                <span> <Image
                  src={require(`../../../../../public/icons/circle.svg`)}
                  alt="upload image"
                  width={20}
                  height={20}
                  priority
                  className="rotate-animation"
                /></span>
                <span className='ml-3'>Analyzing</span>
              </div>}
            </div>

          </div>
        ) :
        (<div className="flex flex-col items-end">
          {formData.length < 1 ?
            <div className='flex items-center mb-3'>
              <label htmlFor="file-input" className='px-4 py-1 rounded-lg w-[150px]' style={{ cursor: 'pointer', color: '#4582C4', backgroundColor: "white", border: '1px solid #4582C4' }}>
                <DriveFolderUploadIcon style={{ color: '#4582C4', cursor: 'pointer' }} /> Upload File
              </label>

              <input
                type="file"
                id="file-input"
                style={{ display: 'none' }}
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
              />
            </div> :
            <div className="bg-sirp-primary text-white font-bold py-2 px-4  rounded-lg flex items-center mb-3 justify-center cursor-pointer" onClick={handleSubmit}>Run Analyzer</div>
          }
          <div className='flex align-middle w-full h-[auto] border-2 rounded-[1rem] border-[#E5E7EB]-500  border-dotted bg-[]'>
            <span className='flex align-middle justify-center mx-3'>
              <Image
                src={require(`../../../../../public/icons/link.svg`)}
                alt="upload image"
                width={20}
                height={20}
                priority
              />
            </span>
            <TextareaAutosize
              minRows={1}
              placeholder="Copy and paste content text here"
              onChange={handleTextareaChange}
              className={`w-[95%] p-5`}
              value={formData}
              maxRows={20}
              style={{ border: 'none', outline: 'none' }}
            />
            <span className='flex align-middle justify-center mx-3' onClick={handleClear}>
              <Image
                className='flex align-middle cursor-pointer justify-center font-light text-black'
                src={require(`../../../../../public/icons/x.svg`)}
                alt="upload image"
                width={20}
                height={20}
              />
            </span>
          </div>
        </div>
        )}
    </div>
  );
};

export default FileUpload;
