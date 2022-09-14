import React, { Component, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select/creatable';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import userService from '../../api/UserService';
import friendRequestService from '../../api/FriendRequestService';
import { Helmet } from 'react-helmet';
import { getAvatarPathForUser, objectToFormData } from '../../common/Utils';
import UserItem from './UserItem';


interface UserSearchProps {
    userInfo: any
}

export default function UserSearch(props: UserSearchProps) {
    const [users, setUsers] = useState<any>([]);
    const [filter, setFilter] = useState<any>({
        name: '',
        tags: [],
        ageTo: 0,
        ageFrom: 0,
        gender: 'Undefined',
        radius: 0,
        city: ''
    });

    useEffect(() => {
        let userData = new FormData();
        userData.append('name', filter.name);

        if (filter.tags.length != 0) {
            filter.tags.map((tag: any) => { userData.append('tag', tag) });
        }
        userData.append('ageTo', filter.ageTo);
        userData.append('ageFrom', filter.ageFrom);
        userData.append('gender', filter.gender);

        if (props.userInfo.hasGeolocation) {
            userData.append('radius', filter.radius);
        }
        userData.append('city', filter.city);

        try {
            const users = userService.getList(userData);
            setUsers(users);
        } catch (err: any) {
            NotificationManager.error(err.message, err.name);
        }
    }, [filter]);

    const onNameChange = (e: any) => {
        setFilter({
            ...filter,
            name: e.target.value
        });
    }

    const onTagsChange = (value: any) => {
        let tags = value.map((tag: any) => tag.value);
        setFilter({
            ...filter,
            tags: tags
        });
    }

    const onAgeToChange = (e: any) => {
        setFilter({
            ...filter,
            ageTo: e.target.value
        });
    }

    const onAgeFromChange = (e: any) => {
        setFilter({
            ...filter,
            ageFrom: e.target.value
        });
    }

    const onGenderChange = (e: any) => {
        setFilter({
            ...filter,
            gender: e.target.value
        });
    }

    const onRadiusChange = (e: any) => {
        setFilter({
            ...filter,
            radius: e.target.value || 0
        });
    }

    const onCityChange = (e: any) => {
        setFilter({
            ...filter,
            city: e.target.value
        });
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

            <div className="row align-items-center">
                <div className="border-0 mb-4">
                    <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
                        <h3 className="fw-bold mb-0">Пользователи</h3>
                    </div>
                </div>
            </div>

            <div className="col-12">
                <div className="card">
                    <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                        <h6 className="mb-0 fw-bold">Параметры поиска</h6>
                    </div>
                    <div className="card-body">
                        <div className="row">

                            <div className="col-12 col-lg-9 order-last order-lg-first">
                                <div className="row g-3">
                                    {users != undefined && users.map((user: any) =>
                                        <UserItem
                                            userInfo={props.userInfo}
                                            user={user}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="col-12 col-lg-3 order-first order-lg-last">
                                <form method="post" action="/api/user/UserSearchPost">
                                    <div className="d-block g-3">
                                        <div className="col pb-3">
                                            <label>Имя</label>
                                            <input type="text" className="form-control" name="name" defaultValue="" onChange={onNameChange} />
                                        </div>

                                        <div className="col pb-3">
                                            <label>Тэги</label>
                                            <Select
                                                isMulti
                                                onChange={onTagsChange}
                                            />
                                        </div>

                                        <div className="col pb-3">
                                            <label>Возраст (от)</label>
                                            <input type="number" className="form-control" name="ageTo" defaultValue="" onChange={onAgeToChange} />
                                        </div>

                                        <div className="col pb-3">
                                            <label>Возраст (до)</label>
                                            <input type="number" className="form-control" name="ageFrom" defaultValue="" onChange={onAgeFromChange} />
                                        </div>

                                        <div className="col pb-3">
                                            <label>Пол</label><br />
                                            <select className="form-select" name="gender" onChange={onGenderChange}>
                                                <option value="Undefined">Не определен</option>
                                                <option value="Male">Мужской</option>
                                                <option value="Female">Женский</option>
                                            </select>
                                        </div>

                                        <div className="col pb-3">
                                            <label>Радиус</label>
                                            {props.userInfo.hasGeolocation
                                                ? <input type="number" className="form-control" name="radius" defaultValue="0" onChange={onRadiusChange} />
                                                : <input type="number" className="form-control" disabled />
                                            }
                                        </div>

                                        <div className="col pb-3">
                                            <label>Город</label>
                                            <input type="text" className="form-control" name="city" defaultValue="" onChange={onCityChange} />
                                        </div>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
