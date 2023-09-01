import React from "react";
import ListItem from "./ListItem";
import Image from "next/image";
import { useRouter } from "next/router";

function Content({ data, onCheck }) {
  // Function to render the list items
  const renderListItems = () => {
    return data.map((item, id) => (
      <div key={item.id}>
        <ListItem
          name={item.name} // Pass the name prop
          desc={item.description}
          message={item.message}
          id={item.id}
          time={item.time}
          buttonType="action"
        />
      </div>
    ));
  };

  return (
    <>
      {data.length > 0 ? (
        // Check if data is available
        renderListItems()
      ) : (
        // Render "No data" message if data is empty or not available
        <div className="flex flex-col items-center my-10 pb-10">
          <Image
            src={require("../../../../public/icons/Time.svg")}
            alt="documents"
            className="cursor-pointer pb-5"
            width={100}
          />
          <h1 className="text-center text-2xl pb-5">No history yet</h1>
          <p className="text-center text-gray-400 pb-5">
            Your recent documents will appear here
          </p>
        </div>
      )}
    </>
  );
}

export default Content;
