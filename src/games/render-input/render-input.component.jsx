import { useState } from 'react';

const RenderInput = ({ label, placeholder, options }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={{ textAlign: 'center' }}>{label}</label>
      <input
        type='text'
        name='gender'
        placeholder={placeholder}
        onClick={() => setOpen(!open)}
      />{' '}
      <div className='ui celled list animated'>
        {open
          ? options.map((option) => (
              <div className='item' key={option}>
                <div className='content'>
                  <div className='header'>{option}</div>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default RenderInput;
