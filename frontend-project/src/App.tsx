import './App.css';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
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
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Popper, { PopperPlacementType } from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';

import {
  TabList,
  Tab,
  Card,
  Text,
  Metric,
} from "@tremor/react";

import { useState } from "react";
import { Add, DeleteOutlineRounded } from '@mui/icons-material';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';

//@ts-ignore
window.savedGraphs = {};

function App() {

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


  const [showGraph, setShowGraph] = useState("1");
  const [counter, setCounter] = useState(1);
  const [nodegroups, setNodeGroups] = useState([{ index: 0 }]);

  const [drawerstate, setDrawerState] = useState(false);
  const [anchorElan, setAnchorElAN] = useState<HTMLButtonElement | null>(null);
  const [anopen, setANOpen] = useState(false);
  const [anplacement, setANPlacement] = useState<PopperPlacementType>();
  const [ddanchorEl, setAnchorElDD] = useState<HTMLButtonElement | null>(null);
  const [ddopen, setDDOpen] = useState(false);
  const [ddplacement, setDDPlacement] = useState<PopperPlacementType>();


  const toggleDrawer =
    (anchor: "right", open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }
        setDrawerState(open);
      };

  const handleChange1 = (e: any, i: number) => {
    //@ts-ignore
    const savedGraph = window.savedGraphs[nodegroups[i].index];
    //@ts-ignore
    graph.destroyLayout();
    //@ts-ignore
    window.graph.read(JSON.parse(JSON.stringify(savedGraph)));
    //@ts-ignore
    graph.fitView();
    const onchangeVal = [...nodegroups]
    setNodeGroups(onchangeVal)
  }

  const handleClickAN =
  (newPlacement: PopperPlacementType) =>
  (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElAN(event.currentTarget);
    setANOpen((prev) => anplacement !== newPlacement || !prev);
    setANPlacement(newPlacement);
  };

  const handleClickDD =
  (newPlacement: PopperPlacementType) =>
  (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElDD(event.currentTarget);
    setDDOpen((prev) => ddplacement !== newPlacement || !prev);
    setDDPlacement(newPlacement);
  };

  const handleClick = (idx: number) => {
    //@ts-ignore
    const graphToSave = window.graph.save();
    //@ts-ignore
    window.savedGraphs[idx] = JSON.parse(JSON.stringify(graphToSave));
    //@ts-ignore
    setNodeGroups([...nodegroups, { index: idx }])
  }

  const handleDelete = (i: number) => {
    //@ts-ignore
    delete window.savedGraphs[nodegroups[i].index]
    const deleteVal = [...nodegroups]
    deleteVal.splice(i, 1)
    setNodeGroups(deleteVal)
  }


  const list = (anchor: "right") => (
    <Box
      sx={{ width: 500 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      {/* TODO: Add more Evaluation Components here! */}
      <Metric>We can add some Evaluations here ...</Metric>
    </Box>
  );


  return (
    <Grid numCols={1} numColsSm={2} numColsLg={5} className="gap-2">
      <Col numColSpan={1} numColSpanLg={1}>
        <Card>
          <>
            <Typography>
              <text style={{ color: "grey" }}>General Information</text>
              <Tooltip title="We can add more tooltips on the graph visualisations here..." placement="right">
                <HelpOutlineRoundedIcon />
              </Tooltip>
            </Typography>
            <Metric>Groups Panel</Metric>
          </>
            <List sx={style} component="nav" aria-label="mailbox folders">
              {
                nodegroups.map((val, i) =>
                  <Grid numCols={5} className="gap-2">
                    <Col numColSpan={4}>
                      <ListItem button onClick={(e) => handleChange1(e, i)}>
                        <ListItemText>
                          Group {val.index + 1}
                        </ListItemText>
                      </ListItem>
                      <Divider />
                    </Col>
                    <Col numColSpan={1}>
                      <Button icon={DeleteOutlineRounded} variant="light" iconPosition='right' onClick={() => handleDelete(i)} />
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
                  onClick={() => { setCounter(counter + 1); handleClick(counter) }}
                >
                  Save view
                </Button>
              </ListItem>
            </List>
        </Card>
      </Col>
      <Col numColSpan={3}>
        <div>
          <>
            <Typography>
              <text style={{ color: "grey" }}>General Information</text>
              <Tooltip title="We can add more tooltips on the panel functionalities here..." placement="right">
                <HelpOutlineRoundedIcon />
              </Tooltip>
            </Typography>
            <Metric>Graph Visualisation on Vast Challenge 2023</Metric>
            <TabList
              defaultValue="1"
              onValueChange={(value) => setShowGraph(value)}
              className="mt-6"
            >
              <Tab value="1" text="Detailed" />
              <Tab value="2" text="Overview" />
            </TabList>
          </>
          <div>
            <div
              style={{
                display: showGraph === "1" ? "block" : "none",
              }}
            >
              <Box sx={{ width: 500 }} style={{paddingTop:"8px"}}>
                <Popper open={anopen} anchorEl={anchorElan} placement={anplacement} transition>
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                      <Paper>
                        <Typography sx={{ p: 2 }}>We can add more user guidances here for this section. Reclick the button to close it.</Typography>
                      </Paper>
                    </Fade>
                  )}
                </Popper>
                <Button variant="secondary" onClick={handleClickAN('bottom-start')}>Use Tips</Button>
              </Box>
              <iframe scrolling="no"
                src="./detailedGraphView.html"
                width="100%"
                height="1000px"
              ></iframe>
            </div>
            <div
              style={{
                display: showGraph === "1" ? "none" : "block",
              }}
            >
              <Box sx={{ width: 500 }} style={{paddingTop:"8px", paddingBottom:"8px"}}>
                <Popper open={ddopen} anchorEl={ddanchorEl} placement={ddplacement} transition>
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                      <Paper>
                        <Typography sx={{ p: 2 }}>We can add more user guidances here for this section. Reclick the button to close it.</Typography>
                      </Paper>
                    </Fade>
                  )}
                </Popper>
                <Button variant="secondary" onClick={handleClickDD('bottom-start')}>Use Tips</Button>
              </Box>
              <iframe src="./cosmos.html" width="100%" height="1000px"></iframe>
            </div>
          </div>
        </div>
      </Col>
      <Col numColSpan={1}>
        <div style={{paddingTop:"20px"}}>
          <Button variant="secondary" size="xl" onClick={toggleDrawer("right", true)}>Evaluation & Explanation</Button>
        </div>
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
          <Drawer
            anchor={"right"}
            open={drawerstate}
            onClose={toggleDrawer("right", false)}
          >
            {list("right")}
          </Drawer>
        </Box>
      </Col>
    </Grid>





  )

}

export default App;
