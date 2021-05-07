import React, { Component } from 'react';

import ReactFlow, {
//   removeElements,
//   addEdge,
//   MiniMap,
//   Controls,
//   Background,
//   isNode,
//   Node,
//   Elements,
//   FlowElement,
//   OnLoadParams,
//   FlowTransform,
//   SnapGrid,
//   ArrowHeadType,
//   Connection,
//   Edge,
} from 'react-flow-renderer';
import ImagePreview from './ImagePreview.js'
import '../styles/container.scss'


const API_SERVER = 'http://10.1.33.76:8081/api'


function getCurrentDate(separator='-'){
    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date<10?`0${date}`:`${date}`}`
}


class Overview extends Component {
    constructor(props) {
    super(props);
      this.state = {
        elements: [],
        typeShow: 0,
        origin: {},
        crop: {},
        fields: [],
        selectId: 0,
        day: getCurrentDate(),
        fullWorflow: {
            import: 0,
            identityCardGood: 0,
            identityCardBad: 0,
            dischargeRecordGood: 0,
            dischargeRecordBad: 0,
            fieldExtractIdentityCard: 0,
            fieldExtractDischargeRecord: 0,
            ocrIdentityCard: 0,
            ocrDischargeRecord: 0,
            transformIdentityCard: 0,
            transformDischargeRecord: 0
        },
        identityCard: {
            len: 0,
            data: [],
           
        },
         dischargeRecord: {
            len: 0,
            data: [],
        },
        isLoading: true,
      }
    }

    async componentDidMount(){
        await fetch(API_SERVER + '/v1/worflow-v1/preview/full-worflow/pipeline', { method: 'GET'})
            .then(response => response.json())
            .then(data => {
                 this.setState({fullWorflow: data})
            }
        );
        const initElementLinking = [
          { id: 'e1-2', source: '1', target: '2', label: 'Classify',},
          { id: 'e1-3', source: '1', target: '3', label: 'Classify',},
          { id: 'e2-4', source: '2', target: '4', animated: true, label: 'Extract',},
          { id: 'e3-4', source: '3', target: '4', animated: true, label: 'Extract',},
          { id: 'e4-5', source: '4', target: '5', animated: true, label: 'OCR',},
          { id: 'e5-6', source: '5', target: '6', animated: true, label: 'Transform',},
          { id: 'e5-7', source: '5', target: '7', animated: true, label: 'Transform',},
        ]
      const importData = { 
          id: '1', 
          type: 'input',
          data: {label: (<><strong>Import Data</strong> ({this.state.fullWorflow.import})</>),}, 
          position: { x: 700, y: 50 }, 
          style: {width: 200}
      }
      const identityCard = { 
          id: '2', 
          data: {label: (<>Identity Card<br/><a>Good: {this.state.fullWorflow.identityCardGood}</a><br/><a>Bad: {this.state.fullWorflow.identityCardBad}</a></>),}, 
          position: { x: 500, y: 150}
      }
      const dischargeRecord = { 
          id: '3', 
          data: {label: (<>Discharge Record<br/> <a>Good: {this.state.fullWorflow.dischargeRecordGood}</a><br/>
                <a>Bad: {this.state.fullWorflow.dischargeRecordBad}</a></>),}, 
          position: { x: 1000, y: 150 }
     }
      const fieldExtract = { 
          id: '4', 
          data: {label: (<>ML Field Extract<br/><a>ID_Card: {this.state.fullWorflow.fieldExtractIdentityCard}</a>
                <br/> <a>D_Record: {this.state.fullWorflow.fieldExtractDischargeRecord}</a> </>),}, 
          position: { x: 750, y: 300 }
      }
      const ocr = {
          id: '5', 
          data: {label: (<>ML Ocr<br/><a>ID_Card: {this.state.fullWorflow.ocrIdentityCard}</a> <br/>
              <a>D_Record: {this.state.fullWorflow.ocrDischargeRecord}</a> </>),}, 
          position: { x: 750, y: 450 }
      }
      const transformIdentityCard = { 
          id: '6', 
          type: 'output',
          data: {label: (<><strong>Identity Card Transform</strong> ({this.state.fullWorflow.transformIdentityCard})</>),}, 
          position: { x: 500, y: 600 }
      }
      const transformDischargeRecord = { 
          id: '7', 
          type: 'output', 
          data: {label: (<><strong>Discharge Record Transform</strong> ({this.state.fullWorflow.transformDischargeRecord})</>),}, 
          position: { x: 1000, y: 600 }
      }
      const initialElements = [importData, identityCard, dischargeRecord, fieldExtract, ocr, transformIdentityCard, transformDischargeRecord]
      const initialElementsEnd = initialElements.concat(initElementLinking);
      this.setState({elements: initialElementsEnd})
    }
    
    async handleClick(type, date = this.state.day) {
       if (type === 'identity-card') {
            const dataId = new FormData()
            dataId.append('type_id', 1);
            dataId.append('status_id', 2);
            dataId.append('day', this.state.day);
            const requestOptions = { method: 'POST', body: dataId}
            await fetch(API_SERVER + '/v1/worflow-v1/preview', requestOptions)
                .then(response => response.json())
                .then(data => {
                    this.setState({identityCard: {data: data, len: data.length}})
                }
            );
            await this.setState({
                origin: this.state.identityCard.data[0].origin, 
                crop: this.state.identityCard.data[0].crop,
                fields: this.state.identityCard.data[0].fields,
                typeShow: 1,
            });
        } else if (type === 'discharge_record'){
            const dataId = new FormData()
            dataId.append('type_id', 2);
            dataId.append('status_id', 2);
            dataId.append('day', this.state.day);
            await fetch(API_SERVER + '/v1/worflow-v1/preview', { method: 'POST', body: dataId})
                .then(response => response.json())
                .then(data => {
                    this.setState({dischargeRecord: {data: data, len: data.length}})
                }
            );
            await this.setState({
                origin: this.state.dischargeRecord.data[0].origin, 
                crop: this.state.dischargeRecord.data[0].crop,
                fields: this.state.dischargeRecord.data[0].fields,
                typeShow: 2,
            });
        }
        else this.setState({typeShow: 0})
    }
    render() {
        const {typeShow, origin, crop, fields, isLoading } = this.state;
        return (
            <div className='overview'>
              <div className='overview__content'>
                <div className='overview__content__group'>
                  <a
                     onClick={() => this.handleClick('full_workflow')}
                     className='overview__content__field margin__top__40' >Full Workflow
                  </a>
                  <a className='overview__content__field' onClick={() => this.handleClick('identity-card')}>Identity Card</a>
                  <a className='overview__content__field' onClick={() => this.handleClick('discharge-record')}>Discharge Record</a>
                </div>
              </div>
            {
                this.state.typeShow === 0 ? <ReactFlow className='overview__graph' elements={this.state.elements}></ReactFlow>
                    : <ImagePreview 
                         key={typeShow}
                         origin= {origin}
                         crop={crop}
                         fields = {fields}
                         typeShow = {typeShow}
                     />
            }
            </div>
        );
    }
}
    
export default Overview;
