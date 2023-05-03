import './App.css';

import Graphin from '@antv/graphin';
const data = require('./data/MC1_processed_fraction=0.10.json');
// const data = require('./data/mock_data.json');

export default () => {
  return <Graphin data={data} />;
};