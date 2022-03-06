import { Helmet } from 'react-helmet-async';
import { useState, useLayoutEffect, forwardRef } from 'react';
import dateFormat from "dateformat" 
import { Link } from "react-router-dom";

import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { InputAdornment, Container, Grid, Card, CardHeader, CardContent, Divider, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, TextField } from '@mui/material';
import CardActions from '@mui/material/CardActions';

import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
// import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PinDropTwoToneIcon from '@mui/icons-material/PinDropTwoTone';
import SearchTwoTone from '@mui/icons-material/SearchTwoTone';
import configData from '../../utils/configData.json'
import SpotifyPlayer from 'react-spotify-web-playback';
import Text from 'src/components/Text';

// interface ExpandMoreProps extends IconButtonProps {
//     expand: boolean;
// }

// const ExpandMore = styled((props: ExpandMoreProps) => {
//     const { expand, ...other } = props;
//     return <IconButton {...other} />;
// })(({ theme, expand }) => ({
//     transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
//     marginLeft: 'auto',
//     transition: theme.transitions.create('transform', {
//       duration: theme.transitions.duration.shortest,
//     }),
// }));


function Notes() {

    const [expanded, setExpanded] = useState(false);
    const [news, setNews] = useState({});
    const [notes, setNotes] = useState([]);
    const [noteId, setNoteId] = useState("");
    const [open, setOpen] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [destination, setDestination] = useState("");
    const [description, setDescription] = useState("");
    const [showError, setShowError] = useState(false);
    const [showTitleError, setTitleError] = useState(false);
    const [showSubtitleError, setSubtitleError] = useState(false);
    const [showDestinationError, setDestinationError] = useState(false);
    const [showDescriptionError, setDescriptionError] = useState(false);
    const [error, setError] = useState("");
    const [removeId, setRemoveId] = useState("");
  
  
    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    const getMotoNews = () => {
        fetch(`${configData.SERVER_URL}/api/v1/extras/news`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then(res => res.json())
        .then(data => {
            setNews(data);
        })
    }

    const getNotes = () => {
        fetch(`${configData.SERVER_URL}/api/v1/notes`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'x-auth-token': localStorage.getItem('token')
            }
          })
          .then(res => res.json())
          .then(data => {
            setNotes(data);
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

    const handleOpenDeleteDialog = (noteId) => {
        setRemoveId(noteId)
        setOpenDeleteDialog(true);
    }

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    }

    const handleSubmit = () => {
        if (title === "") {
            setTitleError(true)
        } else if (subtitle === "") {
            setSubtitleError(true)
        } else if (destination === ""){
            setDestinationError(true)
        } else if (description === "") {
            setDescriptionError(true)
        } else {
            let submitMethod = "";
            if (dialogTitle === 'Add') {
                submitMethod = 'POST'
            } else {
                submitMethod = 'PUT'
            }

            fetch(`${configData.SERVER_URL}/api/v1/notes`, {
                method: submitMethod,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    noteId,
                    title,
                    subtitle,
                    destination,
                    description
                })
            })
            .then(res => res.json())
            .then(data => {
                setNoteId("");
                setTitle("");
                setSubtitle("");
                setDestination("");
                setDescription("");
                setOpen(false);
                getNotes();
            })
        }

    }

    const removeNote = (noteId) => {
        fetch(`${configData.SERVER_URL}/api/v1/notes`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({
                noteId: noteId
            })
        })
        .then(res => res.json())
        .then(data => {
            setRemoveId("");
            setOpenDeleteDialog(false)
            getNotes();
        })
    }

    const changeImportance = (noteId, isImportant) => {
        fetch(`${configData.SERVER_URL}/api/v1/notes`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({
                noteId,
                isImportant: !isImportant
            })
        })
        .then(res => res.json())
        .then(data => {
            getNotes();
        })
    }

    const filterEntries = (searchTerms) => {
        let filteredItems = [];

        if (searchTerms !== "") {
            console.log('a');
            

            for (const note of notes) {
                if (note.title.includes(searchTerms)) {
                    filteredItems.push(note)
                }
            }
            setNotes(filteredItems)
        } else {
            console.log('b');
            
            getNotes();
        }

    }

    const openNews = (newsUrl) => {
        window.open(newsUrl)
    }

    useLayoutEffect(() => {
        getMotoNews();
        getNotes();
    }, []);
  
    return (
      <>
        <Helmet>
          <title>Diary</title>
        </Helmet>
        <PageTitleWrapper>
            <Grid container justifyContent="right" alignItems="right">
                <PageTitle
                    heading="Trip Diary"
                    subHeading="Create your very own ride journal while jamming out to some tunes. Also, you can check out the latest biker news while you're at it."
                />
                <Grid item>
                    <Button
                        sx={{ mt: { xs: 2, md: 0 } }}
                        variant="contained"
                        startIcon={<AddTwoToneIcon fontSize="small" />}
                        onClick={(e) => handleOpen(e)}
                        id="add-btn"
                    >
                        Add Entry
                    </Button>
                </Grid>
            </Grid>
        </PageTitleWrapper>
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} fullWidth maxWidth='xs'>
            <DialogTitle>Delete Entry</DialogTitle>
            <DialogContent dividers>
                {/* <DialogContentText> 
                    Are you sure you want to delete this entry?
                </DialogContentText> */}
                <Grid container spacing={2} sx={{ mt: 0, mb: 1 }} 
                    direction="column"
                    alignItems="center"
                    justifyContent="center">
                    <Grid item xs={12}>
                        <Text color='primary'>
                            Are you sure you want to delete this entry?
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
                    {dialogTitle} the details of your diary entry below.
                </DialogContentText>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <TextField
                            value={title}
                            autoFocus
                            label="Title"
                            placeholder='ex. My First Ever Ride'
                            fullWidth
                            id="outlined-required"
                            onChange={(e) => setTitle(e.target.value)}
                            onFocus={() => setTitleError(false)}
                            error={showTitleError}
                            helperText={ showTitleError ? 'Title cannot be empty': '' }
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            value={subtitle}
                            label="Subtitle"
                            placeholder='ex. My first ever ride. What a blast!'
                            fullWidth
                            id="outlined-required"
                            onChange={(e) => setSubtitle(e.target.value)}
                            onFocus={() => setSubtitleError(false)}
                            error={showSubtitleError}
                            helperText={ showSubtitleError ? 'Subtitle cannot be empty' : '' }
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            value={destination}
                            label="Destination"
                            placeholder='ex. Tagaytay'
                            fullWidth
                            id="outlined-required"
                            onChange={(e) => setDestination(e.target.value)}
                            onFocus={() => setDestinationError(false)}
                            error={showDestinationError}
                            helperText={ showDestinationError ? 'Destination cannot be empty' : ''}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            value={description}
                            multiline
                            minRows={7}
                            label="Description"
                            fullWidth
                            id="outlined-required"
                            onChange={(e) => setDescription(e.target.value)}
                            onFocus={() => setDescriptionError(false)}
                            error={showDescriptionError}
                            helperText={ showDescriptionError ? 'Description cannot be empty' : ''}
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
                <CardHeader title="Moto News" />
                <Divider />
                <CardContent>
                  <Card sx={{ minWidth: 250 }}>
                    <CardContent>
                      <Grid container>
                          {/* <Grid item xs={8}>
                            <Typography variant="h5" component="div">
                              {news['title']}
                            </Typography>
                            <Typography sx={{ mt: 2, mr: 2 }}>
                              {news['description']}
                            </Typography>
                          </Grid> */}
                          <Grid item xs={12}>
                            
                            <div style={{ position: "relative" }}>
                              <CardMedia
                                sx={{ height: 200 }}
                                image={ news['urlToImage'] }
                                style = {{ filter: "brightness(50%)" }}
                              />
                              <div style={{position: "absolute", color: "white",top: "70%",left: "2%"}}>
                                <Typography variant="body1" color="#F2F5F9" style={{ fontSize: '2em', fontWeight: 'bold', textShadow: '12, 12, 12', cursor: 'pointer' }} 
                                  onClick={() => openNews(news['url'])}>
                                  <b>{news['title']}</b>
                                </Typography>
                              </div>
                            </div>
                            
                          </Grid>
                      </Grid>
                    </CardContent>
                    
                    {/* <CardActions sx={{ mt: -6 }}>
                      <Button size="small" href={news['url']} target="_blank">
                        <VisibilityTwoToneIcon/> &nbsp;Full Article
                      </Button>
                    </CardActions> */}
                  </Card>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Entries" />
                <Divider />
                <Card sx={{ p: 2, ml: 2, mr: 2, mt: 2 }} style={{ backgroundColor: '#F2F5F9'}} >
                    <Grid item xs={12}>
                    <SpotifyPlayer
                        token="BQBVA2BTe3YnbhC5dQAEzGmbnuNABI156AUSLEMYfqhM3DsOQ2TGVsWJ-Ps3ktr1P8bI-3d0_kNwJRNGIPEMcMNYzdrTY5qVs92lJX1CJIz58rc7dYhZjIhOIPv7Ytyk3o-MJ_cUbhPiESAfLxApz4Y1xBCbw9_2KXmkqPe3970MI0vbXv6eVr8IHVuovbI"
                        uris={['spotify:playlist:37i9dQZF1DZ06evO49hLQA']}
                    />
                    </Grid>
                </Card>
                <Grid container sx={{ pl: 2, pr: 2, pt: 2 }}>
                    <Grid item xs={12}>
                        <TextField 
                            fullWidth 
                            id="outlined-search" 
                            label="Search field" 
                            type="search"
                            InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SearchTwoTone />
                                  </InputAdornment>
                                ),
                            }}
                            placeholder='Enter search terms here'
                            onChange={(e) => filterEntries(e.target.value)}
                        />
                    </Grid>
                </Grid>
                <CardContent>
                  <Grid container spacing={2}>
                      {notes && notes.map(note => 
                        <Grid item xs={4} key={note._id}>
                            <Card>
                            <CardHeader
                                action={
                                <IconButton aria-label="settings">
                                    <MoreVertIcon />
                                </IconButton>
                                }
                                title={note.title}
                                subheader={dateFormat(note.createdAt, "isoDate")}
                                style={{ backgroundColor: '#F2F5F9' }}
                            />
                            <CardContent>
                                <Grid container direction="row" alignItems="center">
                                    <Grid item>
                                        <PinDropTwoToneIcon/>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body2" color="text.secondary">
                                            {note.destination}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Typography variant="body2" color="text.secondary">
                                    <b>{note.subtitle}</b>
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {note.description}
                                </Typography>
                            </CardContent>
                            <CardActions disableSpacing>
                                <IconButton aria-label="add to favorites" onClick={() => changeImportance(note._id, note.isImportant)}>
                                    <FavoriteIcon style={note.isImportant ? {color: '#5569FF'} : {}}/>
                                </IconButton>
                                <IconButton aria-label="edit" onClick={(e) => { 
                                    handleOpen(e);
                                    setNoteId(note._id);
                                    setTitle(note.title); 
                                    setSubtitle(note.subtitle); 
                                    setDestination(note.destination);
                                    setDescription(note.description); 
                                }}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton aria-label="remove note" onClick={() => handleOpenDeleteDialog(note._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>
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
  
export default Notes;