import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from './firebase.confige';
import React,{useState} from 'react';


// firebase.initializeApp(firebaseConfig)

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}
function App() {
  const [newUser,setNewUser] = useState(false);
  const [user,setUser] = useState( 
    {
    isSignIn: false,
    
    name: '',
    email: '',
    password: '',
    photo: ''
  })

  // console.log(user)

  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();

  const handleSignIn = ()=>{
    firebase.auth().signInWithPopup(googleProvider)
    .then(res => {
      const {displayName, photoURL, email} = res.user;
      

      const signedInUser = {
        isSignIn:true,
        name: displayName,
        email: email,
        photo:photoURL
      }
      setUser(signedInUser);
      // console.log(displayName,email,photoURL);
    })
    .catch(err => {
      console.log(err);
      console.log(err.message);
    })
  }

  const handleFbSignIn= () => {
    firebase.auth().signInWithPopup(fbProvider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // The signed-in user info.
    var user = result.user;
    console.log('fb user after sign in',user);

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var accessToken = credential.accessToken;

    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    // ...
  });
  }
  const handleSignOut = () => {
    firebase.auth().signOut().then(res => {

      const signOutUser = {isSignIn: false,
      name: '',
      photo:'',
      error:'',
      email: '',
      success:false
  }
  setUser(signOutUser);
  
    })
    .catch(err => {
      // An error happen
    })
  }



  const handleChange = (e) => {
    console.log(e.target.name,e.target.value);
    

  }

  const handleSubmit = (e) => {
    // console.log(user.email,user.password);
    if(newUser && user.name && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then((res) => {
        // Signed in 
        const newUserInfo = {...user};
        newUserInfo.error ='';
        newUserInfo.success =true;
        setUser(newUserInfo);
        updateUserName(user.name);
        // ...
      })
      .catch((error) => {
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
        // ..
      });
    }


    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then((res) => {
    // Signed in
    const newUserInfo = {...user};
        newUserInfo.error ='';
        newUserInfo.success =true;
        setUser(newUserInfo);
        console.log('sign in user info',res.user);
    // ...
  })
  .catch((error) => {
    const newUserInfo = {...user};
    newUserInfo.error = error.message;
    newUserInfo.success = false;
    setUser(newUserInfo);
  });
    }
    e.preventDefault();
  }


  const handleBlur=(e)=> {
    let isFileValid = true;
    if(e.target.name=== 'email'){
         isFileValid = /\S+@\S+\.\S+/.test(e.target.value);
         
    }
    if (e.target.name=== 'password'){ 
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFileValid = isPasswordValid && passwordHasNumber

    }
    if(isFileValid){
      //  [...cart,newItem]
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }

  }

  const updateUserName = name => {
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name
    }).then(function() {
      console.log('user name updated')
    }).catch(function(error) {
      // An error happened.
      console.log(error);
    });

  }

  return (
    <div className="App">
    {
      user.isSignIn ? <button onClick={handleSignOut}>Sign Out</button> :
      <button onClick={handleSignIn}>Sign In</button>
      
    }
    <br/>
    <button onClick={handleFbSignIn}>Sign in using Facebook</button>
     {
       user.isSignIn && 
       <div>
         <p> Welcome, {user.name}</p>
         <p>Your email: {user.email}</p>
         
         <img src={user.photo} alt=""/>
       </div>

     }

     <h1>Our own Authentication</h1>
     <input type="checkbox" onChange={()=> setNewUser(!newUser)} name="newUser" id=""/>
     <label htmlFor="newUser">New User Sign up</label>
     
     <form onSubmit={handleSubmit}>
      {newUser && <input name="name" type="text" onBlur={handleBlur} placeholder="your name"/>}
       <br/>
     <input type="text" onBlur={handleBlur} name="email" placeholder="Your Email address" required/>
     <br/>
     <input type="password" onBlur={handleBlur} name="password" placeholder="your password" required/>
     <br/>
     <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'}/>
     </form>
     <p style={{color: 'red'}}>{user.error}</p>
     {user.success && <p style={{color: 'green'}}>User {newUser ?'created': "Logged In"} successfully</p>}
    </div>
  );
}

export default App;
