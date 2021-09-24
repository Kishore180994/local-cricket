import { useRef } from 'react';
import { connect } from 'react-redux';
import { addExtra } from '../actions';

const Dropdown = ({
  val,
  setOpen,
  isOpen,
  options,
  buttonType,
  runType,
  setSelected,
  children,
  addExtra,
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
            addExtra(val, parseInt(option.value));
          else addExtra(val, parseInt(option.value) + 1);
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

export default connect(null, { addExtra })(Dropdown);
