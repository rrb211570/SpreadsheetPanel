import React from "react";
import HoverHorizontalDropdown from "../../general/HoverHorizontalDropdown/HoverHorizontalDropdown";
import './SubCategories.css';

const FONT_FAMILY = 'Font Family';
const FONT_SIZE = 'Font Size';
const TEXT = 'Text';
const FONT_COLOR = 'Font Color';
const CELL_COLOR = 'Cell Color';
const ALIGNMENT = 'Alignment';

function SubCategories({ category, revealFlag }) {
    const [options, setOptions] = useState();

    let highlightItem = (e) => {
        e.target.style.backgroundColor = 'rgb(212, 212, 212)';
    }

    let removeHighlightItem = (e) => {
        e.target.style.backgroundColor = 'white';
    }

    let revealDropdown = (e) => {
        switch (e.target.value) {
            case FONT_FAMILY:
                setOptions([
                    <div key='0' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Calibri</div>,
                    <div key='1' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Times New Roman</div>,
                    <div key='2' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Ebrima</div>,
                    <div key='3' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Century Gothic</div>,
                ]);
                break;
            case FONT_SIZE:
                setOptions([
                    <div key='0' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>6</div>,
                    <div key='1' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>7</div>,
                    <div key='2' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>8</div>,
                    <div key='3' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>9</div>,
                    <div key='4' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>10</div>,
                    <div key='4' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>11</div>,
                    <div key='4' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>12</div>,
                    <div key='4' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>14</div>,
                    <div key='4' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>18</div>,
                    <div key='4' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>24</div>,
                    <div key='4' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>36</div>,
                ]);
                break;
            case TEXT:
                setOptions([
                    <div key='0' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Bold</div>,
                    <div key='1' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Italic</div>,
                    <div key='2' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Strikethrough</div>,
                ]);
                break;
            case FONT_COLOR:
                setOptions([
                    <div key='0' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Black</div>,
                    <div key='1' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Red</div>,
                    <div key='2' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Green</div>,
                    <div key='3' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Blue</div>,
                ]);
                break;
            case CELL_COLOR:
                setOptions([
                    <div key='0' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Black</div>,
                    <div key='1' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Red</div>,
                    <div key='2' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Green</div>,
                    <div key='3' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Blue</div>,
                ]);
                break;
            case ALIGNMENT:
                setOptions([
                    <div key='0' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Left</div>,
                    <div key='1' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Center</div>,
                    <div key='2' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Right</div>,
                    <div key='3' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Top</div>,
                    <div key='4' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Middle</div>,
                    <div key='5' className='hoverHorizontalDropdown__option' onMouseEnter={highlightItem} onMouseLeave={removeHighlightItem}>Bottom</div>,
                ]);
                break;
            default: break;
            // document.querySelector('.hoverHorizontalDropdown').style.opacity = 1;
        }

    }
    return (
        <div className='hoverHorizontalDropdown'>
            <HoverHorizontalDropdown triggerOption={revealDropdown} defaultOption={FONT_FAMILY} options={options} />
        </div>
    );
}

export default SubCategories;