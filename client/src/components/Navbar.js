import React,{useContext} from 'react';
import {
  Navbar,
  Nav,
  NavDropdown,
  Button,
  Tabs
} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link, useHistory} from 'react-router-dom';
import {UserContext} from '../App'



const NavbarMain = () => {

  const history = useHistory()

  const {state, dispatch} = useContext(UserContext)
const renderList = () => {
  if(state){
    return [
      <>
      <Link to="/profile">
      <Button variant="outline-light">Profile</Button>
      </Link> 
      <Link to="/createpost">
      <Button variant="outline-light">Create Post</Button>
      </Link>
      <Link to="/myfollowerspost">
      <Button variant="outline-light">Your Feed</Button>
      </Link>
      <div>
      <Button 
      variant="outline-light"  
      onClick={() => {
        localStorage.clear()
        dispatch({type:"CLEAR"})
        history.push("/signin")
      }}>
      Logout
      </Button>
      </div>
      
      </>
    ]
  }else{
    return [
      <>
       <Nav>
      <Link to="/signin">
      <Button variant="outline-light">Signin</Button>
        </Link>
        </Nav>
        
        <Link to="/signup">
        <Button variant="outline-light">Signup</Button>
      </Link>
     </>
    ]
  }
}

    return (
      
<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" >
<Link to={state ? "/" : "/signin"}>
<Navbar.Brand>SocialAge</Navbar.Brand>
</Link>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav" >
  <Nav className="mr-auto">
    
    </Nav>
    <Nav>
    {renderList()}
    </Nav>
    
    
  </Navbar.Collapse>
</Navbar>


    )
     
           
}
export default NavbarMain


 