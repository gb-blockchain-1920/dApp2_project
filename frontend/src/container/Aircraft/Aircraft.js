import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  Tabs,
  Tab,
  Typography,
  Box,
  AppBar,
  Snackbar
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { ProgressBar } from "../../components/ProgressBar/ProgressBar";
import "./Aircraft.css";
import { wordCapitalization } from "../../scripts/wordManipulation.js";
import moment from "moment";
import { getAircraft } from "../../scripts/hyperledger.js";
import { MaintenanceRecordPanel } from "../../components/MaintenanceRecordPanel/MaintenanceRecordPanel";
import { PartProvenance } from "../../components/PartProvenance/PartProvenance";
import { FabButton } from "../../components/FabButton/FabButton";
import { PopUp } from "../../components/PopUp/PopUp";
import { RegisterAircraft } from "../../components/Forms/RegisterAircraft";
import { AssignMaintainer } from "../../components/Forms/AssignMaintainer";
import { NewPart } from "../../components/Forms/NewPart";
import { ReportMaintenance } from "../../components/Forms/ReportMaintenance";
import { SellAircraft } from "../../components/Forms/SellAircraft";
import { UpdateHours } from "../../components/Forms/UpdateHours";

//from: https://material-ui.com/components/tabs/

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      className="detailContainer"
      {...other}
    >
      {value === index && (
        <Box p={3} className="detailContainer-box">
          {children}
        </Box>
      )}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.main,
    minWidth: "15%"
  }
}));

const TabWrapper = ({ condition, children }) =>
  condition ? (
    children
  ) : (
    <AppBar position="static" color="transparent">
      {children}
    </AppBar>
  );

const menuComponent = {
  AssignMaintainer,
  ReportMaintenance,
  NewPart,
  RegisterAircraft,
  SellAircraft,
  UpdateHours
};

export const Aircraft = ({ connected, userData, companies }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [open, set] = React.useState(false);
  const popUp = { open, set };
  const [menu, setMenu] = React.useState("");
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [transaction, setTransaction] = React.useState(null);
  const [refresh, setRefresh] = React.useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //handle snackbar close
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false); //close snackbar
    setTimeout(() => setTransaction(null), 100); //reset transaction status after a few seconds
  };

  //called when api call is returned
  const transactionResponse = res => {
    setSnackbarOpen(true); //open snackbar
    setTransaction(res); //set transaction status
    if (res) { //if transaction is successful, force refresh data
      setRefresh(prev => !prev);
    }
  };

  //window size listener
  React.useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 600 && !isMobile) {
        setIsMobile(true);
      } else if (window.innerWidth > 600 && isMobile) {
        setIsMobile(false);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return _ => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  //getting data depending on connected or not (offline data)
  React.useEffect(() => {
    if (!connected) {
      const maintTypes = ["A", "B", "C", "D"];
      setData(
        new Array(20).fill({
          description: {
            aircraft: "Boeing 787-8 Dreamliner",
            tailNumber: "G-ZBJG",
            image: "https://cdn.jetphotos.com/full/6/27290_1582395615.jpg"
          },
          maintenanceSchedule: maintTypes.map(type => {
            return {
              type: type,
              lastCompletedDate: new Date(),
              lastCompletedHours: Math.round(Math.random() * 100),
              maxHours: 250
            };
          }),
          flightHours: Math.round(Math.random() * 250),
          owner: [
            {
              company: "british airways",
              purchaseDate: new Date(),
              soldDate: null
            }
          ],
          partsList: ["demoPart"],
          maintainers: [],
          maintenanceReports: new Array(2).fill({
            date: new Date(),
            type: "General",
            notes: "Test maintenance report",
            partsReplaced: JSON.stringify({
              newPart: "test part",
              "testing part": "testing parts"
            })
          })
        })
      );
    } else {
      getAircraft(userData.info.aircraft.join(","))
        .then(res => {
          setData(res);
          console.log(res);
        })
        .catch(e => {
          console.log(e);
          setData([]);
        });
    }
  }, [connected, userData.info.aircraft, refresh]);

  //popup menu component (get from object)
  const MenuComponent = menuComponent[menu.split(" ").join("")];

  return (
    <div
      className={`mainContainer ${
        !isMobile ? "horizontalOrient" : "verticalOrient"
      }`}
    >
      <TabWrapper condition={!isMobile}>
        <Tabs
          orientation={!isMobile ? "vertical" : "horizontal"}
          variant="scrollable"
          value={value}
          onChange={handleChange}
          className={classes.tabs}
        >
          {data.length > 0 &&
            data.map((obj, index) => (
              <Tab
                label={obj.description.tailNumber}
                key={`plane${index}`}
                {...a11yProps(index)}
              />
            ))}
        </Tabs>
      </TabWrapper>
      {data.length > 0 ? (
        data.map((obj, index) => {
          // console.log(obj);
          return (
            <TabPanel value={value} index={index} key={`aircraft${index}`}>
              <Box className="panel-header-details">
                <Typography variant="h2">{obj.description.aircraft}</Typography>
                <Typography variant="h6">{`Tail Number: ${obj.description.tailNumber}`}</Typography>
                <Typography variant="h6">{`Company: ${wordCapitalization(
                  obj.owner[obj.owner.length - 1].company
                )}`}</Typography>
                <Typography variant="h6">{`Flight Hours: ${obj.flightHours}`}</Typography>
              </Box>
              <Box className="panel-header-image">
                <img
                  src={obj.description.image}
                  alt={`${obj.description.aircraft} ${obj.description.tailNumber}`}
                />
              </Box>
              <Box my={1} className="panel-content">
                <Typography variant="h5">Maintenance Checks</Typography>
                <Box pt={1}>
                  {obj.maintenanceSchedule.map(maintenance => {
                    return (
                      <ProgressBar
                        start={maintenance.lastCompletedHours}
                        end={
                          maintenance.lastCompletedHours + maintenance.maxHours
                        }
                        current={obj.flightHours}
                        label={`${maintenance.type} Check - Last Completed: ${
                          moment(maintenance.lastCompletedDate).isValid()
                            ? moment(maintenance.lastCompletedDate).format(
                                "D MMM YYYY"
                              )
                            : "N/A"
                        }`}
                        key={maintenance.type}
                      />
                    );
                  })}
                </Box>
              </Box>
              <Box my={1} className="panel-content">
                <Typography variant="h5">Parts Provenance</Typography>
                <Box pt={1}>
                  {obj.partsList.length > 0 && (
                    <PartProvenance parts={obj.partsList} refresh={refresh} />
                  )}
                </Box>
              </Box>
              <Box my={1} className="panel-content">
                <Typography variant="h5">Maintenance Reports</Typography>
                {obj.maintenanceReports.length > 0 && (
                  <Box pt={1}>
                    {obj.maintenanceReports.map((report, index) => (
                      <MaintenanceRecordPanel report={report} key={index} />
                    ))}
                  </Box>
                )}
              </Box>
            </TabPanel>
          );
        })
      ) : (
        <div></div>
      )}
      <FabButton
        admin={userData.info.type === "administrator"}
        popUp={popUp}
        setMenu={setMenu}
      />
      <PopUp popState={popUp} title={menu}>
        {menu && (
          <MenuComponent
            popState={popUp}
            current={data[value]}
            companies={companies}
            trigger={transactionResponse}
          />
        )}
      </PopUp>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity={transaction ? "success" : "error"}
        >
          {transaction ? "Transaction successful" : "Transaction failed"}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};
