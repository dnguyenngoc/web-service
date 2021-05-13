import React, { Component } from 'react';


export default class MultipleImageUploadComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            typeDoc: 'identity-card',
            apiUrl: this.props.apiUrl,
            files: [], // list url of file
            fileObj: [], // list bytes value
            fileStatus: [], // status of file right now
            isUploadCompleted: false,
        }
        this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this)
        this.uploadFiles = this.uploadFiles.bind(this)
    }

    uploadMultipleFiles(e) {
        const addfiles = [];
        const addfileObj = [];
        const addfileToApi = [];
        const fileStatus = [];
        addfileObj.push(e.target.files)
        for (let i = 0; i < addfileObj[0].length; i++) {
            fileStatus.push(1)
            addfiles.push(URL.createObjectURL(addfileObj[0][i]))
            addfileToApi.push(addfileObj[0][i])
        }
        let newFiles = this.state.files
        newFiles.push.apply(newFiles, addfiles)
        let newfileToApi =  this.state.fileObj
        newfileToApi.push.apply(newfileToApi, addfileToApi)
        this.setState({ files: newFiles, fileObj: newfileToApi, fileStatus: fileStatus})
        
    }
    
    mutipleUploadApiService() {
        const listStatus = []
         console.log(this.state.fileObj.length);
         for (let i = 0; i < this.state.fileObj.length; i++){
             const dataId = new FormData()
             dataId.append('type_doc', this.state.typeDoc);
             dataId.append('image', this.state.fileObj[i]);
             const requestOptions = { method: 'POST', body: dataId}
             fetch(this.state.apiUrl, requestOptions)
                .then(response =>{
                  if (!response.ok) {
                      listStatus.push(5);
                       console.log(response);
                  }
                  else {
                      listStatus.push(4);
                      console.log(response);
                  }
              }
            );
         }
        this.setState({fileStatus: listStatus, isUploadCompleted: true})
        

    }
    
    async uploadFiles(e) {
        const listStatus = []
        e.preventDefault()
        if (this.state.apiUrl === undefined){
            for (let i = 0; i < this.state.fileObj.length; i++) {
                listStatus.push(5); // 5 is bad service 2 is waiting for upload
            } 
            this.setState({fileStatus: listStatus, isUploadCompleted: true})
        } else {
             await this.mutipleUploadApiService();
//              window.location.reload(false);
        }
    }
    
    cleanFiles(){
         window.location.reload(false);
    }
    
     makeListImage(files, num){
        var con = []
        var cha = []
        var k =1
        const len = files.length
        for (let i = 0; i< len; i++) {
            con.push(<div className='image-preview-x'><div className="image-content"> <img src={files[i]} alt="..."  className='imgfit'/></div></div>)
            if (k == num || (i == (len-1) && k %num !== 0)){
                 cha.push(<div className='multi-preview'>{con}</div>);
                 var con = [];
                 var k = 0;
            }
            k++;
        }
        return cha
    }
     makeListImage2(files){
         var con = []
         const len = files.length
         for (let i = 0; i< len; i++) {
            con.push(<div className='image-preview-x'><div className="image-content"> <img src={files[i]} alt="..."  className='imgfit'/></div></div>)
         }
         return (<div className='multi-preview'>{con}</div>)
     }
   
    
    render() {
        const {files, list, isUploadCompleted} = this.state;
        return (
            <div className="mutiple-form">
                <form>
                    <p>{isUploadCompleted === true ? "completed": ""}</p>
                    {this.makeListImage2(files)}       

                    <div className="form-group">
                        <input type="file" className="form-control" onChange={this.uploadMultipleFiles} multiple />
                    </div>
                    <div className='button-group'>
                         <button type="button" className="btn btn-danger btn-block space" onClick={this.uploadFiles}>Upload</button>
                         <p></p>
                         <button type="button" className="btn btn-danger btn-block space" onClick={this.cleanFiles}>Exit</button>
                    </div>

                </form >
             </div>
        )
    }
}

