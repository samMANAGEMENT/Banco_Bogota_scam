import React, { useState } from "react";

const buttons = [
  { id: 1, imgSrc: "lakes.png", alt: "Icon 1", titulo: "Lakes" },
  { id: 2, imgSrc: "sea.png", alt: "Icon 2", titulo: "Sea" },
  { id: 3, imgSrc: "mountain.png", alt: "Icon 3", titulo: "Mountain" },
  { id: 4, imgSrc: "forest.png", alt: "Icon 4", titulo: "Forest" },
];

const MainButtons = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="w-full flex justify-between absolute">
      {buttons.map((button) => (
        <button
          key={button.id}
          onClick={() => setSelected(button.id)}
          className={`flex items-center rounded-3xl ${
            selected === button.id ? "bg-[#008FA0]" : "bg-white"
          }`}
        >
          <img src={button.imgSrc} alt={button.alt} />
          <p
            className={`text-sm transition-all ${
              selected === button.id ? "text-white font-bold" : "text-black"
            }`}
          >
            {button.titulo}
          </p>
        </button>
      ))}
    </div>
  );
};

export default MainButtons;
