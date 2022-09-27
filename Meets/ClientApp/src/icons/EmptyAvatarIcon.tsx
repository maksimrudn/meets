import React, { Component, useState } from 'react';

interface IProps {
    width?: any
    height?: any
    color?: any
}

export default function EmptyAvatarIcon(props: IProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={props.width || "42"} height={props.height || "42"} viewBox={`0 0 ${props.width || "42"} ${props.height || "42"}`}>
            <g id="image-icon" transform="translate(1 1)">
                <rect id="Rectangle" width={props.width || "40"} height={props.height || "40"} rx="6" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="2" />
                <path id="Path" d="M0,0,17.5,17.5,28.272,6.734,39.041,17.5" transform="translate(0.446 15.318)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" />
                <circle id="Oval" cx="4.103" cy="4.103" r="4.103" transform="translate(19.487 7.179)" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="2" />
            </g>
        </svg>
    );
}