import React, { Component } from 'react';

class FileSelect extends Component{
    
    constructor(props){
        super(props);
    }

    getFiles(event) {
        return event.target.files;
    }

    render() {
        return (
                <input onChange={e => this.props.onChange(this.getFiles(e))}
                style={{width:200}} 
                type="file" 
                id="file-selector" 
                accept=".png"
                multiple/>
        )
    }
}

export default FileSelect;