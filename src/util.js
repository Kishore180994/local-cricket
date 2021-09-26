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
