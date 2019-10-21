import React from 'react';
import { Link } from 'react-router';

export class SignupAboutHolipay extends React.Component {

    componentDidMount() {
    }

    render = () => {
        return (
          <div className="aboutHolipay text-center pull-left" style={typeof window !== 'undefined' && window.innerWidth < 700 ? this.props.style : {}}>
                <div className="logoWrapper col-xs-12">
                  <Link to="/"><img className="img-responsive box-center" src="/img/logo-big.png" alt="logo"/></Link>
                </div>
                <p>Creating a Holipay account means you can book a holiday in-store with one of our merchant partners and pay for it over 12 equal weekly instalments.</p>
                <p>There are no hidden fees or interest, so the total you see at checkout is always what you’ll actually pay.</p>
                <p>Have more questions? <Link to="/faqs/">Visit our FAQs page</Link></p>
          </div>
        );
    };
}

export default SignupAboutHolipay;
