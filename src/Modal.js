import React from 'react';
import ReactDOM from 'react-dom';
import styled, { keyframes } from 'styled-components';

const Perimeter = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: ${(props) => (props.hidden ? 'none' : 'flex')};
  top: 0;
  left: 0;
  flex-direction: column;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
`;

const parentAnimation = keyframes`
    0% {
        transform: scale(0.1);
    }
    100% {
        transform: scale(1.0);
    }
`;

const Parent = styled.div`
  width: 50%;
  background-color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 10px 20px lightblue;
  border-radius: 2%;
`;

const ModalWindow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.2s;
  animation: ${parentAnimation} 0.4s ease-in-out 0s;
  animation-fill-mode: backwards;
  margin: 2px;
  .custom-height {
    margin: 10px 0;
    text-align: center;
    font-weight: bolder;
  }
  .actions {
    margin-top: 10px;
    text-align: end;
  }
`;

class Modal extends React.Component {
  render() {
    const { header, content, actions, hidden, onDismiss } = this.props;
    return ReactDOM.createPortal(
      <Perimeter
        hidden={hidden}
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}>
        <Parent>
          <ModalWindow onClick={(e) => e.stopPropagation()}>
            <div className='header custom-height'>{header || 'Header'}</div>
            <div className='content'>{content || 'Content'}</div>
            <div className='actions'>{actions}</div>
          </ModalWindow>
        </Parent>
      </Perimeter>,
      document.querySelector('#modal')
    );
  }
}

export default Modal;
