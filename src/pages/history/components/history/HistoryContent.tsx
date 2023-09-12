import React, {useEffect} from 'react';
import DeleteIcon from './deleteIcon';
import ListItem from './HistoryListItem';
import NoHistory from './NoHistory';
import { useSelector } from 'react-redux';

function HistoryContent() {
    const { history } = useSelector((state: any) => state.analyze)
     
    return (
        <div>
            {history.length > 0 ? (
                <>
                    {history?.map(item => {
                        return (
                            <div key={item.translationUuid} className='"bg-sirp-listBg border h-[100%] w-[100%] md:mx-2 mx-2 my-1 rounded-[1rem]'>
                                <ListItem
                                    uuid={item?.analysisUuid}
                                    translateid={item?.uuid}
                                    title={item?.analysis?.title} // Pass the title
                                    translation={item?.analysis?.title} // Pass the summary
                                    time={item?.createdAt}
                                    isArchived={item?.bookmark} // Pass the isArchived value
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
}

export default HistoryContent;