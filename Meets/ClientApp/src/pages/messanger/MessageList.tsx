import React, { Component, useEffect, useRef, useState } from 'react';
import Message from './Message';
import { Link } from 'react-router-dom';
import { scrollIntoView } from 'scroll-polyfill';
import MessageDTO from '../../contracts/message/MessageDTO';

import './MessageList.scss';
import SendMessageIcon from '../../icons/SendMessageIcon';
import { toast } from 'react-toastify';

interface MessageListProps {
    targetUserId: any,
    onSendMessage: (text: any, receiverId: any) => void,
    messages: MessageDTO[],
    isCanSendMessage: boolean
}

export default function MessageList(props: MessageListProps): JSX.Element {
    const [messageText, setMessageText] = useState<string>('');

    // элемент для скролла сообщений
    let scrollElem = useRef<HTMLLIElement>(null);

    useEffect(() => {
        scrollElem.current?.scrollIntoView({ behavior: 'smooth' });
        // setTimeout(() => { scrollMessages(); });
    }, [props.messages]);

    // "переопределение" метода контейнера (Messanger) для добавления возможности очистки поля Text после отправки
    const onSendMessage = (e: any) => {
        if (e.type === 'keydown') {

            if (e.keyCode == 13 && !e.ctrlKey) {
                e.preventDefault();

                if (messageText.trim()) {
                    try {
                        props.onSendMessage(messageText, props.targetUserId);
                        setMessageText('');
                    }
                    catch (err: any) {
                        toast.error(`Ошибка, ${err.message}`);
                    }
                }
            }

        } else if (e.type === 'click') {

            if (messageText.trim()) {
                try {
                    props.onSendMessage(messageText, props.targetUserId);
                    setMessageText('');
                }
                catch (err: any) {
                    toast.error(`Ошибка, ${err.message}`);
                }
            }

        }
    }

    return (
        <>
            {props.targetUserId &&
                <div className="MessageList">
                    <ul className="Chat">
                        {props.messages?.map((m: MessageDTO) =>
                            <Message
                                text={m.text}
                                createDate={m.createdate}
                                receiverId={m.receiverId}
                                targetId={props.targetUserId}
                            />
                        )}
                        <li ref={scrollElem}></li>
                    </ul>
                    <div className="ChatMessage">

                        <div className="MsgWrap">
                            {props.isCanSendMessage &&
                                <div className="input-group">
                                    <textarea
                                        className="form-control"
                                        name="Text"
                                        value={messageText}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessageText(e.target.value)}
                                        onKeyDown={onSendMessage}>
                                    </textarea>
                                    <span className="input-group-text" onClick={onSendMessage}><SendMessageIcon /></span>
                                </div>
                            }
                        </div>

                    </div>
                </div>
            }
        </>
    )
}
