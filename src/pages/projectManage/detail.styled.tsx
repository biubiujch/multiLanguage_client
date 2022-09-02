import styled from "styled-components";

export const Wrap = styled.div``;

export const TranslateWrap = styled.div`
  display: ${({ show }: { show: boolean }) => (show ? "block" : "none")};
  @keyframes in {
    from {
      transform: translate(0, -30px);
      opacity: 0;
    }
    to {
      transform: translate(0, 0);
      opacity: 1;
    }
  }
  margin: 30px 0;
  animation: in 0.8s;
  .bottom {
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
    textarea {
      margin-right: 10px;
      &:nth-child(n + 2) {
        margin-right: 0;
      }
    }
  }
`;
