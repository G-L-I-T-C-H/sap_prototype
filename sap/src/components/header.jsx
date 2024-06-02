import React, { useState, useEffect } from "react";
import profile from "../assets/profile.jpeg";
import user from "../assets/user.png";
import history_icon from "../assets/history.png";
import "primeicons/primeicons.css";
import { Drawer } from "antd";
import axios from "axios";


import { useNavigate } from "react-router-dom";

function Header({ token, user_id }) {

  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const [history, setHistory] = useState([]);
  const [username, setUsername] = useState("");
  const [hotels,setHotels] = useState([])
  const [promptHotels, setPromptHotels] = useState({});
  


  async function sendGetRequest(userId) {
    const url = "http://localhost:8080/home";
    const params = { user_id: userId };

    try {
      const response = await axios.get(url, { params });
      const usrname = response.data.username;
      console.log("usser" + usrname);  // Debugging line to check username
      setUsername(response.data.username);
      const hotels = response.data.prompts_hotels;
      console.log(hotels);  // Debugging line to check hotels
      setPromptHotels(response.data.prompts_hotels);
    } catch (error) {
      console.error("GET request failed:", error.message);
    }
  }

  // const searchHistory = async (userId) => {
  //   try {
  //     const response = await axios.get("http://localhost:8080/home",{
  //       data: { user_id: userId } // Pass userId in the request body with the key 'user_id'
  //   });
  
  //     if (response.status === 200) { // Check for successful response
  //       const prompts = response.data.prompts;
  //       const hotels = response.data.hotels;
  //       setHotels(hotels);
  //       // Use the prompts and hotels data here
  //       console.log("Prompts:", prompts);
  //       console.log("Hotels:", hotels);
  //       // You can now process the retrieved prompts and hotels
  //     } else {
  //       console.error("Error fetching searches:", response.data.error);
  //     }
  //   } catch (error) {
  //     console.error("Error sending request:", error);
  //   }
  // };
  
  

  useEffect(() => {
    sendGetRequest(user_id);
  }, [user_id]);
  
  // useEffect(() => {
  //   searchHistory();
  // }, [user_id]);// Re-run effect when user_id changes

  // Click handler for the drawer button
  const handleDrawerClick = () => {
    setVisible(true);
  };

  const profileHandler = () => {
    navigate('/profile', { state: { authenticated: true, userId: user_id, username: username } });
  }

  const historyHandler = () =>{
    navigate('/history',{ state: { userId: user_id, promptHotels: promptHotels } })
  }

  return (
    <div className="sticky top-1 z-10 flex items-center justify-between h-18  p-2 md:h-24 md:p-4 ">

<div className="left-0">
        <div className="rounded-full  h-12 w-12 overflow-hidden md:h-18 md:w-18" onClick={handleDrawerClick}>
          <img src={history_icon} alt="profile" className=" object-contain" />
        </div>
      </div>

      <Drawer
        open={visible}
        title={"History"}
        titleStyle={{ color: "#cccccc" }}
        footer={"© StaySavvy 2024"}
        closable={false}
        onClose={() => setVisible(false)}
        placement="left"
        style={{ backgroundColor: "#444444", border: 2 }}
      >
        {Object.keys(promptHotels).length === 0 ? (
          
          <p>No history available.</p>
        ) : (
          <div>
            {Object.entries(promptHotels).map(([prompt, hotels], index) => (
              <div key={index} className="mb-5">
                <h3 onClick={historyHandler}>{prompt}</h3>
                <br />
              </div>
            ))}
          </div>
        )}
      </Drawer>

      <div>
        <h1 className="text-white text-2xl md:text-3xl">StaySavvy</h1>
      </div>

      <div className="right-0">
        <div className="rounded-full  h-12 w-12 overflow-hidden md:h-18 md:w-18" onClick={profileHandler}>
          <img src={user} alt="profile" className=" object-contain" />
        </div>
      </div>
    </div>
  );
}

export default Header;
