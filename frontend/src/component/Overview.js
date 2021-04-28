import React, { useState, useEffect, MouseEvent, CSSProperties, Component } from 'react';

import ReactFlow, {
  removeElements,
  addEdge,
  MiniMap,
  Controls,
  Background,
  isNode,
  Node,
  Elements,
  FlowElement,
  OnLoadParams,
  FlowTransform,
  SnapGrid,
  ArrowHeadType,
  Connection,
  Edge,
} from 'react-flow-renderer';

import ImagePreview from './ImagePreview.js'

// import initialElements from '../assets/datas/OverviewInitial.js';

import '../styles/container.scss'


// TEST DATA +++++++++++++++++++++++++++++++++++++++++++
import  cmnd_test from '../assets/images/cmnd-test-1.jpg'
import  id_test from '../assets/images/id.PNG'
import  name_test from '../assets/images/name.PNG'
import  add_test from '../assets/images/address.PNG'
import  home_test from '../assets/images/home town.PNG'
import  birth_test from '../assets/images/birth.PNG'

import  dr_test from '../assets/images/dr-test1.JPG'
import  dr_crop from '../assets/images/dr-crop.jpg'
import  dr_full_name from '../assets/images/dr-full-name.png'
import  dr_age from '../assets/images/dr-age.png'
import  dr_nation from '../assets/images/dr-nation.png'
import  dr_gender from '../assets/images/dr-gender.png'
import  dr_id from '../assets/images/dr-id.png'
import  dr_come from '../assets/images/dr-come.png'
import  dr_out from '../assets/images/dr-out.png'
import  dr_note from '../assets/images/dr-note.png'
import  dr_solu from '../assets/images/dr-solu.png'
import  dr_diag from '../assets/images/dr-diag.png'
import  dr_add from '../assets/images/dr-address.png'
// TEST DATA +++++++++++++++++++++++++++++++++++++++++++


const UpdateNode = () => {
  const [elements, setElements] = useState(initialElements);
}

const initialElements = [
  { id: '1', type: 'input', data: {label: (<><strong>Import Data</strong> (2000)</>),}, position: { x: 700, y: 50 }, style: {width: 200}},
  { id: '2', data: {label: (<>Identity Card<br/><a>Good: 500</a><br/><a>Bad: 500</a></>),}, position: { x: 500, y: 150 }},
  { id: '3', data: {label: (<>Discharge Record<br/> <a>Good: 500</a><br/><a>Bad: 500</a></>),}, position: { x: 1000, y: 150 }},
  { id: '4', data: {label: (<>ML Field Extract<br/><a>Status: Processing</a> <br/><a>ID_Card: 200</a> <br/> <a>D_Record: 200</a> </>),}, position: { x: 750, y: 300 }},
  { id: '5', data: {label: (<>ML Ocr<br/> <a>Status: Processing</a> <br/><a>ID_Card: 200</a> <br/> <a>D_Record: 200</a> </>),}, position: { x: 750, y: 450 }},
  { id: '6', type: 'output', data: {label: (<><strong>Identity Card Transform</strong> (100)</>),}, position: { x: 500, y: 600 }},
  { id: '7', type: 'output', data: {label: (<><strong>Discharge Record Transform</strong> (100)</>),}, position: { x: 1000, y: 600 }},
  { id: 'e1-2', source: '1', target: '2', label: 'Classify',},
  { id: 'e1-3', source: '1', target: '3', label: 'Classify',},
  { id: 'e2-4', source: '2', target: '4', animated: true, label: 'Extract',},
  { id: 'e3-4', source: '3', target: '4', animated: true, label: 'Extract',},
  { id: 'e4-5', source: '4', target: '5', animated: true, label: 'OCR',},
  { id: 'e5-6', source: '5', target: '6', animated: true, label: 'Transform',},
  { id: 'e5-7', source: '5', target: '7', animated: true, label: 'Transform',},  
]

class Overview extends Component {
    constructor(props) {
    super(props);
      this.state = {
        elements: initialElements,
        typeShow: 0,
        origin: {},
        crop: {},
        fields: [],
      }
    }
    
    handleClick(type) {
        if (type == 'full_workflow') {
            this.setState({typeShow: 0})
            console.log(1)
        }
        else if (type == 'identity_card') {
            console.log(2)
            this.setState({
                typeShow: 1, 
                origin: {'name': 'origin', 'value': cmnd_test}, 
                crop: {'name': 'crop', 'value': cmnd_test}, 
                fields: [
                    {'name': 'ID Number', 'value': id_test}, 
                    {'name': 'Full Name', 'value': name_test},
                    {'name': 'Birthday', 'value': birth_test},
                    {'name': 'Home Town', 'value': home_test},
                    {'name': 'Address', 'value': add_test},
                ]
            });  
        } else {
            console.log(3)
            this.setState({
                typeShow: 2, 
                origin: {'name': 'origin', 'value': dr_test}, 
                crop: {'name': 'crop', 'value': dr_crop}, 
                fields: [
                    {'name': 'Patient Name', 'value': dr_full_name}, 
                    {'name': 'Age Or DOB', 'value': dr_age},
                    {'name': 'Gender', 'value': dr_gender},
                    {'name': 'Nation', 'value': dr_nation},
                    {'name': 'Insurance Number', 'value': dr_id},
                    {'name': 'Address', 'value': dr_add},
                    {'name': 'Event Start Date', 'value': dr_come},
                    {'name': 'Event End Date', 'value': dr_out},
                    {'name': 'Diagnosis Description', 'value': dr_diag},
                    {'name': 'Treatment Description', 'value': dr_solu},
                    {'name': 'Note', 'value': dr_note},
                ]
            });  
        };
    }
    render() {
        const { origin, crop, fields, typeShow } = this.state;
        return (
            <div className='overview'>
              <div className='overview__content'>
                <div className='overview__content__group'>
                  <a
                     onClick={() => this.handleClick('full_workflow')}
                     className='overview__content__field margin__top__40' >Full Workflow
                  </a>
                  <a className='overview__content__field' onClick={() => this.handleClick('identity_card')}>Identity Card</a>
                  <a className='overview__content__field' onClick={() => this.handleClick('discharge_record')}>Discharge Record</a>
                </div>
              </div>
            {
                this.state.typeShow == 0 ? <ReactFlow className='overview__graph' elements={this.state.elements}></ReactFlow>
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
