import { useState } from "react";
import 'primeicons/primeicons.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignUpComponent(){
    
    const navigate = useNavigate();

    const [username,setNane] = useState("")
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const usernameHandler = (event) => {
        setNane(event.target.value); 

    };

    const emailHandler = (event) => {
        setEmail(event.target.value); 

    };

    const passwordHandler = (event) => {
        setPassword(event.target.value);
        
    };

    const handleSubmit = async () => {
        try {
            console.log("Email:", email);
            console.log("Password:", password);
            const response = await axios.post("http://localhost:8080/signup", { username,email, password });
            console.log("Response:", response.data);
            navigate('/');
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-black p-8">

            <div className="flex items-center">
                <i className="pi pi-chevron-left" style={{ color: '#cccccc',fontSize: '2rem' }} onClick={()=>navigate('/')}></i>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-orange-400 ml-4 md:text-5x">Sign Up</h1>
            </div>


            <div className="flex flex-col">

                <div className="mt-12  md:mt-18">
                    <p className="text-white">Login with one of the folllowing options</p>
                    <div className="border w-28 h-10 flex items-center justify-center p-6 rounded-md mt-7 md:w-46 md:h-18">
                        <i className="pi pi-google" style={{ color: '#cccccc',fontSize: '1.5rem' }}></i>
                    </div>
                </div>

                <hr className="w-3/4 border-gray-400 border-t-2 mt-6 md:mt-12" />

                <div className="mb-4 mt-9">
                    <label className="text-white text-xl font-bold block mb-6 md:text-2xl" htmlFor="email">Name</label>
                    <input
                        className="w-full px-3 py-2 rounded-lg  outline-none focus:outline-none focus:ring-1 focus:ring-purple-500 text-white bg-gray-900 md:h-16"
                        id="username"
                        name="username"
                        placeholder="enter name"
                        value={username}
                        onChange={usernameHandler}
                    />
                </div>

                <div className="mb-4 mt-4">
                    <label className="text-white text-xl font-bold block mb-6 md:text-2xl" htmlFor="email">Email</label>
                    <input
                        className="w-full px-3 py-2 rounded-lg  outline-none focus:outline-none focus:ring-1 focus:ring-purple-500 text-white bg-gray-900 md:h-16"
                        id="email"
                        name="email"
                        type="email"
                        placeholder="hey@olivercederborg.com"
                        value={email}
                        onChange={emailHandler}
                    />
                </div>

                <div className="mb-6 mt-6">
                    <label className="text-white text-xl font-bold block mb-2 md:text-2xl" htmlFor="password">Password</label>
                    <input
                        className="w-full px-3 py-2 rounded-lg bg-gray-900  outline-none focus:outline-none focus:ring-1 focus:ring-purple-500 text-white md:h-16"
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={passwordHandler}
                    />
                </div>


                <div className="flex justify-center items-center mb-6">
                    <button className="w-full bg-gradient-to-r from-purple-600 to-blue-400 text-white font-bold py-2 px-4 rounded-md md:h-14 md:rounded-3xl" type="submit" onClick={handleSubmit}> 
                        create account
                    </button>

                </div>


                <div className="text-sm text-center text-gray-500 md:text-lg">
                    Have an account? Sign in
                </div>
                
            </div>
        

            
        </div>
    )
}

export default SignUpComponent;