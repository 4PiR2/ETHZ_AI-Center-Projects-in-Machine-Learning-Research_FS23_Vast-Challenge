// @ts-nocheck 

import './App.css';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SaveIcon from '@mui/icons-material/Save';
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
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Callout } from "@tremor/react";
import { TextInput } from "@tremor/react";
import TextField from '@mui/material/TextField';
import DrawerComponent from './DrawerComponent'
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@tremor/react";

import {
  TabList,
  Tab,
  Card,
  Text,
  Metric,
} from "@tremor/react";

import { useState } from "react";
import { Add, CheckCircleRounded, DeleteOutlineRounded, DoubleArrow } from '@mui/icons-material';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';

//@ts-ignore
window.savedGraphs = {};



const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

function App() {

  const actions = [
    { icon: <SaveIcon />, name: 'Save' },
    { icon: <ShareIcon />, name: 'Share' }
  ];
  const style = {
    width: '100%',
    maxWidth: 360,
    bgcolor: 'background.paper',
  };


  const [showGraph, setShowGraph] = useState("1");
  const [counter, setCounter] = useState(1);
  const [nodegroups, setNodeGroups] = useState([{ index: 0, name: "", description: "" }]);
  const [suspiciongroups, setSuspicionGroups] = useState([{ index: 0 }]);

  const [drawerstate, setDrawerState] = useState(false);
  const [anchorElan, setAnchorElAN] = useState<HTMLButtonElement | null>(null);
  const [anopen, setANOpen] = useState(false);
  const [anplacement, setANPlacement] = useState<PopperPlacementType>();
  const [ddanchorEl, setAnchorElDD] = useState<HTMLButtonElement | null>(null);
  const [ddopen, setDDOpen] = useState(false);
  const [ddplacement, setDDPlacement] = useState<PopperPlacementType>();
  const [opendialog, setOpenDialog] = useState(false);
  const [opendialogemail, setOpenDialogShareEmail] = useState(false);
  const [email, setEmailName] = useState(String);
  const [nodename, setNodeName] = useState(String);
  const [nodedescription, setNodeDescription] = useState(String);


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

  const handleChange = (e: any, i: number) => {
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

  const handleSusChange = (e: any, i: number) => {

  }


  const handleDialClick = (n: String) => {
    if (n === 'Save') {
      //Add the node data here
      var dataStr =
        'data:vast/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify({ email, nodegroups }));
      if (email != "") {
        const download = document.createElement('a');
        download.setAttribute('href', dataStr);
        download.setAttribute('download', email + '.json');
        document.body.appendChild(download);
        download.click();
        download.remove();
      } else {
        const download = document.createElement('a');
        download.setAttribute('href', dataStr);
        download.setAttribute('download', Date().toLocaleString() + '.json');
        document.body.appendChild(download);
        download.click();
        download.remove();
      }

    } else if (n === 'Share') {
      setOpenDialogShareEmail(true);
    }
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

  const handleClick = (idx: number, n: String, d: String) => {
    //@ts-ignore
    const graphToSave = window.graph.save();
    //@ts-ignore
    window.savedGraphs[idx] = JSON.parse(JSON.stringify(graphToSave));
    //@ts-ignore
    setNodeGroups([...nodegroups, { index: idx, name: n, description: d }]);
  }

  const handleDelete = (i: number) => {
    //@ts-ignore
    delete window.savedGraphs[nodegroups[i].index]
    const deleteVal = [...nodegroups]
    deleteVal.splice(i, 1)
    setNodeGroups(deleteVal)
  }

  const [isResizing, setIsResizing] = useState(false);

  const handleResizeStart = () => {
    console.log("onResizeStart");
    setIsResizing(true);
  };

  const handleResizeStop = () => {
    setIsResizing(false);
  };

  const FullScreenOverlay = () => (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
        zIndex: 9999,
      }}
    />
  );

  return (
    <div>
      <BootstrapDialog
        onClose={() => { setOpenDialogShareEmail(false) }}
        aria-labelledby="customised-dialog-title"
        open={opendialogemail}
      >
        <BootstrapDialogTitle id="customised-dialog-title" onClose={() => { setOpenDialogShareEmail(false) }}>
          Want to be informed of the following updates?
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Please provide your email for us! We will not use it for the other use!
          </Typography>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '50ch' },
            }}
            noValidate
            autoComplete="off"
          >
            <TextInput id="standard-basic" value={email} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setEmailName(event.target.value); }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus variant="secondary" size="lg" onClick={() => { setOpenDialogShareEmail(false) }}>
            Submit
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <BootstrapDialog
        onClose={() => { setOpenDialog(false) }}
        aria-labelledby="customized-dialog-title"
        open={opendialog}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={() => { setOpenDialog(false) }}>
          Name your Choice!
        </BootstrapDialogTitle>
        <Box
          component="form"
          sx={{ '& > :not(style)': { m: 1, width: '30ch' }, }}
          noValidate
          autoComplete="off"
        >
          <TextInput id="standard-basic" value={nodename} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setNodeName(event.target.value); }} />
        </Box>
        <DialogContent dividers>
          <Typography gutterBottom>
            Please write some descriptions of your chosen clusters!
          </Typography>
          <Typography gutterBottom>
            Why do you think it is a suspicious pattern of illegal fishing? What is the most important trace in this graph?
          </Typography>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '50ch' },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="outlined-multiline-static"
              label="Description"
              multiline
              rows={5}
              defaultValue="I think it is..."
              value={nodedescription}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setNodeDescription(event.target.value); }}
            />
          </Box>
          <Callout
            className="mt-4"
            title="No critical system data"
            icon={CheckCircleRounded}
            color="teal"
          >
            All systems are currently within their default operating ranges.
          </Callout>
        </DialogContent>
        <DialogActions>
          <Button autoFocus variant="secondary" size="lg" onClick={() => { setCounter(counter + 1); handleClick(counter, nodename, nodedescription); setOpenDialog(false) }}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <main>
        <header>
          <Grid numCols={1} numColsSm={2} numColsLg={10} className="gap-2">
            <Col numColSpan={7}>
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
                    <Tab value="1" id="detailed_button" text="Detailed" />
                    <Tab value="2" id="overview_button" text="Overview" style={{visibility: "hidden"}} />
                  </TabList>
                </>
                <div>
                  <div
                    style={{
                      display: showGraph === "1" ? "block" : "none",
                    }}
                  >
                    <Box sx={{ width: 500 }} style={{ paddingTop: "8px" }}>
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
                    <Box sx={{ width: 500 }} style={{ paddingTop: "8px", paddingBottom: "8px" }}>
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
                    <iframe id="cosmos" src="./cosmos.html" scrolling="no" width="100%" height="1000px"></iframe>
                  </div>
                </div>
              </div>
            </Col>
            <Col numColSpan={3} numColSpanLg={3} id="right_panel">
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
                <List sx={style} aria-label="mailbox folders">
                  {
                    nodegroups.map((val, i) => {
                      return val.index > 0 ?
                        <Grid numCols={5} className="gap-2">
                          <Col numColSpan={4}>
                            <ListItem button onClick={(e) => handleChange(e, i)}>
                              <ListItemText>
                                {val.name}
                              </ListItemText>
                            </ListItem>
                            <Divider />
                          </Col>
                          <Col numColSpan={1}>
                            <Button icon={DeleteOutlineRounded} variant="light" iconPosition='right' onClick={() => handleDelete(i)} />
                          </Col>
                        </Grid> : <div></div>
                    }
                    )
                  }
                  <ListItem>
                    <Button
                      size="lg"
                      icon={Add}
                      iconPosition='left'
                      variant="light"
                      onClick={() => { setOpenDialog(true) }}
                    >
                      Save view
                    </Button>
                  </ListItem>
                </List>
              </Card>
              <div style={{ padding: "5px" }}></div>
              <Accordion>
                <AccordionHeader>
                  Suspicion Suggestions
                </AccordionHeader>
                <AccordionBody>
                  <List sx={style} aria-label="mailbox folders">
                    {
                      suspiciongroups.map((val, i) =>
                        <Grid className="gap-2">
                          <ListItem button onClick={(e) => handleSusChange(e, i)}>
                            {
                              val.index < 4 ? <ListItemText> Node {val.index + 1} </ListItemText> : <ListItemText> Suspicion Node {val.index - 3} </ListItemText>
                            }
                          </ListItem>
                          <Divider />
                        </Grid>
                      )
                    }
                  </List>
                </AccordionBody>
              </Accordion>
              <Box sx={{ height: 720, transform: 'translateZ(0px)', flexGrow: 1 }}>
                <SpeedDial
                  ariaLabel="SpeedDial basic"
                  sx={{ position: 'absolute', bottom: 16, right: 16 }}
                  icon={<SpeedDialIcon />}
                >
                  {actions.map((action) => (
                    <SpeedDialAction
                      key={action.name}
                      icon={action.icon}
                      tooltipTitle={action.name}
                      onClick={() => handleDialClick(action.name)}
                    />
                  ))}
                </SpeedDial>
              </Box>
            </Col>
          </Grid>
        </header>
        <div height={window.innerHeight}>
      {isResizing && <FullScreenOverlay />}
          <ResizableBox 
        width={340}
        height={window.innerHeight}
        // handleSize = {[20, 100]}
        minConstraints={[160, window.innerHeight]}
        maxConstraints={[window.innerWidth / 1.3, window.innerHeight]}
        resizeHandles={['e']}
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
      >
          <DrawerComponent drawerState={drawerstate} toggleDrawer={toggleDrawer}
></DrawerComponent>
        </ResizableBox>
        </div>
      </main>
    </div>
  )

}

export default App;
