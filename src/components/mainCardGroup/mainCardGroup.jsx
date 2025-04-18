import React from "react";

const MainCardGroup = () => {
  return (
    <div className="flex items-center w-full h-auto">
      <div className="flex items-center">
        <img
          src="mountain-trip.png"
          alt="Miniatura"
          className=""
        />
      </div>
      <div className="leading-snug">
        <p className="text-lg font-semibold">Mountain Trip</p>
        <p className="text-sm text-[#636363]">Seelisburg</p>
        <div className="flex">
          <img src="vector-side.png" alt="" className="h-6" />
          <p className="text-[#636363] text-sm">Norway</p>
        </div>
        <img src="group-people.png" alt="" />
        <p className="text-sm text-[#008FA0] font-semibold ml-28">80%</p>
        <div className=" w-full bg-[#D9D9D9] p-0 rounded-full">
          <div
            className="bg-[#008FA0] p-1 rounded-full"
            style={{ width: "80%" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MainCardGroup;
