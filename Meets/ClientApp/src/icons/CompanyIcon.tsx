import React, { Component, useState } from 'react';

export default function CompanyIcon() {
    return (<img src="content/icons/job-icon.svg" alt="" onDragStart={e => e.preventDefault()} />);
}