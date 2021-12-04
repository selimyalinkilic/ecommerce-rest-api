const generateOrderNumber = () => {
  let number = "",
    randomBigChars = "",
    randomSmallChars = "";

  const year = new Date().getFullYear();
  const day = new Date().getDay();
  const characters = "ABCDEFGHIJKLMNOPRSTUVYZ0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 4; i++) {
    randomBigChars += characters
      .charAt(Math.floor(Math.random() * charactersLength))
      .toString();
  }
  for (var i = 0; i < 2; i++) {
    randomSmallChars += characters
      .charAt(Math.floor(Math.random() * charactersLength))
      .toString();
  }
  number = "ECM" + year + randomBigChars + day + randomSmallChars;
  return number;
};

module.exports = generateOrderNumber;
