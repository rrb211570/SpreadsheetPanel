import React from "react";
import { Provider, connect } from 'react-redux'
import { store, mapStateToProps, mapDispatchToProps } from './../../../src/store/store.js'
import TitleInput from "./../../../src/components/TitleInput/TitleInput.js";
import MenuPanel from "./../../../src/components/MenuPanel/MenuPanel.js";
import SpreadSheetPanel from "./../../../src/components/SpreadSheetPanel/SpreadSheetPanel.js";
import './BodyPanel.css'

class MainPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'Untitled'
        }
        this.changeTitle = this.changeTitle.bind(this);
    }
    changeTitle(e) {
        this.setState({ title: e.target.value });
    }
    render() {
        return (
            <div id='body'>
                <div id='body__header'>
                    <img id='body__logo' src='tulip.png' alt='Tulip logo' />
                    <div id='body__titleAndMenuBar'>
                        <TitleInput title={this.state.title} setTitle={this.changeTitle} />
                        <MenuPanel />
                    </div>
                </div>
                <SpreadSheetPanel rows={this.props.defaultRows} cols={this.props.defaultCols} rowHeight={this.props.defaultRowHeight} colWidth={this.props.defaultColWidth} storageURL={this.props.storageURL} />
            </div>
        );
    }

}
const MainContainer = connect(mapStateToProps, mapDispatchToProps)(MainPanel);
function BodyPanel(defaultRows, defaultCols, defaultRowHeight, defaultColWidth, storageURL) {
    return (
        <div>
            <Provider store={store}>
                <MainContainer defaultRows={defaultRows} defaultCols={defaultCols} defaultRowHeight={defaultRowHeight} defaultColWidth={defaultColWidth} storageURL={storageURL} />
            </Provider>
        </div>
    );
}

export default BodyPanel;