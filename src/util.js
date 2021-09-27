export const convertBallsToOvers = (balls) => {
  return Math.trunc(balls / 6) + (balls % 6) / 10 || 0;
};

export const convertOversToBalls = (overs) => {
  return overs * 6;
};

export const getCurRunRate = (runs, balls) => {
  const over = Math.trunc(balls / 6);
  const ballFractionOfOver = (balls % 6) / 6;
  const adjustedOvers = over + ballFractionOfOver;
  return parseFloat(runs / adjustedOvers).toFixed(2);
};

export const getProjectedScore = (runRate, totalOvers) => {
  return parseInt(runRate * totalOvers);
};

const size = {
  fold: '280px',
  mobileS: '320px',
  mobileM: '375px',
  mobileL: '425px',
  tablet: '768px',
  laptop: '1024px',
  laptopL: '1440px',
  desktop: '2560px',
};

export const device = {
  mobileXS: `(min-width: ${size.fold})`,
  mobileS: `(min-width: ${size.mobileS})`,
  mobileM: `(min-width: ${size.mobileM})`,
  mobileL: `(min-width: ${size.mobileL})`,
  tablet: `(min-width: ${size.tablet})`,
  laptop: `(min-width: ${size.laptop})`,
  laptopL: `(min-width: ${size.laptopL})`,
  desktop: `(min-width: ${size.desktop})`,
  desktopL: `(min-width: ${size.desktop})`,
};
