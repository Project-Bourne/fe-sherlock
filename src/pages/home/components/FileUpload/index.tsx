import Image from "next/image";
import React, { useEffect, useState } from "react";
import FileUploadSection from "./FileUploadSection";
import { useDispatch, useSelector } from 'react-redux';
import AnalyzerService from "../../../../services/Analyzer.service"
import { useRouter } from 'next/router';
import NotificationService from '../../../../services/notification.service';
import { setTextAnalysis } from '../../../../redux/reducer/analyzerSlice';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import LoadingModal from './loadingModal';

const FileUpload = ({exportData}) => {
  const [formData, setFormData] = useState(exportData);
  const router = useRouter()
  const dispatch = useDispatch()
  const [file, setFile] = useState<File | null>(null);
  const [showLoader, setShowLoader] = useState(false)
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showReader, setShowReader] = useState(false);
  const [fileName, setFileName] = useState('')

  useEffect(() => {
    // Update formData when exportData changes
    setFormData(exportData);
  }, [exportData]);


  console.log(formData, 'formdatannnnn')
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
          setShowLoader(false);
          setFormData('')
        } else {
          setShowLoader(false);
          router.push('/home');
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
  const handleDeleteFile = () => {
    setFile(null);
    setIsFileUploaded(false);
  };
  const handleTextareaChange = (e) => {
    setFormData(e.target.value);
    // Automatically adjust the textarea's height
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();

    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFileName(selectedFile.name)
      setIsFileUploaded(true)
      const formData = new FormData();
      formData.append('files', selectedFile);
      setIsLoading(true);
      try {
        const res = await fetch('http://192.81.213.226:81/89/api/v1/uploads', {
          method: 'POST',
          body: formData,
        })
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
            // router.push('/home/analyzed');
          } else {
            setIsLoading(false);
            setIsFileUploaded(false)
            console.log(newResponse, 'new')
            // router.push('/home');
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
          {/* <div
            className="flex md:w-[15%] w-[50%] h-[3.5rem] rounded-[1rem] justify-center items-center bg-sirp-primary mb-3"
            onClick={() => router.push("/home/content_id/crawled")} //navigate to Analyezed_content page
            style={{ cursor: "pointer" }}
          >
            <span className="text-white">Run Analyzer</span>
          </div> */}
          {formData.length === 0 &&
            <div className='flex items-center mb-3'>
              <span className='text-grey-400 mr-2 text-sm text-sirp-primary'>{fileName}</span>
              <label htmlFor="file-input" className='px-4 py-1 rounded-lg' style={{ cursor: 'pointer', color: '#4582C4', backgroundColor: "white", border: '1px solid #4582C4' }}>
                <DriveFolderUploadIcon style={{ color: '#4582C4', cursor: 'pointer' }} /> Upload File
              </label>

              <input
                type="file"
                id="file-input"
                style={{ display: 'none' }}
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
              />
            </div>}
          <div className='flex align-middle w-full border-2 rounded-[1rem] border-[#E5E7EB]-500  border-dotted bg-[]'>
            <span className='flex align-middle justify-center mx-3'>
              <Image
                src={require(`../../../../../public/icons/link.svg`)}
                alt="upload image"
                width={20}
                height={20}
                priority
              />
              {/* <span className='ml-3 font-light text-[#A1ADB5]'>Copy and paste link here</span> */}
            </span>
            {/* <input placeholder='Copy and paste content text here' className='py-5 w-[95%]  outline-none' value={formData} onChange={handleChange} onKeyDown={handleKeyDown} /> */}
            <textarea
              placeholder="Copy and paste content text here"
              className={`w-[95%] outline-none focus:ring-0 pt-8 resize-y min-h-[6rem] max-h-[15rem] overflow-auto`}
              value={formData}
              onKeyDown={handleKeyDown}
              onChange={handleTextareaChange}
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

          {/* <div onDragOver={handleDragOver} onDrop={handleDrop} className='h-[30vh] mt-5 flex align-middle w-full justify-center border rounded-[30px] border-[#E5E7EB]'>
            <div className='flex flex-col align-middle justify-center'>
              <span className='flex align-middle justify-center mx-3'>
                <Image
                  className='flex align-middle justify-center'
                  src={require(`../../../../../public/icons/cloud.svg`)}
                  alt="upload image"
                  width={25}
                  height={25}
                  priority
                />
              </span>
              <span className='font-normal text-[#383E42]'>
                <input
                  id="file-upload"
                  type="file"
                  accept=".txt,.rtf,.doc,.pdf,.svg,"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <label className='text-blue-400 cursor-pointer mr-5' htmlFor="file-upload">Upload a file
                </label>
                or drag and drop</span>
              <span className='font-light  text-[#383E42]'>TXT, RFT, DOC, PDF upto 5MB</span>
            </div>
          </div> */}
        </div>
        )}
    </div>
  );
};

export default FileUpload;
