import React  from "react";
import 'primeicons/primeicons.css';
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import axios from 'axios';

        

function WelcomeComponent() {
    const navigate = useNavigate();

    const fetchApi = async () =>{
        const response = await axios.get("http://localhost:8080/");
        console.log(response.data)
    }

    useEffect(()=>{
        fetchApi()
    },[])

    return (
        
        <div className="flex flex-col h-screen bg-black p-8">
            <div className="sticky top-5 z-10 flex flex-col items-center justify-center h-18  p-2">

                <div className="flex">
                    <i className="pi pi-slack" style={{ color: '#cccccc',fontSize: '2rem' }}></i>
                    <h1 className="text-white text-2xl ml-4 md:text-4xl">StaySavvy</h1>  
                </div>

                <hr className="w-3/4 border-gray-400 border-t-2 mt-2" />
            </div>

            //mobile 
            

            //tab and pc layout
            <div className=" mt-2 mb-10 md:mt-9 md:mb-10">
                <p className="text-white text-4xl text-center md:text-6xl">Explore infinite <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-orange-400">capabilities</span>  of learning</p>
            </div>


            //mobile container
            <div className="flex flex-col items-center ">

                <div className="w-4/5 h-24 border mt-3 rounded-3xl flex justify-between items-center p-4 md:w-3/4 md:mb-4 lg:w-2/5 lg:mb-8">
                    <i className="pi pi-clone mr-4" style={{ color: '#cccccc',fontSize: '1.5rem' }}></i>
                    <p className="text-white md:text-xl">Discover Your Perfect Stay with StaySavvy</p>    
                </div>

                <div className="w-4/5 h-24 border mt-3 rounded-3xl flex justify-between items-center p-4 md:w-3/4 md:mb-4 lg:w-2/5 lg:mb-8">
                    <i className="pi pi-comments mr-4" style={{ color: '#cccccc',fontSize: '1.5rem' }}></i>
                    <p className="text-white md:text-xl">Find the Perfect Hotel Experience</p> 
                </div>

                <div className="w-4/5 h-24 border mt-3 rounded-3xl flex justify-between items-center p-4 md:w-3/4 md:mb-4  lg:w-2/5 lg:mb-8">
                    <i className="pi pi-exclamation-circle mr-4" style={{ color: '#cccccc',fontSize: '1.5rem' }}></i>
                    <p className="text-white md:text-xl">Curated Luxury Stays just for you</p>
                </div>
            </div>

            <div className="flex justify-between mt-9 md:mt-11 bg-black">
                <button className="bg-white w-2/5 h-11 rounded-2xl md:w-2/5 md:h-14 md:rounded-3xl lg:w-1/4" onClick={()=>navigate('/login')}>Login</button>
                <button className="bg-white w-2/5 h-11 rounded-2xl md:w-2/5 md:h-14 md:rounded-3xl lg:w-1/4" onClick={()=>navigate('/signup')}>Sign Up</button>
            </div>
            
        </div>
    
    )
};

export default WelcomeComponent;

