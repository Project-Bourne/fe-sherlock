import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setHistory, updatePagination } from '../../../../redux/reducer/analyzerSlice';
import AnalyzerService from '../../../../services/Analyzer.service';
import NotificationService from '../../../../services/notification.service';
import Table from '../../../../components/ui/Table';

/**
 * HistoryContent component displays the user's analysis history using a table view
 * with pagination and actions like bookmark and delete
 * @returns {JSX.Element} The rendered HistoryContent component
 */
function HistoryContent() {
    const { history } = useSelector((state: any) => state?.analyze);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0); // Start from 0 for MUI pagination
    const dispatch = useDispatch();

    // Handle page change in pagination
    const handlePageChange = async (page: number) => {
        setLoading(true);
        try {
            setCurrentPage(page);
            dispatch(updatePagination({ currentPage: page }));
            // Add 1 to page since API uses 1-based indexing but MUI uses 0-based
            const data = await AnalyzerService.getAnalyzerHistory(page + 1);
            dispatch(setHistory(data?.data));
        } catch (error) {
            console.error('Error fetching history:', error);
            NotificationService.error({
                message: 'Failed to fetch history',
                addedText: <p>Please try again later</p>,
            });
        }
        setLoading(false);
    };

    // Handle bookmark action
    const handleBookmark = async (uuid: string) => {
        try {
            await AnalyzerService.bookMarkAnalysis(uuid);
            const data = await AnalyzerService.getAnalyzerHistory(currentPage + 1);
            dispatch(setHistory(data?.data));
            NotificationService.success({
                message: 'Operation successful'
            });
        } catch (error) {
            NotificationService.error({
                message: 'Operation unsuccessful'
            });
            console.error(error);
        }
    };

    // Handle delete action
    const handleDelete = async (uuid: string) => {
        try {
            await AnalyzerService.deleteAnalysis(uuid);
            const data = await AnalyzerService.getAnalyzerHistory(currentPage + 1);
            dispatch(setHistory(data?.data));
            NotificationService.success({
                message: 'Operation Successful'
            });
        } catch (error) {
            NotificationService.error({
                message: 'Operation Unsuccessful'
            });
            console.error(error);
        }
    };

    // Transform history data for Table component
    const tableData = history?.summary?.map(item => ({
        uuid: item?.uuid,
        title: item?.analysis?.title || 'No title',
        content5wh: item?.analysis?.assessment || '',
        createdAt: item?.createdAt,
        isBookmarked: item?.bookmark,
        onBookmark: handleBookmark,
        onDelete: handleDelete
    })) || [];

    return (
        <div className="px-4">
            <Table
                data={tableData}
                totalItems={history?.totalItems || 0}
                page={currentPage}
                loading={loading}
                onPageChange={handlePageChange}
                isBookmarkView={false}
            />
        </div>
    );
}

// Comment out existing implementation for reference
/*
    return (
        <div>
            {loading &&
                <div className='fixed top-0 bottom-0 right-0 left-0  z-[1000000] flex items-center justify-center backdrop-blur-sm  bg-[#747474]/[0.1] backdrop-brightness-50'> 
                    <CircularProgress />
                </div>}
            {history?.summary?.length > 0 ? (
                <>
                    {history?.summary?.map(item => {
                        return (
                            <div key={item?.uuid || item?.analysisUuid} className="bg-sirp-listBg border h-[100%] w-[100%] md:mx-2 mx-2 my-1 rounded-[1rem]">
                                <ListItem
                                    uuid={item?.analysisUuid}
                                    translateid={item?.uuid}
                                    title={item?.analysis?.title}
                                    translation={item?.analysis?.title}
                                    time={item?.createdAt}
                                    isArchived={item?.bookmark}
                                    buttonType="action"
                                    actionButtons={<DeleteIcon doc={item?.title} />}
                                />
                            </div>
                        );
                    })}
                    <div className='w-full m-5 flex justify-end items-center'>
                        <Pagination
                            count={Math.ceil(history.totalItems / itemsPerPage)}
                            page={currentPage}
                            onChange={handlePageChange}
                            variant='outlined'
                            color='primary'
                        />
                    </div>
                </>
            ) : (
                <>
                    <NoHistory />
                </>
            )}
        </div>
    );
*/

export default HistoryContent;