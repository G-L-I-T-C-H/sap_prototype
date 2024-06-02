import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function ResetPassword(){

    const navigate = useNavigate();

    const [password,setPassword] = useState("");
    const [resetpassword,setResetPassword] = useState("");
    const location = useLocation();
    const authenticated = location.state?.authenticated || false; 
    const userId = location.state?.userId || null;

    console.log("user-id in resetpassoword"+userId)

    const passwordHandler = (event) => {
        setPassword(event.target.value);
        
        
    };

    const secondpasswordHandler = (event) => {
        setResetPassword(event.target.value);
        
    };

    const resetHandler = async () => {
        if (password !== resetpassword) {
          alert("Passwords do not match. Please try again.");
          return;
        }
    
        try {
          const response = await axios.post("http://localhost:8080/resetpassword", {
            userId: userId,
            password: password
          });
    
          if (response.data.message) {
            alert("Password reset successfully!");
            navigate('/login')
          } else {
            alert(response.data.error || "An error occurred. Please try again.");
          }
        } catch (error) {
          console.error("Error resetting password:", error);
          alert("An error occurred. Please try again.");
        }
    }

    const logOutHandler = ()=>{
        navigate('/login')
    }
    


    return(
        <div className="flex flex-col h-screen bg-black p-8">
            <div className="mb-4 mt-9">
                    <label className="text-white text-xl font-bold block mb-6 md:text-2xl" htmlFor="email">Enter new password</label>
                    <input
                        className="w-full px-3 py-2 rounded-lg  outline-none focus:outline-none focus:ring-1 focus:ring-purple-500 text-white bg-gray-900 md:h-16"
                        id="email"
                        name="email"
                        placeholder="enter new password"
                        value={password}
                        onChange={passwordHandler}
                        
                    />
                </div>

                <div className="mb-4 mt-9">
                    <label className="text-white text-xl font-bold block mb-6 md:text-2xl" htmlFor="email">Re-enter new password</label>
                    <input
                        className="w-full px-3 py-2 rounded-lg  outline-none focus:outline-none focus:ring-1 focus:ring-purple-500 text-white bg-gray-900 md:h-16"
                        id="email"
                        name="email"
                        placeholder="re-enter new password"
                        value={resetpassword}
                        onChange={secondpasswordHandler}  
                    />
                </div>

                <div>
                    <button className="w-full bg-gradient-to-r from-purple-600 to-blue-400 text-white font-bold py-2 px-4 rounded-md md:h-14 md:rounded-3xl" onClick={resetHandler}>
                        <p>reset password</p>
                    </button>
                </div>

                <div className="mt-4">
                    <button className="w-full bg-gradient-to-r from-purple-600 to-blue-400 text-white font-bold py-2 px-4 rounded-md md:h-14 md:rounded-3xl" onClick={logOutHandler}>
                        <p>log out</p>
                    </button>
                </div>
        </div>
        
    )}


export default ResetPassword;