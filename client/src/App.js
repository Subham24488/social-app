import React,{useEffect, createContext, useReducer, useContext} from 'react';
import Navbar from './components/Navbar'
import './App.css';

import {Route, BrowserRouter, Switch, useHistory } from 'react-router-dom'
import HomePage from './components/screens/HomePage';
import Signin from './components/screens/Signin'
import Profile from './components/screens/Profile'
import Signup from './components/screens/Signup'
import SubscribedUserPosts from './components/screens/SubcribedUserPosts'
import UserProfile from './components/screens/USerProfile'
import CssBaseline from '@material-ui/core/CssBaseline';
import CreatePost from './components/CreatePost';
import {reducer,initialState} from './reducers/userReducer'

export const UserContext = createContext()

const Routing = () => {

  const history = useHistory()
  const {state, dispatch} = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER", payload:user})
      
    }else{
      history.push('/signin')
    }
  },[])
  return (
<Switch>
<Route path="/" exact component={HomePage} />
   <Route path="/signin" component={Signin} />
   <Route path="/profile" exact  component={Profile} />
   <Route path="/signup" component={Signup} />
   <Route path="/createpost" component={CreatePost} />
   <Route path="/profile/:userid" component={UserProfile} />
   <Route path="/myfollowerspost" component={SubscribedUserPosts} />
</Switch>
  )
  
}

function App() {

  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <UserContext.Provider value={{state, dispatch}}>
    <BrowserRouter>
       
       
        <Navbar />
        <CssBaseline />
       <Routing />
    </BrowserRouter>
    </UserContext.Provider>
  
     
   
  );
}

export default App;
