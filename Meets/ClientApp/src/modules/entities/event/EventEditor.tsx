import React, { Component, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import SelectCreatable from 'react-select/creatable';
import { components } from 'react-select';

import { Editor } from '@tinymce/tinymce-react';

//import DateTime from 'react-datetime-picker';
import DateTime from 'react-date-time-new';
import 'react-date-time-new/css/react-datetime.css'

import { AddressSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

import moment from 'moment';
import 'moment-timezone';
import placeService from "api/PlaceService";
import categoryService from 'api/CategoryService';
import eventService from 'api/EventService';

import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import 'swiper/swiper.min.css'
import 'swiper/modules/pagination/pagination.min.css'



import { getAllowedPhotoFilesByMask, loadPhotoContentFromFiles } from 'common/Utils';
import PlaceCreateModal from 'modules/entities/place/PlaceEditorModal'
import AppConfig from '../../../common/AppConfig';
import { decodeDescription, encodeDescription } from '../../../common/Utils';
import GeoSelectorModal from '../../geo/GeoSelectorModal';
import YMapsGeoSelector from '../../geo/YMapsGeoSelector';

import 'modules/entities/event/EventEditor.scss';
import EventDTO from '../../../contracts/EventDTO';
import Category from '../../../contracts/Category';
import Event from '../../../contracts/Event';
import Date from './Date';
import CustomSelectDropdown from './CustomSelectDropdown';
import CustomSelectControl, { CustomSelectControlSettings } from './CustomSelectControl';




interface EventEditorProps {
    eventId: any,
    toggle: any
}

export default function EventEditor(
    {
        eventId,
        toggle // признак вызова модальной формы, функция, используется только в том случае, если вызывается модальная форма, принимает true, если было сохранено изменение
    }: EventEditorProps)
{
    let [event, setEvent] = useState<Event>(() => {
        try {
            let ev = new Event();

            // при редактировании
            if (eventId) {
                ev = eventService.get(eventId);
                if (ev.place) {
                    ev.place = {
                        value: ev.place.id,
                        label: ev.place.title
                    };
                } else {
                    ev.place = null;
                }
            }

            return ev;

        } catch (err: any) {
            let path = `/error?fromPage=eventEdit&errName=${err.name}&errMessage=${err.message}`;
            history.push(encodeURI(path));
        }
    });
    let [categories, setCategories] = useState<Category[]>(() => {
        try {
            let cat: any = categoryService.getList();
            return cat;
        } catch (err: any) {
            let path = `/error?fromPage=eventEdit&errName=${err.name}&errMessage=${err.message}`;
            history.push(encodeURI(path));
        }
    });
    let [places, setPlaces] = useState<any>([]);
    let [photoToUpload, setPhotoToUpload] = useState<any>([]);
    let [validationError, setValidationError] = useState<any>({ title: '', startDate: '' });
    let [geoSelectorModalOpen, setGeoSelectorModalOpen] = useState<any>(false);
    let [placeModalIsOpen, setPlaceModalIsOpen] = useState<any>(false);
    let [placeTitle, setPlaceTitle] = useState<any>('');
    let history = useHistory();

    
    const editorRef = useRef(null);

    useEffect(() => {
        CustomSelectControlSettings.showPlaceModal = placeModalToggle;
    }, []);

    const setNewPlaceToSelect = (id: any) => {
        try {
            const pl: any = placeService.get(id);
            const newPlace = pl ? { value: pl.id, label: pl.title } : null;
            setEvent({
                ...event,
                place: newPlace
            });
        } catch (err) {
            console.log('useEffect place id err: ', err)
        }
    }

    const onSubmit = (e: any) => {
        e.preventDefault();

        if (!formIsValid(e.target)) {
            NotificationManager.error('Некорректные данные. Событие не cоздано', 'Ошибка');
            return false;
        }

        

        let eventFormData = new FormData(e.target);

        // редактор tinyMCE не возвращает данные в formdata
        let descriptionHtml: any = editorRef.current.getContent();
        eventFormData.set('Description', encodeDescription(descriptionHtml));

        try {
            // при редактировании
            if (eventId) {
                eventService.edit(eventFormData);

                if (toggle)
                    toggle(true);
                else
                    history.push(`/event/details/${eventId}`);
            }
            // при создании
            else {
                let id = eventService.create(eventFormData);

                if (toggle)
                    toggle(true);
                else
                    history.push(`/event/details/${id}`);
            }

        } catch (err: any) {
            NotificationManager.error(err.message, err.name)
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

    const onChangeCoordinates = (latitude: any, longitude: any, address: any) => {
        setEvent({
            ...event,
            latitude,
            longitude,
            address
        });
    }

    const formIsValid = (form: any) => {
        const message = 'Необходимо заполнить';
        const title = form.Title.value;
        const startDate = form.StartDate.value;
        const published = form.Published.checked;

        if (!published) {
            return true
        }
        else if (title && startDate) {
            return true;
        }

        const error: any = {};

        if (!title) {
            error.title = message;
        }

        if (!startDate) {
            error.startDate = message;
        }

        setValidationError({ validationError: error });

        return false;
    }

    const onTagsChange = (value: any) => {

        let tags = value.map((tag: any) => tag.value);
        setEvent({
            ...event,
            tags
        });        
    }

    const renderPhotos = () => {
        let photoSlides = [];


        // если новые фото не загружались, тогда выводим ранее загруженные фото
        if (event.photos) {

            for (let i = 0; i < event.photos.length; i++) {

                photoSlides.push(
                    <SwiperSlide className="SwiperSlide" key={i}>
                        <img src={`../сontent/events/${event.id}/${event.photos[i]}`} alt="Responsive image" />
                    </SwiperSlide>
                );
            }
        }

        // предыдущие фото затираются новыми, поэтому сначала проверяем, надо ли загрузить новые фото, если да, то выводим их
        if (photoToUpload.length != 0) {
            photoToUpload.map((url: any, i: any) => {

                photoSlides.push(
                    <SwiperSlide className="SwiperSlide" key={i}>
                        <img src={url} alt="Responsive image" />
                    </SwiperSlide>
                );
            });
        }

        return photoSlides;
    }

    const onFileUploadChange = async (e: any) => {

        var files = getAllowedPhotoFilesByMask(e.currentTarget.files);
        var contentList = await loadPhotoContentFromFiles(files);

        setPhotoToUpload(contentList);
    }

    const onInputSelect = (val: any) => {
        if (val.length >= 3) {
            try {
                const pl = placeService.getList(val);
                setPlaces(pl);
            } catch (err: any) {
                NotificationManager.error(err.message, err.name)
            }
        }
    }

    const placeModalToggle = () => {
        if (placeModalIsOpen) {
                setPlaceModalIsOpen(false)
        } else {
                setPlaceModalIsOpen(true)
        }
    }

    const geoSelectorModalToggle = () => {
        if (geoSelectorModalOpen) {
            setGeoSelectorModalOpen(false);
        } else {
            setGeoSelectorModalOpen( true );
        }
    }

    const onSaveGeo = (e: any) => {
        e.preventDefault();

        geoSelectorModalToggle();
    }

    const onDeleteGeo = (e: any) => {
        setEvent({
            ...event,
            latitude: 0,
            longitude: 0,
            address: ''
        });
    }

    return (
        <>
            <NotificationContainer />

            <form method="post" encType="multipart/form-data" name="eventForm" onSubmit={onSubmit}>
                <div className="EventEditor row g-3">

                    {/* Card: Image */}
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <label className="form-label">Фото</label>
                                <div className="row">
                                    <div className="col">
                                        <Swiper
                                            freeMode={true}
                                            spaceBetween={5}
                                            slidesPerView={'auto'}                                                    
                                        >
                                            {renderPhotos()}

                                            <SwiperSlide style={{ width: '190px' }}>
                                                <div className="d-flex align-items-center justify-content-center" style={{ height: '190px', width: '190px', border: '1px dotted gray', borderRadius: '5px' }}>
                                                    <label htmlFor="fileupload" style={{ cursor: 'pointer' }}>
                                                        <i className="icofont-upload-alt fs-1"></i>
                                                    </label>
                                                </div>
                                            </SwiperSlide>
                                        </Swiper>
                                    </div>

                                </div>

                                <input type="file" id="fileupload" name="photos" style={{ opacity: 0, visibility: 'hidden', position: 'absolute' }} multiple onChange={onFileUploadChange} />
                            </div>
                        </div>
                    </div>

                    {/* Card: Main info */}
                    <div className="col-12 col-md-6">
                        <div className="card ">
                            <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom">
                                <h6 className="mb-0 fw-bold">Основная информация</h6>
                            </div>
                            <div className="card-body">

                                {eventId &&
                                    <input name="Id" value={event.id} readOnly hidden />
                                }


                                <div className="col-12">
                                    <label className="form-label">Название</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="Title"
                                        onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                                        defaultValue={event.title}
                                    />
                                    {validationError.title &&
                                        <div className="text-danger">{validationError.title}</div>
                                    }
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Стоимость</label>
                                    <input
                                        className="form-control"
                                        type="number"
                                        name="Price"
                                        onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                                        defaultValue={event.price} />
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Тэги</label>
                                    <SelectCreatable
                                        isMulti
                                        name="Tags"
                                        onChange={onTagsChange}                                                    
                                        placeholder=""                                                    

                                        value={event.tags && event.tags.map((x: any) => { return { label: x, value: x } })}
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Дата начала</label>
                                    <Date name="StartDate" eventDate={event.startDate} />
                                    {validationError.startDate &&
                                        <div className="text-danger">{validationError.startDate}</div>
                                    }
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Дата завершения</label>
                                    <Date name="EndDate" eventDate={event.endDate}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card: Extra Info */}
                    <div className="col-12 col-md-6">
                        <div className="card">
                            <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom">
                                <h6 className="mb-0 fw-bold">Дополнительная информация</h6>
                            </div>
                            <div className="card-body">
                                <div className="col-12">
                                    <label className="form-label">Категория</label>
                                    <select className="form-control" name="CategoryId">
                                        <option value="">Не выбрано</option>
                                        {categories.length != 0 && categories.map((cat: any) =>
                                            <option key={cat.id} value={cat.id} selected={event.categoryId === cat.id ? true : false}>{cat.title}</option>
                                        )}
                                    </select>
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Место</label>

                                    <SelectCreatable
                                        components={{
                                            Control: CustomSelectControl,
                                            DropdownIndicator: CustomSelectDropdown
                                        }}
                                        name='PlaceId'
                                        //defaultValue={defValue}
                                        value={event.place} // { value: event.place.id, label: event.place.title }
                                        //defaultInputValue={this.state.event.place?.title}
                                        onChange={(place: any) => {
                                            
                                            setEvent({
                                                ...event,
                                                place
                                            });
                                        }} 
                                        onInputChange={onInputSelect}
                                        isClearable={true}
                                        options={places?.map((pl: any) => { return { value: pl.id, label: pl.title } })}
                                        formatCreateLabel={val => { return <div style={{ fontWeight: 'bold', fontSize: '16px', color: 'green' }}>Создать - "{val}"</div> }}
                                        onCreateOption={title => { setPlaceTitle(title); placeModalToggle(); }}
                                        onMenuClose={function () { }}
                                        onBlur={function () { }}
                                        placeholder="Введите название"
                                    />
                                </div>
                                <div className="col-12 mb-2">
                                    <label className="form-label">Адрес</label>
                                    <AddressSuggestions
                                        inputProps={{ name: "Address" }}
                                        token={AppConfig.TokenDadata}
                                        value={{ value: event.address }}
                                        onChange={(resp: any) => { setEvent({ ...event, address: resp.value }) }}
                                        minChars={3}
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Краткое описание</label>
                                    <textarea
                                        id="miniDesc"
                                        name="ShortDescription"
                                        className="form-control pb-0"
                                        rows="8"
                                        cols="30"
                                        defaultValue={event.shortDescription}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card: Full Description */}
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom">
                                <h6 className="mb-0 fw-bold">Описание</h6>
                            </div>
                            <div className="card-body">
                                <div className="form-group">
                                    <label className="form-label">Описание</label>
                                    <Editor
                                        apiKey={AppConfig.TinyMCEApiKey}
                                        initialValue={event.description && decodeDescription(event.description)}
                                        onInit={(evt: any, editor: any) => editorRef.current = editor}
                                        id="fullDesc"
                                        textareaName="Description"
                                        init={{
                                            height: 250
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card: Geolocation */}
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom">
                                <h6 className="mb-0 fw-bold">Местоположение</h6>
                            </div>
                            <div className="card-body">
                                <div className="col-12">
                                    <button type="button" className="btn btn-primary mb-3" onClick={onSaveGeo}>Указать местоположение</button>
                                    <button type="button" className="btn btn-danger mb-3 ms-3" onClick={onDeleteGeo}>Удалить местоположение</button>

                                    <GeoSelectorModal
                                        isOpen={geoSelectorModalOpen}
                                        toggle={geoSelectorModalToggle}
                                        latitude={event.latitude}
                                        longitude={event.longitude}
                                        address={event.address}
                                        onChangeCoordinates={onChangeCoordinates}
                                    />

                                    {event.latitude ?
                                        <YMapsGeoSelector
                                            latitude={event.latitude}
                                            longitude={event.longitude}
                                        />
                                        :
                                        <div>Геопозиция не указана</div>
                                    }

                                    <input name="Address" className="form-control" defaultValue={event.address} />
                                    <input name="Latitude" defaultValue={event.latitude && event.latitude.toLocaleString('ru-Ru')} hidden />
                                    <input name="Longitude" defaultValue={event.longitude && event.longitude.toLocaleString('ru-Ru')} hidden />

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card: Restrictions */}
                    <div className="col-12 col-md-4">
                        <div className="card">
                            <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom">
                                <h6 className="mb-0 fw-bold">Ограничения</h6>
                            </div>
                            <div className="card-body">
                                <div className="col-12">
                                    <label className="form-label">Максимум человек</label>
                                    <input
                                        className="form-control"
                                        type="number"
                                        name="MaxPeopleCount"
                                        onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                                        defaultValue={event.maxPeopleCount}
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="checkbox-inline"><input type="checkbox" name="EighteenPlus" value={true} defaultChecked={event.eighteenPlus} /> 18+</label>
                                </div>
                                <div className="col-12">
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox" id="list-group1"
                                            name="Published"
                                            value={true}
                                            defaultChecked={event.published}
                                        />
                                        <label className="form-check-label ms-2" htmlFor="list-group1">Опубликовать</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {eventId &&
                        <div className="col-12 col-md-8">
                            <div className="card">
                                <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom">
                                    <h6 className="mb-0 fw-bold">Приглашения</h6>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-end ms-2">
                                        <div className="avatar-list g-3">
                                            <span className="avatar rounded-circle text-center pointer lg" data-bs-toggle="modal" data-bs-target="#addUser"><i className="icofont-ui-add"></i></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                                
                    <div className="d-inline mb-5">
                        <input type="submit" value="Сохранить" className="btn btn-primary" />
                        <button className="btn btn-secondary ms-2 " onClick={onClose}>Закрыть</button>
                    </div>

                </div>
            </form>

            <PlaceCreateModal
                isOpen={placeModalIsOpen}
                toggle={placeModalToggle}
                placeTitle={placeTitle}
                setNewPlaceToSelect={setNewPlaceToSelect}
            />
        </>
    );
    
}


