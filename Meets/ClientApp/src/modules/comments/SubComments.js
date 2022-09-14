import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Moment from 'react-moment';
import 'moment-timezone';
import 'moment/locale/ru';
import participationService from '../../api/ParticipationService';
import commentService from '../../api/CommentService';
import eventService from '../../api/EventService';
import CommentTargetType from '../../common/CommentTargetType';
import AppConfig from '../../common/AppConfig';
import { getAvatarPathForUser } from '../../common/Utils';
Moment.globalLocale = 'ru';



export default function SubComments(props) {
    let {
        userInfo,
        comment,
        onCommentSubmit
    } = props;

    const [isShow, setIsShow] = useState(false);
    const [subComments, setSubComments] = useState([]);
    const [subCommentText, setSubCommentText] = useState('');


    const showHideComments = () => {
        if (isShow) {
            setIsShow( false );
        } else {
            setIsShow(true);
            updateSubComments();            
        }
    }

    const updateSubComments = () => {
        try {
            var subComments = commentService.getSubCommentList(
                comment.targetId,
                comment.targetType,
                comment.id);
            setSubComments(subComments);
        }
        catch {

        }
    }

    const onSubCommentTextChange = (e) => {
        setSubCommentText( e.target.value );
    }

    const onCommentSubmitOverride = (e) => {
        try {
            onCommentSubmit(e);
            setSubCommentText('');
            updateSubComments();
        }
        catch {}
    }

    
    return (
        <>
            <div className="timeline-item-post">
                <p>{comment.text}</p>
                <div className="mb-2 mt-4">
                    <a className="me-lg-4 me-2 text-primary CommentShowHide"
                        href={null} onClick={showHideComments}
                        style={{ cursor: 'pointer' }}>
                        <i className="icofont-speech-comments"></i>
                        Комментарии ({isShow ? subComments.length : comment.subCommentsCount})
                    </a>
                </div>
                {isShow &&
                    <div> 
                        {subComments && subComments.map(subComment =>
                            <div key={subComment.id} className="d-flex mt-3 pt-3 border-top">
                                <img className="avatar rounded-circle" src={getAvatarPathForUser(subComment.author)} alt="" />
                                <div className="flex-fill ms-3 text-truncate">
                                    <p className="mb-0">
                                        <Link className="fw-bold" to={'/user/details/' + comment.author.id} >
                                            <span>{subComment.author.fullName}</span>
                                        </Link>
                                        <small className="ms-1 msg-time">
                                            <Moment date={subComment.createDate} format="DD.MM.YYYY HH:mm:ss" />
                                        </small>
                                    </p>
                                    <span className="text-muted">{subComment.text}</span>
                                </div>
                            </div>
                        )}
                    </div>
                }
            </div>

            {userInfo.isAuthenticated &&

            <div className="mt-4">
                <form onSubmit={onCommentSubmitOverride}>

                    <textarea className="form-control" name="Text" value={subCommentText} placeholder="Ответить" rows="4" onChange={onSubCommentTextChange}></textarea>
                    <input type="number" name="TargetId" value={comment.targetId} hidden readOnly />
                    <input type="text" name="TargetType" value={comment.targetType} hidden readOnly />
                    <input type="text" name="ParentId" value={comment.id} hidden readOnly />
                    <br />
                    <input type="submit" className="btn btn-primary float-sm-end  mt-2 mt-sm-0" value="Отправить" disabled={!subCommentText} />

                </form>
            </div>
            }
        </>
    );
    
}