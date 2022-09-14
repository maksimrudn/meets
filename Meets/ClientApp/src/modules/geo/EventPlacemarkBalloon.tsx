import React, { useEffect } from 'react';
import { useState } from 'react';
import Moment from 'react-moment';
import 'moment-timezone';
import 'moment/locale/ru';
import moment from 'moment-timezone';
import participationService from '../../api/ParticipationService';
import eventService from '../../api/EventService';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import './EventPlacemarkBalloon.scss';
import EventDTO from '../../contracts/EventDTO';
import UserAuthInfo from '../../contracts/UserAuthInfo';
import { IMainProps } from '../../common/IMainProps';
import ParticipationRequestDTO from '../../contracts/participations/ParticipationRequestDTO';


export interface IEventPlacemarkBalloonProps extends IMainProps {
    event: EventDTO
}

export default function EventPlacemarkBalloon(props: IEventPlacemarkBalloonProps) {
    const [event, setEvent] = useState<EventDTO>(props.event);

    const onParticipate = (e: any) => {
        e.preventDefault();

        var data = new ParticipationRequestDTO();
        data.eventId = event.id;

        try {
            participationService.Add(data);

            let ev: any = eventService.get(event.id);
            setEvent(ev);
        } catch (err: any) {
            NotificationManager.error(err.message, err.name);
        }
    }

    const onCancelParticipate = (e: any) => {
        e.preventDefault();

        var data = new ParticipationRequestDTO();
        data.eventId = event.id;

        try {
            participationService.Delete(data);

            let ev: any = eventService.get(event.id);
            setEvent(ev);
        } catch (err: any) {
            NotificationManager.error(err.message, err.name);
        }
    }

    return (
        <div className="event-placemark-balloon d-flex flex-column row gy-2">
            <NotificationContainer />
            {(event && props.history && props.userInfo) &&
                <>
                    <div className="d-flex flex-row align-items-center">

                        <i className="icofont-ui-calendar "></i>
                        <span className="ms-1">
                            <Moment date={event.startDate} format="DD.MM" />
                        </span>
                        <span>
                            (<Moment date={event.startDate} format="ddd" />)
                        </span>
                        {moment(event.startDate).format("HH:mm") != "00:00" &&
                            <>
                                <i className="icofont-clock-time ms-2"></i>
                                <span className="ms-1"><Moment date={event.startDate} format="HH:mm" /></span>
                            </>
                        }

                    </div>
                    <div className="d-flex flex-row align-items-center justify-content-between">
                        <div className="fw-bold fs-6 d-inline-block" onClick={() => props.history && props.history.push(`/event/Details/${event.id}`)}>{event.title}</div>
                    </div>
                    {event.place &&
                        <div className="d-flex flex-row align-items-center justify-content-between">
                            <div className="fw-bold fs-6 d-inline-block text-muted" onClick={() => props.history && props.history.push(`/place/Details/${event.place.id}`)} >{event.place.title}</div>
                        </div>
                    }
                    <div className="d-flex flex-row align-items-center justify-content-start">
                        {event.tags && event.tags.map((tag: string) =>
                            <span key={tag} className="badge bg-secondary me-1">{tag}</span>
                        )}
                    </div>
                    <div className="d-flex flex-row align-items-center justify-content-start">
                        {event.price
                            ? <>
                                <i className="icofont-rouble"></i>
                                <span className="ms-2">{event.price}</span>
                            </>
                            :
                            <>
                                <i className="icofont-rouble"></i>
                                <span className="ms-2">{event.price === 0 ? "FREE" : "Не известно"}</span>
                            </>
                        }
                    </div>
                    <div className="d-flex flex-row align-items-center justify-content-start">
                        {props.userInfo.isAuthenticated &&
                            <>
                                {!event.isParticipant
                                    ? <button type="button" className="btn btn-primary" onClick={onParticipate} >Пойти</button>
                                    : <button type="button" className="btn btn-secondary" onClick={onCancelParticipate}>Не пойду</button>
                                }
                            </>
                        }
                    </div>
                </>
            }
        </div>
    );
}