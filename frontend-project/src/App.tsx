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
import { Add, DeleteOutlineRounded } from '@mui/icons-material';

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
  const [counter1, setCounter1] = useState(1);
  const [counter2, setCounter2] = useState(1);
  const [counter3, setCounter3] = useState(1);
  const [counter4, setCounter4] = useState(1);
  const [node1groups, setNode1Groups] = useState([{index:0}]);
  const [node2groups, setNode2Groups] = useState([{index:0}]);
  const [node3groups, setNode3Groups] = useState([{index:0}]);
  const [node4groups, setNode4Groups] = useState([{index:0}]);

  const handleChange1 = (e: any,i: number) => {
    const onchangeVal = [...node1groups]
    setNode1Groups(onchangeVal)
  }

  const handleChange2 = (e: any,i: number) => {
    const onchangeVal = [...node2groups]
    setNode2Groups(onchangeVal)
  }

  const handleChange3 = (e: any,i: number) => {
    const onchangeVal = [...node3groups]
    setNode3Groups(onchangeVal)
  }  

  const handleChange4 = (e: any,i: number) => {
    const onchangeVal = [...node4groups]
    setNode4Groups(onchangeVal)
  }  

  const handleClick1 =(idx:number)=>{
    setNode1Groups([...node1groups,{index:idx}])
  }

  const handleClick2 =(idx:number)=>{
    setNode2Groups([...node2groups,{index:idx}])
  }

  const handleClick3 =(idx:number)=>{
    setNode3Groups([...node3groups,{index:idx}])
  }  

  const handleClick4 =(idx:number)=>{
    setNode4Groups([...node4groups,{index:idx}])
  }  

  const handleDelete1 =(i: number)=>{
    const deleteVal = [...node1groups]
    deleteVal.splice(i,1)
    setNode1Groups(deleteVal)
  }

  const handleDelete2 =(i: number)=>{
    const deleteVal = [...node2groups]
    deleteVal.splice(i,1)
    setNode2Groups(deleteVal)
  }

  const handleDelete3 =(i: number)=>{
    const deleteVal = [...node3groups]
    deleteVal.splice(i,1)
    setNode3Groups(deleteVal)
  }

  const handleDelete4 =(i: number)=>{
    const deleteVal = [...node4groups]
    deleteVal.splice(i,1)
    setNode4Groups(deleteVal)
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
              {
                node1groups.map((val,i)=>
                <Grid numCols={5} className="gap-2">
                  <Col numColSpan={4}>
                  <ListItem button onClick={(e)=>handleChange1(e,i)}>
                     <ListItemText>
                         Group {val.index+1}
                     </ListItemText>
                   </ListItem>
                   <Divider/>
                  </Col>
                  <Col numColSpan={1}>
                    <Button icon={DeleteOutlineRounded} variant="light" iconPosition='right' onClick={()=>handleDelete1(i)}/> 
                  </Col>
                </Grid>
                )
              }
              <ListItem>
                <Button
                  size="lg"
                  icon={Add}
                  iconPosition='left'
                  variant="light"
                  onClick={() => {setCounter1(counter1 + 1);handleClick1(counter1)}}
                >
                  Add Current Selection
                </Button>
              </ListItem>
            </List>
          ) : null }
          {showCard === "2" ? (
            <List sx={style} component="nav" aria-label="mailbox folders">
              {
                node2groups.map((val,i)=>
                <Grid numCols={5} className="gap-2">
                  <Col numColSpan={4}>
                  <ListItem button onClick={(e)=>handleChange2(e,i)}>
                     <ListItemText>
                         Group {val.index+1}
                     </ListItemText>
                   </ListItem>
                   <Divider/>
                  </Col>
                  <Col numColSpan={1}>
                    <Button icon={DeleteOutlineRounded} variant="light" iconPosition='right' onClick={()=>handleDelete2(i)}/> 
                  </Col>
                </Grid>
                )
              }
              <ListItem>
                <Button
                  size="lg"
                  icon={Add}
                  iconPosition='left'
                  variant="light"
                  onClick={() => {setCounter2(counter2 + 1); handleClick2(counter2) }}
                >
                  Add Current Selection
                </Button>
              </ListItem>
              <Divider />
            </List>
          ) : null }
          {showCard === "3" ? (
            <List sx={style} component="nav" aria-label="mailbox folders">
              {
                node3groups.map((val,i)=>
                <Grid numCols={5} className="gap-2">
                  <Col numColSpan={4}>
                  <ListItem button onClick={(e)=>handleChange3(e,i)}>
                     <ListItemText>
                         Group {val.index+1}
                     </ListItemText>
                   </ListItem>
                   <Divider/>
                  </Col>
                  <Col numColSpan={1}>
                    <Button icon={DeleteOutlineRounded} variant="light" iconPosition='right' onClick={()=>handleDelete3(i)}/> 
                  </Col>
                </Grid>
                )
              }
              <ListItem>
                <Button
                  size="lg"
                  icon={Add}
                  iconPosition='left'
                  variant="light"
                  onClick={() => {setCounter3(counter3 + 1); handleClick3(counter3) }}
                >
                  Add Current Selection
                </Button>
              </ListItem>
              <Divider />
            </List>
          ) : null }
          {showCard === "4" ? (
            <List sx={style} component="nav" aria-label="mailbox folders">
              {
                node4groups.map((val,i)=>
                <Grid numCols={5} className="gap-2">
                  <Col numColSpan={4}>
                  <ListItem button onClick={(e)=>handleChange4(e,i)}>
                     <ListItemText>
                         Group {val.index+1}
                     </ListItemText>
                   </ListItem>
                   <Divider/>
                  </Col>
                  <Col numColSpan={1}>
                    <Button icon={DeleteOutlineRounded} variant="light" iconPosition='right' onClick={()=>handleDelete4(i)}/> 
                  </Col>
                </Grid>
                )
              }
              <ListItem>
                <Button
                  size="lg"
                  icon={Add}
                  iconPosition='left'
                  variant="light"
                  onClick={() => {setCounter4(counter4 + 1); handleClick4(counter4) }}
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
            /* TODO: Jiale add all nodes data information */
            <iframe src="./cosmos.html" width="100%" height="1000px"></iframe>
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
