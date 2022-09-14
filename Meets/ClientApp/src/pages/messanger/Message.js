import React, { Component } from 'react';
import * as moment from 'moment-timezone';


export default class Message extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var createDateStr = moment(this.props.createDate).format("DD.MM.YYYY HH:mm");

        if (this.props.receiverid != this.props.targetid) {
            return (
                <li className="mb-3 d-flex flex-row align-items-end">
                    <div className="max-width-70">
                        <div className="max-width-70">
                            <img class="avatar sm rounded-circle me-1" src="assets/images/xs/avatar2.jpg" alt="avatar"></img>
                            <span class="text-muted small">{createDateStr}</span>
                        </div>
                        <div className="card border-0 p-3">
                            <div class="message">{this.props.text}</div>
                        </div>
                    </div>
                </li>
            )
        }
        else {
            return (
                <li className="mb-3 d-flex flex-row-reverse align-items-end">
                    <div className="max-width-70 text-right">
                        <div className="user-info mb-1">
                            <span className="text-muted small">{createDateStr}</span>
                        </div>
                        <div className="card border-0 p-3 bg-primary text-light">
                            <div className="message text-left">{this.props.text}</div>
                        </div>
                    </div>
                </li>
            )
        }
    }
}