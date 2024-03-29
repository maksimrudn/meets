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
import learningService from '../../../api/LearningService';
import { Learning } from '../../../contracts/learning/Learning';
import CalendarAltIcon from '../../../icons/CalendarAltIcon';
import MenuCloseIcon from '../../../icons/MenuCloseIcon';
import ConfirmationModal from '../../ConfirmationModal';
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
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/createStore';
import useAccountStore from '../../../hooks/useAccountStore';
import useUserStore from '../../../hooks/useUserStore';
import { UserCardTabsNames } from '../../../common/UserCardTabsNames';
import { toast } from 'react-toastify';




interface UserCardTabsProps {
    tabs: any
    selectedTab: any
    setSelectedTab: any

    onClickEditIcon: any
}

export default function UserCardTabs(props: UserCardTabsProps) {
    const { currentUser } = useAccountStore();
    const state = useUserStore();

    const [isOpenLearningEditorModal, setIsLearningEditorModal] = useState(false);
    const [isOpenWorkEditorModal, setIsWorkEditorModal] = useState(false);
    const [isOpenActivityEditorModal, setIsActivityEditorModal] = useState(false);
    const [isOpenFactEditorModal, setIsFactEditorModal] = useState(false);

    const [isOpenRemoveLearningConfirmModal, setIsOpenRemoveLearningConfirmModal] = useState(false);
    const [isOpenRemoveWorkConfirmModal, setIsOpenRemoveWorkConfirmModal] = useState(false);
    const [isOpenRemoveActivityConfirmModal, setIsOpenRemoveActivityConfirmModal] = useState(false);
    const [isOpenRemoveFactConfirmModal, setIsOpenRemoveFactConfirmModal] = useState(false);

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

    const editLearningOnClick = async (learning: Learning) => {
        try {
            await state.setLearning(learning);
        } catch (err) { }

        learningEditorModalToggler();
    }

    const editWorkOnClick = async (work: Work) => {
        try {
            await state.setWork(work);
        } catch (err) { }

        workEditorModalToggler();
    }

    const editActivityOnClick = async (activity: Activity) => {
        try {
            await state.setActivity(activity);
        } catch (err) { }

        activityEditorModalToggler();
    }

    const editFactOnClick = async (fact: Fact) => {
        try {
            await state.setFact(fact);
        } catch (err) { }
        factEditorModalToggler();
    }

    const removeLearningOnClick = async (learning: Learning) => {
        try {
            await state.setLearning(learning);
        } catch (err) { }

        removeLearningConfirmModalToggler();
    }

    const removeWorkOnClick = async (work: Work) => {
        try {
            await state.setWork(work);
        } catch (err) { }

        removeWorkConfirmModalToggler();
    }

    const removeActivityOnClick = async (activity: Activity) => {
        try {
            await state.setActivity(activity);
        } catch (err) { }

        removeActivityConfirmModalToggler();
    }

    const removeFactOnClick = async (fact: Fact) => {
        try {
            await state.setFact(fact);
        } catch (err) { }

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

    const handleRemoveLearning = async () => {
        try {
            await state.removeLearning();
        } catch (err: any) {
            toast.error(`Ошибка, ${err.message}`);
        }
    }

    const handleRemoveWork = async () => {
        try {
            await state.removeWork();
        } catch (err: any) {
            toast.error(`Ошибка, ${err.message}`);
        }
    }

    const handleRemoveActivity = async () => {
        try {
            await state.removeActivity();
        } catch (err: any) {
            toast.error(`Ошибка, ${err.message}`);
        }
    }

    const handleRemoveFact = async () => {
        try {
            await state.removeFact();
        } catch (err: any) {
            toast.error(`Ошибка, ${err.message}`);
        }
    }

    return (
        <div className="UserCardTabs">
            <div className="TabBtnsContainer">
                <SwiperTabs
                    tabs={state.tabHeader}
                    selectedTab={props.selectedTab}
                    setSelectedTab={props.setSelectedTab}
                    user={state.user}
                />
            </div>

            {(() => {
                switch (props.selectedTab) {
                    case UserCardTabsNames.Info:
                        return (
                            <div className="TabInfo">
                                <div className="Main mb-2">

                                    <div className="d-flex justify-content-start mb-5">
                                        <span className="fs-5 me-4">{state.user.description || 'Nothing is specified'}</span>
                                        {(currentUser.id === state.user.id) &&
                                            <span className="IconEdit" role="button" onClick={() => props.onClickEditIcon(UserFieldNames.Description)}><EditIcon /></span>
                                        }
                                    </div>

                                    <div className="d-flex justify-content-start align-items-center mb-5">
                                        <span className="IconBirthDate text-white me-2">
                                            <BirthDateIconSvg />
                                        </span>
                                        <span className="fs-5 me-4">{state.user.birthDate && (moment().diff(moment(state.user.birthDate), 'years')) + ' years' || 'not specified'}</span>
                                        {(currentUser.id === state.user.id) &&
                                            <span className="IconEdit" role="button" onClick={() => props.onClickEditIcon(UserFieldNames.BirthDate)}><EditIcon /></span>
                                        }
                                    </div>

                                    <div className="d-flex justify-content-start align-items-center mb-5">
                                        <span className="IconCity text-white me-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="21.447" height="33.996" viewBox="0 0 21.447 33.996">
                                                <path id="Icon_metro-location" data-name="Icon metro-location" d="M16.257,1.392A10.223,10.223,0,0,0,6.034,11.616c0,10.223,10.223,22.492,10.223,22.492S26.481,21.839,26.481,11.616A10.223,10.223,0,0,0,16.257,1.392Zm0,16.485a6.262,6.262,0,1,1,6.262-6.262,6.262,6.262,0,0,1-6.262,6.262ZM12.3,11.616a3.962,3.962,0,1,1,3.962,3.962A3.962,3.962,0,0,1,12.3,11.616Z" transform="translate(-5.534 -0.892)" fill="#fff" stroke="rgba(0,0,0,0.2)" stroke-width="1" />
                                            </svg>
                                        </span>
                                        <span className="fs-5 me-4">{state.user.city || 'not specifie'}</span>
                                        {(currentUser.id === state.user.id) &&
                                            <span className="IconEdit" role="button" onClick={() => props.onClickEditIcon(UserFieldNames.City)}><EditIcon /></span>
                                        }
                                    </div>

                                    <div className="d-flex justify-content-start align-items-center mb-5">
                                        <span className="IconGrowth text-white me-2">
                                            <GrowthIconSvg />
                                        </span>
                                        <span className="fs-5 me-4">{state.user.growth ? `${state.user.growth} sm` : 'not specifie'}</span>
                                        {(currentUser.id === state.user.id) &&
                                            <span className="IconEdit" role="button" onClick={() => props.onClickEditIcon(UserFieldNames.Growth)}><EditIcon /></span>
                                        }
                                    </div>

                                    <div className="d-flex justify-content-start align-items-center mb-4">
                                        <span className="IconWeight text-white me-2">
                                            <WeightIconSvg />
                                        </span>
                                        <span className="fs-5 me-4">{state.user.weight ? `${state.user.weight} sm` : 'not specifie'}</span>
                                        {(currentUser.id === state.user.id) &&
                                            <span className="IconEdit" role="button" onClick={() => props.onClickEditIcon(UserFieldNames.Weight)}><EditIcon /></span>
                                        }
                                    </div>

                                </div>


                            </div>
                        );
                    case UserCardTabsNames.Learning:
                        if (state.user.id !== currentUser.id && !state.user.learnings?.length) return null;
                        return (
                            <div className="TabLearning">
                                <div className="Desc">Completed courses and education events</div>

                                {state.user.learnings && state.user.learnings.map((learning: Learning) =>
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
                                                    {(currentUser.id === state.user.id) &&
                                                        <>
                                                            <span className="Edit me-3" role="button" onClick={() => editLearningOnClick(learning)}><EditIcon /></span>
                                                            <span className="Remove" role="button" onClick={() => removeLearningOnClick(learning)}><MenuCloseIcon /></span>
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

                                {state.user.id === currentUser.id &&
                                    <span className="Button" onClick={() => learningEditorModalToggler()}><PlusIcon /></span>
                                }
                            </div>
                        );
                    case UserCardTabsNames.Work:
                        if (state.user.id !== currentUser.id && !state.user.works?.length) return null;
                        return (
                            <div className="TabWork">
                                <div className="Desc">Places of work and other occupation</div>

                                {state.user.works && state.user.works.map((work: Work) =>
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
                                                    {(currentUser.id === state.user.id) &&
                                                        <>
                                                            <span className="Edit me-3" role="button" onClick={() => editWorkOnClick(work)}><EditIcon /></span>
                                                            <span className="Remove" role="button" onClick={() => removeWorkOnClick(work)}><MenuCloseIcon /></span>
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="Body">
                                            <div className="Title">{work.title}</div>
                                            {work.post &&
                                                <span className="Post">
                                                    <span className="me-3"><JobIcon color="#000" /></span>
                                                    <span>{work.post}</span>
                                                </span>
                                            }
                                        </div>
                                    </div>
                                )}

                                {state.user.id === currentUser.id &&
                                    <span className="Button" onClick={() => workEditorModalToggler()}><PlusIcon /></span>
                                }
                            </div>
                        );
                    case UserCardTabsNames.Activity:
                        if (state.user.id !== currentUser.id && !state.user.activities?.length) return null;
                        return (
                            <div className="TabActivity">
                                <div className="Desc">Hobby, interests and other businesses that are payed attention periodically </div>

                                {state.user.activities && state.user.activities.map((activity: Activity) =>
                                    <div className="Item" key={activity.id}>
                                        <div className="Header">
                                            <div className={'d-flex justify-content-end'}>
                                                <div className="d-flex align-items-center">
                                                    {(currentUser.id === state.user.id) &&
                                                        <>
                                                            <span className="Edit me-3" role="button" onClick={() => editActivityOnClick(activity)}><EditIcon /></span>
                                                            <span className="Remove" role="button" onClick={() => removeActivityOnClick(activity)}><MenuCloseIcon /></span>
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

                                {state.user.id === currentUser.id &&
                                    <span className="Button" onClick={() => activityEditorModalToggler()}><PlusIcon /></span>
                                }
                            </div>
                        );
                    case UserCardTabsNames.Facts:
                        if (state.user.id !== currentUser.id && !state.user.facts?.length) return null;
                        return (
                            <div className="TabFacts">
                                <div className="Desc">Whatever facts about yourself</div>

                                {state.user.facts && state.user.facts.map((fact: Fact) =>
                                    <div className="Item" key={fact.id}>
                                        <div className="Header">
                                            <div className={'d-flex justify-content-end'}>
                                                <div className="d-flex align-items-center">
                                                    {(currentUser.id === state.user.id) &&
                                                        <>
                                                            <span className="Edit me-3" role="button" onClick={() => editFactOnClick(fact)}><EditIcon /></span>
                                                            <span className="Remove" role="button" onClick={() => removeFactOnClick(fact)}><MenuCloseIcon /></span>
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

                                {state.user.id === currentUser.id &&
                                    <span className="Button" onClick={() => factEditorModalToggler()}><PlusIcon /></span>
                                }
                            </div>
                        );
                }
            })()}

            <LearningEditorModal
                isOpen={isOpenLearningEditorModal}
                toggle={learningEditorModalToggler}
                learning={state.learning}
            />

            <WorkEditorModal
                isOpen={isOpenWorkEditorModal}
                toggle={workEditorModalToggler}
                work={state.work}
            />

            <ActivityEditorModal
                isOpen={isOpenActivityEditorModal}
                toggle={activityEditorModalToggler}
                activity={state.activity}
            />

            <FactEditorModal
                isOpen={isOpenFactEditorModal}
                toggle={factEditorModalToggler}
                fact={state.fact}
            />

            <ConfirmationModal
                isOpen={isOpenRemoveLearningConfirmModal}
                toggle={removeLearningConfirmModalToggler}
                message='Удалить запись об обучении?'
                confirmAction={handleRemoveLearning}
            />

            <ConfirmationModal
                isOpen={isOpenRemoveWorkConfirmModal}
                toggle={removeWorkConfirmModalToggler}
                message='Удалить запись о месте работы?'
                confirmAction={handleRemoveWork}
            />

            <ConfirmationModal
                isOpen={isOpenRemoveActivityConfirmModal}
                toggle={removeActivityConfirmModalToggler}
                message='Удалить запись об активности?'
                confirmAction={handleRemoveActivity}
            />

            <ConfirmationModal
                isOpen={isOpenRemoveFactConfirmModal}
                toggle={removeFactConfirmModalToggler}
                message='Удалить запись о факте?'
                confirmAction={handleRemoveFact}
            />

        </div>
    );
}