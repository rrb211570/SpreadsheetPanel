import React from "react";
import './HorizontalDropdown.css'

function HorizontalDropdown({ triggerOption, defaultOption, options}) {
    return (
        <div>
            <select className='horizontalDropdown' value={defaultOption} onChange={triggerOption}>
                {options}
            </select>
        </div>
    );
}

export default HorizontalDropdown;