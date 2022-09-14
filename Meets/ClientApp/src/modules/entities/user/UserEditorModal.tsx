﻿import React, { Component, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import 'moment-timezone';
import AppConfig from '../../../common/AppConfig';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AddressSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';
import { getAvatarPathForUser, objectToFormData } from '../../../common/Utils';


import DateTime from 'react-date-time-new';
import 'react-date-time-new/css/react-datetime.css'
import SelectCreatable from 'react-select/creatable';
import { getUserEditorModalTitle, UserFieldNames } from '../../../common/UserFieldNames';
import './UserEditorModal.scss';




interface UserEditorModalProps {
    user: any
    isOpen: boolean
    toggle: () => void
    fieldName: string
    onSaveChanges: (fieldName: string, value: any) => void
}

export default function UserEditorModal(props: UserEditorModalProps) {
    const [editedFieldValue, setEditedFieldValue] = useState<any | any[]>('');

    const fullNameOnChange = (e: any) => {
        setEditedFieldValue(e.target.value);
    }

    const birthDateOnChange = (date: any) => {
        setEditedFieldValue(moment(date).format('YYYY-MM-DD HH:mm'));
    }

    const cityOnChange = (city: any) => {
        setEditedFieldValue(city?.value);
    }

    const descriptionOnChange = (e: any) => {
        setEditedFieldValue(e.target.value);
    }

    const growthOnChange = (e: any) => {
        setEditedFieldValue(e.target.value);
    }

    const weightOnChange = (e: any) => {
        setEditedFieldValue(e.target.value);
    }

    const tagsOnChange = (value: any) => {
        let tags = value.map((tag: any) => tag.value);
        setEditedFieldValue(tags);
    }

    const onSaveChanges = () => {
        props.toggle();
        props.onSaveChanges(props.fieldName, editedFieldValue);
    }

    return (
        <>
            <Modal
                isOpen={props.isOpen}
                toggle={props.toggle}
                size='md'
                container='div.container-xl'
                cssModule={{
                    //'modal-open': 'p-0'
                }}
                className="UserEditorModal"
                contentClassName="Content"
            >
                <ModalHeader
                    toggle={props.toggle}
                    cssModule={{
                        'modal-title': 'mb-0'
                    }}
                    className="Header"
                >
                    {getUserEditorModalTitle(props.fieldName)}
                    {/*(() => {
                        switch (props.fieldName) {
                            case UserFieldNames.FullName: return 'Имя';
                            case UserFieldNames.BirthDate: return 'Дата рождения';
                            case UserFieldNames.City: return 'Город';
                            case UserFieldNames.Description: return 'О себе';
                            case UserFieldNames.Growth: return 'Рост';
                            case UserFieldNames.Weight: return 'Вес';
                            case UserFieldNames.Tags: return 'Тэги';
                        }
                    })()*/}
                </ModalHeader>
                <ModalBody
                    className="Body"
                >
                    {(() => {
                        switch (props.fieldName) {
                            case UserFieldNames.FullName:
                                return (
                                    <div className="col-12 mb-2">
                                        <input className="form-control" type="text" defaultValue={props.user.fullName} onChange={fullNameOnChange} />
                                    </div>
                                );
                            case UserFieldNames.BirthDate:
                                return (
                                    <div className="col-12 mb-2">
                                        <DateTime
                                            onChange={birthDateOnChange}
                                            initialValue={props.user.birthDate && moment(props.user.birthDate).format('DD.MM.YYYY')}
                                            inputProps={{ placeholder: 'dd.mm.yyyy' }}
                                            dateFormat="DD.MM.YYYY"
                                            timeFormat={false}
                                            closeOnSelect={true}
                                        />
                                    </div>
                                );
                            case UserFieldNames.City:
                                return (
                                    <div className="col-12 mb-2">
                                        <AddressSuggestions
                                            token={AppConfig.TokenDadata}
                                            value={{ value: props.user.city }}
                                            onChange={cityOnChange}
                                            minChars={3}
                                        />
                                    </div>
                                );
                            case UserFieldNames.Description:
                                return (
                                    <div className="col-12 mb-2">
                                        <textarea className="form-control" defaultValue={props.user.description} onChange={descriptionOnChange} cols={5} rows={6} style={{ resize: 'none' }} />
                                    </div>
                                );
                            case UserFieldNames.Growth:
                                return (
                                    <div className="col-12 mb-2">
                                        <input className="form-control" type="number" max={250} defaultValue={props.user.growth} onChange={growthOnChange} />
                                    </div>
                                );
                            case UserFieldNames.Weight:
                                return (
                                    <div className="col-12 mb-2">
                                        <input className="form-control" type="number" max={250} defaultValue={props.user.weight} onChange={weightOnChange} />
                                    </div>
                                );
                            case UserFieldNames.Tags:
                                return (
                                    <div className="col-12 mb-2">
                                        <SelectCreatable
                                            isMulti
                                            onChange={tagsOnChange}
                                            placeholder=""
                                            defaultValue={props.user.tags && props.user.tags.map((x: any) => { return { label: x, value: x } })}
                                        />
                                    </div>
                                );
                        }
                    })()}

                    <button type="button" className="SaveBtn btn mt-3" onClick={onSaveChanges}><span className="fs-6 text-white">Сохранить</span></button>

                </ModalBody>

            </Modal>
        </>
    );
}