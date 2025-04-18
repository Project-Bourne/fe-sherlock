import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useTruncate } from '../../../../components/custom-hooks';
import Image from 'next/image';
import ListItemModels from '../../../../utils/model/home.models';
import { DateTime } from 'luxon';
import { useDispatch } from 'react-redux';
import { fetchData } from '../../../../hooks/FetchHistory'
import AnalyzerService from '../../../../services/Analyzer.service';
import { Tooltip } from '@mui/material';
import NotificationService from '../../../../services/notification.service';
import MarkdownRenderer from '../../../../components/ui/MarkdownRenderer';

function ListItem({
    uuid,
    title,
    translation,
    translateid,
    time,
    actionButtons,
    isArchived
}: ListItemModels) {
    const [showaction, setShowAction] = useState(0);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleHover = () => {
        setShowAction(1);
    };

    const handleHoverOut = () => {
        setShowAction(0);
    };

    const handleItemClick = () => {
        router.replace(`/history/${uuid}`);
    };

    const handleArchive = async (e, uuid) => {
        e.stopPropagation();
        try {
            await AnalyzerService.bookMarkAnalysis(uuid)
            fetchData(dispatch)
            NotificationService.success({
                message: 'Operation successful'
            })
        }
        catch (error) {
            NotificationService.error({
                message: 'Operation unsuccessful'
            })
            console.log(error)
        }
    };

    const handleDelete = async (e, uuid) => {
        e.stopPropagation();
        try {
            await AnalyzerService.deleteAnalysis(uuid)
            await AnalyzerService.getAnalyzerHistory()
            fetchData(dispatch)
            NotificationService.success({
                message: 'Operation Successful'
            })
        } catch (error) {
            NotificationService.error({
                message: 'Operation Unsuccessful'
            })
            console.log(error)
        }

    };

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Get user's time zone
    const parsedDate = DateTime.fromISO(`${time}`, { zone: userTimeZone }); // Convert UTC date to user's local time zone
    const formattedDate = parsedDate.toFormat('yyyy-MM-dd HH:mm'); // Format the parsed date

    return (
        <div
            onClick={handleItemClick}
            onMouseOut={handleHoverOut}
            onMouseOver={handleHover}
            className={
                'text-[14px] flex items-center text-gray-500 hover:text-gray-400 hover:bg-sirp-primaryLess2 p-2 cursor-pointer rounded-lg hover:rounded-none hover:shadow justify-between'
            }
        >
            <div className="flex gap-3 items-center  hover:text-gray-400">
                {/* Save icon */}
                <Tooltip title={isArchived ? "Remove from bookmark" : "Save to bookmark"}>
                    <Image
                        src={
                            isArchived
                                ? require(`../../../../../public/icons/on.saved.svg`)
                                : require(`../../../../../public/icons/saved.svg`)
                        }
                        alt="documents"
                        className="cursor-pointer w-4 h-4"
                        width={10}
                        height={10}
                        onClick={(e) => handleArchive(e, translateid)}
                    />
                </Tooltip>
                {/* name */}
                {/* <p className="text-sirp-black-500 ml-2 md:w-[20rem] hover:text-gray-500"> */}
                    {/* {useTruncate(title, 20)} */}
                {/* </p> */}
                <MarkdownRenderer
                    content={`${title}`}
                    className="text-[14px] text-justify pl-10 pb-1 leading-8 break-normal"
                />
            </div>
            {showaction === 0 ? (
                <div className="md:w-[23rem] hidden md:block">
                    {/* <p className="text-gray-400 border-l-2 pl-2 ">{useTruncate(translation, 20)}</p> */}
                    <MarkdownRenderer
                        content={`${translation}`}
                        className="text-[14px] text-justify pl-10 pb-1 leading-8 break-normal"
                    />
                </div>

            ) : null}
            {/* time */}
            <div className="flex w-[8rem] mr-[3rem] md:mr-[5rem]">
                <p>{formattedDate}</p>
            </div>
            {/* overflow buttons */}
            {showaction === 1 && (
                <div className="border-l-2" onClick={(e) => handleDelete(e, translateid)}>
                    {actionButtons}
                </div>
            )}
        </div>
    );
}

export default ListItem;