import React, { Component, SetStateAction, useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select/creatable';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { AddressSuggestions } from 'react-dadata';
import AppConfig from '../../../common/AppConfig';

import './UserSearchFilterModal.scss';


export interface IFilter {
    city: string
    tags: string[]
    growthFrom: number
    growthTo: number
    weightFrom: number
    weightTo: number
    ageFrom: number
    ageTo: number
    company: string
    learning: string
    activity: string
}

interface IUserSearchFilterModalProps {
    isOpen: boolean
    toggle: () => void

    filter: IFilter
    setFilter: React.Dispatch<SetStateAction<IFilter>>

    onFilterSubmit: (filter?: IFilter) => void
}

export default function UserSearchFilterModal(props: IUserSearchFilterModalProps) {
    const findOnClick = () => {
        props.toggle();
        props.onFilterSubmit(props.filter);
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
                        value={{ value: props.filter.city }}
                        onChange={(data: any) => props.setFilter({ ...props.filter, city: data?.value || '' })}
                        minChars={3}
                        filterFromBound="city"
                        filterToBound="settlement"
                        inputProps={{ className: 'form-control' }}
                    />
                    {/*<input
                        className="form-control"
                        type="text"
                        defaultValue={props.filter.city}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setFilter({ ...props.filter, city: e.target.value })}
                    />*/}
                </div>

                <div className="col-12 mb-3">
                    <label className="form-label">Интересы</label>
                    <Select
                        isMulti
                        defaultValue={props.filter.tags && props.filter.tags.map((x: any) => { return { label: x, value: x } })}
                        onChange={(res: any) => props.setFilter({ ...props.filter, tags: res.map((x: any) => x.value) })}
                    />
                </div>

                <div className="col-12 mb-2">
                    <label className="form-label">Рост</label>
                    <div className="d-flex flex-row align-items-center">
                        <span className="fw-light text-muted me-3">от</span>
                        <input
                            className="form-control me-4"
                            type="number"
                            defaultValue={props.filter.growthFrom}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setFilter({ ...props.filter, growthFrom: e.target.valueAsNumber })}
                        />
                        <span className="fw-light text-muted me-3">до</span>
                        <input
                            className="form-control"
                            type="number"
                            defaultValue={props.filter.growthTo}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setFilter({ ...props.filter, growthTo: e.target.valueAsNumber })}
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
                            defaultValue={props.filter.weightFrom}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setFilter({ ...props.filter, weightFrom: e.target.valueAsNumber })}
                        />
                        <span className="fw-light text-muted me-3">до</span>
                        <input
                            className="form-control"
                            type="number"
                            defaultValue={props.filter.weightTo}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setFilter({ ...props.filter, weightTo: e.target.valueAsNumber })}
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
                            defaultValue={props.filter.ageFrom}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setFilter({ ...props.filter, ageFrom: e.target.valueAsNumber })}
                        />
                        <span className="fw-light text-muted me-3">до</span>
                        <input
                            className="form-control"
                            type="number"
                            defaultValue={props.filter.ageTo}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setFilter({ ...props.filter, ageTo: e.target.valueAsNumber })}
                        />
                    </div>
                </div>

                <div className="col-12 mb-2">
                    <label className="form-label">Место работы</label>
                    <input
                        className="form-control"
                        type="text"
                        defaultValue={props.filter.company}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setFilter({ ...props.filter, work: e.target.value })}
                    />
                </div>

                <div className="col-12 mb-2">
                    <label className="form-label">Учёба</label>
                    <input
                        className="form-control"
                        type="text"
                        defaultValue={props.filter.learning}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setFilter({ ...props.filter, learning: e.target.value })}
                    />
                </div>

                <div className="col-12">
                    <label className="form-label">Активности</label>
                    <input
                        className="form-control"
                        type="text"
                        defaultValue={props.filter.activity}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setFilter({ ...props.filter, activity: e.target.value })}
                    />
                </div>

                <button className="Find btn mt-3" type="button" onClick={findOnClick}>Найти</button>
            </ModalBody>

        </Modal>
    );
}
