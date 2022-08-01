import React, {FC} from 'react';
import './Footer.scss';

interface FooterProps {
	// Copyright text
	copyrightInfo: string;
}

const Footer: FC<FooterProps> = ({copyrightInfo}) => {
	return (
		<footer className='footer'>
			<div className='content has-text-centered'>
				<p>{copyrightInfo}</p>
			</div>
		</footer>
	);
};

export default Footer;
