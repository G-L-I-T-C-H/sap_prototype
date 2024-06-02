import { useState, useEffect } from "react";
import axios from "axios";

function Prompt({ token, user_id }) {
    const [welcomeText, setWelcomeText] = useState(true);
    const [prompt, setPrompt] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [username, setUsername] = useState(""); // State to store the username
    const [location, setLocation] = useState("");
    const [items, setItems] = useState([1,2,3]); // Example list of items to render
    const [hotels,setHotels] = useState([])

    console.log("user_id in prompt: " + user_id);

    useEffect(() => {
        // Fetch username when the component mounts
        nameHandler(user_id);
    }, [user_id]);

    const queryHandler = (event) => {
        setPrompt(event.target.value);
    };


    const promptHandler = async () => {
        setWelcomeText(false);
        try {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
                    try {
                        const response = await fetch(url);
                        const data = await response.json();
                        console.table(data.address);
                        setLocation(data.address.state_district);
                        await sendPromptToServer(data.address.state_district);
                    } catch (fetchError) {
                        console.error("Error fetching location data:", fetchError);
                        setErrorMessage("There was an error getting user's location.");
                    }
                },
                (geoError) => {
                    console.error("Geolocation error:", geoError);
                    setErrorMessage("Error getting user's location.");
                }
            );
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage("Error getting user's location.");
        }
    };

    const sendPromptToServer = async (location) => {
        try {
            setPrompt("")
            const response = await axios.post("http://localhost:8080/home", { prompt, user_id, location });
            if (response.data.message) {
                console.log(response.data.message);
                if (response.data.hotels) {
                    console.log("Hotels data:", response.data.hotels);
                    setHotels(response.data.hotels);
                    console.log("Hotels state updated:", hotels); 
                }
            } else {
                setErrorMessage("Error adding prompt.");
            }
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage("Error adding prompt.");
        }
    };

    const nameHandler = async (userId) => {
        const url = "http://localhost:8080/home";
        const params = { user_id: userId };
        try {
            const response = await axios.get(url, { params });
            setUsername(response.data.username); // Set username from response
        } catch (error) {
            // Handle error
            console.error("GET request failed:", error.message);
        }
    };

    return (
        <div className="flex-1 p-6 flex flex-col justify-end">
            {welcomeText ? (
                <div className="flex-grow mt-11">
                    <div>
                        <h1 className="text-5xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-orange-400 md:text-7xl">
                            Hello, {username}
                        </h1>
                        <br />
                        <p className="text-white text-4xl md:text-6xl">How can I help you today?</p>
                    </div>
                </div>
            ) : (
                <div className="flex-col flex-grow border-2 border-gray-800 bg-gray-900 rounded-md mb-4 p-2 h-96 overflow-auto lg:p-10 justify-center items-center">
                    {
                        hotels.map((hotel, index) => (
                        <div key={index} className="border-2 rounded-md mb-4 p-2 bg-gray-800 lg:w-11/12">
                            <div className="flex flex-col items-center justify-center relative">
                                <div className="w-full overflow-hidden mt-0 p-1">
                                    <img 
                                        src={hotel.specification.image}
                                        alt={hotel.specification.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div className="border  z-10 absolute bottom-0 transform translate-y-1/2 bg-gray-800 p-4">
                                    <p className="text-white text-center">
                                    <a href={hotel.specification.website}  target="_blank" rel="noopener noreferrer">
                                        <u>{hotel.specification.name.toUpperCase()}</u>
                                    </a>
                                    </p>
                                    <p className="text-white text-center">{hotel.specification.class} ★</p>
                                </div>
                            </div>
                            <div className="text-white mt-11 p-2 block lg:hidden">
                  <p>{hotel.specification.description}</p>
                </div>
                <div className="text-white mt-11 p-2 hidden lg:block">
                  <p><b>Hotel Description: </b>{hotel.specification.description}</p>
                </div>
                            <div className="text-white mt-9 p-2 relative bottom-0 block lg:hidden">
                  <p>{hotel.specification.rating} / 5</p>
                  <p>{hotel.specification.rate_per_night}</p>
                  <p>{hotel.specification.phone}</p>
                </div>
                <div className="text-white mt-9 p-2 relative bottom-0 hidden lg:block">
                  <p><b>User Rating:</b> {hotel.specification.rating} / 5</p>
                  <p><b>Rate per Night:</b> {hotel.specification.rate_per_night}</p>
                  <p><b>Contact:</b> {hotel.specification.phone}</p>
                </div>
                        </div>
                    ))}
                    
                    

                </div>

            )}

            <div className="border h-16 w-full rounded-full flex items-center justify-between p-2 mb-9">
                <input className="input pl-4 w-3/4 outline-none" placeholder="Enter a prompt here" value={prompt} onChange={queryHandler} />
                <button onClick={promptHandler}>
                    <i className="pi pi-caret-right" style={{ color: '#cccccc', fontSize: '2rem' }}></i>
                </button>
            </div>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
    );
}

export default Prompt;
