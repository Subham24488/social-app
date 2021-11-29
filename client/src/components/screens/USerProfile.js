import React,{useEffect, useState, useContext} from 'react';
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'
import {Spinner} from 'react-bootstrap'
import {
Container,
Row,
Col,
Card,
Button
}
from 'react-bootstrap'

 

const Profile = () => {
  const [userProfile, setProfile] = useState(null)
  const {state, dispatch} = useContext(UserContext)
  const [showfollow, setShowFollow] = useState(state ? !state.following.includes(userid) : true)
  const {userid} = useParams()
 

   useEffect(() => {
    fetch(`/user/${userid}`, {
     
      headers:{
        "Authorization":"Bearer " + localStorage.getItem("jwt")
      }
    }).then(res => res.json())
    .then(result => {
     
      setProfile(result)
    })
   },[])

   const followUser = () => {
       fetch('/follow', {
           method:"put",
           headers:{
               "Content-Type":"application/json",
               "Authorization":"Bearer "+ localStorage.getItem("jwt")
           },
           body:JSON.stringify({
               followId:userid
           })
        }).then(res => res.json())
           .then(data => {
               console.log(data)
               
            dispatch({type:"UPDATE", payload:{following:data.following, followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))   
            setProfile((prevState) => {
                return {
                ...prevState,
                user:{
                    ...prevState.user,
                followers:[...prevState.user.followers,data._id]}
            }
            })
            setShowFollow(false)
           
       })
   }

   const unfollowUser = () => {
    fetch('/unfollow', {
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+ localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            unfollowId:userid
        })
     }).then(res => res.json())
        .then(data => {
            console.log(data)
            
         dispatch({type:"UPDATE", payload:{following:data.following, followers:data.followers}})
         localStorage.setItem("user",JSON.stringify(data))
        
         setProfile((prevState) => {
            const newFollower =  prevState.user.followers.filter(item => item != data._id)
             return {
             ...prevState,
             user:{
                 ...prevState.user,
             followers:newFollower
         }
        }
      })
      setShowFollow(true)
        
    })
}

    return (
        <>
        {userProfile ? 
            <Container fluid>
      <Row>
        <Col><Card>
          <Card.Img src={userProfile.user.pic} alt="unavailable" />
        </Card>
        <Row>
        {
            showfollow ? 
            <Col><Button variant="secondary" onClick={() => followUser()} >Follow</Button></Col>
            :
            <Col><Button variant="secondary" onClick={() => unfollowUser()} >Unfollow</Button></Col>
        }
            
           
        </Row>
        </Col>

       
        <Col><Card>
          <Card.Title>{userProfile.user.name}</Card.Title>
          <Card.Title>{userProfile.user.email}</Card.Title>
          <Card.Text>{userProfile.posts.length}Posts</Card.Text>
          <Card.Text>{userProfile.user.followers.length}folowers</Card.Text>
          <Card.Text>{userProfile.user.following.length}following</Card.Text>
        </Card>
        </Col>
      </Row>
      
      <Row>
    
      {
        userProfile.posts.map(item => {
          return (
          <Card.Img key={item._id} src={item.photo} alt={item.title} />
          )
        })
      }
      </Row>
    </Container>

        :

        <Spinner animation="border" role="status">
                      <span className="sr-only">Loading...</span>
               </Spinner>
              }
               
               
     
     </>
    )
    
}

export default Profile
