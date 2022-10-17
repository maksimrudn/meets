import React, { Component, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';

import { AddressSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';


import DateTime from 'react-date-time-new';
import 'react-date-time-new/css/react-datetime.css'

import moment from 'moment';
import 'moment-timezone';
import placeService from "api/PlaceService";
import AppConfig from 'common/AppConfig';

import 'bootstrap/dist/css/bootstrap.css';
import 'styles/scss/main.scss';
import { formToObject } from '../../../common/Utils';
import Place from '../../../contracts/Place';
import { toast } from 'react-toastify';

interface PlaceEditorProps {
    placeId: any,
    toggle: any,
    placeTitle: any,
    setNewPlaceToSelect: any
}

export default function PlaceEditor(
    {
        placeId,
        toggle, // признак вызова модальной формы, функция, используется только в том случае, если вызывается модальная форма, принимает true, если было сохранено изменение
        placeTitle,
        setNewPlaceToSelect
    }: PlaceEditorProps)
{
    let [place, setPlace] = useState<any>(
        {
            title: '',
            address: '',
            phone: '',
            description:''
        });

    let [validationError, setValidationError] = useState<any>({ title: '' });



    let history = useHistory();

    useEffect(() => {
        try {

            var pl = new Place();

            // при редактировании
            if (placeId) {
                pl = placeService.get(placeId);
            }

            setPlace(pl);

        } catch (err: any) {
            toast.error(`Ошибка, ${err.message}`);
        }

    }, []);

    const onSubmit = (e: any) => {
        e.preventDefault();

        if (!formIsValid(e.target)) {
            toast.error(`Ошибка, Некорректные данные. Место не cоздано`);
            return false;
        }

        try {
            // при редактировании
            if (placeId) {
                let placeData = formToObject(e.target);
                placeData.id = placeId;

                placeService.edit(placeData);

                if (toggle)
                    toggle(true);
                else
                    history.push(`/place/Edit/${placeId}`);
            }
            // при создании
            else {
                let placeFormData = new FormData(e.target);
                let id = placeService.create(placeFormData);

                if (toggle) {
                    setNewPlaceToSelect && setNewPlaceToSelect(id);
                    toggle(true);
                } else {
                    history.push(`/place/Details/${id}`);
                }
            }

        } catch (err: any) {
            toast.error(`Ошибка, ${err.message}`);
        }
    }

    const onClose = (e: any) => {
        e.preventDefault();

        // модальный редим
        if (toggle) {
            toggle();
        }
        // страничный режим
        else {
            history.goBack();
        }
    }

    const formIsValid = (form: any) => {
        const message = 'Необходимо заполнить';
        const title = form.Title.value;

        if (title)
            return true;

        const error: any = {};

        if (!title) {
            error.title = message;
        }

        setValidationError({ validationError: error });

        return false;
    }

    return (
        <>
            <form method="post" encType="multipart/form-data" name="placeForm" onSubmit={onSubmit}>
                <div className="col-12">
                    <div className="card border-0">
                        <div className="card-body">
                            <div className="col-12 mb-2">                                
                                <label className="form-label">Название</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="Title"
                                    onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                                    defaultValue={place.title || placeTitle}
                                />
                            </div>

                            <div className="col-12 mb-2">
                                <label className="form-label">Адрес</label>
                                <AddressSuggestions
                                    token={AppConfig.TokenDadata}
                                    inputProps={{ name: "Address" }}
                                    
                                    value={{ value: place.address }}
                                    
                                    onChange={(resp) => { setPlace({ ...place, address: resp.value }) }}
                                    
                                    minChars={3}
                                />
                            </div>

                            <div className="col-12 mb-2">
                                <label className="form-label">Телефон</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="Phone"
                                    onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                                    defaultValue={place.phone} />
                            </div>

                            <div className="col-12 mb-2">
                                <label className="form-label">Описание</label>
                                <textarea
                                    id="Desc"
                                    name="Description"
                                    className="form-control pb-0"
                                    rows="8"
                                    cols="30"
                                    defaultValue={place.description}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="d-block mb-5 mt-2">
                        <input type="submit" value="Сохранить" className="btn btn-primary" />
                        <button className="btn btn-secondary ms-2 " onClick={onClose}>Закрыть</button>
                    </div>
                </div>

            </form>
        </>
        );
}



