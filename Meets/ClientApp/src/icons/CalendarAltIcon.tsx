import React, { Component, useState } from 'react';

export default function CalendarAltIcon() {
    return (<img src="content/icons/awesome-calendar-alt.svg" alt="" onDragStart={e => e.preventDefault()} />);
}