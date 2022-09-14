import { Button } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import * as React from 'react';
import { Component, useEffect, useRef, useState } from 'react';
import YMapsGeoSelector from './YMapsGeoSelector';
import getPosition from '../../common/GeoUtils';

type GeoSelectorModalState = {
    latitude: number,
    longitude: number,
    address?: string
}

type GeoSelectorModalProps = {
    isOpen: boolean,
    toggle(): void,
    latitude: number,
    longitude: number,
    address?: string,
    onChangeCoordinates(latitude: number, longitude: number, address?: string): void //  - функция, в которую возвращается результат изменения геопозиции
}


export default function GeoSelectorModal({ isOpen, toggle, latitude, longitude, address, onChangeCoordinates }: GeoSelectorModalProps) {

    let [coords, setCoords] = useState<GeoSelectorModalState>({
        latitude,
        longitude,
        address
    });

    useEffect(() => {
        setCoords({
            latitude,
            longitude,
            address
        });
    }, [latitude, longitude]);



    const onChangeCoordinatesModal = (latitude: number, longitude:number, address?:string) => {
        setCoords({
            latitude,
            longitude,
            address
        });
    }

    const onDetetctGeoposition = async () => {

        try {
            let coordinates = await getPosition();

            setCoords({
                ...coords,
                latitude: coordinates.latitude,
                longitude: coordinates.longitude
            });
        } catch (err) {
        }
    }

    const onSave = () => {
        onChangeCoordinates(coords.latitude, coords.longitude, coords.address);
        toggle();
    }

    const onClose = () => {
        toggle();
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                toggle={toggle}
                size='lg'
                container='div.container-xl'
                cssModule={{ 'modal-title': 'fw-bold' }}
            >
                <ModalHeader
                    toggle={toggle}
                >
                    Выбор геопозиции
                </ModalHeader>
                <ModalBody>
                    <button className={"btn btn-primary mb-3"} onClick={onDetetctGeoposition}>Определить геопозицию</button>
                    <YMapsGeoSelector editable={true} latitude={coords.latitude} longitude={coords.longitude} onChangeCoordinates={onChangeCoordinatesModal} />
                    <div className="d-inline mt-3 mb-5">
                        <button className="btn btn-primary" onClick={onSave}>Сохранить</button>
                        <button className="btn btn-warning ms-2 " onClick={onClose}>Закрыть</button>
                    </div>
                </ModalBody>
                
            </Modal>
        </>
        );
}