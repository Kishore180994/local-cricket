import styled from 'styled-components';

export const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  transform: rotateY('90deg');
  width: 100%;
  .label {
    width: 30%;
    text-align: center;
    height: 4em;
    line-height: 1.4em;
    background-color: black;
    color: white;
    overflow-wrap: break-word;
  }
  .parent {
    width: 70%;
    margin-right: 1rem;
    .search {
      input:placeholder-shown {
        font-size: small;
        overflow-wrap: break-word;
      }
      .items {
        margin-top: 2em;
        .item {
          .content {
            padding: 0.5em;
            display: flex;
            justify-content: space-evenly;
            color: grey;
            cursor: pointer;
            .header {
              width: 40%;
            }
            .score {
              width: 45%;
            }
            .overs {
              width: 25%;
              font-size: smaller;
              font-style: italic;
            }
          }
          border-bottom: 1px solid #0002;
        }
        .active {
          .content {
            color: white;
            background-color: cadetblue;
            font-weight: bolder;
          }
        }
      }
    }
  }
`;
