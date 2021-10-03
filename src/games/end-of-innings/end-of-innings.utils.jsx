export const getSubHeading = (toss, choose) => {
  let subHeading = '';
  if (toss) {
    subHeading = `(Won the toss and chose ${choose})`;
  } else {
    subHeading = `Lost the toss`;
  }

  return subHeading;
};
