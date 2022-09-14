import React, { Component, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import 'react-date-time-new/css/react-datetime.css'

import 'moment-timezone';
import categoryService from 'api/CategoryService';

import 'swiper/swiper.min.css'
import 'swiper/modules/pagination/pagination.min.css'



export default function CategoryEditor(
    {
        categoryId,
        toggle // признак вызова модальной формы, функция, используется только в том случае, если вызывается модальная форма, принимает true, если было сохранено изменение
    })
{
    let [category, setCategory] = useState(
        {
            title: ''
        });

    let [validationError, setValidationError] = useState({ title: ''});

    let history = useHistory();

    useEffect(() => {
        try {

            var cat = {
                title: ''
            };

            // при редактировании
            if (categoryId) {
                cat = categoryService.get(categoryId);
            }

            setCategory(cat);

        } catch (err) {
            NotificationManager.error(err.message, err.name)
        }

    }, []);

    const onSubmit = (e) => {
        e.preventDefault();

        if (!formIsValid(e.target)) {
            NotificationManager.error('Некорректные данные. Место не cоздано', 'Ошибка');
            return false;
        }

        let categoryFormData = new FormData(e.target);


        try {
            // при редактировании
            if (categoryId) {
                categoryFormData.append('Id', categoryId);

                categoryService.edit(categoryFormData);

                if (toggle)
                    toggle(true);
                else
                    history.push(`/category/Edit/${categoryId}`);
            }
            // при создании
            else {
                let id = categoryService.create(categoryFormData);

                if (toggle)
                    toggle(true);
                else
                    history.push(`/category/Details/${id}`);
            }

        } catch (err) {
            NotificationManager.error(err.message, err.name)
        }
    }

    const onClose = (e) => {
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

    const formIsValid = (form) => {
        const message = 'Необходимо заполнить';
        const title = form.Title.value;

        if (title)
            return true;

        const error = {};

        if (!title) {
            error.title = message;
        }

        setValidationError({ validationError: error });

        return false;
    }

    return (
        <>
            <NotificationContainer />
            <form method="post" encType="multipart/form-data" name="categoryForm" onSubmit={onSubmit}>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="col-12 mb-2">                                
                                <label className="form-label">Название</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="Title"
                                    onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                                    defaultValue={category.title}
                                />
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
