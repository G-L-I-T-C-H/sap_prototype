import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ResetPassword from "./resetPassword";
import profile from "../assets/profile.jpeg";
import user from "../assets/user.png";


function Profile() {

    const navigate = useNavigate();

    const location = useLocation();
    const authenticated = location.state?.authenticated || false; 
    const userId = location.state?.userId || null;
    const username = location.state?.username || null;

    const [visible,setVisible] = useState(false)

    console.log("user_id in profile" + userId)

    const deleteUserPrompts = async (userId) => {
        try {
            const response = await axios.delete("http://localhost:8080/profile", {
                data: { user_id: userId } // Pass userId in the request body with the key 'user_id'
            });
            console.log("Prompts deleted successfully:", response.data);
            // Handle success (e.g., show a success message)
        } catch (error) {
            console.error("Error deleting prompts:", error);
            // Handle error (e.g., show an error message)
        }
    };


    function clickHandler(){
        navigate('/resetpassword', { state: { authenticated: true, userId: userId } })
    }

    function signoutHandler(){
        navigate('/')
    }

    


    return (
        <div className="flex flex-col h-screen bg-black p-8  items-center rounded-md border-gray-700">

            

            <div className="mt-7 mb-10">
                <div className="rounded-full  h-14 w-14 overflow-hidden md:h-18 md:w-18" >
                <img src={user} alt="profile" className=" object-contain" />
                </div>
            </div>

            <button className="w-full bg-gradient-to-r from-purple-600 to-blue-400 text-white font-bold py-2 px-4 rounded-md md:h-14 md:rounded-3xl" onClick={() => deleteUserPrompts(userId)}>
                <p className="md:text-lg">Delete all chats</p>
            </button>

            <br />

            <button className="w-full bg-gradient-to-r from-purple-600 to-blue-400 text-white font-bold py-2 px-4 rounded-md md:h-14 md:rounded-3xl"  onClick={clickHandler}>
                <p className="md:text-lg">
                reset password
                </p>
            </button>

                <br />

            <button className="w-full bg-gradient-to-r from-purple-600 to-blue-400 text-white font-bold py-2 px-4 rounded-md md:h-14 md:rounded-3xl" onClick={signoutHandler}>
                <p className="md:text-lg">
                sign out
                </p>
            </button>
            

        </div>
    );
}

export default Profile;
