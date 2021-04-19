import React, { useState, useEffect, MouseEvent, CSSProperties } from 'react';

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

// import initialElements from '../assets/datas/OverviewInitial.js';

import '../styles/container.scss'


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

const UpdateNode = () => {
  const [elements, setElements] = useState(initialElements);
}

const Overview = () => {
  const [elements, setElements] = useState(initialElements);
  return (
    <div className='overview'>
      <div className='overview__content'>
        <div className='overview__content__group'>
           <a className='overview__content__field margin__top__40 overview__content__field__select'>Full Workflow</a>
          <a className='overview__content__field'>Identity Card Import</a>
          <a className='overview__content__field'>Discharge Record Import</a>
          <a className='overview__content__field'>Identity Card Field</a>
          <a className='overview__content__field'>Discharge Record Field</a>
          <a className='overview__content__field'>Identity Card Transform</a>
          <a className='overview__content__field'>Discharge Record Transform</a>
        </div>
      </div>
      <ReactFlow className='overview__graph'
          elements={elements}
       ></ReactFlow>
      
    </div>
  
  );
}
export default Overview;