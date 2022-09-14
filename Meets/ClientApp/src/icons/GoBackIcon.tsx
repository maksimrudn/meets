import React, { Component, useState } from 'react';

export default function GoBackIcon() {
    return (<img src="content/icons/feather-heart-fill.svg" alt="" onDragStart={e => e.preventDefault()} />);
}