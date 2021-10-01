import { PLAYER_STATE } from '../../states.js';

export const trimObjectToTwo = (items) => {
  return items.reduce(
    (acc, item) => {
      if (acc[0].playerId !== item.playerId) {
        if (acc[0].batting.runs < item.batting.runs) {
          if (acc[1].batting.runs < acc[0].batting.runs) {
            acc[1] = acc[0];
          }
          acc[0] = item;
          return acc;
        } else if (acc[1].batting.runs < item.batting.runs) {
          acc[1] = item;
          return acc;
        }

        if (acc[0].batting.runs === item.batting.runs) {
          if (acc[1].batting.runs < item.batting.runs) {
            acc[1] = item;
            return acc;
          } else if (acc[1].batting.runs === item.batting.runs) {
            acc[1] = item;
            return acc;
          }
        }

        if (acc[0].batting.runs > item.batting.runs) {
          if (acc[1].batting.runs <= item.batting.runs) {
            acc[1] = item;
            return acc;
          }
        }
      }
      return acc;
    },
    [{ ...PLAYER_STATE }, { ...PLAYER_STATE }]
  );
};
