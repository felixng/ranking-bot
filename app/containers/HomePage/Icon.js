import styled from 'styled-components';

const Icon = styled.i`
	font-size: 1.25em !important;
	font-weight: 800;
	vertical-align: text-top;

	${props => props.left && `
		padding-left: 0.5em;
	`}

	${props => props.right && `
		padding-right: 0.5em;
	`}
`;

export default Icon;
