import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Routes from '../../common/Routes';
import { RootState, useAppDispatch } from '../../store/createStore';
import { updateTimeTable } from '../../store/timetable';
import WaitingScreen from '../common/WaitingScreen';
import _ from 'lodash';
import GoBackIcon from '../../icons/GoBackIcon';
import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/ru';

import './TimeTable.scss';
import useTimeTableStore from '../../hooks/useTimeTableStore';

export default function TimeTable() {
    moment.locale('ru');

    const history = useHistory();

    const timetableStore = useTimeTableStore();

    useEffect(() => {
        const update = async () => {
            try {
                await timetableStore.update();
            } catch (err) {
                history.push(Routes.Error, err);
            }
        }

        update();
    }, []);

    const compareDates = (date: string) => {
        if (date === moment().format('DD MMMM YYYY')) {
            return 'Сегодня';
        } else if (date === moment().add(-1, 'days').format('DD MMMM YYYY')) {
            return 'Вчера';
        } else {
            return date;
        }
    }

    const sortedTimeTable = (timetableStore.timeTable && timetableStore.timeTable.length > 0) && _.sortBy(timetableStore.timeTable, (item) => (moment(item.meetingDate).format('DD MMMM YYYY')));
    const groupedTimeTable = sortedTimeTable && _.groupBy(sortedTimeTable, (item) => (moment(item.meetingDate).format('DD MMMM YYYY')));

    return timetableStore.isLoading ? (
        <WaitingScreen />
    ) : (
        <div className="TimeTable">
                <div className="Header">
                    <span className="GoBackBtn" onClick={() => history.goBack()}><GoBackIcon /></span>
                    <span className="Title">Schedule</span>
                    <span></span>
                </div>

                <div className="Content">
                    {groupedTimeTable && Object.entries(groupedTimeTable).map(([key, value]) =>
                        <div className="DateBlock" key={key}>
                            <div className="Title">{compareDates(key)}</div>
                            {value && value.map((item) =>
                                <div className="Item" key={item.id}>
                                    <div className="card px-3 py-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <Link
                                                to={location => ({
                                                    ...location,
                                                    pathname: Routes.MeetingBuild(item.companionId),
                                                    state: {
                                                        meetingId: item.meetingId
                                                    }
                                                })}
                                                className="Name"
                                            >
                                                {item.companion.fullName}
                                            </Link>
                                            <div className="Time">{moment(item.meetingDate).format('HH:mm')}</div>
                                        </div>
                                        <div className="Place">{item.place}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
        </div>
    );
}