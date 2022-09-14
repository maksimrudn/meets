import React, { Component, useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';

import ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom'

import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import $ from 'jquery';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment-timezone';

// DataTable css
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.min.css';

// DataTable js
import 'datatables.net/js/jquery.dataTables.min.js';
import 'datatables.net-responsive/js/dataTables.responsive.min.js';
import eventService from 'api/EventService';

import EventEditorModal from 'modules/entities/event/EventEditorModal';
import AppConfig from '../../../common/AppConfig';
import { getAvatarPathForUser } from '../../../common/Utils';

import * as Cookie from 'js-cookie';
import Participants from '../Participants';
import './OwnEventsDataTable.scss'


export default function OwnEventsTable(): JSX.Element {
    let history = useHistory();

    const [editEventId, setEditEventId]: any = useState(null);
    const [showEventEditModal, setShowEventEditModal]: any = useState(false);

    let table: any = null;

    useEffect(() => {
        $(document).ready(function () {
            table = $('#eventsTable').DataTable({
                responsive: true,
                "paging": true,
                "ordering": true,
                "lengthMenu": [10, 20, 30],
                processing: true,
                serverSide: true, // это важно!
                "ajax": {
                    "url": '/api/Event/OwnListDataTable',
                    "type": 'POST',
                    "beforeSend": function (req: any) {
                        req.setRequestHeader('Authorization', 'Bearer  ' + Cookie.get('access_token'))
                    },
                    "error": function (err: any) {
                        NotificationManager.error(err.name, err.message);
                    }
                },
                "columns": [
                    {
                        "data": "id",
                        "name": "Id",
                    },
                    // creator avatar
                    {
                        "data": null,
                        orderable: false,
                        "render": function (data: any, type: any, full: any, meta: any) {
                            return (`
                                    <img src="${getAvatarPathForUser(data.creator)}" class="avatar bg-transparent rounded-circle sm" alt="user" />
                                `);
                        }
                    },
                    {
                        "name": "Title",
                        "className": 'text-sm-fix text-lg-fix',
                        "data": null,
                        "render": function (data: any, type: any, full: any, meta: any) {
                            return (`
                                    <a href="#" data-eventid="${data.id}" class="fw-bold toDetails">${data.title}</a>
                                `);
                        }
                    },
                    {
                        "name": "StartDate",
                        "data": null,
                        "render": function (data: any, type: any, full: any, meta: any) {
                            return (`
                                    <div class="d-flex align-items-center">
                                        <i class="icofont-ui-calendar"></i>
                                        <span class="ms-2">${moment(data.startDate).format('DD-MM-YYYY')}</span>
                                    </div>
                                `);
                        }
                    },
                    // время из даты начала берется
                    {
                        "name": "StartDate",
                        "data": null,
                        "render": function (data: any, type: any, full: any, meta: any) {
                            return (`
                                    <div class="d-flex align-items-center">
                                        <i class="icofont-ui-calendar"></i>
                                        <span class="ms-2">${moment(data.startDate).format('HH:mm')}</span>
                                    </div>
                                `);
                        }
                    },
                    // status
                    {
                        "data": null,
                        orderable: false,
                        "render": function (data: any, type: any, full: any, meta: any) {
                            return (`
                                    <div></div>
                                `);
                        }
                    },
                    {
                        "name": "Participants",
                        "data": null,
                        orderable: false,
                    },
                    // Actions
                    {
                        "data": null,
                        orderable: false,
                        "render": function (data: any, type: any, full: any, meta: any) {
                            return (`
                                    <button
                                        class="btn btn-warning"
                                        data-eventid="${data.id}"
                                        onClick="handleEditClick(e)"
                                    ><i class="icofont-edit text-white"></i></button>
                                `);
                        }
                    },
                    //организатор event.creator.fullNAme
                    {
                        "data": "creator.fullName",
                    },
                    // event.place.title
                    {
                        "data": null,
                        "render": function (data: any, type: any, full: any, meta: any) {
                            return data.place?.title ?? '';
                        }
                    },
                    {
                        "name": "City",
                        "data": null,
                        "render": function (data: any, type: any, full: any, meta: any) {
                            return data.city ?? '';
                        }
                    },
                    {
                        "name": "Price",
                        "data": null,
                        "render": function (data: any, type: any, full: any, meta: any) {
                            return data.price ?? '';
                        }
                    },
                    {
                        "name": "MaxPeopleCount",
                        "data": "maxPeopleCount",
                    },
                    //event.participations.length
                    {
                        "data": "participations.length",
                    },
                ],
                columnDefs: [
                    {
                        targets: [6],
                        "createdCell": function (td: any, cellData: any, rowData: any, row: any, col: any) {
                            ReactDOM.render(<Participants participations={cellData.participations} history={history} />, td);
                        }
                    }
                ],
                "language": {
                    "lengthMenu": "Показать _MENU_ записей",
                    "search": "Поиск:",
                    "info": "Страница _PAGE_ из _PAGES_",
                    "zeroRecords": "Ничего не найдено",
                    "infoEmpty": "Нет данных",
                    "paginate": {
                        "next": "След.",
                        "previous": "Пред."
                    }
                }
            });

            // эта кнопка открывает модалку
            $('#eventsTable tbody').on('click', 'td button', handleEditClick);

            //ссылка на страницу details для события
            $('#eventsTable tbody').on('click', 'td .toDetails', eventDetailsClick);
        });
    }, []);


    const handleEditClick = (e: any) => {
        var id = e.currentTarget.getAttribute("data-eventid");
        setEditEventId(id);
        setShowEventEditModal(true);
    }

    const eventDetailsClick = (e: any) => {
        e.preventDefault();
        let id = e.currentTarget.getAttribute("data-eventid");
        history.push(`/event/details/${id}`);
    }

    const showEventEditModalToggle = (renewEvents: any) => {
        setShowEventEditModal(!showEventEditModal);
        if (renewEvents === true) {
            // перезагрузка запроса таблицы, если событие было изменено
            $('#eventsTable').DataTable().ajax.reload();
        }
    }

    return (
        <>
            <table id="eventsTable" className="display nowrap" style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Фото</th>
                        <th>Название</th>
                        <th>Дата начала</th>
                        <th>Время начала</th>
                        <th> </th>
                        <th>Участники</th>
                        <th>Действия</th>
                        <th>Оганизатор</th>
                        <th>Место</th>
                        <th>Город</th>
                        <th>Цена</th>
                        <th>Макс.чел.</th>
                        <th>Посетители</th>
                    </tr>
                </thead>

            </table>
            {
                showEventEditModal &&
                <EventEditorModal
                    isOpen={showEventEditModal}
                    toggle={showEventEditModalToggle}
                    eventId={editEventId}
                />
            }
        </>
    );

}
