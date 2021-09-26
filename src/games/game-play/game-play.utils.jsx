import _ from 'lodash';
import React from 'react';
import {
  SELECT_RUNS_BYES,
  SELECT_RUNS_LEGBYES,
  SELECT_RUNS_NOBALL,
  SELECT_RUNS_WIDE,
  TOGGLE_OPEN_BYES,
  TOGGLE_OPEN_LEGBYES,
  TOGGLE_OPEN_NOBALL,
  TOGGLE_OPEN_WIDE,
} from '../../actions/types';
import { convertBallsToOvers } from '../../util';
import Dropdown from '../../components/Dropdown';

export const dropDownOptions = [
  { text: 'extra + 1 run', value: '1' },
  { text: 'extra + 2 run', value: '2' },
  { text: 'extra + 3 run', value: '3' },
  { text: 'extra + 4 run', value: '4' },
  { text: 'extra + 5 run', value: '5' },
  { text: 'extra + 6 run', value: '6' },
];

export const updateScroll = (ref) => {
  // (TODO) Fix the update scroll
  if (ref) ref.current.scrollLeft = ref.current.scrollWidth;
};

export const renderOvers = (text, balls) => {
  const formatOvers = convertBallsToOvers(balls);
  return (
    <div className='item'>
      <label>{text}</label> {formatOvers}
    </div>
  );
};

export const renderIcons = (
  val,
  color,
  size,
  clickHandler,
  optional,
  props
) => {
  const colorTag = `${color} ${optional} circle icon run`;
  const sizeTag = `${size} inverted icon run`;
  if (_.isNumber(val) || val === 'W') {
    return (
      <i
        className='big icons'
        onClick={() => {
          if (clickHandler) clickHandler(val);
        }}>
        <i className={colorTag}></i>
        <i className={sizeTag}>{val}</i>
      </i>
    );
  } else {
    const isOpenProp =
      val === 'wd'
        ? props.isWideOpen
        : val === 'b'
        ? props.isByesOpen
        : val === 'nb'
        ? props.isNoBallOpen
        : val === 'lb'
        ? props.isLegByesOpen
        : '';

    const isSelectedProp =
      val === 'wd'
        ? props.selectedWides
        : val === 'b'
        ? props.selectedByes
        : val === 'nb'
        ? props.selectedNoBall
        : val === 'lb'
        ? props.selectedLegByes
        : '';

    const buttonType =
      val === 'wd'
        ? TOGGLE_OPEN_WIDE
        : val === 'b'
        ? TOGGLE_OPEN_BYES
        : val === 'nb'
        ? TOGGLE_OPEN_NOBALL
        : val === 'lb'
        ? TOGGLE_OPEN_LEGBYES
        : '';

    const runType =
      val === 'wd'
        ? SELECT_RUNS_WIDE
        : val === 'b'
        ? SELECT_RUNS_BYES
        : val === 'nb'
        ? SELECT_RUNS_NOBALL
        : val === 'lb'
        ? SELECT_RUNS_LEGBYES
        : '';

    return (
      <Dropdown
        val={val}
        setOpen={props.setOpen}
        isOpen={isOpenProp}
        options={dropDownOptions}
        buttonType={buttonType}
        runType={runType}
        selected={isSelectedProp}
        setSelected={props.setSelected}>
        <i className='big icons'>
          <i className={colorTag}></i>
          <i className={sizeTag}>{val}</i>
        </i>
      </Dropdown>
    );
  }
};

export const renderEx = (boolValue, ball, color, size, props) => {
  if (boolValue)
    return (
      <React.Fragment>
        {renderIcons(ball, color, size, null, 'big', props)}
      </React.Fragment>
    );
};

export const renderExtras = (props) => (
  <React.Fragment>
    {renderEx(props.isWidesEnabled, 'wd', 'orange', 'small', props)}
    {renderEx(props.isNoBallEnabled, 'nb', 'orange', 'small', props)}
    {renderEx(props.isByesEnabled, 'b', 'orange', 'small', props)}
    {renderEx(props.isLegByesEnabled, 'lb', 'orange', 'small', props)}
  </React.Fragment>
);
