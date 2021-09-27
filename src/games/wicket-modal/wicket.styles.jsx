import styled from 'styled-components';

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  & > * {
    margin: 0.5rem 1rem;
  }

  .label {
    text-align: center;
    font-size: small;
  }
`;

export const BastmanHeader = styled.div`
  display: flex;
  justify-content: space-evenly;

  padding: 1rem 2rem;
  margin: 5px 0px;
  background-color: #5b7def;
  color: white;

  .name {
    font-size: 1.1rem;
    font-weight: bolder;
  }

  .bowler {
    .wicket-type {
      font-size: 0.9rem;
      margin-right: 0.4rem;
    }
    .bowler-name {
      font-size: 1.1rem;
    }
  }

  .score {
    .runs {
      font-size: 1.2rem;
    }
    .balls {
      font-size: 0.9rem;
    }
  }

  .fow {
    font-style: italic;
  }
`;

export const StatsHeader = styled.div`
  display: flex;
  justify-content: space-around;
  .boundaries {
    display: flex;
    justify-content: space-around;
    width: 30%;
    .fours {
    }
    .sixes {
    }
  }
  .stats {
    width: 70%;
  }
`;

export const NextBatsman = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  .container {
    display: flex;
    form {
      width: 65%;
      .input {
        width: 100%;
      }
    }
  }

  .select-side {
    display: flex;
    width: 96%;
  }

  .label {
    width: 25%;
    font-size: small;
    text-align: center;
  }
`;

export const Header = styled.div`
  font-size: 3vw;
  color: black;
  -webkit-text-stroke: 2px red;
  -webkit-text-fill-color: white;
`;

export const RadioWrapper = styled.div`
  display: flex;
  justify-content: space-around;
`;
export const RadioButton = styled.input``;
export const RadioLabel = styled.label``;
