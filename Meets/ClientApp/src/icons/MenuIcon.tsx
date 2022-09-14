import React, { Component, useState } from 'react';

export default function MenuIcon() {
    return (<img src="content/icons/feather-menu.svg" alt="" onDragStart={e => e.preventDefault()} />);
}