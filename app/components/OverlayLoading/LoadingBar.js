import styled from 'styled-components';

const LoadingBar = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	z-index: -1;
	width: 100%;
	height: 50px;
	background: rgba(58, 64, 77, 0.1);
	pointer-events: none;
	-webkit-transform: translate3d(0, -100%, 0);
	transform: translate3d(0, -100%, 0);
	-webkit-transition: -webkit-transform 0.3s;
	transition: transform 0.3s;

	&::before {
		top: 0;
		left: 0;
		position: absolute;
		content: '';
		width: 100%;
		height: 20px;
		background: #c1c1c1;
		-webkit-backface-visibility: hidden;
		-moz-backface-visibility: hidden;
		-ms-backface-visibility: hidden;
		backface-visibility: hidden;

		-webkit-perspective: 1000;
		-moz-perspective: 1000;
		-ms-perspective: 1000;
		perspective: 1000;
		
		-webkit-transform: ${props => props.loaded ? 'translate3d(0, 0, 0)' : 'translate3d(-100%, 0, 0)'};
		transform: ${props => props.loaded ? 'translate3d(0, 0, 0)' : 'translate3d(-100%, 0, 0)'};
		opacity: ${props => props.loaded ? '1' : '0'};
		-webkit-transition: ${props => props.loaded ? '-webkit-transform 5.4s linear 0.3s' : 'opacity 0.3s, -webkit-transform 0s 0.3s'};
		transition: ${props => props.loaded ? 'transform 5.4s linear 0.3s' : 'opacity 0.3s, transform 0s 0.3s'} ;
	}
}
`;

export default LoadingBar;
