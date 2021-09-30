import styled from 'styled-components';

export const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  transform: rotateY('90deg');

  .label {
    width: 30%;
    text-align: center;
    height: 3em;
    line-height: 2em;
    background-color: black;
    color: white;
    animation: labelAnim 1s normal ease-in-out 0.3s;
    animation-fill-mode: backwards;
  }
  .parent {
    width: 70%;
    margin-right: 1rem;
    .search {
      .items {
        margin-top: 2em;
        .item {
          .content {
            padding: 0.5em;
            display: flex;
            justify-content: space-evenly;
            color: grey;
            cursor: pointer;
            :active {
              background-color: cadetblue;
              color: white;
            }
          }
          border-bottom: 1px solid #0002;
        }
      }
    }
  }
`;
