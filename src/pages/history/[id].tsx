import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from 'react-redux';
import AnalyzerService from "../../services/Analyzer.service";
import NotificationService from '../../services/notification.service';
import { setAssessment, setTextAnalysis } from "../../redux/reducer/analyzerSlice";
import ActionIcons from "../home/components/actionIcons/ActionIcons";
import CustomModal from "../../components/ui/CustomModal";
import Loader from "../../components/ui/Loader";
import { Box, Tab, Tabs } from "@mui/material";
import MarkdownRenderer from "../../components/ui/MarkdownRenderer";

/**
 * Interface for tab panel props
 * @interface TabPanelProps
 * @property {React.ReactNode} [children] - Child elements to render
 * @property {number} index - Tab index
 * @property {number} value - Current active tab value
 */
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

/**
 * Custom tab panel component
 * @param {TabPanelProps} props - Component props
 * @returns {JSX.Element} Rendered tab panel
 */
function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`analysis-tab-${index}`}
            aria-labelledby={`analysis-tab-${index}`}
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

/**
 * Get aria props for tabs
 * @param {number} index - Tab index
 * @returns {Object} Aria props object
 */
function a11yProps(index: number) {
    return {
        id: `analysis-tab-${index}`,
        'aria-controls': `analysis-tab-${index}`,
    };
}

/**
 * History detail page component
 * @returns {JSX.Element} Rendered history detail page
 */
function HistoryDetail() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [uuid, setUuid] = useState<string>("");
    const [showLoader, setShowLoader] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [showMetadata, setShowMetadata] = useState(true);
    
    const { analyzedText, analyzedTitle, analysisArray, assessment } = useSelector((state: any) => state.analyze);
    const { id } = router.query;

    useEffect(() => {
        const fetchSingleAnalysis = async () => {
            if (!id) return;

            try {
                setShowLoader(true);
                const response = await AnalyzerService.getAnalysisById(id as string);
                
                if (response.status) {
                    // Process text with analysis array
                    const processText = (text: string) => {
                        if (!text || !response.data.analysisArray?.length) return text;
                        
                        return response.data.analysisArray.reduce((acc, item) => {
                            const regex = new RegExp(item.name, 'g');
                            return acc.replace(regex, `*${item.name}*`);
                        }, text);
                    };

                    // Update state with processed texts
                    dispatch(setTextAnalysis({
                        ...response.data,
                        text: processText(response.data.text),
                        title: processText(response.data.title),
                        assessment: processText(response.data.assessment)
                    }));
                    setUuid(response.data.uuid);
                } else {
                    router.replace('/history');
                    NotificationService.error({
                        message: "Error!",
                        addedText: <p>{response.message}. Please try again</p>,
                    });
                }
            } catch (error) {
                console.error('Error fetching analysis:', error);
                NotificationService.error({
                    message: "Error!",
                    addedText: <p>Failed to fetch analysis. Please try again</p>,
                });
                router.replace('/history');
            } finally {
                setShowLoader(false);
            }
        };

        fetchSingleAnalysis();
    }, [id, dispatch, router]);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    if (showLoader) {
        return (
            <CustomModal
                style="md:w-[30%] w-[90%] relative top-[20%] rounded-xl mx-auto pt-3 px-3 pb-5"
                closeModal={() => setShowLoader(false)}
            >
                <div className="flex justify-center items-center mt-[10rem]">
                    <Loader />
                </div>
            </CustomModal>
        );
    }

    return (
        <div className="bg-[#F8FBFE] min-h-screen mx-5 rounded-[1rem] shadow-sm">
            <Box sx={{ borderBottom: 1, borderColor: '#E8F8FD' }}>
                <Tabs 
                    value={activeTab} 
                    onChange={handleTabChange} 
                    aria-label="analysis tabs"
                    sx={{
                        '& .MuiTab-root': {
                            color: '#545C62',
                            '&.Mui-selected': {
                                color: '#4582C4',
                            }
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#4582C4',
                        }
                    }}
                >
                    <Tab label="Analyzer" {...a11yProps(0)} />
                    <Tab label="Assessment" {...a11yProps(1)} />
                </Tabs>
            </Box>

            <CustomTabPanel value={activeTab} index={0}>
                {analyzedText ? (
                    <div>
                        <ActionIcons docId={uuid} />
                        <div className="bg-white border border-[#E8F8FD] mt-3 mx-10 rounded-[1rem] shadow-sm">
                            <div className="pl-5 p-5">
                                <p className="text-[#545C62] mb-2">Title</p>
                                <MarkdownRenderer
                                    content={analyzedTitle}
                                    className="text-[24px] font-bold text-[#383E42] text-justify pl-10 pb-1 leading-8 break-normal"
                                    analysisArray={analysisArray}
                                />
                            </div>
                        </div>
                        <div className="mx-5 mt-4 bg-white border border-[#E8F8FD] p-6 rounded-[1rem] shadow-sm">
                            <MarkdownRenderer 
                                content={analyzedText} 
                                className="text-[14px] text-[#545C62] text-justify leading-7"
                                analysisArray={analysisArray}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center flex-col gap-4 h-[60vh]">
                        <div className="flex items-center justify-center w-[50%] font-bold flex-col p-3 rounded-[1rem] gap-3 text-xl">
                            <Image
                                src={require(`../../../public/icons/no_history.svg`)}
                                alt="No content"
                                width={150}
                                height={150}
                                priority
                            />
                            <h1 className="font-[700] text-2xl text-[#383E42]">No Analysis Found</h1>
                            <span className='text-[#545C62]'>The requested analysis could not be found</span>
                        </div>
                    </div>
                )}
            </CustomTabPanel>

            <CustomTabPanel value={activeTab} index={1}>
                {assessment?.length > 0 ? (
                    <div className="bg-white border border-[#E8F8FD] rounded-[1rem] shadow-sm p-7">
                        <MarkdownRenderer
                            content={assessment}
                            className="text-[14px] text-[#545C62] text-justify leading-7"
                            analysisArray={analysisArray}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center flex-col gap-4 h-[60vh]">
                        <div className="flex items-center justify-center w-[50%] font-bold flex-col p-3 rounded-[1rem] gap-3 text-xl">
                            <Image
                                src={require(`../../../public/icons/no_history.svg`)}
                                alt="No assessment"
                                width={150}
                                height={150}
                                priority
                            />
                            <h1 className="font-[700] text-2xl text-[#383E42]">No Assessment Available</h1>
                            <span className='text-[#545C62]'>No assessment has been generated for this analysis</span>
                        </div>
                    </div>
                )}
            </CustomTabPanel>
        </div>
    );
}

export default HistoryDetail;