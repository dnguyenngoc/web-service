import React from 'react';
import ReactFlow, { 
  Handle, 
  Controls, 
  Background,
} from 'react-flow-renderer';


const initWorkflow = [
  {
    id: '1',
    type: 'upload',
    position: { x: 200, y: 200 },
    data: { text: 'Upload' },
  },
  {
    id: '2',
    type: 'extract',
    position: { x: 300, y: 100 },
    data: { text: 'Discharge Record' },
  },
  {
    id: '3',
    type: 'extract',
    position: { x: 300, y: 300 },
    data: { text: 'Identity Card' },
  },
];

const uploadStyle = {
  background: '#9CA8B3',
  color: '#FFF',
  padding: 30,
};

const extractStyle = {
  background: 'black',
  color: '#FFF',
  padding: 30,
};


const UploadComponent = ({ data }) => {
  return (
    <div style={uploadStyle}>
      <div>{data.text}</div>
      <Handle
        type="source"
        position="right"
        id="1"
        style={{ top: '70%', borderRadius: 0 }}
      />
    </div>
  );
};

const ExtractComponent = ({ data }) => {
  return (
    <div style={extractStyle}>
      <div>{data.text}</div>
      <Handle
        type="source"
        position="right"
        id="1"
        style={{ top: '70%', borderRadius: 0 }}
      />
    </div>
  );
};


const nodeTypes = {
  upload: UploadComponent,
  extract: ExtractComponent
};


const App = () => {
  return (
    <div style={{ height: 500, width: 1000 }}>
      <ReactFlow elements={initWorkflow} nodeTypes={nodeTypes}>
        <Controls />
         <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default App;