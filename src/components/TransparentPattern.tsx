import styled from 'styled-components';

export const TransparentPattern = styled.div`
  background-color: #fff;
  opacity: 0.8;
  background-image: repeating-linear-gradient(45deg, #c1c1c1 25%, transparent 0, transparent 75%, #c1c1c1 0, #c1c1c1),
    repeating-linear-gradient(45deg, #c1c1c1 25%, #fff 0, #fff 75%, #c1c1c1 0, #c1c1c1);
  background-position:
    0 0,
    5px 5px;
  background-size: 10px 10px;
`;
