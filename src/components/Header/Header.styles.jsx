import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Logo = styled(Link)`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  letter-spacing: 0rem;
  color: white;
  position: relative;
  font-size: smaller;
  .big {
    text-decoration: underline;
  }
  .small {
    font-size: 0.5rem;
    font-weight: 200;
    font-style: italic;
    text-decoration: overline underline;
  }
`;
