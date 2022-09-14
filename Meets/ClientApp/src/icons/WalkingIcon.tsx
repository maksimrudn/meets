import React, { Component, useState } from 'react';

export default function WalkingIcon() {
    return (<img src="content/icons/awesome-walking.svg" alt="" onDragStart={e => e.preventDefault()} />);
}