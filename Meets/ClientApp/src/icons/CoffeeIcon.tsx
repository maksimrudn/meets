import React, { Component, useState } from 'react';

export default function CoffeeIcon() {
    return (<img src="content/icons/coffee-icon.svg" alt="" onDragStart={e => e.preventDefault()} />);
}