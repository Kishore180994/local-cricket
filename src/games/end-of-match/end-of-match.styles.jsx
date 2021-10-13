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
    .teamhandle {
      display: flex;
      flex-direction: column;
      margin: 5px 0;
      .header {
        border-top: 2px solid black;
        display: flex;
        background: linear-gradient(#3d3d3d, #ffffff, grey);
        padding: 1px 0;
        color: black;
        justify-content: space-evenly;
        box-shadow: 3px 5px grey;
      }
      .sub-header {
        display: flex;
        flex-direction: column;
        .top-batsman,
        .top-bowler {
          display: flex;
          justify-content: space-evenly;
        }
        * {
          padding: 2px 10px;
          background: white;
          color: #1e5799;
          text-shadow: 0px 5px 0px rgba(255, 255, 255, 0.3),
            1.5px 0px 1.5px rgba(0, 0, 0, 0.3);
        }
      }
    }
  }

  .innings-text {
    display: block;
    width: 10%;
    margin: auto 0;
    text-align: center;
    font-weight: bold;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  @media ${device.mobileXS} {
    flex-direction: column;
    .stats {
      width: 100%;
      justify-content: center;
    }
    .innings-text {
      width: 100%;
      margin: 1em 0;
    }
  }

  @media ${device.mobileS} {
    flex-direction: column;
    .stats {
      width: 100%;
      justify-content: center;
    }
    .innings-text {
      width: 100%;
      margin: 1em 0;
    }
  }

  @media ${device.mobileM} {
    flex-direction: column;
    .stats {
      width: 100%;
      justify-content: center;
    }
    .innings-text {
      width: 100%;
      margin: 1em 0;
    }
  }

  @media ${device.laptop} {
    flex-direction: column;
    .stats {
      width: 60%;
      justify-content: center;
    }
    .innings-text {
      width: 50%;
      margin: 1em 0;
    }
  }

  @media ${device.tablet} {
    flex-direction: row;
    margin: auto 2em;
    .stats {
      width: 50%;
      justify-content: center;
    }
    .innings-text {
      width: 50%;
      margin: 1em 0;
    }
  }
`;
