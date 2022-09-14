import React, { Component, useState } from 'react';

export default function MenuCloseIcon() {
    return (<img src="content/icons/feather-menu-close.svg" alt="" onDragStart={e => e.preventDefault()} />);
}