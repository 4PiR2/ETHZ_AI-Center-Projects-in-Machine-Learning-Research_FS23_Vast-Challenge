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


import {
  TabList,
  Tab,
  Card,
  Text,
  Metric,
} from "@tremor/react";

import { useState } from "react";
import Graphin from '@antv/graphin';

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

  const handleChange =()=>{
    console.log("a change")
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
              <ListItem button onClick={handleChange}>
                <ListItemText primary="Group 1" />
              </ListItem>
              <Divider />
              <ListItem button onClick={handleChange}>
                <ListItemText primary="Group 2" />
              </ListItem>
              <Divider />
              <ListItem button onClick={handleChange}>
                <ListItemText primary="Group 3" />
              </ListItem>
              <Divider />
              <ListItem button onClick={handleChange}>
                <ListItemText primary="Group 4" />
              </ListItem>
              <Divider />
              <ListItem button onClick={handleChange}>
                <ListItemText primary="Group 5" />
              </ListItem>
              <Divider />
            </List>
          ) : (
            <div></div>
          )}
        </Card>
      </Col>
      <Col numColSpan={3}>
        <Graphin data={data} />
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
