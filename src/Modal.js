import ReactDOM from 'react-dom';
import styled from 'styled-components';

const Perimeter = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: grey;
`;

const Parent = styled.div`
  width: 50%;
  background-color: white;
  position: absolute;
  transform: translate(50%, 50%);
  box-shadow: 0 10px 20px lightblue;
  border-radius: 2%;
`;

const ModalWindow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.2s;
  margin: 10px;
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

const Modal = ({ header, content, actions, onDismiss }) => {
  return ReactDOM.createPortal(
    <Perimeter onClick={onDismiss}>
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
};

export default Modal;
