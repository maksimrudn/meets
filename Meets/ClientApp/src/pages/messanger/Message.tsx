import React, { Component } from 'react';
import * as moment from 'moment-timezone';

import './Message.scss';

interface IMessageProps {
    text: string
    createDate: any
    receiverId: any
    targetId: any
}

export default function Message(props: IMessageProps) {
    if (props.receiverId != props.targetId) {
        return (
            <li className="Message mb-3 d-flex flex-row align-items-end">
                <div className="Sender">
                    <div className="card p-3">
                        <div className="message">{props.text}</div>
                    </div>
                </div>
            </li>
        )
    }
    else {
        return (
            <li className="Message mb-3 d-flex flex-row-reverse align-items-end">
                <div className="Receiver text-right">
                    <div className="card p-3">
                        <div className="message text-left">{props.text}</div>
                    </div>
                </div>
            </li>
        )
    }
}
