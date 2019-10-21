import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';

export const NavBar = (style, distanceFromTop, page, onSignOut) => {
    if (distanceFromTop < 0) {
        style.backgroundColor = '#fff';
    }

    return(
        <nav
            className={page === 'merchants' ? 'navigation navigation-business' : 'navigation'}
            style={typeof window !== 'undefined' && window.innerWidth < 700 ? { width: '100%', position: 'fixed', top: '0' } : style}>
            {page === 'merchants' && typeof window !== 'undefined' && window.innerWidth < 767 ?
                <div className="logo-box">
                    <img className="logo-purple-mobile" src="/img/logo.png"/>
                    <Link to="/sign-up/" className="menu__btn logo-white-mobile mobile-only-sign-up">SIGN UP</Link>
                </div> : <div>
                    {page !== 'dashboard' && typeof window !== 'undefined' && window.innerWidth < 700 ?
                        <img id="log-white" src="/img/logo-white.png" className="logo-white-mobile"/> : ''}
                    {page !== 'dashboard' && typeof window !== 'undefined' && window.innerWidth < 700 ?
                        <Link to="/sign-up/" className="menu__btn logo-white-mobile mobile-only-sign-up">SIGN UP</Link> : ''}
                </div>
            }
            {page === 'dashboard' && typeof window !== 'undefined' && window.innerWidth < 700 ?
                <img id="log-white" className="logo-purple-mobile" src="/img/logo-purple.png"/> : ''}
            {page !== 'dashboard' && typeof window !== 'undefined' && window.innerWidth < 767 && distanceFromTop < 0 ?
                <div className="logo-box">
                    <img className="logo-purple-mobile" src="/img/logo.png"/>
                    <Link to="/sign-up/" className="menu__btn logo-white-mobile mobile-only-sign-up">SIGN UP</Link>
                </div> : ''}
            <div className={page !== 'dashboard' ? 'container' : ''}>
                <div className={page !== 'dashboard' ? 'menu' : 'menu dashboard_menu'}>
                    <div className="menu_left">
                        <Link to="/">
                                <img id="logo-white" src="/img/logo-white.png" style={ distanceFromTop < 0  || page === 'merchants' || page === 'dashboard' || (typeof window !== 'undefined' && window.innerWidth < 700) ? { display: 'none' } : {}}/>
                                <img id="logo-white" src="/img/logo.png" style={ distanceFromTop === 0 && typeof window !== 'undefined' && window.innerWidth > 700 && page !== 'dashboard' && page !== 'merchants' ? { display: 'none' } : { width: '141px' }}/>
                        </Link>
                        <span className="right-menu">
                    <Link
                        to="/how-it-works/"
                        style={(page === 'dashboard' || page === 'merchants' || distanceFromTop < 0 || (typeof window !== 'undefined' && window.innerWidth < 700) ) ?
                            { color: '#000' } : { color: '#fff' }}>How it works</Link>
                    <Link
                        to="/travel-directory/"
                        onClick={() => $('html').toggleClass('menu_mobile_open')}
                        style={(page === 'dashboard' || page === 'merchants' || distanceFromTop < 0 || (typeof window !== 'undefined' && window.innerWidth < 700) ) ?
                            { color: '#000' } : { color: '#fff' }}
                    >Travel Directory</Link>
                    <Link
                        to="/merchants/" onClick={() => $('html').toggleClass('menu_mobile_open')}
                        style={(page === 'dashboard' || page === 'merchants' || distanceFromTop < 0 || (typeof window !== 'undefined' && window.innerWidth < 700) ) ?
                            { color: '#000' } : { color: '#fff' }}
                    >For Merchants</Link>
                            {page !== 'dashboard' && page !== 'merchants' ?
                                <Link
                                    to="/log-in/"
                                    onClick={() => $('html').toggleClass('menu_mobile_open')}
                                    className="mobile-login-btn"
                                    style={(distanceFromTop < 0 || page === 'merchants' || (typeof window !== 'undefined' && window.innerWidth < 700)) ?
                                        { color: '#000' } : { color: '#fff' }}
                                >Login</Link> : ''}
                            {page === 'merchants' ?
                                <Link
                                    to="/merchant-log-in/"
                                    onClick={() => $('html').toggleClass('menu_mobile_open')}
                                    className="mobile-login-btn"
                                    style={(distanceFromTop < 0 || page === 'merchants' || (typeof window !== 'undefined' && window.innerWidth < 700)) ?
                                        { color: '#000' } : { color: '#fff' }}
                                >Login</Link> : ''}
                </span>
                    </div>
                    <div className="menu_right">
                        {page !== 'dashboard' ?
                            <Link to="/sign-up/" rel="canonical" className="f-btn f-btn_default f-color_white menu__btn">Sign Up</Link> : ''}
                        {page === 'dashboard' ?
                            <a href="#" onClick={onSignOut} className="f-btn f-btn_default f-color_white menu__btn dashboard_btn">Sign Out</a> : ''}
                    </div>
                </div>
                <a className={page === 'dashboard' ? 'menu_mobile menu_dashboard' : 'menu_mobile'} onClick={() => $('html').toggleClass('menu_mobile_open')}
                   style={{ zIndex: '10001' }}>
                    <div className="menu_mobile__hamburger">
                        <span className="lh-1"/>
                        <span className="lh-2"/>
                        <span className="lh-3"/>
                        <span className="lh-4"/>
                    </div>
                </a>
            </div>
        </nav>
    );
};

export default NavBar;
