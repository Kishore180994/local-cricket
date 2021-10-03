import styled from 'styled-components';
import { device } from '../../util';

export const MainContent = styled.div`
  display: flex;
  background-image: linear-gradient(#1e5799 0%, #2989d8 66%, #207cca 94%);
  color: white;
  flex-direction: column;
`;

export const MainSection = styled.div`
  text-align: center;
  padding: 1em 0;
  .team-name {
    font-size: 2rem;
    font-weight: bolder;
    margin-bottom: 0.2em;
  }
  .team-sub {
    font-style: italic;
    font-size: 0.8rem;
  }
`;

export const SubSection = styled.div`
  display: flex;
  .stats {
    display: flex;
    justify-content: flex-start;
    margin: 1em 4em;
    width: 30%;
    .score {
      display: flex;
      margin: auto 0em;
      justify-content: center;
      transform: skewX(20deg);
      background-image: linear-gradient(#ffffff 0%, #97a5c3 66%, #207cca 94%);
      color: black;
      .score-label {
        padding: 0.8em 1em;
        transform: skewX(-20deg);
        text-align: center;
      }
      .score-numbers {
        display: flex;
        transform: skewX(-20deg);
        text-align: center;
        margin: auto 1em;
      }
    }
    .overs {
      display: flex;
      transform: skewX(20deg);
      margin: auto 0em;
      padding: 0.8em 1em;
      background-image: linear-gradient(#000000 0%, #3e4243 66%, #3e4043 94%);
      .overs-count {
        transform: skewX(-20deg);
        text-align: center;
        margin: 0 0.2em;
      }
      .overs-text {
        transform: skewX(-20deg);
        text-align: center;
        margin: auto 0em;
      }
    }
  }

  .innings-text {
    width: 70%;
    text-align: center;
    margin: auto 2em;
    font-weight: bold;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  @media ${device.mobileM} {
    flex-direction: column;
    .stats {
      width: 70%;
      justify-content: center;
    }
    .innings-text {
      width: 100%;
      margin: 1em 0;
    }
  }

  @media ${device.tablet} {
    flex-direction: row;
    margin: auto 2em;
  }
`;
