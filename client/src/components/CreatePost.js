import React,{useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box'
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import {Typography, TextField, TextareaAutosize} from '@material-ui/core';
import {useHistory} from 'react-router-dom';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme =>({

    button: {
        margin: theme.spacing(1),
      },
  root: {
    minWidth: 275,
  },
  input: {
    
  },
})
);

const CreatePost = () => {
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;
    
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    const [open, setOpen] = useState(false);

    const handleClick = () => {
      setOpen(true);
    };
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };

    useEffect(() => {
      if(url){
    //request to server--------------------------------------------------
    fetch("/createpost",
    {
        method:"post",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer " + localStorage.getItem("jwt")
        },
        body:JSON.stringify({
           title,
           body,
           pic:url
        })
    }).then(res => res.json())
    .then(data => {
        if(data.error){
          return handleClick()
        }else{
           history.push("/")
        }
       
    }).catch(err => {
        console.log(err)
    })
      }
    },[url])
//fetching the cloudinary--------------------------------------------------------------
    const PostDetails = () => {
      const data = new FormData()
      data.append("file", image)
      data.append("upload_preset", "SocialAge")
      data.append("cloud_name", "subham24488")
      
fetch("https://api.cloudinary.com/v1_1/subham24488/image/upload", {
  method:"post",
  body:data
})
.then(res => res.json())
.then(data => {
  setUrl(data.url)
})
.catch(err => {
  console.log(err)
})
}
  
    return (
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <Typography variant="h4" align="center" color="textSecondary" gutterBottom>
            Create your post
          </Typography>
          <TextField 
                    fullWidth={true}
                    label="Post title"
                    required
                    variant="outlined"
                    multiline
                    rows={1}
                    name="Posttitle"
                    margin="dense"
                    size="medium"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    
                  /><br/>
                  <TextareaAutosize 
                  aria-label="minimum height" 
                  rowsMin={3} 
                  variant="outlined" 
                  required 
                 
                  placeholder="Body"
                  name="body"
                  value={body}
                    onChange={(e) => setBody(e.target.value)} />
                     <br/>

                     <div className={classes.root}>

      <input
        className={classes.input}
        multiple
        type="file"
        name="image"
        
        onChange={(e) => setImage(e.target.files[0])}
      />
       
      </div>
        
        </CardContent>
        <CardActions>
          <Button size="small" type="submit" variant="contained" color="primary" onClick={() => PostDetails()} >Post</Button>
          <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
          <Alert severity="error">This is an error message!</Alert>
        </Snackbar>
        </CardActions>
      </Card>
    );
}

export default CreatePost
