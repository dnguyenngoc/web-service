import React, { Component } from 'react';
import ReactLoading from "react-loading";
import ReactFlow, {
    Controls,
    ControlButton,
    ReactFlowProvider,
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
import RefreshIcon from '../assets/images/refresh button.png'
import Upload from './Upload.js'

const API_SERVER = 'http://161.117.87.31:8081/api'
const API_IMPORT_DOCUMENT = API_SERVER + '/v1/ftp/image/import'

function getCurrentDate(separator='-'){
    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date<10?`0${date}`:`${date}`}`
}
const onElementClick = (event, element) => {
    if (element.id == 1) {
        console.log('import click')
    }
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
            data: {},
           
        },
        dischargeRecord: {
            len: 0,
            data: {},
        },
        isLoading: true,
      }
    }

    async componentDidMount(){
        await fetch(API_SERVER + '/v1/workflow/full-workflow/pipeline', { method: 'GET'})
            .then(response => response.json())
            .then(data => {
                 this.setState({fullWorflow: data})
            }
        );
        const initElementLinking = [
          { id: 'e1-2', source: '1', target: '2', label: 'Classify', arrowHeadType: 'arrowclosed',},
          { id: 'e1-3', source: '1', target: '3', label: 'Classify',},
          { id: 'e2-4', source: '2', target: '4', animated: true, label: 'Extract',},
          { id: 'e3-4', source: '3', target: '4', animated: true, label: 'Extract',},
          { id: 'e4-5', source: '4', target: '5', animated: true, label: 'OCR',arrowHeadType: 'arrowclosed',  style: { stroke: 'blue' }},
          { id: 'e5-6', source: '5', target: '6', animated: true, label: 'Transform',type: 'smoothstep',
},
          { id: 'e5-7', source: '5', target: '7', animated: true, label: 'Transform', type: 'smoothstep',  style: { stroke: '#f6ab6c' }, labelStyle: { fill: '#f6ab6c'},
},
        ]
    
      const importData = { 
          id: '1', 
          type: 'input',
          data: {label: (<> IMPORT & CLASSIFY <strong><br/> DOCUMENT <br/> [</strong> {this.state.fullWorflow.import}<strong> ]</strong></>),}, 
          position: { x: 750, y: 50 }, 
          style: {width: 200, background: '#E7EBFA'}
      }
      const identityCard = { 
          id: '2', 
          data: {label: (<><strong>IDENTITY CARD</strong><br/>Good: {this.state.fullWorflow.identityCardGood}<br/>Bad: {this.state.fullWorflow.identityCardBad}</>),}, 
          position: { x: 500, y: 200},
          style: {
              border: '1px solid #222138',
              width: 200,
          },
        

      }
      const dischargeRecord = { 
          id: '3', 
          data: {label: (<><strong>DISCHARGE RECORD</strong> <br/> Good: {this.state.fullWorflow.dischargeRecordGood}<br/>
                Bad: {this.state.fullWorflow.dischargeRecordBad}</>),}, 
          style: {
              background: '#D6D5E6',
              color: '#333',
              border: '1px solid #222138',
              width: 200,
          },
          position: { x: 1050, y: 200 }
     }
      const fieldExtract = { 
          id: '4', 
          data: {label: (<><strong>ML SMART CROPPING</strong><br/>ID_Card: {this.state.fullWorflow.fieldExtractIdentityCard}
                <br/> D_Record: {this.state.fullWorflow.fieldExtractDischargeRecord} </>),}, 
          position: { x: 750, y: 360 },
          style: {
              background: '#B5E0F1',
              color: '#333',
              border: '1px solid #222138',
              width: 200,
          },
      }
      const ocr = {
          id: '5', 
          data: {label: (<><strong>ML OPITCAL CHARACTER RECOGNITION</strong><br/>ID_Card: {this.state.fullWorflow.ocrIdentityCard} <br/>
              D_Record: {this.state.fullWorflow.ocrDischargeRecord} </>),}, 
          position: { x: 750, y: 500 },
          style: {
              background: '#FAEBE7',
              color: '#333',
              border: '1px solid #222138',
              width: 200,
          },
      }
      const transformIdentityCard = { 
          id: '6', 
          type: 'output',
          data: {label: (<><strong>IDENTITY CARD</strong><br/><strong>TRANSFORMATION</strong> <br/> <strong>[</strong> {this.state.fullWorflow.transformIdentityCard} <strong>]</strong></>),}, 
          position: { x: 500, y: 710 },
          style: {
              width: 200,
              height: 70,
          },
      }
      const transformDischargeRecord = { 
          id: '7', 
          type: 'output', 
          data: {label: (<><strong>DISCHARGE RECORD TRANSFORMATION<br/></strong> [ {this.state.fullWorflow.transformDischargeRecord} ]</>),}, 
          position: { x: 1050, y: 660 },
          style: { stroke: '#f6ab6c',  width: 200, height: 70, },
          labelStyle: { fill: '#f6ab6c', fontWeight: 700 },
      }
      const initialElements = [importData, identityCard, dischargeRecord, fieldExtract, ocr, transformIdentityCard, transformDischargeRecord]
      const initialElementsEnd = initialElements.concat(initElementLinking);
      this.setState({elements: initialElementsEnd, isLoading: false})
    }

    async handleClick(type, date = this.state.day) {
        const dataId = new FormData()
        dataId.append('type_doc', type);
        dataId.append('status_code', 200);
       if (type === 'identity-card') {
            const requestOptions = { method: 'POST', body: dataId}
            await fetch(API_SERVER + '/v1/show/document/' + type + '/200/last?skip=0', requestOptions)
                .then(response => response.json())
                .then(data => {
                    this.setState({identityCard: {data: data, len: 1}})
                }
            );
            await this.setState({
                origin: this.state.identityCard.data.origin, 
                crop: this.state.identityCard.data.crop,
                fields: this.state.identityCard.data.fields,
                typeShow: 1,
            });
       }else if (type === 'discharge-record') {
            await fetch(API_SERVER + '/v1/show/document/' + type +  '/200/last?skip=0', { method: 'POST', body: dataId})
                .then(response => response.json())
                .then(data => {
                    this.setState({dischargeRecord: {data: data, len: 1}})
                    console.log(data)
                }
            );
            await this.setState({
                origin: this.state.dischargeRecord.data.origin, 
                crop: this.state.dischargeRecord.data.crop,
                fields: this.state.dischargeRecord.data.fields,
                typeShow: 2,
            });
        }
        else {
            this.setState({typeShow: 0})
            window.location.reload(false);
        }
    }

    refreshWorkflow(){
        window.location.reload(false);
    }

    
    render() {
        const {typeShow, origin, crop, fields, isLoading } = this.state;
        return (
            isLoading === true  ? <ReactLoading type='Bubbles' color="red" /> :
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
                    this.state.typeShow === 0 ? 
                        <ReactFlow className='overview__graph' elements={this.state.elements} onElementClick={onElementClick}>
                            <Controls>
                                <ControlButton onClick={() => this.refreshWorkflow()}>
                                    <img src = {RefreshIcon} className='photo__button'></img>
                                </ControlButton>
                            </Controls>
                        </ReactFlow>
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
//         return  <div className="Upload"><div className="Card"><Upload apiUrl={API_IMPORT_DOCUMENT}/></div></div>
    }
}
    
export default Overview;
