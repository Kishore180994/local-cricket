import React from 'react';
import { useState } from 'react';
import { InputContainer } from './render-input.styles';

const RenderInput = ({
  label,
  placeholder,
  options,
  value,
  onValueChange,
  ...otherProps
}) => {
  const [open, setOpen] = useState(false);
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
          {options ? (
            <div className='items'>
              {open ? (
                options.map((option) => (
                  <div
                    className='item'
                    key={option.name}
                    onClick={(e) => onValueChange(e, option.name)}>
                    <div className='content'>
                      <div className='header'>{option.name}</div>
                      <div className='score'>{option.score}</div>
                      <div className='overs'>{option.overs}overs</div>
                    </div>
                  </div>
                ))
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
              No bowlers yet!! Enter the new Bowler name!!
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
