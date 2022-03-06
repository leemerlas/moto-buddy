import { Helmet } from 'react-helmet-async';
import { useState, useLayoutEffect, forwardRef } from 'react';

import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { 
    Slide,
    Container, 
    Grid, 
    Card, 
    CardHeader, 
    CardContent, 
    Divider, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    DialogContentText, 
    TextField,
    InputLabel,
    Select,
    MenuItem, 
} from '@mui/material';
import CardActions from '@mui/material/CardActions';
// import { styled } from '@mui/material/styles';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BoltTwoToneIcon from '@mui/icons-material/BoltTwoTone';
import LocalGasStationTwoToneIcon from '@mui/icons-material/LocalGasStationTwoTone';
import PermDataSettingTwoToneIcon from '@mui/icons-material/PermDataSettingTwoTone';
import SettingsSuggestTwoToneIcon from '@mui/icons-material/SettingsSuggestTwoTone';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';  
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SpeedTwoToneIcon from '@mui/icons-material/SpeedTwoTone';
import configData from '../../utils/configData.json'
import Text from 'src/components/Text';




function Garage() {

    const [expanded, setExpanded] = useState(false);
    const [motos, setMotos] = useState([]);

    // for dialogs
    const [open, setOpen] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");

    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [odo, setOdo] = useState("");
    const [maxSpeed, setMaxSpeed] = useState("");
    const [kmPerLiter, setKmPerLiter] = useState("");
    const [passengerCount, setPassengerCount] = useState("Single");
    const [rearBrake, setRearBrake] = useState("Disc");
    const [frontBrake, setFrontBrake] = useState("Disc");
    const [lastOilChange, setLastOilChange] = useState(new Date().toISOString());
    const [motoId, setMotoId] = useState("");
    const [imageFile, setImageFile] = useState(null);
    
    // for errors
    const [showError, setShowError] = useState(false);
    const [showBrandError, setBrandError] = useState(false);
    const [showModelError, setModelError] = useState(false);
    const [showOdoError, setOdoError] = useState(false);
    const [showMaxSpeedError, setMaxSpeedError] = useState(false);
    const [showKmPerLiterError, setKmPerLiterError] = useState(false);
    // const [showLastOilChangeError, setLastOilChangeError] = useState(false);
    const [error, setError] = useState("");
    const [removeId, setRemoveId] = useState("");
  
  
    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    const getMotos = () => {
        fetch(`${configData.SERVER_URL}/api/v1/motorcycles`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'x-auth-token': localStorage.getItem('token')
            }
          })
          .then(res => res.json())
          .then(data => {
            console.log(data);
            setMotos(data);
          })
    }

    const handleOpen = (e) => {
        if (e.target.id === "add-btn") {
            setDialogTitle("Add")
        } else {
            setDialogTitle("Edit")
        }
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleOpenDeleteDialog = (motoId) => {
        setRemoveId(motoId)
        setOpenDeleteDialog(true);
    }

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    }

    const handleSubmit = () => {
        if (brand === "") {
            setBrandError(true)
        } else if (model === "") {
            setModelError(true)
        } else if (odo === ""){
            setOdoError(true)
        } else if (maxSpeed === "") {
            setMaxSpeedError(true)
        } else if (kmPerLiter === "") {
            setKmPerLiterError(true)
        } else {
            let submitMethod = "";
            if (dialogTitle === 'Add') {
                submitMethod = 'POST'
            } else {
                submitMethod = 'PUT'
            }

            let formData = new FormData();
            
            formData.append("motoId", motoId);
            formData.append("brand", brand);
            formData.append("model", model);
            formData.append("odo", odo);
            formData.append("maxSpeed", maxSpeed);
            formData.append("kmPerLiter", kmPerLiter);
            formData.append("passengerCount", passengerCount);
            formData.append("rearBrake", rearBrake);
            formData.append("frontBrake", frontBrake);
            formData.append("lastOilChange", lastOilChange);
            console.log(imageFile);
            
            formData.append("file", imageFile);

            console.log(formData.get("model"));
            
            

            fetch(`${configData.SERVER_URL}/api/v1/motorcycles`, {
                method: submitMethod,
                headers: {
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                    // "Content-Type": "multipart/form-data", 
                    'x-auth-token': localStorage.getItem('token')
                },
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setBrand("");
                setModel("");
                setOdo("");
                setMaxSpeed("");
                setKmPerLiter("");
                setPassengerCount("Single");
                setFrontBrake("Disc");
                setRearBrake("Disc");
                setLastOilChange(new Date().toISOString());
                setOpen(false);
                getMotos();
            })
        }

    }

    const removeNote = (motoId) => {
        fetch(`${configData.SERVER_URL}/api/v1/motorcycles`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({
                motoId: motoId
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setRemoveId("");
            setOpenDeleteDialog(false)
            getMotos();
        })
    }

    const handlePassengerCountChange = (event) => {
        setPassengerCount(event.target.value)
    }

    const handleFrontBrakeChange = (event) => {
        setPassengerCount(event.target.value)
    }

    const handleRearBrakeChange = (event) => {
        setPassengerCount(event.target.value)
    }

    useLayoutEffect(() => {
        getMotos();
    }, []);
  
    return (
      <>
        <Helmet>
          <title>Garage</title>
        </Helmet>
        <PageTitleWrapper>
            <Grid container justifyContent="right" alignItems="right">
                <PageTitle
                    heading="Motorcycle Garage"
                    subHeading="Keep track of your owned motorcycles here."
                />
                <Grid item>
                    <Button
                        sx={{ mt: { xs: 2, md: 0 } }}
                        variant="contained"
                        startIcon={<AddTwoToneIcon fontSize="small" />}
                        onClick={(e) => handleOpen(e)}
                        id="add-btn"
                    >
                        Add Motorcycle
                    </Button>
                </Grid>
            </Grid>
        </PageTitleWrapper>
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} fullWidth maxWidth='xs'>
            <DialogTitle>Delete Motorcycle</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2} sx={{ mt: 0, mb: 1 }} 
                    direction="column"
                    alignItems="center"
                    justifyContent="center">
                    <Grid item xs={12}>
                        <Text color='primary'>
                            Are you sure you want to delete this motorcycle?
                        </Text>
                    </Grid>
                </Grid>
                
            </DialogContent>
            <DialogActions>
                <Button onClick={() => removeNote(removeId)} color="primary">Submit</Button>
                <Button onClick={handleCloseDeleteDialog} color="secondary">Cancel</Button>
            </DialogActions>
        </Dialog>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth='lg'>
            <DialogTitle>{dialogTitle} Entry</DialogTitle>
            <DialogContent dividers>
                <DialogContentText> 
                    {dialogTitle} the details of your motorcycle below.
                </DialogContentText>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                        <TextField
                            value={brand}
                            autoFocus
                            label="Brand"
                            placeholder='ex. Honda'
                            fullWidth
                            id="outlined-required"
                            onChange={(e) => setBrand(e.target.value)}
                            onFocus={() => setBrandError(false)}
                            error={showBrandError}
                            helperText={ showBrandError ? 'Brand cannot be empty': '' }
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            value={model}
                            label="Model"
                            placeholder='ex. ADV 150'
                            fullWidth
                            id="outlined-required"
                            onChange={(e) => setModel(e.target.value)}
                            onFocus={() => setModelError(false)}
                            error={showModelError}
                            helperText={ showModelError ? 'Model cannot be empty' : '' }
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            value={odo}
                            label="Odometer"
                            type={'number'}
                            fullWidth
                            id="outlined-required"
                            onChange={(e) => setOdo(e.target.value)}
                            onFocus={() => setOdoError(false)}
                            error={showOdoError}
                            helperText={ showOdoError ? 'Odometer cannot be empty' : ''}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            value={maxSpeed}
                            label="Maximum Speed"
                            type={'number'}
                            fullWidth
                            id="outlined-required"
                            onChange={(e) => setMaxSpeed(e.target.value)}
                            onFocus={() => setMaxSpeedError(false)}
                            error={showMaxSpeedError}
                            helperText={ showMaxSpeedError ? 'Maximum speed cannot be empty' : ''}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            value={kmPerLiter}
                            label="Kilometre per Litre"
                            type={'number'}
                            fullWidth
                            id="outlined-required"
                            onChange={(e) => setKmPerLiter(e.target.value)}
                            onFocus={() => setKmPerLiterError(false)}
                            error={showKmPerLiterError}
                            helperText={ showKmPerLiterError ? 'Kilometre per litre cannot be empty' : ''}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="outlined-select-passenger"
                            select
                            fullWidth
                            label="Passenger Count"
                            defaultValue={passengerCount}
                            onChange={handlePassengerCountChange}
                        >
                            <MenuItem value={'Single'}>Single</MenuItem>
                            <MenuItem value={'Double'}>Double</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="outlined-select-front"
                            select
                            fullWidth
                            label="Front Brake Type"
                            defaultValue={frontBrake}
                            onChange={handleFrontBrakeChange}
                        >
                            <MenuItem value={'Disc'}>Disc</MenuItem>
                            <MenuItem value={'Drum'}>Drum</MenuItem>
                            <MenuItem value={'ABS'}>ABS</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="outlined-select-rear"
                            select
                            fullWidth
                            label="Rear Brake Type"
                            defaultValue={rearBrake}
                            onChange={handleRearBrakeChange}
                        >
                            <MenuItem value={'Disc'}>Disc</MenuItem>
                            <MenuItem value={'Drum'}>Drum</MenuItem>
                            <MenuItem value={'ABS'}>ABS</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={3}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Last Oil Change"
                            value={lastOilChange}
                            onChange={(newDate) => {
                                setLastOilChange(newDate);
                            }}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel>Upload Image</InputLabel>
                        <input
                            // label="Upload Image"
                            type="file"
                            id="outlined-required"
                            onChange={(e) => setImageFile(e.target.files[0])}
                            // onFocus={() => setKmPerLiterError(false)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Text color='error'>
                            {error}
                        </Text>
                    </Grid>
                </Grid>
                
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">Cancel</Button>
                <Button onClick={handleSubmit} color="primary">Submit</Button>
            </DialogActions>
        </Dialog>
        <Container maxWidth="lg">
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={3}
          >
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Motorcycles" />
                <Divider />
                <CardContent>
                  <Grid container spacing={2}>
                      {motos && motos.map(moto => 
                        <Grid item xs={4} key={moto._id}>
                            <Card>
                            <CardHeader
                                action={
                                <IconButton aria-label="settings">
                                    <MoreVertIcon />
                                </IconButton>
                                }
                                title={moto.model}
                                subheader={moto.brand}
                                style={{ backgroundColor: '#F2F5F9' }}
                            />
                            <CardMedia
                                sx={{ height: 200 }}
                                image={ moto.img ? '/static/images/file-uploads/' + moto.img : '/static/images/placeholders/moto_placeholder.png' }
                                title="Contemplative Reptile"
                            />
                            <CardContent>
                                <Grid container direction="row" alignItems="center">
                                    <Grid item>
                                        <SpeedTwoToneIcon/>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body2" color="text.secondary">
                                            &nbsp;<b>ODO:</b> {moto.odo} kilometres
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" alignItems="center">
                                    <Grid item>
                                        <BoltTwoToneIcon/>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body2" color="text.secondary">
                                            &nbsp;<b>Max speed:</b> {moto.maxSpeed} kmph
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" alignItems="center">
                                    <Grid item>
                                        <LocalGasStationTwoToneIcon/>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body2" color="text.secondary">
                                            &nbsp;<b>Km per liter:</b> {moto.kmPerLiter} km/L
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" alignItems="center">
                                    <Grid item>
                                        <PeopleAltTwoToneIcon/>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body2" color="text.secondary">
                                            &nbsp;<b>Passenger Count:</b> {moto.passengerCount}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" alignItems="center">
                                    <Grid item>
                                        <PermDataSettingTwoToneIcon/>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body2" color="text.secondary">
                                            &nbsp;<b>Front Brake Type:</b> {moto.frontBrake}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" alignItems="center">
                                    <Grid item>
                                        <PermDataSettingTwoToneIcon/>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body2" color="text.secondary">
                                            &nbsp;<b>Rear Brake Type:</b> {moto.rearBrake}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" alignItems="center">
                                    <Grid item>
                                        <SettingsSuggestTwoToneIcon/>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body2" color="text.secondary">
                                            &nbsp;<b>Last Oil Change:</b> {moto.oilChange}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                {/* <Typography variant="body2" color="text.secondary">
                                    {moto.description}
                                </Typography> */}
                            </CardContent>
                            <CardActions disableSpacing>
                                <IconButton aria-label="edit" onClick={(e) => { 
                                    handleOpen(e);
                                    setMotoId(moto._id);
                                    setBrand(moto.brand);
                                    setModel(moto.model);
                                    setOdo(moto.odo);
                                    setMaxSpeed(moto.maxSpeed);
                                    setKmPerLiter(moto.kmPerLiter);
                                    setPassengerCount(moto.passengerCount);
                                    setFrontBrake(moto.frontBrake);
                                    setRearBrake(moto.rearBrake);
                                    setLastOilChange(moto.lastOilChange)
                                }}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton aria-label="remove moto" onClick={() => handleOpenDeleteDialog(moto._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>
                            <Collapse in={expanded} timeout="auto" unmountOnExit>
                                <CardContent>
                                    <Typography paragraph>Method:</Typography>
                                </CardContent>
                            </Collapse>
                        </Card>
                        </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </>
    );
  }
  
export default Garage;