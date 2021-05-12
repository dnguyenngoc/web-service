import React, { Component } from 'react';
import MultipleImageUploadComponent from './popup/MultipleImageUpload.js'
import '../styles/Upload.scss'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type,
            apiUrl: this.props.apiUrl,
        };
       
    }
    render() {
        const {type} = this.state;
        
        return (
          (type === "mutiple" || type === undefined) ? 
              <div className="container">
                <div className="row">
                  <div className="item-raw">
                    <div className="card">
                      <div className="card-header">
                        Upload Image
                      </div>
                      <div className="card-body">
                        <MultipleImageUploadComponent apiUrl= {this.state.apiUrl}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            :
              <div>Not Now</div>
            
        )
    }
}
export default Upload;
