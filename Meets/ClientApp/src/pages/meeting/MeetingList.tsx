import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import meetingsService from '../../api/MeetingsService';
import Routes from '../../common/Routes';
import { getAvatarPathForUser } from '../../common/Utils';
import MeetingDTO from '../../contracts/meeting/MeetingDTO';
import UserAuthInfo from '../../contracts/UserAuthInfo';
import EmptyAvatarIcon from '../../icons/EmptyAvatarIcon';
import GoBackIcon from '../../icons/GoBackIcon';
import MeetingIcon from '../../icons/MeetingIcon';
import SwiperTabs from '../../modules/tabs/SwiperTabs';
import mapDispatchToProps from '../../store/mapDispatchToProps';
import mapStateToProps from '../../store/mapStateToProps';
import { connect } from 'react-redux';
import moment from 'moment';

import './MeetingList.scss';
import AccessTimeIcon from '../../icons/AccessTimeIcon';
import CalendarAltIcon from '../../icons/CalendarAltIcon';
import CommentIcon from '../../icons/CommentIcon';
import { MeetingListTabs } from '../../common/MeetingListTabs';
import { MeetingStatus, MeetingStatusItems } from '../../common/MeetingStatus';

interface IMeetingsListProps {
    userInfo: UserAuthInfo
}

function MeetingList(props: IMeetingsListProps) {
    const history = useHistory();

    const [selectedTab, setSelectedTab] = useState<string>(MeetingListTabs.Inbox);
    const [meetings, setMeetings] = useState<MeetingDTO[]>([]);

    useEffect(() => {
        try {
            let meetings = meetingsService.getList();
            setMeetings(meetings);
        } catch (err) {
            history.push(Routes.Error, err);
        }
    }, []);

    return (
        <div className="MeetingList">

            <div className="Header">
                <span className="GoBackBtn" onClick={()=>history.goBack()}><GoBackIcon /></span>
                <span className="Title">Встречи</span>
                <span className="MeetingBtn"><MeetingIcon /></span>
            </div>

            <div className="TabsToggle">
                <SwiperTabs
                    tabs={Object.values(MeetingListTabs)}
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                />
            </div>

            <div className="Tabs">
                {(() => {
                    switch (selectedTab) {
                        case MeetingListTabs.Outbox:
                            return meetings && meetings.filter((item: MeetingDTO) => item.ownerId === props.userInfo.user.id).map((item: MeetingDTO) =>
                                <div className="Item d-inline-flex justify-content-sm-between justify-content-lg-evenly align-items-center">
                                    <div className="Avatar">
                                        {item.target.avatar
                                            ? (<div className="Content"><img src={getAvatarPathForUser(item.target)} alt="" /></div>)
                                            : (<div className="Empty"><EmptyAvatarIcon /></div>)
                                        }
                                    </div>
                                    <div className="Data">
                                        <div className="Name">{item.target.fullName}</div>
                                        <div className="Time">
                                            <span className="me-2"><AccessTimeIcon /></span>
                                            <span className="">{moment(item.meetingDate).format('HH:mm')}</span>
                                        </div>
                                        <div className="Date">
                                            <span className="me-2"><CalendarAltIcon /></span>
                                            <span className="">{moment(item.meetingDate).format('DD MMMM, YYYY')} ({moment(item.meetingDate).format('ddd')})</span>
                                        </div>
                                        <div className="Status">{MeetingStatus[item.status as MeetingStatusItems].Title}</div>
                                        <div className="Counters">
                                            {(item.status === MeetingStatus.Discussion.Code || item.status === MeetingStatus.Canceled.Code) &&
                                                <>
                                                    <span className="Icon"><CommentIcon /></span>
                                                    <span className="Count">{item.messageCount}</span>
                                                </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            );
                        case MeetingListTabs.Inbox:
                            return meetings && meetings.filter((item: MeetingDTO) => item.targetId === props.userInfo.user.id).map((item: MeetingDTO) =>
                                <div className="Item d-inline-flex justify-content-sm-between justify-content-lg-evenly align-items-center">
                                    <div className="Avatar">
                                        {item.owner.avatar
                                            ? (<div className="Content"><img src={getAvatarPathForUser(item.owner)} alt="" /></div>)
                                            : (<div className="Empty"><EmptyAvatarIcon /></div>)
                                        }
                                    </div>
                                    <div className="Data">
                                        <div className="Name">{item.owner.fullName}</div>
                                        <div className="Time">
                                            <span className="me-2"><AccessTimeIcon /></span>
                                            <span className="">{moment(item.meetingDate).format('HH:mm')}</span>
                                        </div>
                                        <div className="Date">
                                            <span className="me-2"><CalendarAltIcon /></span>
                                            <span className="">{moment(item.meetingDate).format('DD MMMM, YYYY')} ({moment(item.meetingDate).format('ddd')})</span>
                                        </div>
                                        <div className="Status">{MeetingStatus[item.status as MeetingStatusItems].Title}</div>
                                        <div className="Counters">
                                            {(item.status === MeetingStatus.Discussion.Code || item.status === MeetingStatus.Canceled.Code) &&
                                                <>
                                                    <span className="Icon"><CommentIcon /></span>
                                                    <span className="Count">{item.messageCount}</span>
                                                </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            );
                    }
                })()}
            </div>

        </div>
    );
}

export default connect(mapStateToProps("MeetingList"), mapDispatchToProps("MeetingList"))(MeetingList);