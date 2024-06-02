import React from "react";
import { useLocation } from "react-router-dom";

function HistoryContent() {
  const location = useLocation();
  const { userId, promptHotels } = location.state || {};

  return (
    <div className="flex flex-col flex-grow border-2 border-gray-800 bg-gray-900 rounded-md mb-4 p-2 h-full overflow-auto lg:p-11 justify-center items-center">
      {!promptHotels ? (
        <p>No Search Items.</p>
      ) : (
        Object.entries(promptHotels).map(([prompt, hotels], promptIndex) => (
          <div key={promptIndex} className="items-center justify-center">
            <h1 className="text-white mb-3">Prompt :</h1>
            <h3 className="text-white mb-8">{prompt}</h3>
            {hotels.map((hotel, index) => (
              <div key={index} className="border-2 rounded-md mb-4 p-2 bg-gray-800 lg:w-11/12 lg:mx-31">
                <div className="flex flex-col items-center justify-center relative">
                  <div className="w-full overflow-hidden mt-0 p-1 lg:h-96">
                    <img
                      src={hotel.specification.image}
                      alt={hotel.specification.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="border z-10 absolute bottom-0 transform translate-y-1/2 bg-gray-800 p-2 lg:p-4">
                    <p className="text-white text-center">
                      <a href={hotel.specification.website} target="_blank" rel="noopener noreferrer">
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
        ))
      )}
    </div>
  );
}

export default HistoryContent;
