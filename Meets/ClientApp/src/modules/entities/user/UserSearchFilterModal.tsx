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

interface IUserSearchFilterModalProps {
    isOpen: boolean
    toggle: () => void
}

export default function UserSearchFilterModal(props: IUserSearchFilterModalProps) {
    const state = useSelector((state: RootState) => state.users);
    const dispatch = useDispatch();

    const [filter, setFilter] = useState<IFilter>(state.filter);

    /**
     * onChange обработчик DaData вызывается только когда выбирается город в меню подсказок, когда значение удаляется обработчик не вызывается (и выбранный город сохраняется),
     * для этого надо пробрасывать еще один обработчик onChange в inputProps, который меняет значение при изменении инпута (e.target.value)
     * @param e
     */
    const inputCityOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter({ ...filter, city: e.target.value })
    }

    const findOnClick = () => {
        dispatch(updateFilter(filter));
        try {
            dispatch(updateUsers());
        } catch (err) {

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
                Параметры
            </ModalHeader>
            <ModalBody
                className="Body"
            >
                <div className="col-12 mb-2">
                    <label className="form-label">Город</label>
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
                    <label className="form-label">Интересы</label>
                    <Select
                        isMulti
                        defaultValue={filter.tags && filter.tags.map((x: any) => { return { label: x, value: x } })}
                        onChange={(res: any) => setFilter({ ...filter, tags: res.map((x: any) => x.value) })}
                    />
                </div>

                <div className="col-12 mb-2">
                    <label className="form-label">Рост</label>
                    <div className="d-flex flex-row align-items-center">
                        <span className="fw-light text-muted me-3">от</span>
                        <input
                            className="form-control me-4"
                            type="number"
                            defaultValue={filter.growthFrom}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter({ ...filter, growthFrom: e.target.valueAsNumber })}
                        />
                        <span className="fw-light text-muted me-3">до</span>
                        <input
                            className="form-control"
                            type="number"
                            defaultValue={filter.growthTo}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter({ ...filter, growthTo: e.target.valueAsNumber })}
                        />
                    </div>
                </div>

                <div className="col-12 mb-2">
                    <label className="form-label">Вес</label>
                    <div className="d-flex flex-row align-items-center">
                        <span className="fw-light text-muted me-3">от</span>
                        <input
                            className="form-control me-4"
                            type="number"
                            defaultValue={filter.weightFrom}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter({ ...filter, weightFrom: e.target.valueAsNumber })}
                        />
                        <span className="fw-light text-muted me-3">до</span>
                        <input
                            className="form-control"
                            type="number"
                            defaultValue={filter.weightTo}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter({ ...filter, weightTo: e.target.valueAsNumber })}
                        />
                    </div>
                </div>

                <div className="col-12 mb-3">
                    <label className="form-label">Возраст</label>
                    <div className="d-flex flex-row align-items-center">
                        <span className="fw-light text-muted me-3">от</span>
                        <input
                            className="form-control me-4"
                            type="number"
                            defaultValue={filter.ageFrom}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter({ ...filter, ageFrom: e.target.valueAsNumber })}
                        />
                        <span className="fw-light text-muted me-3">до</span>
                        <input
                            className="form-control"
                            type="number"
                            defaultValue={filter.ageTo}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter({ ...filter, ageTo: e.target.valueAsNumber })}
                        />
                    </div>
                </div>

                <div className="col-12 mb-2">
                    <label className="form-label">Место работы</label>
                    <input
                        className="form-control"
                        type="text"
                        defaultValue={filter.company}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter({ ...filter, company: e.target.value })}
                    />
                </div>

                <div className="col-12 mb-2">
                    <label className="form-label">Учёба</label>
                    <input
                        className="form-control"
                        type="text"
                        defaultValue={filter.learning}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter({ ...filter, learning: e.target.value })}
                    />
                </div>

                <div className="col-12">
                    <label className="form-label">Активности</label>
                    <input
                        className="form-control"
                        type="text"
                        defaultValue={filter.activity}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter({ ...filter, activity: e.target.value })}
                    />
                </div>

                <button className="Find btn mt-3" type="button" onClick={findOnClick}>Найти</button>
            </ModalBody>

        </Modal>
    );
}
