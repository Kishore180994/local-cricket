import { useRef } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { addExtra, setBowlerModal, swapStriker } from '../actions';
import { selectTotalBallsPlayed } from '../reducers/currentScore/currentScore.selectors';

const Dropdown = ({
  val,
  setOpen,
  isOpen,
  options,
  buttonType,
  runType,
  setSelected,
  children,
  addExtraAndSwapStriker,
  totalBallsPlayed,
  setBowlerModal,
}) => {
  const ref = useRef();
  //   useEffect(() => {
  //     const onBodyClick = (event) => {
  //       if (ref.current.contains(event.target)) {
  //         return;
  //       }
  //       setOpen(buttonType, true);
  //     };
  //     document.body.addEventListener("click", onBodyClick);

  //     return () => {
  //       document.body.removeEventListener("click", onBodyClick);
  //     };
  //   }, []);

  const renderedOptions = options.map((option) => {
    return (
      <label
        key={option.value}
        className='item ui'
        onClick={() => {
          setSelected(runType, option.value);
          // Add the extra runs to the "games" state.
          if (val === 'b' || val === 'lb')
            addExtraAndSwapStriker(val, parseInt(option.value));
          else addExtraAndSwapStriker(val, parseInt(option.value) + 1);
          const overEnd =
            val === 'b' || val === 'lb'
              ? (totalBallsPlayed + 1) % 6
              : totalBallsPlayed % 6;
          if (!overEnd) setBowlerModal(false);
        }}>
        {option.value}
      </label>
    );
  });
  const topClassName = `ui down pointing dropdown icon ${
    isOpen ? 'active visible' : ''
  }`;
  const optionsClassName = `menu ${isOpen ? 'visible transition' : ''}`;

  return (
    <div
      ref={ref}
      className={topClassName}
      onClick={() => {
        setOpen(buttonType, isOpen);
      }}>
      {children}
      <div className={optionsClassName}>{renderedOptions}</div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  totalBallsPlayed: selectTotalBallsPlayed,
});

const mapDispatchToProps = (dispatch) => ({
  addExtraAndSwapStriker: (val, run) => {
    dispatch(addExtra(val, run));
    dispatch(swapStriker(run));
  },
  setBowlerModal: (val) => dispatch(setBowlerModal(val)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dropdown);
