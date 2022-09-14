import React, { Component, useState } from 'react';

export default function CalendarIcon() {
    return (<img src="content/icons/calendar-icon.svg" alt="" onDragStart={e => e.preventDefault()} />);
}