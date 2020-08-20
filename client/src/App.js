import React, { useContext, useEffect, createContext, useReducer } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Signup from "./components/Signup";
import CreatePost from "./components/CreatePost";
import SubscribedUserPost from "./components/SubscribedUserPost";
import UserProfile from "./components/UserProfile";
import Reset from "./components/Reset";
import ResetPassword from "./components/ResetPassword";
import { reducer, initialState } from "./reducers/userReducer";

export const UserContext = createContext();

 const Routing = () => {
   const history = useHistory();
   const {state,dispatch} = useContext(UserContext)
  console.log(state,dispatch)
  const user = JSON.parse(localStorage.getItem("user"))
   useEffect(() => {
     if(user){
       dispatch({type:"USER",payload:user})
        history.push("/")
     }else{
       if(!history.location.pathname.startsWith('/reset')){
         history.push("/signin")
        }
     }
   }, [])
   return (
     <>
       <Switch>
         <Route exact path="/" component={Home} />
         <Route exact path="/signin" component={Login} />
         <Route exact path="/myFOllowersPost" component={SubscribedUserPost} />
         <Route exact path="/profile" component={Profile} />
         <Route exact path="/signup" component={Signup} />
         <Route exact path="/create" component={CreatePost} />
         <Route exact path="/reset" component={Reset} />
         <Route exact path="/profile/:id" component={UserProfile} />
         <Route exact path="/reset/:token" component={ResetPassword} />
       </Switch>
     </>
   );
 };

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <>
     <UserContext.Provider value={{state, dispatch}}>
       <Router>
         <Navbar />
         <Routing />
       </Router>
     </UserContext.Provider>

    </>
  );
}

export default App;
