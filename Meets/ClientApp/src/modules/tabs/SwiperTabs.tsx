import React, { Component, useEffect, useRef, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import 'swiper/swiper.min.css';
import { UserCardTabsNames } from '../../common/UserCardTabsNames';
import useCurrentUserStore from '../../hooks/useCurrentUserStore';
import './SwiperTabs.scss';


interface ITabItem {
    title: string
    count: number
}

interface SwiperTabsProps {
    tabs: any[]
    selectedTab: any
    setSelectedTab: any

    user?: any
}

export default function SwiperTabs(props: SwiperTabsProps) {
    const currentUser = useCurrentUserStore();


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
                {(() => {
                    if (props.tabs.every((item: any) => typeof item === 'string')) {
                        return props.tabs && props.tabs.map((item: any) =>
                            <SwiperSlide
                                key={item}
                                className={'Tab ' + (props.selectedTab === item ? 'Active rounded-pill text-white' : 'text-black')}
                                onClick={() => props.setSelectedTab(item)}
                            //onTouchEnd={() => props.setSelectedTab(item)}
                            >
                                <div className="fs-6 fw-bold d-flex justify-content-center align-items-center">
                                    {item}
                                </div>
                            </SwiperSlide>
                        );
                    } else {
                        return props.tabs && props.tabs.filter((item: ITabItem) => {
                            if (props.user?.id !== currentUser.id) {
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
                        );
                    }
                })()}
            </Swiper>
        </div>
    );
}