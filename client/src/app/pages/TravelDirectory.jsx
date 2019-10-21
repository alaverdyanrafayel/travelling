import React from 'react';
import { connect } from 'react-redux';
import { Sticky, StickyContainer } from 'react-sticky';
import { selector } from '../services';
import { NavBar, Footer } from 'components/common';

class TravelDirectory extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <StickyContainer>
                <section id="travel-header">
                    <Sticky>
                        {
                            ({ style, distanceFromTop }) => {
                                if (distanceFromTop === undefined) {
                                    distanceFromTop = 0;
                                }

                                style.position = 'fixed';
                                style.top = '0px';
                                style.width = '100%';
                                style.transform = 'translateZ(0px)';
                                style.left = '0px';

                                return NavBar(style, distanceFromTop, 'merchants');
                            }
                        }
                    </Sticky>
                    <h1 className="header__logotype header__hiw center-align hiw-container">Holipay helps you book your
                        holiday with one of our merchant partners whilst paying for it over 12 equal weekly
                        instalments</h1>
                    <h3 className="header__sublogotype center-align hiw-container">Booking with Holipay is easy. There
                        are no hidden fees, so the total you see at checkout is always what you'll actually pay.</h3>
                    <div className="header__icon-scrolldown" />
                </section>
                <div className="banner-sec">
                    <h1 className="header__logotype header__hiw center-align hiw-container f-color_purple">Explore
                        Holipay's travel partners</h1>
                    <br/>
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12 col-sm-3 col-md-3">
                                <img src="/img/merchant-randwick.png" className="img-responsive img-box img-thumbnail"/>
                            </div>
                            <div className="col-xs-12 col-sm-9 col-md-9">
                                <div className="list-group">
                                    <div className="list-group-item">
                                        <div className="row-content">
                                            <div className="list-group-item-heading">
                                                <small className="f-color_purple">Altitude Travel Randwick</small>
                                            </div>
                                            <p>Altitude Travel is a full-service travel agent located on Level 1 of the
                                                Royal Randwick Shopping Centre in Sydney. They have a reliable team
                                                consisting of cruise, flights, tours and Africa specialists who will
                                                understand your requirements and travel priorities.</p>
                                            <i className="glyphicon glyphicon-globe" style={{ padding: '5px' }} />
                                            Website: <span className="twitter">
                                            <a href="http://www.altitudetravel.com.au" target="_blank">www.altitudetravel.com.au</a></span>
                                            <br/>
                                            <i className="glyphicon glyphicon-envelope p-5"/>
                                            Email: <span className="twitter">
                                            <a className="f_color-purple" href="mailto:info@altitudetravel.com.au">info@altitudetravel.com.au</a></span>
                                            <br/>
                                            <i className="glyphicon glyphicon-earphone p-5"/>
                                            Phone: <span className="twitter"> 02 9326 3577</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr/>
                        <div className="row">
                            <div className="col-xs-12 col-sm-3 col-md-3">
                                   <img src="/img/merchant-altitude.jpg" className="img-responsive img-box img-thumbnail"/>
                            </div>
                            <div className="col-xs-12 col-sm-9 col-md-9">
                                <div className="list-group">
                                    <div className="list-group-item">
                                        <div className="row-content">
                                            <div className="list-group-item-heading">
                                                <small className="f-color_purple">Altitude Travel Tea Gardens</small>
                                            </div>
                                            <p>Altitude Travel Tea Gardens is a regional office about 2.5hrs north of Sydney and only an hour away from Newcastle,
                                                conveniently located in the Myall Quays Shopping Centre in Tea Gardens.  Their experienced team caters to the resident
                                                communities of the Myall Lakes region covering Tea Gardens, Pindimar, Hawk's Nest, Bulahdelah and Karuah as well as catering
                                                for clients in the Hunter region.</p>
                                            <i className="glyphicon glyphicon-globe p-5"/>
                                            Website: <span className="twitter">
                                            <a href="http://www.altitudetravel.com.au" target="_blank">www.altitudetravel.com.au</a></span>
                                            <br/>
                                            <i className="glyphicon glyphicon-envelope p-5"/>
                                            Email: <span className="twitter">
                                            <a href="mailto:teagardens@altitudetravel.com.au">teagardens@altitudetravel.com.au</a></span>
                                            <br/>
                                            <i className="glyphicon glyphicon-earphone p-5"/>
                                            Phone: <span className="twitter"> 02 4997 0580</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr/>
                        <hr/>
                        <div className="row">
                            <div className="col-xs-12 col-sm-3 col-md-3">
                                   <img src="/img/merchant-amanda.jpg" className="img-responsive img-box img-thumbnail"/>
                            </div>
                            <div className="col-xs-12 col-sm-9 col-md-9">
                                <div className="list-group">
                                    <div className="list-group-item">
                                        <div className="row-content">
                                            <div className="list-group-item-heading">
                                                <small className="f-color_purple">Amanda Anthony - Travel Managers</small>
                                            </div>
                                            <p>Whether you are taking a trip with family or friends, travelling for business, attending sporting events or planning your dream holiday, let Amanda take care of all the hard work for you. Amanda services the areas surrounding Yeppoon, Rockhampton, Emerald, Moranbah, Central Highlands and Central West QLD.</p>
                                            <i className="glyphicon glyphicon-globe p-5"/>
                                            Website: <span className="twitter">
                                              <a href="https://www.travelmanagers.com.au/ptm/amandaanthony/" target="_blank">www.travelmanagers.com.au/ptm/amandaanthony/</a></span>
                                            <br/>
                                            <i className="glyphicon glyphicon-envelope p-5"/>
                                            Email: <span className="twitter">
                                            <a href="mailto:amanda.anthony@travelmanagers.com.au">amanda.anthony@travelmanagers.com.au</a></span>
                                            <br/>
                                            <i className="glyphicon glyphicon-earphone p-5"/>
                                            Phone: <span className="twitter"> 0417 244 176</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr/>
                        <div className="row">
                            <div className="col-xs-12 col-sm-3 col-md-3">
                                    <img src="/img/merchant-gmt.png" className="img-responsive img-box img-thumbnail"/>
                            </div>
                            <div className="col-xs-12 col-sm-9 col-md-9">
                                <div className="list-group">
                                    <div className="list-group-item">
                                        <div className="row-content">
                                            <div className="list-group-item-heading">
                                              <small className="f-color_purple">Get Me There Travel</small>
                                            </div>
                                              <p>GMT Travel Co. specialises in multi-continent travel, offering the best value for money airfares you can buy so that you can see more of the world. They also manage tour and cruise reservations - with one point of contact for all your travel plans.</p>
                                            <i className="glyphicon glyphicon-globe p-5"/>
                                            Website: <span className="twitter">
                                            <a href="http://www.getmethere.net.au" target="_blank">www.getmethere.net.au</a></span>
                                            <br/>
                                            <i className="glyphicon glyphicon-envelope p-5"/>
                                            Email: <span className="twitter">
                                            <a href="bookings@gmttravelco.com.au">bookings@gmttravelco.com.au</a></span>
                                            <br/>
                                            <i className="glyphicon glyphicon-earphone p-5"/>
                                            Phone: <span className="twitter">1300 933 805</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                          </div>
                        <hr/>
                        <div className="row">
                            <div className="col-xs-12 col-sm-3 col-md-3">
                                    <img src="/img/merchant-nepal.jpg" className="img-responsive img-box img-thumbnail"/>
                            </div>
                            <div className="col-xs-12 col-sm-9 col-md-9">
                                <div className="list-group">
                                    <div className="list-group-item">
                                        <div className="row-content">
                                            <div className="list-group-item-heading">
                                                <small className="f-color_purple">Holiday In Nepal</small>
                                            </div>
                                            <p>Holiday In Nepal delivers a wide variety of awesome experiences in Nepal.
                                                They know the best hotels and their guides can take you on unique
                                                cultural tours, or for the more adventurous, on treks and hikes.</p>
                                            <i className="glyphicon glyphicon-globe p-5"/>
                                            Website: <span className="twitter">
                                            <a href="http://www.holidayinnepal.com.au" target="_blank">www.holidayinnepal.com.au</a></span>
                                            <br/>
                                            <i className="glyphicon glyphicon-envelope p-5"/>
                                            Email: <span className="twitter">
                                            <a href="mailto:info@holidayinnepal.com.au">info@holidayinnepal.com.au</a></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr/>
                        <div className="row">
                            <div className="col-xs-12 col-sm-3 col-md-3">
                                    <img src="/img/merchant-jayes.jpg" className="img-responsive img-box img-thumbnail"/>
                            </div>
                            <div className="col-xs-12 col-sm-9 col-md-9">
                                <div className="list-group">
                                    <div className="list-group-item">
                                        <div className="row-content">
                                            <div className="list-group-item-heading">
                                                <small className="f-color_purple">Jayes Travel</small>
                                            </div>
                                            <p>Jayes Travel has an experienced team of consultants who will sit down with you and discuss every
                                                aspect of your upcoming holiday, from the kind of accommodation you prefer to the cultural experience
                                                you want to have, right down to the finest detail and all within your budget.</p>
                                            <i className="glyphicon glyphicon-globe p-5"/>
                                            Website: <span className="twitter">
                                            <a href="http://www.jayestravel.com.au" target="_blank">www.jayestravel.com.au</a></span>
                                            <br/>
                                            <i className="glyphicon glyphicon-envelope p-5"/>
                                            Email: <span className="twitter">
                                            <a href="mailto:info@jayestravel.com.au">info@jayestravel.com.au</a></span>
                                            <br/>
                                            <i className="glyphicon glyphicon-earphone p-5"/>
                                            Phone: <span className="twitter"> 1300 891 100</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr/>
                        <div className="row">
                            <div className="col-xs-12 col-sm-3 col-md-3">
                                    <img src="/img/merchant-naracoorte.jpg" className="img-responsive img-box img-thumbnail"/>
                            </div>
                            <div className="col-xs-12 col-sm-9 col-md-9">
                                <div className="list-group">
                                    <div className="list-group-item">
                                        <div className="row-content">
                                            <div className="list-group-item-heading">
                                                <small className="f-color_purple">Naracoorte Travel n Cruise</small>
                                            </div>
                                              <p>Naracoorte Travel n Cruise specialise in all styles of travel to every corner of the world. Our combined experience and knowledge is invaluable when planning your next holiday and is what sets us apart from our competitors. Naracoorte Travel n Cruise is a proud member of AFTA, CLIA and Travellers Choice.</p>
                                            <i className="glyphicon glyphicon-globe p-5"/>
                                            Website: <span className="twitter">
                                            <a href="http://www.travelncruise.net.au" target="_blank">www.travelncruise.net.au</a></span>
                                            <br/>
                                            <i className="glyphicon glyphicon-envelope p-5"/>
                                            Email: <span className="twitter">
                                            <a href="naracoorte@travelncruise.net.au">naracoorte@travelncruise.net.au</a></span>
                                            <br/>
                                            <i className="glyphicon glyphicon-earphone p-5"/>
                                            Phone: <span className="twitter">  (08) 8762 4444</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                          </div>
                        <hr/>
                        <div className="row">
                            <div className="col-xs-12 col-sm-3 col-md-3">
                                    <img src="/img/merchant-travelcrafters.png" className="img-responsive img-box img-thumbnail"/>
                            </div>
                            <div className="col-xs-12 col-sm-9 col-md-9">
                                <div className="list-group">
                                    <div className="list-group-item">
                                        <div className="row-content">
                                            <div className="list-group-item-heading">
                                                <small className="f-color_purple">Travel Crafters</small>
                                            </div>
                                              <p>Travel Crafters is a travel agent located in Shop 25/43-45 Burns Bay Road, Lane Cove. Their experienced team will guide you through the entire process of planning your next holiday.</p>
                                            <i className="glyphicon glyphicon-envelope p-5"/>
                                            Email: <span className="twitter">
                                            <a href="holidays@travelcrafters.com.au">holidays@travelcrafters.com.au</a></span>
                                            <br/>
                                            <i className="glyphicon glyphicon-earphone p-5"/>
                                            Phone: <span className="twitter"> 02 8964 4221</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                          </div>
                          <hr/>
                          <hr/>
                          <div className="row">
                              <div className="col-xs-12 col-sm-3 col-md-3">
                                      <img src="/img/merchant-travelplus.jpg" className="img-responsive img-box img-thumbnail"/>
                              </div>
                              <div className="col-xs-12 col-sm-9 col-md-9">
                                  <div className="list-group">
                                      <div className="list-group-item">
                                          <div className="row-content">
                                              <div className="list-group-item-heading">
                                                  <small className="f-color_purple">Travel Plus</small>
                                              </div>
                                                <p>We always make sure you are 100% ecstatic about your travel choices, whether you are a seasoned traveller or new to this wonderful world of discovering new and exciting places. Through our extensive research and comprehensive database we can get you the best deals.</p>
                                              <i className="glyphicon glyphicon-globe p-5"/>
                                              Website: <span className="twitter">
                                              <a href="http://www.travelplus.net.au" target="_blank">www.travelplus.net.au</a></span>
                                              <br/>
                                              <i className="glyphicon glyphicon-envelope p-5"/>
                                              Email: <span className="twitter">
                                              <a href="enquiries@travelplus.net.au">enquiries@travelplus.net.au</a></span>
                                              <br/>
                                              <i className="glyphicon glyphicon-earphone p-5"/>
                                              Phone: <span className="twitter">  (07) 4671 1307</span>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                            </div>
                            <hr/>
                    </div>
                    <p className="center-align hiw-container f-color_purple" style={{ fontSize: '18px' }}>
                        Can't find what you're looking for?
                    </p>
                    <p className="center-align hiw-container">
                        Contact your favourite travel provider about using Holipay!
                    </p>
                    <p className="center-align hiw-container">
                        If they're interested, we'll have them on board as soon as possible.
                    </p>
                    <br/>
                </div>
                <Footer/>
            </StickyContainer>
        );
    }
}

const mapStateToProps = state => selector(state);

const mapDispatchToProps = () => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TravelDirectory);
