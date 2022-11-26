const scrolledToTheBottom = (e) => {
  return (
    e.scrollingElement.scrollHeight - e.scrollingElement.scrollTop ===
    e.scrollingElement.clientHeight
  );
};
const escapeSpecialCharacters = (name) => name.replace(/[^a-zA-Z ]/g, "");

export { scrolledToTheBottom, escapeSpecialCharacters };
