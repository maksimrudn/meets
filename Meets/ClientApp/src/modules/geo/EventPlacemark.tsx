import React from "react";
import $ from 'jquery';
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";
import { GeoObjectProps, Placemark, PlacemarkGeometry, withYMaps } from "react-yandex-maps";
import EventPlacemarkBalloon, { IEventPlacemarkBalloonProps } from './EventPlacemarkBalloon';
import Coordinates from "../../contracts/Coordinates";
import EventDTO from "../../contracts/EventDTO";
import YMapsIcons from "../../common/YMapsIcons";
import { IMainProps } from "../../common/IMainProps";
import 'moment-timezone';
import 'moment/locale/ru';
import moment from 'moment'


// id html элемента необходимый для поиска при гидрации. Является контейнером для balloon
function getEventBallonLayoutId(eventId: number) {
    return `event-balloon-layout-${eventId}`;
}

function getEventBallonLayoutClusterId(eventId: number) {
    return `event-balloon-layout-cluster-${eventId}`;
}


interface EventPlacemarkProps extends GeoObjectProps<PlacemarkGeometry>, IMainProps  {
    event: EventDTO
}

function EventPlacemark(props: EventPlacemarkProps) {
    const EventPlacemarkCore = React.memo(({ ymaps: any }) => {
        const makeLayout = (layoutFactory: any) => {
            const Layout = layoutFactory.createClass(
                ReactDOMServer.renderToString(<div id={getEventBallonLayoutId(props.event.id)}><EventPlacemarkBalloon {...props} eventId={props.event.id} /></div>),
                {
                    build: function () {
                        Layout.superclass.build.call(this);

                        //this.element = $(`#event-balloon-${props.geoObject.id}`, this.getParentElement());
                        //this.element
                        //    .find(`#event-balloon-title-${props.geoObject.id}`)
                        //    .on('click', { geoObject: props.geoObject }, $.proxy(this.onNavigate, this));
                    },

                    clear: function () {

                        //this.element
                        //    .find(`#event-balloon-title-${props.geoObject.id}`)
                        //    .off('click');

                        Layout.superclass.clear.call(this);
                    },

                    //geoObject: props.geoObject,
                    //onNavigate: props.onNavigate,
                },
            );
            return Layout;
        };

        return (
            <Placemark
                {...props}

                modules={[
                    "geoObject.addon.balloon",
                    "geoObject.addon.hint"
                ]}

                geometry={[props.event.latitude, props.event.longitude]}
                
                onBalloonOpen={() => {
                    ReactDOM.hydrate(
                        <EventPlacemarkBalloon {...props} event={props.event} />,
                        document.getElementById(getEventBallonLayoutId(props.event.id))
                    );

                }}

                options={{
                    ...props.options,
                    balloonContentLayout: makeLayout(ymaps.templateLayoutFactory),
                    balloonPanelMaxMapArea: 0,

                    preset: YMapsIcons.Flag,
                    iconColor: 'violet',
                    hideIconOnBalloonOpen: false,
                }}

                properties={{
                    ...props.properties,
                    // компонент, который виден в случае если несколько событий находятся в одном месте. сгруппированная форма
                    balloonContentBody: ReactDOMServer.renderToString(<div id={getEventBallonLayoutClusterId(props.event.id)}><EventPlacemarkBalloon {...props} eventId={props.event.id} /></div>),
                    clusterCaption: `${(moment(props.event.startDate).format("HH:mm") != "00:00" && moment(props.event.startDate).format("HH:mm"))} ${props.event.title}`,
                    //balloonContentHeader: o.title,
                    hintContent: props.event.title,

                }}
            />
        );
    });

    const EventPlacemark = React.useMemo(() => {
        return withYMaps(
            EventPlacemarkCore,
            true,
            ["geoObject.addon.balloon", "templateLayoutFactory"]);
    }, [EventPlacemarkCore]);
    return <EventPlacemark {...props} />;
}


export { EventPlacemark }