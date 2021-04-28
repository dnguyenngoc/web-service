import React, { useState, useEffect, MouseEvent, CSSProperties, Component } from 'react';

import '../styles/ImagePreview.scss'

class ImagePreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      origin: this.props.origin,
      crop: this.props.crop,
      fields: this.props.fields,
      typeShow: this.props.typeShow,
    };
  }
    
  makeFieldData(fields) {
      return(
        fields.map((field) =>    
          <div className = 'details'>
            <p className = 'field-name'>{field.name}</p>
            <a className = 'field-image'>
              <img src = {field.value}></img>
            </a>
          </div>
        )
      );
  }

  render() {
    const { origin, crop, fields, typeShow } = this.state;
    return (
      <div className={ typeShow == 1 ? 'image-preview' : 'image-preview1' }>
        <div className='main-content'>
          <div className = 'origin'>
             <p className = 'name-fix'>Origin Image</p>
             <a>
               <img className = 'image-fix' src = {origin.value}></img>
             </a>
          </div>
          <div className = 'crop'>
             <p className = 'name-fix'>Crop Image</p>
             <a>
               <img className = 'image-fix' src = {crop.value}></img>
             </a>
          </div>
        </div>
        <div className='field-content'>{this.makeFieldData(fields)}</div> 
      </div>
    );
  }
}
export default ImagePreview;