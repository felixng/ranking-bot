import styled from 'styled-components';
import { css, keyframes } from 'styled-components';

const FadeIn = keyframes`
  0%{
    opacity: 0;
  }

  100% {
    opacity: 0.8;
  }
`;

const FadeOut = keyframes`
  0%{
    opacity: 0.8;
  }

  100% {
    opacity: 0;
  }
`;

const CentreButton = styled.a`
	opacity: 0.8;
	font-weight: 500;
	color: white;
	background-color: #c24448;
	// width: 40px;
	// height: 40px;
	position: fixed;
	left: 50%;
	margin: 0 auto;
	min-height: 0.5em;
	bottom: 30px;
	padding: 0.5em;
	font-size: 1.25em;
	border-radius: 5px;
	border: none;
	cursor: pointer;
	-webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    -o-transform: translateX(-50%);
    transform: translateX(-50%);
    text-decoration: none;
	text-align: center;
    animation: ${FadeIn} 0.6s ease-in-out both;

	&:hover {
		opacity: 1;
	}

	${props => props.hide && css`
		opacity: 0;
		animation: ${FadeOut} 0.6s ease-in-out both;
	`}

	small {
		font-size: 70%;
		line-height: 100%;
		padding-top: 1.5%;
		font-weight: 400;
		display: block;
		margin: 0 auto;
		text-align: center;
	}


`;

export default CentreButton;
