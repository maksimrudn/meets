﻿import React, { Component, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import 'moment-timezone';


import { UserFieldNames } from '../../../common/UserFieldNames';

import UserPlusIcon from '../../../icons/UserPlusIcon';
import EditIcon from '../../../icons/EditIcon';
import BirthDateIconSvg from '../../../icons/BirthDateIconSvg';
import GrowthIconSvg from '../../../icons/GrowthIconSvg';
import WeightIconSvg from '../../../icons/WeightIconSvg';
import SwiperTabs from '../../../modules/tabs/SwiperTabs';

import './UserCardTabs.scss';
import PlusIcon from '../../../icons/PlusIcon';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import DateTime from 'react-date-time-new';
import 'react-date-time-new/css/react-datetime.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import learningService from '../../../api/LearningService';
import { Learning } from '../../../contracts/learning/Learning';
import CalendarAltIcon from '../../../icons/CalendarAltIcon';
import MenuCloseIcon from '../../../icons/MenuCloseIcon';
import ConfirmationModal from './ConfirmationModal';
import LearningEditorModal from '../learning/LearningEditorModal';
import { Work } from '../../../contracts/work/Work';
import workService from '../../../api/WorkService';
import CompanyIconSvg from '../../../icons/CompanyIconSvg';
import WorkEditorModal from '../work/WorkEditorModal';
import JobIcon from '../../../icons/JobIcon';
import { Activity } from '../../../contracts/activity/Activity';
import activityService from '../../../api/ActivityService';
import ActivityEditorModal from '../activity/ActivityEditorModal';
import { Fact } from '../../../contracts/fact/Fact';
import factService from '../../../api/FactService';
import FactEditorModal from '../fact/FactEditorModal';





interface UserCardTabsProps {
    tabs: any
    selectedTab: any
    setSelectedTab: any

    user: any
    userInfo: any
    onClickEditIcon: any


    updateUser: () => void

    learnings: Learning[]
    works: Work[]
    activities: Activity[]
    facts: Fact[]
}

export default function UserCardTabs(props: UserCardTabsProps) {
    const [isOpenLearningEditorModal, setIsLearningEditorModal] = useState(false);
    const [isOpenWorkEditorModal, setIsWorkEditorModal] = useState(false);
    const [isOpenActivityEditorModal, setIsActivityEditorModal] = useState(false);
    const [isOpenFactEditorModal, setIsFactEditorModal] = useState(false);

    const [isOpenRemoveLearningConfirmModal, setIsOpenRemoveLearningConfirmModal] = useState(false);
    const [isOpenRemoveWorkConfirmModal, setIsOpenRemoveWorkConfirmModal] = useState(false);
    const [isOpenRemoveActivityConfirmModal, setIsOpenRemoveActivityConfirmModal] = useState(false);
    const [isOpenRemoveFactConfirmModal, setIsOpenRemoveFactConfirmModal] = useState(false);

    const [learningId, setLearningId] = useState<string>('');
    const [workId, setWorkId] = useState<string>('');
    const [activityId, setActivityId] = useState<string>('');
    const [factId, setFactId] = useState<string>('');

    const learningEditorModalToggler = () => {
        setIsLearningEditorModal(!isOpenLearningEditorModal);
    }

    const workEditorModalToggler = () => {
        setIsWorkEditorModal(!isOpenWorkEditorModal);
    }

    const activityEditorModalToggler = () => {
        setIsActivityEditorModal(!isOpenActivityEditorModal);
    }

    const factEditorModalToggler = () => {
        setIsFactEditorModal(!isOpenFactEditorModal);
    }

    const editLearningOnClick = (learningId: string) => {
        setLearningId(learningId);
        learningEditorModalToggler();
    }

    const editWorkOnClick = (workId: string) => {
        setWorkId(workId);
        workEditorModalToggler();
    }

    const editActivityOnClick = (activityId: string) => {
        setActivityId(activityId);
        activityEditorModalToggler();
    }

    const editFactOnClick = (factId: string) => {
        setFactId(factId);
        factEditorModalToggler();
    }

    const removeLearningOnClick = (learningId: string) => {
        setLearningId(learningId);
        removeLearningConfirmModalToggler();
    }

    const removeWorkOnClick = (workId: string) => {
        setWorkId(workId);
        removeWorkConfirmModalToggler();
    }

    const removeActivityOnClick = (activityId: string) => {
        setActivityId(activityId);
        removeActivityConfirmModalToggler();
    }

    const removeFactOnClick = (factId: string) => {
        setFactId(factId);
        removeFactConfirmModalToggler();
    }

    const removeLearningConfirmModalToggler = () => {
        setIsOpenRemoveLearningConfirmModal(!isOpenRemoveLearningConfirmModal);
    }

    const removeWorkConfirmModalToggler = () => {
        setIsOpenRemoveWorkConfirmModal(!isOpenRemoveWorkConfirmModal);
    }

    const removeActivityConfirmModalToggler = () => {
        setIsOpenRemoveActivityConfirmModal(!isOpenRemoveActivityConfirmModal);
    }

    const removeFactConfirmModalToggler = () => {
        setIsOpenRemoveFactConfirmModal(!isOpenRemoveFactConfirmModal);
    }

    const removeLearning = () => {
        try {
            let formData = new FormData();
            formData.append('id', learningId);
            learningService.remove(formData);

            props.updateUser();
        } catch (err: any) {
            NotificationManager.error(err.message, err.name);
        }
    }

    const removeWork = () => {
        try {
            let formData = new FormData();
            formData.append('id', workId);
            workService.remove(formData);

            props.updateUser();
        } catch (err: any) {
            NotificationManager.error(err.message, err.name);
        }
    }

    const removeActivity = () => {
        try {
            let formData = new FormData();
            formData.append('id', activityId);
            activityService.remove(formData);

            props.updateUser();
        } catch (err: any) {
            NotificationManager.error(err.message, err.name);
        }
    }

    const removeFact = () => {
        try {
            let formData = new FormData();
            formData.append('id', factId);
            factService.remove(formData);

            props.updateUser();
        } catch (err: any) {
            NotificationManager.error(err.message, err.name);
        }
    }

    return (
        <div className="UserCardTabs">
            <div className="TabBtnsContainer">
                <SwiperTabs
                    tabs={[
                        {
                            title: props.tabs.Info,
                            count: 1
                        },
                        {
                            title: props.tabs.Learning,
                            count: props.learnings?.length
                        },
                        {
                            title: props.tabs.Work,
                            count: props.works?.length
                        },
                        {
                            title: props.tabs.Activity,
                            count: props.activities?.length
                        },
                        {
                            title: props.tabs.Facts,
                            count: props.facts?.length
                        }
                    ]}
                    selectedTab={props.selectedTab}
                    setSelectedTab={props.setSelectedTab}
                    user={props.user}
                    userInfo={props.userInfo}
                />
            </div>

            {(() => {
                switch (props.selectedTab) {
                    case props.tabs.Info:
                        return (
                            <div className="TabInfo">
                                <div className="Main mb-2">

                        <div className="d-flex justify-content-start mb-5">
                            <span className="fs-5 me-4">{props.user.description || 'О себе ничего не указано'}</span>
                            {(props.userInfo.user.id === props.user.id) &&
                                <span className="IconEdit" role="button" onClick={() => props.onClickEditIcon(UserFieldNames.Description)}><EditIcon /></span>
                            }
                        </div>

                                    <div className="d-flex justify-content-start align-items-center mb-5">
                                        <span className="IconBirthDate text-white me-2">
                                            <BirthDateIconSvg />
                                        </span>
                                        <span className="fs-5 me-4">{props.user.birthDate && (moment().diff(moment(props.user.birthDate), 'years')) + ' лет' || 'не указано'}</span>
                                        {(props.userInfo.user.id === props.user.id) &&
                                            <span className="IconEdit" role="button" onClick={() => props.onClickEditIcon(UserFieldNames.BirthDate)}><EditIcon /></span>
                                        }
                                    </div>

                                    <div className="d-flex justify-content-start align-items-center mb-5">
                                        <span className="IconCity text-white me-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="21.447" height="33.996" viewBox="0 0 21.447 33.996">
                                                <path id="Icon_metro-location" data-name="Icon metro-location" d="M16.257,1.392A10.223,10.223,0,0,0,6.034,11.616c0,10.223,10.223,22.492,10.223,22.492S26.481,21.839,26.481,11.616A10.223,10.223,0,0,0,16.257,1.392Zm0,16.485a6.262,6.262,0,1,1,6.262-6.262,6.262,6.262,0,0,1-6.262,6.262ZM12.3,11.616a3.962,3.962,0,1,1,3.962,3.962A3.962,3.962,0,0,1,12.3,11.616Z" transform="translate(-5.534 -0.892)" fill="#fff" stroke="rgba(0,0,0,0.2)" stroke-width="1" />
                                            </svg>
                                        </span>
                                        <span className="fs-5 me-4">{props.user.city || 'не указано'}</span>
                                        {(props.userInfo.user.id === props.user.id) &&
                                            <span className="IconEdit" role="button" onClick={() => props.onClickEditIcon(UserFieldNames.City)}><EditIcon /></span>
                                        }
                                    </div>

                                    <div className="d-flex justify-content-start align-items-center mb-5">
                                        <span className="IconGrowth text-white me-2">
                                            <GrowthIconSvg />
                                        </span>
                                        <span className="fs-5 me-4">{props.user.growth ? `${props.user.growth} см` : 'не указано'}</span>
                                        {(props.userInfo.user.id === props.user.id) &&
                                            <span className="IconEdit" role="button" onClick={() => props.onClickEditIcon(UserFieldNames.Growth)}><EditIcon /></span>
                                        }
                                    </div>

                                    <div className="d-flex justify-content-start align-items-center mb-4">
                                        <span className="IconWeight text-white me-2">
                                            <WeightIconSvg />
                                        </span>
                                        <span className="fs-5 me-4">{props.user.weight ? `${props.user.weight} кг` : 'не указано'}</span>
                                        {(props.userInfo.user.id === props.user.id) &&
                                            <span className="IconEdit" role="button" onClick={() => props.onClickEditIcon(UserFieldNames.Weight)}><EditIcon /></span>
                                        }
                                    </div>

                                </div>


                            </div>
                        );
                    case props.tabs.Learning:
                        if (props.user.id !== props.userInfo.user.id && !props.learnings?.length) return null;
                        return (
                            <div className="TabLearning">
                                <div className="Desc">Пройденные учебные курсы и события</div>

                                {props.learnings && props.learnings.map((learning: Learning) =>
                                    <div className="Item" key={learning.id}>
                                        <div className="Header">
                                            <div className={'d-flex ' + (learning.startDate && learning.endDate ? 'justify-content-between' : 'justify-content-end')}>
                                                <div className="d-flex align-items-center">
                                                    {learning.startDate && learning.endDate &&
                                                        <>
                                                            <span className="Calendar me-2"><CalendarAltIcon /></span>
                                                            <span className="Date">{moment(learning.startDate).format('DD.MM.YYYY') + ' - ' + moment(learning.endDate).format('DD.MM.YYYY')}</span>
                                                        </>
                                                    }
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    {(props.userInfo.user.id === props.user.id) &&
                                                        <>
                                                            <span className="Edit me-3" role="button" onClick={() => editLearningOnClick(learning.id)}><EditIcon /></span>
                                                            <span className="Remove" role="button" onClick={() => removeLearningOnClick(learning.id)}><MenuCloseIcon /></span>
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="Body">
                                            <div className="Title">{learning.title}</div>
                                        </div>
                                    </div>
                                )}

                                {props.user.id === props.userInfo.user.id &&
                                    /*<div className="Actions">*/
                                        <span className="Button" onClick={() => learningEditorModalToggler()}><PlusIcon /></span>
                                    /*</div>*/
                                }
                            </div>
                        );
                    case props.tabs.Work:
                        if (props.user.id !== props.userInfo.user.id && !props.works?.length) return null;
                        return (
                            <div className="TabWork">
                                <div className="Desc">Места работы и другой занятости</div>

                                {props.works && props.works.map((work: Work) =>
                                    <div className="Item" key={work.id}>
                                        <div className="Header">
                                            <div className={'d-flex ' + (work.startDate && work.endDate ? 'justify-content-between' : 'justify-content-end')}>
                                                <div className="d-flex align-items-center">
                                                    {work.startDate && work.endDate &&
                                                        <>
                                                            <span className="Calendar me-2"><CalendarAltIcon /></span>
                                                            <span className="Date">{moment(work.startDate).format('DD.MM.YYYY') + ' - ' + moment(work.endDate).format('DD.MM.YYYY')}</span>
                                                        </>
                                                    }
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    {(props.userInfo.user.id === props.user.id) &&
                                                        <>
                                                            <span className="Edit me-3" role="button" onClick={() => editWorkOnClick(work.id)}><EditIcon /></span>
                                                            <span className="Remove" role="button" onClick={() => removeWorkOnClick(work.id)}><MenuCloseIcon /></span>
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="Body">
                                            <div className="Title">{work.title}</div>
                                            {work.post &&
                                                <span className="Post">
                                                    <span className="me-3"><JobIcon /></span>
                                                    <span>{work.post}</span>
                                                </span>
                                            }
                                        </div>
                                    </div>
                                )}

                                {props.user.id === props.userInfo.user.id &&
                                    /*<div className="Actions">*/
                                    <span className="Button" onClick={() => workEditorModalToggler()}><PlusIcon /></span>
                                    /*</div>*/
                                }
                            </div>
                        );
                    case props.tabs.Activity:
                        if (props.user.id !== props.userInfo.user.id && !props.activities?.length) return null;
                        return (
                            <div className="TabActivity">
                                <div className="Desc">Хобби, увлечения и другие дела, которым периодически уделяется время</div>

                                {props.activities && props.activities.map((activity: Activity) =>
                                    <div className="Item" key={activity.id}>
                                        <div className="Header">
                                            <div className={'d-flex justify-content-end'}>
                                                <div className="d-flex align-items-center">
                                                    {(props.userInfo.user.id === props.user.id) &&
                                                        <>
                                                            <span className="Edit me-3" role="button" onClick={() => editActivityOnClick(activity.id)}><EditIcon /></span>
                                                            <span className="Remove" role="button" onClick={() => removeActivityOnClick(activity.id)}><MenuCloseIcon /></span>
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="Body">
                                            <div className="Title">{activity.title}</div>
                                        </div>
                                    </div>
                                )}

                                {props.user.id === props.userInfo.user.id &&
                                    /* <div className="Actions">*/
                                    <span className="Button" onClick={() => activityEditorModalToggler()}><PlusIcon /></span>
                                   /* </div>*/
                                }
                            </div>
                        );
                    case props.tabs.Facts:
                        if (props.user.id !== props.userInfo.user.id && !props.facts?.length) return null;
                        return (
                            <div className="TabFacts">
                                <div className="Desc">Любые факты о себе</div>

                                {props.facts && props.facts.map((fact: Fact) =>
                                    <div className="Item" key={fact.id}>
                                        <div className="Header">
                                            <div className={'d-flex justify-content-end'}>
                                                <div className="d-flex align-items-center">
                                                    {(props.userInfo.user.id === props.user.id) &&
                                                        <>
                                                            <span className="Edit me-3" role="button" onClick={() => editFactOnClick(fact.id)}><EditIcon /></span>
                                                            <span className="Remove" role="button" onClick={() => removeFactOnClick(fact.id)}><MenuCloseIcon /></span>
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="Body">
                                            <div className="Title">{fact.title}</div>
                                        </div>
                                    </div>
                                )}

                                {props.user.id === props.userInfo.user.id &&
                                    /*<div className="Actions">*/
                                        <span className="Button" onClick={() => factEditorModalToggler()}><PlusIcon /></span>
                                    /*</div>*/
                                }
                            </div>
                        );
                }
            })()}

            <LearningEditorModal
                isOpen={isOpenLearningEditorModal}
                toggle={learningEditorModalToggler}
                LearningId={learningId}
                updateUser={props.updateUser}
            />

            <WorkEditorModal
                isOpen={isOpenWorkEditorModal}
                toggle={workEditorModalToggler}
                WorkId={workId}
                updateUser={props.updateUser}
            />

            <ActivityEditorModal
                isOpen={isOpenActivityEditorModal}
                toggle={activityEditorModalToggler}
                ActivityId={activityId}
                updateUser={props.updateUser}
            />

            <FactEditorModal
                isOpen={isOpenFactEditorModal}
                toggle={factEditorModalToggler}
                FactId={factId}
                updateUser={props.updateUser}
            />

            <ConfirmationModal
                isOpen={isOpenRemoveLearningConfirmModal}
                toggle={removeLearningConfirmModalToggler}
                message='Удалить запись об обучении?'
                confirmAction={removeLearning}
            />

            <ConfirmationModal
                isOpen={isOpenRemoveWorkConfirmModal}
                toggle={removeWorkConfirmModalToggler}
                message='Удалить запись о месте работы?'
                confirmAction={removeWork}
            />

            <ConfirmationModal
                isOpen={isOpenRemoveActivityConfirmModal}
                toggle={removeActivityConfirmModalToggler}
                message='Удалить запись об активности?'
                confirmAction={removeActivity}
            />

            <ConfirmationModal
                isOpen={isOpenRemoveFactConfirmModal}
                toggle={removeFactConfirmModalToggler}
                message='Удалить запись о факте?'
                confirmAction={removeFact}
            />

        </div>
    );
}