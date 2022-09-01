import React, { useState } from "react";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Typography } from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { useStateContext } from "../../Contexts/ContextProvider";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PopupOrder({ name, niftyData, bankData ,orderType}) {
  const { orderBook } = useStateContext();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openSuccess, setOpenSuccess] = useState(false);

  const [pos, setPos] = useState(1);
  const [cepePos, setCepePos] = useState(3);
  const [data, setData] = useState(niftyData);
  const [selectedStrike, setSelectedStrike] = useState(
    niftyData[20]?.strikePrice
  );
  const [lots, setLots] = useState(0);
  const [lotsize, setLotsize] = useState(true);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenSuccess(false);
    setLots(0);
  };

  const handleClickOpen = () => {
    setOpenSuccess(true);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleChange = (event) => {
    setPos(event.target.value);
    setLotsize(!lotsize);

    data[0]?.strikePrice === niftyData[0]?.strikePrice
      ? setSelectedStrike(bankData[20]?.strikePrice)
      : setSelectedStrike(niftyData[20]?.strikePrice);

    data[0]?.strikePrice === niftyData[0]?.strikePrice
      ? setData(bankData)
      : setData(niftyData);
  };

  const handleChange2 = (event) => {
    setSelectedStrike(event.target.value);
  };

  const handleChange3 = (event) => {
    setCepePos(event.target.value);
  };

  const enableButton = (event) => {
    setLots(event.target.value);
  };

  const order = (event) => {
    orderBook?.unshift(orderDetails);
    localStorage.setItem("orderBook", JSON.stringify(orderBook));
  };

  let currentPrice =
    cepePos === 4
      ? data[
          data?.findIndex((element) => element?.strikePrice === selectedStrike)
        ]?.PE?.lastPrice
      : data[
          data?.findIndex((element) => element?.strikePrice === selectedStrike)
        ]?.CE?.lastPrice;

  let requiredMargin =
    lots > 0
      ? lotsize
        ? currentPrice * lots * 50
        : currentPrice * lots * 25
      : 0;

  var orderDetails = {
    indexName: lotsize ? "NIFTY" : "BANKNIFTY",
    strikePrice: selectedStrike,
    optionType: cepePos === 3 ? "CE" : "PE",
    price: currentPrice,
    lots: lots,
    orderTime: new Date().toString().split("G"),
    orderType: orderType,
  };

  return (
    <>
      <Button
        aria-describedby={id}
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        style={{ margin: "2em" }}
        disableElevation
        onClick={handleClick}
      >
        {name}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        style={{ marginBottom: "200px" }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div>
          <FormControl sx={{ m: 1, minWidth: 130 }} style={{ margin: "1em" }}>
            <InputLabel id="index">Select Index</InputLabel>
            <Select
              labelId="index"
              id="selectindex"
              value={pos}
              label="Select Index"
              onChange={handleChange}
            >
              <MenuItem value={1}>NIFTY</MenuItem>
              <MenuItem value={2}>BANKNIFTY</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 130 }} style={{ margin: "1em" }}>
            <InputLabel id="strikePrice">Strike-Price</InputLabel>
            <Select
              labelId="strikePrice"
              id="strike"
              value={selectedStrike}
              label="Select Strike"
              onChange={handleChange2}
            >
              {data?.map((x) => (
                <MenuItem key={x?.strikePrice} value={x?.strikePrice}>
                  {x?.strikePrice}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div>
          <FormControl sx={{ m: 1, minWidth: 130 }} style={{ margin: "1em" }}>
            <InputLabel id="cepe">Select Option</InputLabel>
            <Select
              labelId="cepe"
              id="selectcepe"
              value={cepePos}
              label="Select CE PE"
              onChange={handleChange3}
            >
              <MenuItem value={3} name="CE">
                CE
              </MenuItem>
              <MenuItem value={4} name="PE">
                PE
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 130 }} style={{ margin: "1em" }}>
            <Typography>{currentPrice}</Typography>
          </FormControl>
        </div>

        <div>
          <FormControl sx={{ m: 1, maxWidth: 130 }} style={{ margin: "1em" }}>
            <TextField
              id="outlined-number"
              onChange={enableButton}
              label={lotsize ? " Lots Size 50 " : " Lots Size 25 "}
              type="number"
              placeholder="No of Lots"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormHelperText>Required</FormHelperText>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 130 }} style={{ margin: "1em" }}>
            <Typography>{requiredMargin.toFixed(2)}</Typography>
          </FormControl>
        </div>

        <div style={{padding:"1em"}}>
          <Button
            aria-describedby={id}
            disabled={lots <= 0}
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            disableElevation
            onClick={() => {
              order();
              handleClickOpen();
            }}
          >
            Click to Place Order
          </Button>
        </div>
        <Dialog
          open={openSuccess}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => {
            handleClose();
          }}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Your Order was Successfully Placed !!!"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This is a virtual option trading platform. Money will neither be
              debited nor credited in your Bank Account
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                handleClose();
              }}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Popover>
    </>
  );
}
