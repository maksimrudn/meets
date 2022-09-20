﻿import React, { Component, SetStateAction, useEffect, useRef, useState } from 'react';
import 'react-date-time-new/css/react-datetime.css'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'moment-timezone';
import 'moment/locale/ru';
import LocateMapIcon from '../../../icons/LocateMapIcon';
import YMapsGeoSelector from '../../../modules/geo/YMapsGeoSelector';
import getPosition from '../../../common/GeoUtils';
import UserAuthInfo from '../../../contracts/UserAuthInfo';

import './MapSelectorModal.scss';

type MapSelectorModalState = {
    latitude: number,
    longitude: number,
    address?: string
}

type IMapSelectorModalProps = {
    isOpen: boolean,
    toggle(): void,
    setMeetingAddress: React.Dispatch<SetStateAction<string>>,
    userInfo: UserAuthInfo
}

export default function MapSelectorModal(props: IMapSelectorModalProps) {
    const [coords, setCoords] = useState<MapSelectorModalState>({
        latitude: 0,
        longitude: 0,
        address: ''
    });

    const onChangeCoordinatesModal = (latitude: number, longitude: number, address?: string) => {
        setCoords({
            latitude,
            longitude,
            address
        });
    }

    const onDetectGeoposition = async (e: React.ChangeEvent<HTMLButtonElement>) => {
        console.log('detect ', e.target);
        try {
            let coordinates = await getPosition();

            setCoords({
                ...coords,
                latitude: coordinates.latitude,
                longitude: coordinates.longitude
            });
        } catch (err) {
            console.error(err);
        }
    }

    const onDetetctGeoposition2 = () => {

        try {
            console.log('asdf');
        } catch (err) {
        }
    }

    const onSave = () => {
        props.setMeetingAddress(coords.address as string);
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
            className="MapSelectorModal"
            contentClassName="Content"
        >
            <ModalHeader
                toggle={props.toggle}
                cssModule={{
                    'modal-title': 'mb-0'
                }}
                className="Header"
            >
                Место встречи
            </ModalHeader>
            <ModalBody
                className="Body"
            >
                <button type="button" className="SetPlaceBtn btn mt-3" onClick={onDetectGeoposition}>
                    <span className="me-3"><LocateMapIcon /></span>
                    <span>Текущее местоположение</span>
                </button>

                <div className="Map">
                    <YMapsGeoSelector
                        editable={true}
                        latitude={coords.latitude}
                        longitude={coords.longitude}
                        onChangeCoordinates={onChangeCoordinatesModal}
                        userInfo={props.userInfo}
                    />
                </div>

                <div className="col-12 mb-2">
                    <label className="form-label">Адрес</label>
                    <textarea
                        className="form-control"
                        value={coords.address}
                        //ref={addresRef}
                        rows={4}
                        readOnly
                    />
                </div>

                <button type="button" className="SaveBtn btn mt-3" onClick={onSave}>Выбрать</button>

            </ModalBody>

        </Modal>
    );
}
