import styled from 'styled-components';
import { device } from '../../util';

export const ScoreMainContainer = styled.div``;
export const ScoreGrid = styled.div`
  margin: 0 1em;
`;

export const ScoreRow = styled.div`
  display: flex;
  justify-content: space-around;
  .overs {
    border: 1px solid black;
    font-weight: bold;
  }
  @media ${device.mobileS} {
    flex-direction: column;
  }

  @media ${device.mobileL} {
    flex-direction: row;
    .score-label {
      width: 80%;
      margin-right: 1rem;
    }
    .overs {
      margin: auto 1em;
      text-align: center;
      border: none;
      width: 90%;
    }
  }

  @media ${device.laptop} {
    .score-label {
      justify-content: center;
      .label {
        width: 60%;
      }
    }
    .overs {
      margin: auto 1em;
      text-align: center;
      border: none;
      width: 41%;
    }
    .bowler-score {
      width: 54%;
    }
  }
`;

export const ScoreColumn = styled.div`
  /* border: 1px solid red; */
  @media ${device.mobileXS} {
    display: flex;
    justify-content: space-around;
    padding: 10px 0;
    width: 100%;
    .list {
      width: 100%;
    }
  }

  @media ${device.mobileL} {
    display: flex;
    justify-content: space-around;
    /* border: 1px solid red; */
    margin: 1em 0;
    width: 100%;
    .list {
    }
  }
  @media ${device.laptop} {
    display: flex;
    justify-content: space-around;
    margin: 1em 0;
    width: 100%;
    .list {
    }
  }
`;

export const FooterGrid = styled.div`
  @media ${device.laptop} {
  }
`;

export const FooterRow = styled.div`
  @media ${device.laptop} {
    display: flex;
    justify-content: space-evenly;
  }
`;

export const FooterColumn = styled.div`
  @media ${device.laptop} {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
  }
`;
