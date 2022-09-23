import React, { Component, useState } from 'react';

interface IProps {
    width?: any
    height?: any
    color?: any
}

export default function JobIconSvg(props: IProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={props.width || '17.688'} height={props.height || '16.803'} viewBox={`0 0 ${(props.width || '17.688')} ${(props.height || '16.803')}`}>
            <g id="_15a745d9af056ec2f4cf5fcc77b88892" data-name="15a745d9af056ec2f4cf5fcc77b88892" transform="translate(-10 -34.5)">
                <path id="Path_29" data-name="Path 29" d="M638.863,577.343A9.611,9.611,0,0,0,633,571.152a.421.421,0,1,0-.33.774,8.281,8.281,0,0,1,5.306,5.528c0,.222.222.332.442.332h.11C638.753,577.785,638.863,577.565,638.863,577.343Z" transform="translate(-611.175 -526.924)" fill={props.color || '#fff'} />
                <path id="Path_30" data-name="Path 30" d="M15.859,577.25A8.92,8.92,0,0,0,10,583.441a.591.591,0,0,0,.332.442h.11c.222,0,.332-.11.442-.332a8.077,8.077,0,0,1,5.306-5.528.4.4,0,0,0,.22-.552C16.413,577.25,16.081,577.14,15.859,577.25Z" transform="translate(0 -532.912)" fill={props.color || '#fff'} />
                <path id="Path_31" data-name="Path 31" d="M255,38.922a4.422,4.422,0,1,0,4.422-4.422A4.422,4.422,0,0,0,255,38.922Z" transform="translate(-240.578)" fill={props.color || '#fff'} />
                <path id="Path_32" data-name="Path 32" d="M421.837,561.3l-1.437.552,1.106.994-.994,4.422,1.327,1.327,1.327-1.327-.995-4.422,1.106-.994Z" transform="translate(-402.993 -517.292)" fill={props.color || '#fff'} />
            </g>
        </svg>
    );
}
