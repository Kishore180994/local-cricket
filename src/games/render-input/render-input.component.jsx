import React from 'react';
import { useState } from 'react';
import { PLAYER_STATE } from '../../states';
import { convertBallsToOvers } from '../../util';
import { InputContainer } from './render-input.styles';

const RenderInput = ({
  label,
  placeholder,
  options,
  value,
  onValueChange,
  dropDownPlaceHolder,
  modalType,
  ...otherProps
}) => {
  const [open, setOpen] = useState(false);
  const [selectedObjectFromList, setPlayer] = useState(PLAYER_STATE);

  return (
    <InputContainer>
      <span className='ui right pointing black label'>{label}</span>
      <div className='parent'>
        <div className='ui loading fluid search selection dropdown'>
          <input
            className='search'
            placeholder={placeholder}
            value={value}
            onClick={() => setOpen(!open)}
            onChange={(e) => onValueChange(e)}
            {...otherProps}
          />
          {options.length ? (
            <div className='items'>
              {open ? (
                options.map((option) => {
                  const listItemClass = `item ${
                    selectedObjectFromList.playerId === option.playerId
                      ? 'active'
                      : ''
                  }`;
                  return (
                    <div
                      className={listItemClass}
                      key={option.playerId}
                      onClick={(e) => {
                        setPlayer(option);
                        onValueChange(e, option);
                      }}>
                      <div className='content'>
                        <div className='header'>{option.name}</div>
                        {modalType === 'bowler' ? (
                          <React.Fragment>
                            <div className='score'>{option.bowling.runs}</div>
                            <div className='overs'>
                              {convertBallsToOvers(option.bowling.balls)}{' '}
                              over(s)
                            </div>
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <div className='score'>
                              <span>{option.batting.runs}</span>
                              <span
                                style={{
                                  fontStyle: 'italic',
                                  fontSize: 'smaller',
                                }}>
                                ({option.batting.balls} balls)
                              </span>
                            </div>
                            <div className='overs'>{option.batting.status}</div>
                          </React.Fragment>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div
                  className='item'
                  style={{
                    fontSize: '0.8em',
                    color: 'grey',
                    textAlign: 'center',
                  }}>
                  {options.length} players available!!
                </div>
              )}
            </div>
          ) : (
            <div
              className='items'
              style={{ fontSize: '0.8em', color: 'grey', textAlign: 'center' }}>
              {dropDownPlaceHolder}
            </div>
          )}
        </div>
        {/* <div className='ui icon input'>
          <input
            type='text'
            name='player'
            placeholder={placeholder}
            onClick={() => setOpen(!open)}
          />
          <i class='circular search link icon'></i>
          <div className='items'>
            {open
              ? options.map((option) => (
                  <div className='item' key={option}>
                    <div className='content'>
                      <div className='header'>{option.name}</div>
                      <div className='score'>{option.score}</div>
                      <div className='overs'>{option.overs}overs</div>
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div> */}
      </div>
    </InputContainer>
  );
};

export default RenderInput;
