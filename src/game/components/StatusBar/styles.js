// Libraries
import styled from 'styled-components';

export const StatusBarContainer = styled.div`
  display: flex;
  align-items: center;
  background: #ece9d8;
  border-top: 1px solid #fff;
  height: 22px;
  min-height: 22px;
  max-height: 22px;
  padding: 0 2px;
  gap: 2px;
  font-family: Tahoma, Arial, sans-serif;
  font-size: 11px;
  user-select: none;
  box-sizing: border-box;
`;

export const StatusBarField = styled.p`
  margin: 0;
  padding: 0 4px;
  background: linear-gradient(to bottom, #f0ebe0 0%, #ece9d8 50%, #ddd8cc 51%, #d8d4c8 100%);
  border: 1px solid;
  border-color: #f5f5f5 #d8d4c8 #d8d4c8 #f5f5f5;
  box-shadow: inset -1px -1px 0 #fff, inset 1px 1px 0 #d0ccc0;
  height: 18px;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #000;
  box-sizing: border-box;
`;

export const StatusBarGrip = styled.div`
  width: 13px;
  height: 13px;
  margin-left: auto;
  flex-shrink: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='13' height='13'%3E%3Cpath fill='%23808080' d='M11 0h2v2h-2zM11 4h2v2h-2zM7 4h2v2H7zM11 8h2v2h-2zM7 8h2v2H7zM3 8h2v2H3z'/%3E%3Cpath fill='%23fff' d='M10 1h2v2h-2zM10 5h2v2h-2zM6 5h2v2H6zM10 9h2v2h-2zM6 9h2v2H6zM2 9h2v2H2z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: bottom right;
  cursor: se-resize;
`;
