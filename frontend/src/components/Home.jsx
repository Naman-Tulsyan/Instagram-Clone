import React from "react";
import Feed from "./Feed";
import RightSidebar from "./RightSidebar";

const Home = () => {
  return (
    <div className="flex p-4 md:p-6">
      <div className="flex-grow">
        <Feed />
      </div>
      <RightSidebar />
    </div>
  );
};

export default Home;
