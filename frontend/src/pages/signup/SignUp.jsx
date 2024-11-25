import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import PasswordInput from '../../components/Input/PasswordInput';
import { validateEmail } from '../../Utils/helper';
import Navbar from '../../components/Navbar/Navbar'
import axiosInstance from '../../Utils/axiosInstance';


const SignUp = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); 


   const handleSignUp = async (e) => {
    e.preventDefault();

    if(!name) {
      setError("Please enter your name");
      return;
    }
    
    if(!email) {
      setError("Please enter your email")
      return;
    }
    if(!password) {
      setError("Please enter your password")
      return;
    }

    setError("");
    
    //Sign Up API Call

    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });
      //handle successfull registration response
      
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate('/login'); // Redirect user to login page after successful signup
    } else if (response.data && response.data.message) {
        setError(response.data.message); // Handle any additional server messages
    }
    

  }catch (error) {
    
    if(error.response && error.response.data && error.response.data.message) {
      setError(error.response.data.message);
    }else{
      setError("Unexpected Error Occured Please Try Again");}
  }

     
   }

  return (
    <>
    <Navbar/>
    <div className='flex items-center justify-center mt-28'>
      <div className='w-96 border rounded bg-white px-7 py-10'>
      <form onSubmit={handleSignUp} >
        <h4 className="text-2xl mb-7">Sign Up</h4>

        
        <input 
        type='text' 
        placeholder="Name"
        className="input-box"
        value={name}
        onChange={(e) => setName(e.target.value)}
        />

        <input 
        type='text' 
        placeholder="Email"
        className="input-box"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />

        <PasswordInput 
        value={password}
         onChange={(e) => setPassword(e.target.value)}
       
        />

        {error && <p className="text-red-500 text-xs pb-1.5 ">{error}</p>}

        <button type="submit" className="btn-primary " >
          Create Account
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account ?{" "}
          <Link to="/login" className="font-medium text-primary underline2608">
            Login
        </Link> 

        </p>


      </form>
      </div>
    </div>
    </> 
  )
}

export default SignUp