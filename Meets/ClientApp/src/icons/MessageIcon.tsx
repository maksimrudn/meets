import React, { Component, useState } from 'react';

export default function MessageIcon() {
    return (<img src = "content/icons/message-icon.svg" alt="" onDragStart={e => e.preventDefault()} />);
}