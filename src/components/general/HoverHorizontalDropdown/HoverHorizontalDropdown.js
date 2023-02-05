import React from "react";
import './HoverHorizontalDropdown.css'

function HoverHorizontalDropdown({ triggerOption, defaultOption, options }) {
    return (
        <div className='hoverHorizontalDropdown'>
            <select className='horizontalDropdown' value={defaultOption} onChange={triggerOption}>
                {options}
            </select>
        </div>
    );
}

export default HoverHorizontalDropdown;