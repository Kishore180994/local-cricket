import styled from 'styled-components';

export const BowlerHeader = styled.div`
  display: flex;
  justify-content: space-evenly;

  padding: 1rem 2rem;
  margin: 5px 0px;
  background-color: #5b7def;
  color: white;

  .bowler-name {
    width: 40%;
    text-align: center;
  }

  .bowler-score-group {
    display: flex;
    justify-content: space-evenly;
    width: 30%;
    text-align: center;
    .bowler-score {
    }
    .bowler-overs {
      font-style: italic;
      font-size: smaller;
    }
  }
  .last-over {
    width: 30%;
    text-align: center;
  }
`;
