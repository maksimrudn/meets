import React, { Component, SetStateAction, useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select/creatable';
import userService from '../../api/UserService';
import { Helmet } from 'react-helmet';
import { getAvatarPathForUser, objectToFormData } from '../../common/Utils';
import UserItem from './UserItem';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


import './UserSearch.scss';
import GoBackIcon from '../../icons/GoBackIcon';
import SlidersIcon from '../../icons/SlidersIcon';
import UserSearchFilterModal, { IFilter } from '../../modules/entities/user/UserSearchFilterModal';

import useUsersStore from '../../hooks/useUsersStore';
import Routes from '../../common/Routes';




export default function UserSearch() {
    const usersStore = useUsersStore();

    const [isOpenFilterModal, setIsOpenFiterModal] = useState(false);

    const history = useHistory();

    useEffect(() => {
        const update = async () => {
            try {
                await usersStore.updateFilter(usersStore.filter);
            } catch (err) {
                history.push(Routes.Error, err);
            }
        }

        update();
    }, []);

    const filterModalToggle = () => {
        setIsOpenFiterModal(!isOpenFilterModal);
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

            <div className="UserSearch">

                <div className="Header">
                    <span className="Button ms-3" onClick={() => { history.goBack(); }}><GoBackIcon /></span>
                    <h3 className="fw-bold mb-0">Search</h3>
                    <span className="Button me-3" onClick={() => filterModalToggle()}><SlidersIcon /></span>
                </div>

                <div className="row g-3">
                    {usersStore.users?.length && usersStore.users.map((user: any) =>
                        <UserItem
                            key={user.id}
                            user={user}
                        />
                    )}
                </div>

                {isOpenFilterModal &&
                    <UserSearchFilterModal
                        isOpen={isOpenFilterModal}
                        toggle={filterModalToggle}
                    />
                }
            </div>
        </>
    );
}
