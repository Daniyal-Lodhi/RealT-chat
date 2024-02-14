import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../context/FirebaseProvider';

const Auth = (props) => {
  const navigate = useNavigate();
  const firebase = useFirebase();

  useEffect(() => {
    if (localStorage.getItem("loggedIn")=='false') {
      navigate('/');
      console.log(localStorage.getItem("loggedIn"))
    }
  }, [firebase, navigate]);

  return (
    <div>
        {props.children}
    </div>
  );
};

export default Auth;
