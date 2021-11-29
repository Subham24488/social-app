import React,{useState, useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {Link,useHistory} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright ©SocialAge '}
     
      {new Date().getFullYear()}
      
    </Typography>
  );
}

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
 
  form: {
    width: '100%', 
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Signup = () => {
    const classes = useStyles();

    const history = useHistory()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const[image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)
    const [open, setOpen] = React.useState(false);

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
          uploadFields()
        }
      },[url])

const uploadPic = () => {
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
  
const uploadFields = () => {
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
    return handleClick();
}

fetch("/signup",
{
    method:"post",
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify({
        name,
        email,
        password,
        pic:url
    })
}).then(res => res.json())
.then(data => {
    if(data.error){
      return handleClick()
    }else{
       history.push("/signin")
    }
   
}).catch(err => {
    console.log(err)
})

}

const PostData = () => {
  if(image){
    uploadPic()
  }else{
    uploadFields()
  }
    }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} >
              <TextField
                autoComplete="name"
                name="name"
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Name"
                autoFocus
                value={name}
              onChange={(e) => setName(e.target.value)}
              />
            </Grid>
           
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
              onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
              onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
            <div className={classes.root}>
            <Typography component="span">Upload Pic </Typography>
            <input
               className={classes.input}
               multiple
               type="file"
               name="image"
  
               onChange={(e) => setImage(e.target.files[0])}
                 />
 
             </div>
             
            </Grid>
          </Grid>
          <Button
            
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => PostData()}
          >
            Sign Up
          </Button>
          <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
          <Alert severity="error">Email or password is invalid!</Alert>
        </Snackbar>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/signin" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default Signup
