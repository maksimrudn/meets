import React, { Component, useState } from 'react';

interface IProps {
    width?: any
    height?: any
    color?: any
}

export default function CompanyIcon(props: IProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={props.width || '14.75'} height={props.height || '16.464'} viewBox={`0 0 ${(props.width || '14.75')} ${(props.height || '16.464')}`}>
            <g id="_02589d7a33ac8dc9cec0826d2d09b5c0" data-name="02589d7a33ac8dc9cec0826d2d09b5c0" transform="translate(-61 -10)">
                <path id="Path_33" data-name="Path 33" d="M61,26.464v-.685h14.75v.685H61m10.634-1.03H69.919l-.007-8.812-2.051-1.478-4.8,2.06v8.232H61v-.685h1.373V16.859l5.489-2.4L70.6,16.517v8.232h1.03Zm-7.562-7.164L66.489,17.2v1.373l-2.4,1.03-.015-1.336Zm2.416,2.019v1.373l-2.4.685-.015-1.3Zm-2.4,3.431,2.4-.685v1.715h-2.4ZM72.32,11.715V25.436h1.028V12.93Zm-4.459,4.459v9.26h1.028V16.859Zm7.889,9.26H74.035V12.743L72.32,10.685,65.8,13.431v1.03l-.687.684V13.086L72.663,10l2.058,2.743V24.749h1.03Z" transform="translate(0)" fill={props.color || '#fff'} />
            </g>
        </svg>
    );
}
