import React, { Component, useEffect, useRef, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
//import Moment from 'react-moment';
import moment from 'moment';
import 'moment-timezone';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

//import { scrollIntoView } from 'scroll-polyfill';

import ReactDOM from 'react-dom';

//import userService from '../../api/UserService';
//import friendRequestServie from '../../api/FriendRequestService';
import participationService from '../../../api/ParticipationService';
//import CommentTargetType from '../../common/CommentTargetType';
//import Comments from '../../modules/comments/Comments';
//import { Helmet } from 'react-helmet';
//import AppConfig from '../../common/AppConfig';
import { getAvatarPathForUser } from '../../../common/Utils';
//import YMapsGeoViewer from '../../modules/geo/YMapsGeoViewer';
import Participants from '../Participants';
import $ from 'jquery';

// DataTable css
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.min.css';

// DataTable js
import 'datatables.net/js/jquery.dataTables.min.js';
import 'datatables.net-responsive/js/dataTables.responsive.min.js';

// datatables buttons
import 'datatables.net-buttons/js/dataTables.buttons.min.js'
import EventEditorModal from '../../entities/event/EventEditorModal';

import './UserEventsDataTable.scss';



interface UserEventsDataTableProps {
    userInfo: any,
    userId: any
}

export default function UserEventsDataTable({ userInfo, userId }: UserEventsDataTableProps): JSX.Element {
    let history = useHistory();

    const [editEventId, setEditEventId] = useState(null);
    const [showEventEditModal, setShowEventEditModal] = useState(false);

    let table: any = null;

    let organizes = false;
    let goes = false;
    let past = false;

    useEffect(() => {
        $(document).ready(function () {
            if (table !== null) {
                table.clear()
                table.destroy();
                table = null;
            }

            initTable();
        });
    }, [userId])

    const initTable = () => {
        table = $('#eventsTable').DataTable({
            responsive: { // - отвечает за возможность свернуть/развернуть строку таблицы
                details: { // - эта настройка нужна для корректного рендеринга компонента Participants как свернутом, так и в развернутом режиме
                    renderer: $.fn.dataTable.Responsive.renderer.listHiddenNodes()
                }
            },
            /*
             * root, dom архитектура таблицы
             * необходимо для отображения кастомных компонентов
             * 
             * l - меню количества строк таблицы (10, 20, ...)
             * B - кнопки
             * f - поиск 
             * r - элемент загрузки
             * t - сама таблица
             * i - инфо компонент 'Страница _PAGE_ из _PAGES_'
             * p - элемент пагинации
             * 
             * ! регистр важен
             * */
            dom: "<'d-flex flex-wrap justify-content-center justify-content-md-between'fBl>" + 'rtip',
            "buttons": [
                {
                    "text": 'Организует',
                    "className": 'btn btn-secondary filter-btn',
                    "action": function (e: any, dt: any, node: any, config: any) {
                        if (node[0].classList.contains('btn-secondary')) {
                            node[0].classList.remove('btn-secondary');
                            node[0].classList.add('btn-danger');
                        } else {
                            node[0].classList.remove('btn-danger');
                            node[0].classList.add('btn-secondary');
                        }
                        organizes = !organizes;
                        dt.ajax.reload();
                    }
                },
                {
                    "text": 'Идет',
                    "className": 'btn btn-secondary filter-btn',
                    "action": function (e: any, dt: any, node: any, config: any) {
                        if (node[0].classList.contains('btn-secondary')) {
                            node[0].classList.remove('btn-secondary');
                            node[0].classList.add('btn-danger');
                        } else {
                            node[0].classList.remove('btn-danger');
                            node[0].classList.add('btn-secondary');
                        }
                        goes = !goes;
                        dt.ajax.reload();
                    }
                },
                {
                    "text": 'Включая прошедшие',
                    "className": 'btn btn-secondary filter-btn',
                    "action": function (e: any, dt: any, node: any, config: any) {
                        if (node[0].classList.contains('btn-secondary')) {
                            node[0].classList.remove('btn-secondary');
                            node[0].classList.add('btn-danger');
                        } else {
                            node[0].classList.remove('btn-danger');
                            node[0].classList.add('btn-secondary');
                        }
                        past = !past;
                        dt.ajax.reload();
                    }
                }
            ],
            "paging": true,
            "ordering": true,
            "lengthMenu": [10, 20, 30],
            processing: true,
            serverSide: true, // это важно!
            "destroy": true,
            "ajax": {
                "url": '/api/Event/GetListForUserDataTable',
                "type": 'POST',
                /**
                 * для того чтобы передать новые данные при перезагрузке запроса, надо использовать функцию
                 * функция принимает параметр d - значения которого изменяются
                 * 
                 *  ! d - обязательное название параметра
                 */
                "data": function (d: any) {
                    d.userId = userId;
                    d.organizes = organizes;
                    d.goes = goes;
                    d.past = past;
                },
                "error": function (response: any, err: any) {
                    NotificationManager.error(err.name, err.message);
                }
                //    "beforeSend": function (req) {
                //        req.setRequestHeader('Authorization', 'Bearer  ' + Cookie.get('access_token'))
                //    }
            },
            "columns": [
                {
                    "data": "id",
                    "name": "Id",
                    "maxWidth": 50
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
                    "render": function (data: any, type: any, full: any, meta: any) {//?.slice(0, 55)
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
                            <div class="btn-group" role="group" aria-label="Basic outlined example">
                                ${!data.participations.some((part: any) => part.participantId == userInfo.user.id)
                                    ? `<button type="button" data-eventid="${data.id}" class="btn btn-outline-secondary toParticipate"><i class="icofont-runner text-success"></i></button>`
                                    : `<button type="button" data-eventid="${data.id}" class="btn btn-outline-secondary toCancelParticipation"><i class="icofont-runner text-danger"></i></button>`
                                }
                                <button type="button" data-eventid="${data.id}" class="btn btn-outline-secondary modalOpener"><i class="icofont-edit"></i></button>
                            </div>
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
                    targets: [6, 7],
                    //className: 'dt-body-right',
                    "createdCell": function (td: any, cellData: any, rowData: any, row: any, col: any) {
                        if (col === 6) {
                            ReactDOM.render(<Participants participations={cellData.participations} history={history} />, td);
                        }
                    //    else if (col === 7) {
                    //        ReactDOM.render(<DataTableActions participations={cellData.participations} userInfo={userInfo} eventId={cellData.id} ajax={table.ajax} />, td);
                    //    }
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
        $('#eventsTable tbody').on('click', '.modalOpener', handleEditClick);

        // кнопки пойду / не пойду
        $('#eventsTable tbody').on('click', '.toParticipate', toParticipate);
        $('#eventsTable tbody').on('click', '.toCancelParticipation', toCancelParticipation);

        $('.dt-buttons').addClass('flex-sm-column');
    }

    const toParticipate = (e: any) => {
        e.preventDefault();
        let id = e.currentTarget.getAttribute("data-eventid");

        try {
            participationService.Add({ eventId: id });
            table.ajax.reload();
        } catch (err: any) {
            NotificationManager.error(err.message, err.name)
        }
    }

    const toCancelParticipation = (e: any) => {
        e.preventDefault();
        let id = e.currentTarget.getAttribute("data-eventid");

        try {
            participationService.Delete({ eventId: id });
            table.ajax.reload();
        } catch (err: any) {
            NotificationManager.error(err.message, err.name)
        }
    }

    const handleEditClick = (e: any) => {
        var id = e.currentTarget.getAttribute("data-eventid");
        setEditEventId(id);
        setShowEventEditModal(true);
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
            <div className="row">
                <div className="col-md-12">
                    <div className="row g-3">
                        <table id="eventsTable" className="display nowrap" style={{ width: '100%' }}>
                            <thead style={{ width: '100%' }}>
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
                        {showEventEditModal &&
                            <EventEditorModal
                                isOpen={showEventEditModal}
                                toggle={showEventEditModalToggle}
                                eventId={editEventId}
                            />
                        }
                    </div>
                </div>
            </div>
        </>
    );
}
