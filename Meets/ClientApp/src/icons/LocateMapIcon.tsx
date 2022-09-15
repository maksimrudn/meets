import React, { Component, useState } from 'react';

interface IProps{
    width?: any
    height?: any
}

export default function LocateMapIcon(props: IProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={props.width || "31.5"} height={props.height || "31.5"} viewBox={`0 0 ${props.width || "31.5"} ${props.height || "31.5"}`}>
            <path id="Icon_ionic-md-locate" data-name="Icon ionic-md-locate" d="M18,12.375A5.625,5.625,0,1,0,23.625,18,5.641,5.641,0,0,0,18,12.375ZM31.425,16.5A13.551,13.551,0,0,0,19.5,4.575V2.25h-3V4.575A13.551,13.551,0,0,0,4.575,16.5H2.25v3H4.575A13.552,13.552,0,0,0,16.5,31.425V33.75h3V31.425A13.552,13.552,0,0,0,31.425,19.5H33.75v-3ZM18,28.5A10.5,10.5,0,1,1,28.5,18,10.531,10.531,0,0,1,18,28.5Z" transform="translate(-2.25 -2.25)" />
        </svg>
    );
}