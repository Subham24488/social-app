import React,{useEffect, useState, useContext} from 'react';
import {UserContext} from '../../App'
import {
Container,
Row,
Col,
Card,
Spinner,
Button
}
from 'react-bootstrap'

 

const Profile = () => {
  const [mypics, setPics] = useState([])
  const {state, dispatch} = useContext(UserContext)
  const[image, setImage] = useState("")
  

   useEffect(() => {
    fetch("/mypost", {
     
      headers:{
        "Authorization":"Bearer " + localStorage.getItem("jwt")
      }
    }).then(res => res.json())
    .then(result => {
      
     setPics(result.mypost)
    })
   },[])
    
   useEffect(() => {
     if(image){
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
           
           
        
            fetch("/updatepic", {
              method:"put",
              headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("jwt")
              },
              body:JSON.stringify({
                pic:data.url
              })
            }).then(res => res.json())
            .then(result => {
              console.log(result)
              localStorage.setItem("user", JSON.stringify({...state, pic:result.pic}))
              dispatch({type:"UPDATEDPIC", payload:result.pic})
            })  
            
          })
            .catch(err => {
             console.log(err)
              })
        }

      },[image])


  const updatePhoto = (file) => {
     setImage(file)
   }

    return (
      <Container fluid>
      <Row>
        <Col><Card>
          <Card.Img src={state ? state.pic : "loading"} alt="unavailable" />
         
           <input
               placeholder="Upload"
               multiple
               type="file"
               name="image"
               onChange={(e) => updatePhoto(e.target.files[0])}
                 />
        </Card>
        </Col>
        <Col><Card>
          <Card.Title>{state ? state.name : "loading"}</Card.Title>
          <Card.Text>{mypics.length}Posts</Card.Text>
          <Card.Text>{state ? state.followers.length : "loading"}folowers</Card.Text>
          <Card.Text>{state ? state.following.length : "loading"}following</Card.Text>
        </Card>
        </Col>
      </Row>
      <Row>
    
      {
        mypics.map(item => {
          return (
            <Col>
            <Card.Img key={item._id} src={item.photo} alt={item.title} />
            </Col>
         
          )
        })
      }
          
             
            
         
      </Row>
    
    </Container>

    )
    
}

export default Profile
