const filterCards = (cardsData, filter) => {
  console.log("entered filterCards");
  if (!Array.isArray(cardsData)) {
    console.log("not array");
    return [];
  }
  if (filter === "") return cardsData;
  if (filter === "saved") return cardsData.filter((card) => card.fav === true);
  return cardsData.filter((card) => card.type === filter);
};

export { filterCards };
