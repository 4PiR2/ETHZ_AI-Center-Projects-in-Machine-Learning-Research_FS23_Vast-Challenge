import './App.css';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import { Grid, Col } from "@tremor/react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { Button } from "@tremor/react";


import {
  TabList,
  Tab,
  Card,
  Text,
  Metric,
} from "@tremor/react";

import { useState } from "react";
import Graphin from '@antv/graphin';
import { Add } from '@mui/icons-material';

const data = require('./data/mock_data.json');

function App() {

  const data = require('./data/MC1_processed_fraction=0.10.json');
  const actions = [
    { icon: <FileCopyIcon />, name: 'Copy' },
    { icon: <SaveIcon />, name: 'Save' },
    { icon: <PrintIcon />, name: 'Print' },
    { icon: <ShareIcon />, name: 'Share' },
  ];
  const style = {
    width: '100%',
    maxWidth: 360,
    bgcolor: 'background.paper',
  };


  const [showCard, setShowCard] = useState("1");
  const [showGraph, setShowGraph] = useState("1");
  const [node1group, setNode1Group] = useState(0);
  const [node2group, setNode2Group] = useState(0);

  const handleChange = (i: any) => {
    console.log(i)
  }

  const buttons1: JSX.Element[] = [];
  const buttons2: JSX.Element[] = [];

  
  for (let i = 0; i < Math.min(node1group, 10); i++) {
    buttons1.push(
      <ListItem button onClick={handleChange}>
        <ListItemText>
            Group {i+1}
        </ListItemText>
      </ListItem>
    );
    buttons1.push(<Divider />);
  }

  for (let i = 0; i < Math.min(node2group, 10); i++) {
    buttons2.push(
      <ListItem button onClick={handleChange}>
        <ListItemText>
            Group {i+1}
        </ListItemText>
      </ListItem>
    );
    buttons2.push(<Divider />);
  }
  

  return (
    <Grid numCols={1} numColsSm={2} numColsLg={5} className="gap-2">
      <Col numColSpan={1} numColSpanLg={1}>
        <Card>
          <>
            <Text>General Information</Text>
            <Metric>We can write some descriptions here ...</Metric>
            <TabList
              defaultValue="1"
              onValueChange={(value) => setShowCard(value)}
              className="mt-6"
            >
              <Tab value="1" text="Node 1" />
              <Tab value="2" text="Node 2" />
              <Tab value="3" text="Node 3" />
              <Tab value="4" text="Node 4" />
            </TabList>
          </>
          {showCard === "1" ? (
            <List sx={style} component="nav" aria-label="mailbox folders">
              {buttons1}
              <ListItem>
                <Button
                  size="lg"
                  icon={Add}
                  iconPosition='left'
                  variant="light"
                  onClick={() => { setNode1Group(node1group + 1); }}
                >
                  Add Current Selection
                </Button>
              </ListItem>
              <Divider />
            </List>
          ) : null }
          {showCard === "2" ? (
            <List sx={style} component="nav" aria-label="mailbox folders">
              {buttons2}
              <ListItem>
                <Button
                  size="lg"
                  icon={Add}
                  iconPosition='left'
                  variant="light"
                  onClick={() => { setNode2Group(node2group + 1); }}
                >
                  Add Current Selection
                </Button>
              </ListItem>
              <Divider />
            </List>
          ) : null }
        </Card>
      </Col>
      <Col numColSpan={3}>
        <div>
          <>
            <Text>General Information</Text>
            <Metric>We can write some descriptions here ...</Metric>
            <TabList
              defaultValue="1"
              onValueChange={(value) => setShowGraph(value)}
              className="mt-6"
            >
              <Tab value="1" text="All nodes" />
              <Tab value="2" text="Detailed Display" />
            </TabList>
          </>

          {showGraph === "1" ? (
            <div>
              {/* TODO: Jiale add all nodes data information */}
            </div>
          ) : (
            <div>
              {/* TODO: Lukas add G6 data information */}
            </div>
          )}
        </div>
      </Col>
      <Box sx={{ height: 720, transform: 'translateZ(0px)', flexGrow: 1 }}>
        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
            />
          ))}
        </SpeedDial>
      </Box>
    </Grid>





  )

}

export default App;
