import React from 'react';

export default [
  {
    id: '1',
    type: 'input',
    data: {
      label: (
        <>
          <strong>Import Data</strong> : (1000)
        </>
      ),
    },
    position: { x: 400, y: 30 },
  },
  {
    id: '2',
    data: {
      label: (
        <>
          <strong>Identity Card</strong> (500)
        </>
      ),
    },
    position: { x: 200, y: 130 },
    style: {
      background: '#F0F8FF',
      color: '#333',
      border: '1px solid #222138',
      width: 180,
    },
  },
  {
    id: '3',
    data: {
      label: (
        <>
          <strong>Discharge Record</strong> (500)
        </>
      ),
    },
    position: { x: 600, y: 130 },
    style: {
      background: '#D6D5E6',
      color: '#333',
      border: '1px solid #222138',
      width: 180,
    },
  },
  {
    id: '4',
    data: {
      label: <div>
           <strong>ML Field Processing</strong>
           Identity Card
           Discharge Record
        
        </div>,
    },
    position: { x: 600, y: 230 },
    style: {
      background: '#D6D5E6',
      color: '#333',
      border: '1px solid #222138',
      width: 180,
    },
  },
      
  
//   {
//     id: '6',
//     type: 'output',
//     data: {
//       label: (
//         <>
//           An <strong>output node</strong>
//         </>
//       ),
//     },
//     position: { x: 100, y: 480 },
//   },
//   {
//     id: '7',
//     type: 'output',
//     data: { label: 'Another output node' },
//     position: { x: 400, y: 450 },
//   },
//   { id: 'e1-2', source: '1', target: '2', label: 'this is an edge label' },
//   { id: 'e1-3', source: '1', target: '3' },
//   {
//     id: 'e3-4',
//     source: '3',
//     target: '4',
//     animated: true,
//     label: 'animated edge',
//   },
//   {
//     id: 'e4-5',
//     source: '4',
//     target: '5',
//     arrowHeadType: 'arrowclosed',
//     label: 'edge with arrow head',
//   },
//   {
//     id: 'e5-6',
//     source: '5',
//     target: '6',
//     type: 'smoothstep',
//     label: 'smooth step edge',
//   },
//   {
//     id: 'e5-7',
//     source: '5',
//     target: '7',
//     type: 'step',
//     style: { stroke: '#f6ab6c' },
//     label: 'a step edge',
//     animated: true,
//     labelStyle: { fill: '#f6ab6c', fontWeight: 700 },
//   },
];