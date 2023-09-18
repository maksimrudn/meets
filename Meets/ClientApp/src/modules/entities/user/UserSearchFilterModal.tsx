import React, { Component, SetStateAction, useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select/creatable';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { AddressSuggestions } from 'react-dadata';
import AppConfig from '../../../common/AppConfig';

import './UserSearchFilterModal.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/createStore';
import { IFilter, updateFilter, updateUsers } from '../../../store/users';
import useUsersStore from '../../../hooks/useUsersStore';
import Routes from '../../../common/Routes';

interface IUserSearchFilterModalProps {
    isOpen: boolean
    toggle: () => void
}

export default function UserSearchFilterModal(props: IUserSearchFilterModalProps) {
    const history = useHistory();
    const usersStore = useUsersStore();

    const [filter, setFilter] = useState<IFilter>(usersStore.filter);

    /**
     * onChange обработчик DaData вызывается только когда выбирается город в меню подсказок, когда значение удаляется обработчик не вызывается (и выбранный город сохраняется),
     * для этого надо пробрасывать еще один обработчик onChange в inputProps, который меняет значение при изменении инпута (e.target.value)
     * @param e
     */
    const inputCityOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter({ ...filter, city: e.target.value })
    }

    const findOnClick = async () => {
        try {
            await usersStore.updateFilter(filter);
        } catch (err) {
            history.push(Routes.Error, err);
        }

        props.toggle();
    }

    return (
        <Modal
            isOpen={props.isOpen}
            toggle={props.toggle}
            size='md'
            container='div.container-xl'
            cssModule={{
                //'modal-open': 'p-0'
            }}
            className="UserSearchFilterModal"
            contentClassName="Content"
            /**
             особенности rectstrap модалки: при закрытии занчения state модалки сохраняется,
             если значение для state родительского компонента UserSearch не сохранилось при отправке, выведутся сохраненные значения state модалки,
             поэтому в обработчике onClosed повторно устанавливется значение для state модалки из родительского компонента UserSearch
             */
            //onClosed={() => setFilter(props.filter)}
        >
            <ModalHeader
                toggle={props.toggle}
                cssModule={{
                    'modal-title': 'mb-0'
                }}
                className="Header"
            >
                Charecteristics
            </ModalHeader>
            <ModalBody
                className="Body"
            >
                <div className="col-12 mb-2">
                    <label className="form-label">City</label>
                    <AddressSuggestions
                        token={AppConfig.TokenDadata}
                        value={{ value: filter.city }}
                        onChange={(data: any) => setFilter({ ...filter, city: data.value || undefined })}
                        minChars={3}
                        filterFromBound="city"
                        filterToBound="settlement"
                        inputProps={{ className: 'form-control', onChange: inputCityOnChange }}
                    />
                </div>

                <div className="col-12 mb-3">
                    <label className="form-label">Interests</label>
                    <Select
                        isMulti
                        defaultValue={filter.tags && filter.tags.map((x: any) => { return { label: x, value: x } })}
                        onChange={(res: any) => setFilter({ ...filter, tags: res.map((x: any) => x.value) })}
                    />
                </div>

                <div className="col-12 mb-2">
                    <label className="form-label">Height</label>
                    <div className="d-flex flex-row align-items-center">
                        <span className="fw-light text-muted me-3">from</span>
                        <input
                            className="form-control me-4"
                            type="number"
                            defaultValue={filter.growthFrom}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter({ ...filter, growthFrom: e.target.valueAsNumber })}
                        />
                        <span className="fw-light text-muted me-3">to</span>
                        <input
                            className="form-control"
                            type="number"
                            defaultValue={filter.growthTo}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter({ ...filter, growthTo: e.target.valueAsNumber })}
                        />
                    </div>
                </div>

                <div className="col-12 mb-2">
                    <label className="form-label">Weight</label>
                    <div className="d-flex flex-row align-items-center">
                        <span className="fw-light text-muted me-3">from</span>
                        <input
                            className="form-control me-4"
                            type="number"
                            defaultValue={filter.weightFrom}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter({ ...filter, weightFrom: e.target.valueAsNumber })}
                        />
                        <span className="fw-light text-muted me-3">to</span>
                        <input
                            className="form-control"
                            type="number"
                            defaultValue={filter.weightTo}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter({ ...filter, weightTo: e.target.valueAsNumber })}
                        />
                    </div>
                </div>

                <div className="col-12 mb-3">
                    <label className="form-label">Age</label>
                    <div className="d-flex flex-row align-items-center">
                        <span className="fw-light text-muted me-3">from</span>
                        <input
                            className="form-control me-4"
                            type="number"
                            defaultValue={filter.ageFrom}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter({ ...filter, ageFrom: e.target.valueAsNumber })}
                        />
                        <span className="fw-light text-muted me-3">to</span>
                        <input
                            className="form-control"
                            type="number"
                            defaultValue={filter.ageTo}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter({ ...filter, ageTo: e.target.valueAsNumber })}
                        />
                    </div>
                </div>

                <div className="col-12 mb-2">
                    <label className="form-label">Workplace</label>
                    <input
                        className="form-control"
                        type="text"
                        defaultValue={filter.work}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter({ ...filter, work: e.target.value })}
                    />
                </div>

                <div className="col-12 mb-2">
                    <label className="form-label">Education</label>
                    <input
                        className="form-control"
                        type="text"
                        defaultValue={filter.learning}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter({ ...filter, learning: e.target.value })}
                    />
                </div>

                <div className="col-12">
                    <label className="form-label">Activities</label>
                    <input
                        className="form-control"
                        type="text"
                        defaultValue={filter.activity}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter({ ...filter, activity: e.target.value })}
                    />
                </div>

                <button className="Find btn mt-3" type="button" onClick={findOnClick}>Search</button>
            </ModalBody>

        </Modal>
    );
}
