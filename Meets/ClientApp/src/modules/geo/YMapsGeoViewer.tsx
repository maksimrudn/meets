import * as React from 'react';
import { Component, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { YMaps, Map, Placemark, YMapsApi, Clusterer } from 'react-yandex-maps';
import AppConfig from 'common/AppConfig';
import getPosition from '../../common/GeoUtils';
import { EventPlacemark } from './EventPlacemark';
import Coordinates from '../../contracts/Coordinates';
import EventDTO from '../../contracts/EventDTO';
import YMapsConfig from '../../common/YMapsConfig';
import YMapsIcons from '../../common/YMapsIcons';
import UserAuthInfo from '../../contracts/UserAuthInfo';
import EventPlacemarkBalloon from './EventPlacemarkBalloon';


function getEventBallonLayoutClusterId(eventId: number) {
    return `event-balloon-layout-cluster-${eventId}`;
}




type YMapsGeoViewerState = {
    userPosition: Coordinates,
    selectedPoint: any
}

export interface YMapsGeoViewerProps {
    showUserPosition: boolean
    geoObjects: EventDTO[]
    history: any
    userInfo: UserAuthInfo
}

/**
 * Компонент позволяет
 * - выводить список объектов на карте
 * - отдельно определять и выводить геопозицию пользователя
 *
 * Обёртка необходима для того, чтобы обернуть яндекс карты в компонент и использовать в функциях
 * Яндекс карты глючат при работе в функциях. Проблемы с получением и использованием instanceRef - при обработке клика ref=null
 *
 * */
export default class YMapsGeoViewer extends Component<YMapsGeoViewerProps, YMapsGeoViewerState> {
    private mapRef: any     // ссылка на html яндекс карт
    private objPlacemark: any // метка геопозиции
    private ymapsApi?: any // метка геопозиции

    constructor(props: YMapsGeoViewerProps) {
        super(props);
        this.mapRef = React.createRef();

        this.state = { userPosition: new Coordinates(), selectedPoint: null };
    }

    onLoadMap = async (ymaps: any) => {
        this.ymapsApi = ymaps;

        // определяем геопозицию пользователя
        try {
            let coordinates = new Coordinates();
            coordinates = await getPosition();

            this.setState({
                userPosition: {
                    ...this.state.userPosition,
                    latitude: coordinates.latitude,
                    longitude: coordinates.longitude
            }});
        } catch (err) {
        }
    }

    onPlacemarkClick = (point: any) => {
        this.setState({ userPosition: this.state.userPosition, selectedPoint: point });
    };


    render() {

        // вычисление центрирования
        let centerLatitude = YMapsConfig.DefaultLatitude;
        let centerLongitude = YMapsConfig.DefaultLongitude;

        // если указано выводить пользователя, то центрировать по пользователю
        if (this.props.showUserPosition && this.state.userPosition.latitude) {
            centerLatitude = this.state.userPosition.latitude;
            centerLongitude = this.state.userPosition.longitude;
        }
        // если выводится только один объект, то центрировать по этому объекту
        else if (this.props.geoObjects && this.props.geoObjects.length === 1) {
            centerLatitude = this.props.geoObjects[0].latitude;
            centerLongitude = this.props.geoObjects[0].longitude;
        }

        return (
            <>
                {this.props.geoObjects.length === 1 && this.props.geoObjects[0].latitude === 0 ?
                    <div>Геопозиция не указана</div>
                    :
                    <YMaps query={{ apikey: YMapsConfig.YandexApiKey, lang: "ru_RU", load: "package.full" }} >
                        <Map
                            modules={[
                                'geolocation',
                                'geocode',
                                'Placemark',
                                'clusterer.addon.balloon',
                                'geoObject.addon.balloon',
                                'geoObject.addon.hint',
                                'templateLayoutFactory',
                            ]}
                            width='100%'
                            height='400px'
                            state={{
                                center: [centerLatitude, centerLongitude],
                                zoom: YMapsConfig.DefaultMapZoom,
                                controls: []
                            }}
                            instanceRef={ref => this.mapRef = ref}
                            onLoad={ymaps => this.onLoadMap(ymaps)}

                        >
                            <Clusterer
                                options={{
                                    preset: "islands#invertedVioletClusterIcons",
                                    groupByCoordinates: true,
                                    clusterDisableClickZoom: true,
                                    balloonPanelMaxMapArea: 0
                                }}

                                onBalloonOpen={(ev) => {
                                    
                                    //ReactDOM.hydrate(
                                    //    <EventPlacemarkBalloon {...props} eventId={event.id} />,
                                    //    document.getElementById(getEventBallonLayoutClusterId(event.id))
                                    //);

                                }}
                            >
                                {this.props.showUserPosition && this.state.userPosition.latitude &&
                                    <Placemark
                                        geometry={[this.state.userPosition.latitude, this.state.userPosition.longitude]}
                                        options={{
                                            preset: YMapsIcons.MyPosition,
                                            iconColor: 'red'
                                        }}
                                    />
                                }
                                {this.ymapsApi && this.props.geoObjects && this.props.geoObjects.map((o, i) =>
                                    o.latitude 
                                    ?( <EventPlacemark
                                            event={o}
                                            history={this.props.history}
                                            userInfo={this.props.userInfo}
                                        />
                                    )
                                    : null
                                )
                                }
                            </Clusterer>
                        </Map>
                    </YMaps>
                }
            </>);
    }
}

