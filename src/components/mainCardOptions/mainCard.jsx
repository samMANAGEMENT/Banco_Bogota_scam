import React from "react";

const cards = [
  {
    id: 1,
    image: "RedFishLake.png",
    title: "RedFish Lake",
    rating: 4.5,
    userImage: "vector-side.png",
    userName: "Idaho",
    price: "$40",
  },
  {
    id: 2,
    image: "MaligneLake.png",
    title: "Maligne Lake",
    rating: 4.5,
    userImage: "vector-side.png",
    userName: "Canada",
    price: "$40",
  },
  {
    id: 3,
    image: "MaligneLake.png",
    title: "Lake McDonald",
    rating: 4.5,
    userImage: "vector-side.png",
    userName: "Canada",
    price: "$40",
  },
];

const MainCards = () => {
  return (
    <div className="flex gap-2 overflow-x-hidden leading-none">
      {cards.map((card) => (
        <div key={card.id} className="bg-white w-64 rounded-xl">
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-28 rounded-2xl object-cover"
          />

          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold">{card.title}</h2>
            <div className="flex items-center">
              <img src="vector-star.png" alt="Star"/>
              <span className="text-sm font-semibold">{card.rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <img
              src={card.userImage}
              alt={card.userName}
              className="rounded-full"
            />
            <p className="text-sm text-gray-600">{card.userName}</p>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#008FA0] font-bold text-sm">
              {card.price} / Visit
            </span>
            <img src="vector-heart.png" alt="Heart" className="w-5 h-5" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MainCards;
