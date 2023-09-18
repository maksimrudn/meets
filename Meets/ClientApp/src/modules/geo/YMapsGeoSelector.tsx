import * as React from 'react';
import { Component, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { YMaps, Map, Placemark, YMapsApi } from 'react-yandex-maps';
import YMapsConfig from '../../common/YMapsConfig';
import YMapsIcons from '../../common/YMapsIcons';
import UserDTO from '../../contracts/user/UserDTO';


/**
 * Компонент позволяет 
 * - выводить указанную геометку на карте
 * - получать координаты клика и выводить метку в месте клика
 * - получать полный адрес по геометке клика
 * 
 * Обёртка необходима для того, чтобы обернуть яндекс карты в компонент и использовать в функциях
 * Яндекс карты глючат при работе в функциях. Проблемы с получением и использованием instanceRef - при обработке клика ref=null
 * 
 * */



export interface YMapsGeoSelectorProps {
    editable: boolean, // при истине, карта, при клике на определённое место, будет возвращать данные геопозиции
    latitude: number,
    longitude: number,
    onChangeCoordinates(latitude: number, longitude: number, address: string): void, //  - функция, в которую возвращается результат изменения геопозиции
    currentUser: UserDTO
}


export default class YMapsGeoSelector extends Component<YMapsGeoSelectorProps, any> {
    private mapRef: any     // ссылка на html яндекс карт
    private objPlacemark: any // метка геопозиции
    private ymapsApi?: any // метка геопозиции

    constructor(props: YMapsGeoSelectorProps) {
        super(props);
        this.mapRef = React.createRef();
        this.state = {
            coordsIP: []
        }
    }

    componentWillUpdate(nextProps: any, nextState: any) {
        // Установка метки в случае если геопозиция обновляется извне. Например если мы извне определяем текущую геопозицию и надо установить метку в обновлённой геопозиции
        if (nextProps.latitude != 0) {
            var coords = [nextProps.latitude, nextProps.longitude];

            // Если метка была создана - передвигаем метку на новую геопозицию.
            if (this.objPlacemark) {
                this.objPlacemark.geometry.setCoordinates(coords);

            }
            // или создаём метку, если она не была создана. Для случая когда метка изначально не была установлена и мы ставим её по определению геопоизции пользователя извне
            else {
                this.createPlacemark([nextProps.latitude, nextProps.longitude]);
            }
        }


    }

    // Создание метки.
    createPlacemark = (coords: any) => {
        if (this.ymapsApi) {
            this.objPlacemark = new this.ymapsApi.Placemark(coords,
                {},
                {
                    preset: YMapsIcons.MeetingAddress,
                });

            if (this.mapRef != null)
                this.mapRef.geoObjects.add(this.objPlacemark);
        }
    }

    // передвинуть метку
    movePlacemark = (coords: any) => {
        this.objPlacemark.geometry.setCoordinates(coords);
    }


    onLoadMap = (ymaps: any) => {
        this.ymapsApi = ymaps;

        /// определение геопозиции по ip
        ymaps.geolocation.get({ provider: 'yandex', mapStateAutoApply: true }).then((res: any) => {
            if (res.geoObjects.position) {
                this.setState({ coordsIP: res.geoObjects.position });
            }
        });


        // если запущено в режиме показа - то отключить зум скроллом мышки
        if (!this.props.editable)
            this.mapRef.behaviors.disable('scrollZoom');


        // устанавливаем предыдущую геопозицию на карте
        if (this.props.latitude != 0) {
            this.createPlacemark([this.props.latitude, this.props.longitude]);
        }

        // Обработчик клика по карте. 
        if (this.props.editable) {
            this.mapRef.events.add('dblclick', async (e: any) => {

                var coords = await e.get('coords');

                // !!! если удалить код ниже до address то возникает зависание, поэтому не удаётся выполнить содание placemark через state и рендеринг
                // Если метка уже создана – просто передвигаем ее.
                if (this.objPlacemark) {
                    this.movePlacemark(coords);
                }
                // Если нет – создаем.
                else {
                    this.createPlacemark([this.props.latitude, this.props.longitude]);
                }

                var address = await getAddress(coords);

                this.props.onChangeCoordinates(
                    coords[0],
                    coords[1],
                    address);
            });
        }


        // Определяем адрес по координатам (обратное геокодирование).
        const getAddress = async (coords: any) => {
            return await ymaps.geocode(coords).then((res: any) => {
                var firstGeoObject = res.geoObjects.get(0);

                return firstGeoObject.getAddressLine();
            });
        };

    }

    render() {
        let centerLatitude = YMapsConfig.DefaultLatitude;
        let centerLongitude = YMapsConfig.DefaultLongitude;

        if (this.props.latitude) {
            centerLatitude = this.props.latitude;
            centerLongitude = this.props.longitude;
        } else if (this.props.currentUser.hasGeolocation) {
            centerLatitude = this.props.currentUser.latitude;
            centerLongitude = this.props.currentUser.longitude;
        } else if (this.state.coordsIP) {
            //let coords = this.getCoordsByIP();
            centerLatitude = this.state.coordsIP[0];
            centerLongitude = this.state.coordsIP[1];
            console.log();
        }

        return (
            <>

                <YMaps query={{ apikey: YMapsConfig.YandexApiKey, lang: "ru_RU", load: "package.full" }} >
                    <Map
                        modules={[
                            'geolocation',
                            'geocode',
                            'Placemark',
                            'geoObject.addon.balloon',
                            'geoObject.addon.hint'
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
                        {this.props.currentUser.hasGeolocation &&
                            <Placemark
                                geometry={[this.props.currentUser.latitude, this.props.currentUser.longitude]}
                                options={{
                                    preset: YMapsIcons.MyPosition,
                                    //iconColor: 'red'
                                }}
                            />
                        }
                    </Map>
                </YMaps>
            </>);
    }
}