import React, { Component, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { components } from 'react-select';


export let CustomSelectControlSettings: any = {
    showPlaceModal: null
}

export default function CustomSelectControl({ children, ...props }: any) {
    return (
        <components.Control {...props}>
            {children}
            <i className="icofont-plus-circle me-2 fs-4" onClick={CustomSelectControlSettings.showPlaceModal}></i>
        </components.Control>
    );
}