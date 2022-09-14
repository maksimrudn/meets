import React, { Component, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { components } from 'react-select';



export default function CustomSelectDropdown(props: any) {
    return (
        <div style={{ width: 0, height: 0, paddingLeft: '8px' }}>
            <components.DropdownIndicator {...props}><span></span></components.DropdownIndicator>
        </div>
    );
}