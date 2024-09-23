const pascalCase = (name) => {
  return name
    .trim()
    .split(" ")
    .filter((word) => word !== "")
    .map((word) => word.slice(0, 1).toUpperCase() + word.slice(1))
    .join(" ");
};

const formattedLowerCase = (name) => {
  return name
    .trim()
    .split(" ")
    .filter((word) => word !== "")
    .map((word) => word.toLowerCase())
    .join(" ");
};

const formatDateToDisplay = (date) => {
  date = new Date(date).toDateString().slice(4);
  const month = date.slice(0, 3);
  const day = date.slice(4, 6);
  const year = date.slice(9);

  return `${day} ${month} ${year}`;
};

const dateToMS = (date) => {
  return new Date(date).getTime();
};

const calcCredit = (price, amount_paid) => {
  return Number(price) - Number(amount_paid);
};

export {
  pascalCase,
  formattedLowerCase,
  dateToMS,
  formatDateToDisplay,
  calcCredit,
};
