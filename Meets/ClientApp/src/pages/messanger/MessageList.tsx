import React, { Component, useEffect, useRef, useState } from 'react';
import Message from './Message';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { Link } from 'react-router-dom';
import { scrollIntoView } from 'scroll-polyfill';
import MessageDTO from '../../contracts/message/MessageDTO';

import './MessageList.scss';
import SendMessageIcon from '../../icons/SendMessageIcon';

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
                        NotificationManager.error(err.message, undefined);
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
                    NotificationManager.error(err.message, undefined);
                }
            }

        }
    }

    const scrollMessages = () => {
        scrollIntoView(scrollElem.current, { inline: 'nearest', block: 'nearest' });
    }

    return (
        <>
            <NotificationContainer />

            {props.targetUserId && // card card-chat-body border-0  w-100 px-4 px-md-5 py-3 py-md-4
                <div className="MessageList">
                    {/*<div className="chat-header d-flex justify-content-between align-items-center border-bottom pb-3">*/}
                    {/*    <Link to={`/user/details/${props.targetUser.id}`} className="d-flex align-items-center">*/}
                    {/*        <img className="avatar rounded-circle" src="/assets/images/xs/avatar6.jpg" alt=""></img>*/}
                    {/*        <div className="ms-3">*/}
                    {/*            <h6 className="mb-0">{props.targetUser.fullName}</h6>*/}
                    {/*        </div>*/}
                    {/*    </Link>*/}
                    {/*</div>*/}
                    <ul className="Chat">{/* chat-history list-unstyled mb-0 py-lg-5 py-md-4 py-3 flex-grow-1 */}
                        {props.messages?.map((m: MessageDTO) =>
                            <Message
                                text={m.text}
                                createDate={m.createdate}
                                receiverId={m.receiverId}
                                targetId={props.targetUserId}
                            />
                        )}
                        <li ref={scrollElem}></li>{/* style={{ position: 'relative', bottom: -10, left: 0 }} */}
                    </ul>
                    <div className="ChatMessage">

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
            }
        </>
    )
}
