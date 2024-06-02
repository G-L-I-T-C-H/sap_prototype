import { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./header";
import Prompt from "./prompt";

function MainComponent() {
    const location = useLocation();
    const authenticated = location.state?.authenticated || false; 
    const userid = location.state?.userId || null;
    const errorMessage = location.state?.errorMessage || null;

    console.log("userid in mainComponent "+userid)

    return (
        <div className="flex flex-col h-screen bg-black">
            <Header token={authenticated} user_id={userid} errorMessage={errorMessage}/>
            <Prompt token={authenticated} user_id={userid} errorMessage={errorMessage}/>
        </div>
    );
}

export default MainComponent;
