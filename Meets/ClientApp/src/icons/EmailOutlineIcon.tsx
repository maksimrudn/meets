import React, { Component, useState } from 'react';

export default function EmailOutlineIcon() {
    return (<img src="content/icons/feather-outline-email.svg" alt="" onDragStart={e => e.preventDefault()} />);
}