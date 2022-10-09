import React, { Component, SetStateAction, useEffect, useRef, useState } from 'react';
import 'react-date-time-new/css/react-datetime.css'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'moment-timezone';
import 'moment/locale/ru';
import LocateMapIcon from '../../../icons/LocateMapIcon';
import YMapsGeoSelector from '../../../modules/geo/YMapsGeoSelector';
import getPosition from '../../../common/GeoUtils';

import './MapSelectorModal.scss';
import useAccountStore from '../../../hooks/useAccountStore';
import useMeetRequestStore from '../../../hooks/useMeetRequestStore';

type MapSelectorModalState = {
    latitude: number,
    longitude: number,
    address?: string
}

type IMapSelectorModalProps = {
    isOpen: boolean,
    toggle(): void,
}

export default function MapSelectorModal(props: IMapSelectorModalProps) {

    const { currentUser } = useAccountStore();
    const meeting = useMeetRequestStore();

    const [coords, setCoords] = useState<MapSelectorModalState>({
        latitude: 0,
        longitude: 0,
        address: ''
    });

    const [isNavigatorEnabled, setIsNavigatorEnabled] = useState(() => {
        try {
            let coordinates = (async () => await getPosition())()
            return true;
        } catch (err) {
            return false
        }
    });

    const onChangeCoordinatesModal = (latitude: number, longitude: number, address?: string) => {
        setCoords({
            latitude,
            longitude,
            address
        });
    }

    const onDetectGeoposition = async () => {
        try {
            let coordinates = await getPosition();

            setCoords({
                ...coords,
                latitude: coordinates.latitude,
                longitude: coordinates.longitude
            });
        } catch (err) {
            let res;
            console.error(err);
        }
    }

    const onSave = async () => {
        try {
            await meeting.setMeetRequest({ ...meeting.meetRequest, place: coords.address });
            props.toggle();
        }
        catch (err) { }
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
            //onEnter={navigatorCondition}
            //onOpened={navigatorCondition}
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
                <button type="button" className="SetPlaceBtn btn mt-3" onClick={onDetectGeoposition} disabled={isNavigatorEnabled}>
                    <span className="me-3"><LocateMapIcon /></span>
                    <span>Текущее местоположение</span>
                </button>

                <div className="Map">
                    <YMapsGeoSelector
                        editable={true}
                        latitude={coords.latitude}
                        longitude={coords.longitude}
                        onChangeCoordinates={onChangeCoordinatesModal}
                        currentUser={currentUser}
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
