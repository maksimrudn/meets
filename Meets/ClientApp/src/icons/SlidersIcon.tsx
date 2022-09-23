import React, { Component, useState } from 'react';

export default function SlidersIcon() {
    return (<img src="content/icons/awesome-sliders-h.svg" alt="" onDragStart={e => e.preventDefault()} />);
}