import React,{useState,useEffect, useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Box, TextField, Button } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import {UserContext} from '../../App'
import { Form } from 'react-bootstrap';
import DeleteIcon from '@material-ui/icons/Delete';
import {useHistory} from 'react-router-dom'
import {Link, useParams} from 'react-router-dom'



const useStyles = makeStyles((theme) => ({
    
  root: {
      
    maxWidth: "100%",
    padding:"20px 20px"

    
  },
  media: {
    height: 0,
    paddingTop: '56.25%', 
    
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  
}));

const HomePage = () => {

    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const[data, setData] = useState([])
    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()

    console.log(state)

    const getDateAndTime = () => {
        return (new Date().toLocaleString())
        
       
    }

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };
  
    useEffect(() => {

      fetch("/getsubpost", {
        headers:{
          "Authorization":"Bearer "+localStorage.getItem("jwt")
        }
      }).then(res => res.json()
      .then(result => {
        console.log(result)
        setData(result.posts)
      }))
      
      },[])

      const likePost = (id) => {
        fetch("/like", {
          method:"put",
          headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
          },
          body:JSON.stringify({
            postId:id
          })
        }).then(res => res.json())
        .then(result => {
          const newData = data.map(item => {
            if(item._id == result._id){
              return result
            }else{
              return item
            }
          })
          setData(newData)
        }).catch(err => {
          console.log(err)
        })
      }

      const unlikePost = (id) => {
        fetch("/unlike", {
          method:"put",
          headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
          },
          body:JSON.stringify({
            postId:id
          })
        }).then(res => res.json())
        .then(result => {
          const newData = data.map(item => {
            if(item._id == result._id){
              return result
            }else{
              return item
            }
          })
          setData(newData)
        }).catch(err => {
          console.log(err)
        })
      }

      const makeComment = (text, postId) => {
        fetch("/comment", {
          method:"put",
          headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer " + localStorage.getItem("jwt")
          },
          body:JSON.stringify({
            postId,
            text
          })
        
        }).then(res => res.json())
        .then(result => {
          console.log(result)
          const newData = data.map(item => {
            if(item._id == result._id){
              return result
            }else{
              return item
            }
          })
          setData(newData)
        }).catch(err => {
          console.log(err)
        })
      }
   
      const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`, {
          method:"delete",
          headers:{
            "Authorization":"Bearer " + localStorage.getItem("jwt")
          }
        }).then(res => res.json())
        .then(result => {
          console.log(result)
          const newData = data.filter(item => {
            return item._id !== result._id
          })
          setData(newData)
        })
      }

    return ( 
        
      <Box>

        {
         data.map((item) => {
           return (
            <Card className={classes.root} key={item._id}>
         
        <CardHeader
action ={
  
            (item.postedBy._id == state._id) ?
             <IconButton onClick={() => deletePost(item._id)}>
              <DeleteIcon />
            </IconButton>
            :
            null
          
        }

          title={<Link to={ (item.postedBy._id !== state._id) ?  "/profile/"+item.postedBy._id : "/profile"}>{item.postedBy.name}</Link>}
          subheader={getDateAndTime()}
          
        />
        <CardMedia
          className={classes.media}
          image={item.photo}
          title={item.title}
          
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
           {item.title}
             <IconButton component="span"
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
          </Typography><br />
          <Typography>

          </Typography>
          
        </CardContent>
        <CardActions disableSpacing>
        <Typography component="p">{item.likes.length}likes</Typography>
         
         {
            item.likes.includes(state._id) ? 
            <IconButton aria-label="add to favorites" onClick={() => {unlikePost(item._id)} }>
            <ThumbDownAltIcon />
          </IconButton>
          :
          <IconButton aria-label="add to favorites" onClick={() => {likePost(item._id)} }>
            <ThumbUpIcon /> 
          </IconButton>
         }
         <form  onSubmit={(e) => {
                      e.preventDefault()
                      makeComment(e.target[0].value, item._id)}}>
          <input
                    
                    placeholder="Message"
                    required
                    name="message"
                    
                    type="text"
                    
                  />
                  {/* <Button component="span" className={classes.sendButton} type="submit" size="small" variant="outlined"  >
                     <SendIcon />
                  </Button> */} 
                 
                  
                   {
                    item.comments.map((record) => {
                      return(
                        <Typography key={record._id} ><span style={{fontWeight:"500"}}>{record.postedBy.name}</span> : {record.text}</Typography>
                      )
                    })
                  }
                 
                  </form>
                 
                  
                  
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>{item.title}</Typography>
            <Typography paragraph>
            {item.body}
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
           )
         })

        }
            
      
        </Box>
    );
}

export default HomePage
