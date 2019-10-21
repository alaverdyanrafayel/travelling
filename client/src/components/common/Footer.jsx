import React from 'react';
import { Link } from 'react-router';

export const Footer = () => {
    return (
        <section id="footer" className="container-fluid footer">
            <div className="row ptb-80">
                <div className="container">
                    <footer className="row">
                        <div className="col-md-3">
                            <div className="footer__description">
                                <p className="footer__logotype">
                                    <img src="/img/logo-white.png" alt="Holipay" />
                                </p>
                                <p className="footer__info" style={{ paddingLeft: '80px' }}>
                                    <Link to="/terms-of-use/" className="f-color_white footer-link">Terms of use</Link>
                                    <Link to="/privacy/" className="f-color_white footer-link">Privacy</Link>
                                    <Link to="/security/" className="f-color_white footer-link">Security</Link>
                                </p>
                                <ul className="footer__soc-icons">
                                    <li>
                                        <a href="https://www.facebook.com/Holipay/" target="_blank" className="facebook">
                                            <i className="fa fa-facebook" aria-hidden="true" />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://twitter.com/holipay_/" target="_blank" className="twitter">
                                            <i className="fa fa-twitter" aria-hidden="true" />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://www.instagram.com/holipay/?hl=en" target="_blank" className="instagram">
                                            <i className="fa fa-instagram" aria-hidden="true" />
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <h3 className="f-title f-color_white" style={{ fontSize: '23px' }}>Learn more</h3>
                            <p className="footer__info" style={{ paddingLeft: '70px' }}>
                                <Link to="/how-it-works/" className="f-color_white footer-link">How it works</Link>
                                <Link to="/travel-directory/" className="f-color_white footer-link">Travel directory</Link>
                                <Link to="/FAQs/" className="f-color_white footer-link">FAQs</Link>
                            </p>
                        </div>
                        <div className="col-md-3">
                            <h3 className="f-title f-color_white" style={{ fontSize: '23px' }}>For Merchants</h3>
                            <p className="footer__info" style={{ paddingLeft: '70px' }}>
                                <a href="https://medium.com/holipay" target="_blank" className="f-color_white footer-link">Blog</a>
                            </p>
                        </div>
                        <div className="col-md-3">
                            <h3 className="f-title f-color_white" style={{ fontSize: '23px' }}>About Holipay</h3>
                            <p className="footer__info" style={{ paddingLeft: '60px' }}>
                                <Link to="/about-us/" className="f-color_white footer-link">About us</Link>
                                <Link to="/contact-us/" className="f-color_white footer-link">Contact us</Link>
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        </section>
    );
};

export default Footer;
