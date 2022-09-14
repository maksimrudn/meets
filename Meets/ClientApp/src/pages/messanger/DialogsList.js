import React, { Component } from 'react';
import Dialog from './Dialog';


export default class DialogsList extends Component {
    constructor(props) {
        super(props);       
    }

    renderDialogs() {
        let dialogsList = this.props.dialogs.map((m) => (
            <Dialog
                text={m.text}
                createDate={m.createdate}
                fullName={m.receiver.fullName}
                receiverid={m.receiverId}
            />));

        return dialogsList;
    }

    render() {
        return (
            <>
                <div className="card card-chat border-right border-top-0 border-bottom-0  w380">
                    <div className="tab-content border-top">
                        <ul className="list-unstyled list-group list-group-custom list-group-flush mb-0">
                            {this.renderDialogs()}
                        </ul>
                    </div>
                </div>
            </>
        )
    }
}