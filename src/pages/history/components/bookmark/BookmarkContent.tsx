import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setHistory, setBookmark } from '../../../../redux/reducer/analyzerSlice';
import AnalyzerService from '../../../../services/Analyzer.service';
import NotificationService from '../../../../services/notification.service';
import Table from '../../../../components/ui/Table';
import DeleteIcon from './deleteIcon';
import BookmarkListItem from './BookmarkListItem';
import NoHistory from './NoHistory';

/**
 * BookmarkContent component displays the user's bookmarked analyses using a table view
 * with pagination and actions
 * @returns {JSX.Element} The rendered BookmarkContent component
 */
function BookmarkContent() {
    const { bookmark } = useSelector((state: any) => state.analyze);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0); // Start from 0 for MUI pagination
    const dispatch = useDispatch();

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Handle unbookmark action
    const handleUnbookmark = async (uuid: string) => {
        try {
            setLoading(true);
            await AnalyzerService.bookMarkAnalysis(uuid);
            // Fetch updated history data
            const historyData = await AnalyzerService.getAnalyzerHistory(currentPage + 1);
            dispatch(setHistory(historyData?.data));
            // Update bookmark state
            const updatedBookmarks = bookmark.filter(item => item.analysisUuid !== uuid);
            dispatch(setBookmark(updatedBookmarks));
            NotificationService.success({
                message: 'Removed from bookmarks'
            });
        } catch (error) {
            NotificationService.error({
                message: 'Failed to remove bookmark'
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Handle delete action
    const handleDelete = async (uuid: string) => {
        try {
            setLoading(true);
            await AnalyzerService.deleteAnalysis(uuid);
            const historyData = await AnalyzerService.getAnalyzerHistory(currentPage + 1);
            dispatch(setHistory(historyData?.data));
            // Update bookmark state after deletion
            const updatedBookmarks = bookmark.filter(item => item.analysisUuid !== uuid);
            dispatch(setBookmark(updatedBookmarks));
            NotificationService.success({
                message: 'Operation Successful'
            });
        } catch (error) {
            NotificationService.error({
                message: 'Operation Unsuccessful'
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate pagination
    const itemsPerPage = 10;
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = bookmark?.slice(startIndex, endIndex) || [];

    // Transform bookmark data for Table component
    const tableData = paginatedData.map(item => ({
        uuid: item?.uuid,
        title: item?.analysis?.title || 'No title',
        content5wh: item?.analysis?.assessment || '',
        createdAt: item?.createdAt,
        isBookmarked: true, // Always true for bookmarks
        onBookmark: handleUnbookmark, // Use unbookmark handler for bookmark action
        onDelete: handleDelete
    })) || [];

    return (
        <div className="px-4">
            <Table
                data={tableData}
                totalItems={bookmark?.length || 0}
                page={currentPage}
                loading={loading}
                onPageChange={handlePageChange}
                isBookmarkView={true}
            />
        </div>
    );
}

// Comment out existing implementation for reference
/*
    return (
        <div>
            {bookmark?.length > 0 ? (
                <>
                    {bookmark?.map(item => {
                        return (
                            <div key={item.translationUuid} className='"bg-sirp-listBg border h-[100%] w-[100%] md:mx-2 mx-2 my-1 rounded-[1rem]'>
                                <BookmarkListItem
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
                </>
            ) : (
                <>
                    <NoHistory />
                </>
            )}
        </div>
    );
*/

export default BookmarkContent;