import React, { Component, SetStateAction, useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select/creatable';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import userService from '../../api/UserService';
import { Helmet } from 'react-helmet';
import { getAvatarPathForUser, objectToFormData } from '../../common/Utils';
import UserItem from './UserItem';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


import './UserSearch.scss';
import GoBackIcon from '../../icons/GoBackIcon';
import SlidersIcon from '../../icons/SlidersIcon';
import { AddressSuggestions } from 'react-dadata';
import AppConfig from '../../common/AppConfig';
import UserSearchFilterModal, { IFilter } from '../../modules/entities/user/UserSearchFilterModal';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/createStore';




interface UserSearchProps {
    
}

export default function UserSearch(props: UserSearchProps) {
    const [isOpenFilterModal, setIsOpenFiterModal] = useState(false);

    const currentUser = useSelector((state: RootState) => state.currentUser);

    const [users, setUsers] = useState<any>([]);
    const [filter, setFilter] = useState<IFilter>({
        city: '',
        tags: [],
        growthFrom: 0,
        growthTo: 0,
        weightFrom: 0,
        weightTo: 0,
        ageFrom: 0,
        ageTo: 0,
        company: '',
        learning: '',
        activity: ''
    });

    const history = useHistory();

    useEffect(() => {
        onFilterSubmit(filter);
    }, []);

    const filterModalToggle = () => {
        setIsOpenFiterModal(!isOpenFilterModal);
    }

    const onFilterSubmit = (filter: IFilter) => {
        try {
            const users = userService.getList(filter);
            setUsers(users);
        } catch (err: any) {
            NotificationManager.error(err.message, err.name);
        }
    }

    const getSEO = () => {
        var title = 'Пользователи';
        var keywords = 'eventsurfing пользователи';
        var description = 'Куда сходить сегодня? С сервисом EventSurfing вы сможете легко найти события рядом с вами сегодня и в будущем, а если не нашли то сможете создать и найти желающих поучаствовать!';

        return { title, keywords, description };
    }

    var seo = getSEO();

    return (
        <>
            <Helmet>
                <title>{seo.title}</title>
                <meta className="meta-tag" data-type="name" name="keywords" content={seo.keywords} />
                <meta name="description" content={seo.description} />
                <meta property="og:title" content={seo.title} />
                <meta property="og:description" content={seo.description} />
            </Helmet>

            <NotificationContainer />

            <div className="UserSearch">

                <div className="Header">
                    <span className="Button ms-3" onClick={() => { history.goBack(); }}><GoBackIcon /></span>
                    <h3 className="fw-bold mb-0">Поиск</h3>
                    <span className="Button me-3" onClick={() => filterModalToggle()}><SlidersIcon /></span>
                </div>

                <div className="row g-3">
                    {users?.length && users.map((user: any) =>
                        <UserItem
                            key={user.id}
                            currentUserId={currentUser.userId}
                            user={user}
                        />
                    )}
                </div>

                <UserSearchFilterModal
                    isOpen={isOpenFilterModal}
                    toggle={filterModalToggle}
                    filter={filter}
                    setFilter={setFilter}
                    onFilterSubmit={onFilterSubmit}
                />
            </div>
        </>
    );
}
