import React, { Component } from "react";
import Dropzone from "./Dropzone.js";
import "../styles/Upload.scss";
import Progress from "./Progress.js";
import {  Dropdown } from 'reactjs-dropdown-component';

class Upload extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      apiUrl: this.props.apiUrl, 
      typeDocSelect: null,
      typeDocList: [
        {
            label: 'Identity Card',
            value: 'identity-card',
        },
        {
            label: 'Discharge Record',
            value: 'discharge-record',
        },
      ],
      files: [],
      uploading: false,
      uploadProgress: {},
      successfullUploaded: false
    };

    this.onFilesAdded = this.onFilesAdded.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.renderActions = this.renderActions.bind(this);
  }
    
  onChange = (item, name) => {
    console.log(item)
    console.log(name)
  }

  onFilesAdded(files) {
    this.setState(prevState => ({
      files: prevState.files.concat(files)
    }));
  }

  async uploadFiles() {
    this.setState({ uploadProgress: {}, uploading: true });
    const promises = [];
    this.state.files.forEach(file => {
      promises.push(this.sendRequest(file));
    });
    try {
      await Promise.all(promises);

      this.setState({ successfullUploaded: true, uploading: false });
    } catch (e) {
      // Not Production ready! Do some error handling here instead...
      this.setState({ successfullUploaded: true, uploading: false });
    }
  }

  sendRequest(file) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      req.upload.addEventListener("progress", event => {
        if (event.lengthComputable) {
          const copy = { ...this.state.uploadProgress };
          copy[file.name] = {
            state: "pending",
            percentage: (event.loaded / event.total) * 100
          };
          this.setState({ uploadProgress: copy });
        }
      });

      req.upload.addEventListener("load", event => {
        const copy = { ...this.state.uploadProgress };
        copy[file.name] = { state: "done", percentage: 100 };
        this.setState({ uploadProgress: copy });
        resolve(req.response);
      });

      req.upload.addEventListener("error", event => {
        const copy = { ...this.state.uploadProgress };
        copy[file.name] = { state: "error", percentage: 0 };
        this.setState({ uploadProgress: copy });
        reject(req.response);
      });

      const formData = new FormData();
      formData.append("image", file, file.name);
      formData.append("type_doc", this.state.typeDocSelect)
      req.open("POST", this.state.apiUrl);
      req.send(formData);
    });
  }

  renderProgress(file) {
    const uploadProgress = this.state.uploadProgress[file.name];
    if (this.state.uploading || this.state.successfullUploaded) {
      return (
        <div className="ProgressWrapper">
          <Progress progress={uploadProgress ? uploadProgress.percentage : 0} />
          <img
            className="CheckIcon"
            alt="done"
            src="baseline-check_circle_outline-24px.svg"
            style={{
              opacity:
                uploadProgress && uploadProgress.state === "done" ? 0.5 : 0
            }}
          />
        </div>
      );
    }
  }

  renderActions() {
    if (this.state.successfullUploaded) {
      return (
        <button
          onClick={() =>
            this.setState({ files: [], successfullUploaded: false })
          }
        >
          Clear
        </button>
      );
    } else {
      return (
        <button
          disabled={this.state.files.length < 0 || this.state.uploading}
          onClick={this.uploadFiles}
        >
          Upload
        </button>
      );
    }
  }

  render() {
    return (
      
        
        
        
      <div className="UploadS">
        <div className = 'UploadContent floatybox'>
            <span className="Title">Upload Files</span>
            <div className="Files">
                <div className="Content">
                     <div>
                        <Dropzone
                          onFilesAdded={this.onFilesAdded}
                          disabled={this.state.uploading || this.state.successfullUploaded}
                        />
                     </div>
                </div>
            </div>

        </div>
         <div className = 'ActionContent floatybox'>
             <div className = "DocumentType">
                <Dropdown
                  name="type"
                  title="Select Document"
                  list={this.state.typeDocList}
                  onChange={this.onChange}/>
             </div>
            <div className = "ListFile">
                {
                   this.state.files.map(file => {
                      return (
                        <div key={file.name} className="Row">
                          <span className="Filename">{file.name}</span>
                          {this.renderProgress(file)}
                        </div>
                      );
                   })
                }
            </div>
                
          
        </div>
        <div className="DocumentUpload">

             
               
                
            </div>
      </div>
    );
  }
}
//   <div className="Files">
//                 <div className="Content">
//                      <div>
//                         <Dropzone
//                           onFilesAdded={this.onFilesAdded}
//                           disabled={this.state.uploading || this.state.successfullUploaded}
//                         />
//                      </div>
//                     
//               </div>
//             </div>

export default Upload;
//             <div className="Actions">{this.renderActions()}</div>


//  <div className="DocumentUpload">
//             <div className="Files">
//             <div className="Content">
//               <div>
//                 <Dropzone
//                   onFilesAdded={this.onFilesAdded}
//                   disabled={this.state.uploading || this.state.successfullUploaded}
//                 />
//               </div>
//                 {this.state.files.map(file => {
//                   return (
//                     <div key={file.name} className="Row">
//                       <span className="Filename">{file.name}</span>
//                       {this.renderProgress(file)}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//                 <div className="Actions">{this.renderActions()}</div>
//             </div>