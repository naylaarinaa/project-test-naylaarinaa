import React from "react";
import Banner from "../components/Banner";
import ListPost from "../components/ListPost";

const Ideas: React.FC = () => (
  <>
    <Banner
      imageUrl="https://scalabilityproject.com/wp-content/uploads/2016/07/New-Site-Home-Image.jpg"
      title="Ideas"
      subtitle="Where all our great things begin"
    />
    <ListPost />
  </>
);

export default Ideas;
