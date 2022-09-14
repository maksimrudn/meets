import React, { Component, useState } from 'react';

export default function RoubleSignIcon() {
    return (<img src="content/icons/awesome-ruble-sign.svg" alt="" onDragStart={e => e.preventDefault()} />);
}