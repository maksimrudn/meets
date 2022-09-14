import React, { Component, useEffect, useRef, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import 'swiper/swiper.min.css';
import { UserCardTabsNames } from '../../common/UserCardTabsNames';
import './SwiperTabs.scss';


interface ITabItem {
    title: string
    count: number
}

interface SwiperTabsProps {
    tabs: any
    selectedTab: any
    setSelectedTab: any

    user: any
    userInfo: any
}

export default function SwiperTabs(props: SwiperTabsProps) {
    return (
        <div className="SwiperTabsConatainer d-flex justify-content-center">
            <Swiper
                freeMode={true}
                slidesPerView={'auto'}
                spaceBetween={20}
                className={'SwiperTabs rounded-pill'}
            //onSwiper={e => console.log(e)}
            //onTouchMove={e => console.log(e)}
            //onSlideChange={e => console.log(e)}
            >
                {props.tabs && props.tabs.filter((item: ITabItem) => {
                    if (props.user.id !== props.userInfo.user.id) {
                        return item.count > 0
                    } else {
                        return item;
                    }
                }).map((item: ITabItem, i: any) =>
                    <SwiperSlide
                        key={i}
                        className={'Tab ' + (props.selectedTab === item.title ? 'Active rounded-pill text-white' : 'text-black')}
                        onClick={() => props.setSelectedTab(item.title)}
                    //onTouchEnd={() => props.setSelectedTab(item)}
                    >
                        <div className="fs-6 fw-bold d-flex justify-content-center align-items-center">
                            <span className="me-2">{item.title}</span>
                            {item.title !== UserCardTabsNames.Info &&
                                <div className="Counter">{item.count}</div>
                            }
                        </div>
                    </SwiperSlide>
                )}

            </Swiper>
        </div>
    );
}