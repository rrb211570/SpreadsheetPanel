import React from "react";
import './VerticalDropdown.css'

function VerticalDropdown({ option, triggerOption, options, hideArrow }) {
    return (
        <div>
            <select className='verticalDropdown' value={option} onChange={triggerOption} style={{ appearance: hideArrow == true ? 'none' : undefined }}>
                {options}
            </select>
        </div>
    );
}

export default VerticalDropdown;