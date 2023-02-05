import React from "react";
import './TitleInput.css'

function TitleInput({ title, setTitle }) {
    return (
        <div>
            <input className='titleInput' type="text" value={title} style={{width: title.length+'ch'}} onChange={setTitle}/>
        </div>
    );
}

export default React.memo(TitleInput);