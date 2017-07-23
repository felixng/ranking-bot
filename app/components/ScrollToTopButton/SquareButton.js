import styled from 'styled-components';
import { css, keyframes } from 'styled-components';

const FadeIn = keyframes`
  0%{
    opacity: 0;
  }

  100% {
    opacity: 0.4;
  }
`;

const FadeOut = keyframes`
  0%{
    opacity: 0.4;
  }

  100% {
    opacity: 0;
  }
`;

const SquareButton = styled.button`
	opacity: 0.4;
	background-color: #c24448;
	width: 40px;
	height: 40px;
	position: fixed;
	bottom: 30px;
	right: 30px;
	border-radius: 5px;
	border: none;
	cursor: pointer;
    animation: ${FadeIn} 0.6s ease-in-out both;

	&:hover {
		opacity: 0.6;
	}

	i {
		opacity: 1;
		color: white;
		
		font-size: 1.25em !important;
		font-weight: 800;
		vertical-align: text-top;
	}

	${props => props.hide && css`
		opacity: 0;
		animation: ${FadeOut} 0.6s ease-in-out both;
	`}


`;

export default SquareButton;
