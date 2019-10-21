import React from 'react';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';
import { Sticky, StickyContainer } from 'react-sticky';
import { selector } from '../services';
import { NavBar, Footer } from 'components/common';

const privacyState = {
    fields: {},
    errors: {},
};

export class Privacy extends React.Component {

    constructor(props) {
        super(props);
        this.state = cloneDeep(privacyState);
    }

    render() {

        return (
            <StickyContainer>
                <section id="header" style={{ height: '180px' }}>
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
                    <h2 className="container f-title f-color_purple center-align">Privacy Policy</h2>
                </section>
                <section id="works" className="f-section">
                    <div className="container works">
                        <p>At Holipay Pty Ltd ACN 619 238 005 (“Holipay”) we are committed to protecting your privacy in
                            accordance with the Privacy Act 1988 (Cth). This Policy describes our current policies and
                            practices in relation to the collection, handling, use and disclosure of personal
                            information collected by us through our websites and other online platforms (together, the
                            “Websites”). It also deals with how you can complain about a breach of the privacy laws, how
                            you can access the personal information we hold about you and how to have that information
                            corrected.</p>
                        <p>Holipay’s travel merchant partners (together, our “Partners”) are independent of Holipay and
                            may have privacy policies which differ from ours. Our Partners are responsible for their own
                            privacy policies and privacy practices. Please contact our Partners directly for further
                            information on their privacy policies.</p>
                        <p>This Privacy Policy applies when you sign up for, access, or use our services, features,
                            technologies or functions offered on our Websites (collectively, Holipay’s “Services”) and
                            in relation to personal information we may otherwise collect during the course of our
                            business as set out in this Privacy Policy.</p>
                        <h3 className="f-color_purple">What information do we collect and how do we use it?</h3>
                        <p>If you open a Holipay account with us or use Holipay’s Services, we ask you for the
                            information we need to assess the fraud and repayment risk posed by Holipay transactions.
                            This can include:</p>
                        <ul>
                            <li>Contact information, such as your name, address, phone number, email and other similar
                                information;
                            </li>
                            <li>Detailed personal information, such as your date of birth, your device that you use to
                                sign up and log in to your Holipay account and purchases you have made;
                            </li>
                            <li>Financial information, such as your repayment history with Holipay, bank statement data,
                                and your credit score.
                            </li>
                        </ul>
                        <p>We may also obtain information about you from third parties including our Partners and
                            related companies, as well as credit reporting bodies and identity verification services,
                            and publicly or commercially available sources for the purposes of complying with relevant
                            legislation.</p>
                        <p>We may provide the information, that you have provided to Holipay, to Equifax Pty Ltd to
                            enable them to provide Holipay with a credit report on you in the instance that Holipay
                            requests one.</p>
                        <p>We also use your information to enable us to manage your ongoing requirements and our
                            relationship with you, e.g. to remind you of upcoming payments due. We may contact you by
                            mail or electronically unless you tell us that you do not wish to receive electronic
                            communications.</p>
                        <p>From time to time we will use your contact details to send you offers, updates, events,
                            articles, newsletters or other information about products and services that we believe will
                            be of interest to you. We may also send you regular updates by email or by post. We will
                            always give you the option of electing not to receive these communications and you can
                            unsubscribe at any time by notifying us that you wish to do so.</p>
                        <p>We may also use your information internally to help us improve our services and help resolve
                            any problems.</p>
                        <h3 className="f-color_purple">How we share personal information with other parties</h3>
                        <p>We may share your personal information with:</p>
                        <ul>
                            <li>Credit reporting bodies and collection agencies, including to report account
                                information, as permitted by law. To request a credit report, we will provide
                                information to the credit reporting body that identifies you;
                            </li>
                            <li>Our Partners and the suppliers and service providers who help with our business
                                operations including in relation to fraud prevention, identity verification, payment
                                collection, marketing, customer service, and technology services.
                            </li>
                        </ul>
                        <h3 className="f-color_purple">What if you don’t provide some information to us?</h3>
                        <p>If you do not provide us with some or all of the information that we ask for, we may not be
                            able to consider any purchases you intend to make with Holipay, resulting in an inability by
                            you to use our Services.</p>
                        <h3 className="f-color_purple">How do we hold and protect your information?</h3>
                        <p>We strive to maintain the relevance, reliability, accuracy, completeness and currency of the
                            personal information we hold and to protect its privacy and security. We keep personal
                            information only for as long as is reasonably necessary for the purpose for which it was
                            collected or to comply with any applicable legal or ethical reporting or document retention
                            requirements.</p>
                        <p>We hold the information we collect from you on secure servers that meet the highest standards
                            of encryption and security. Our servers are primarily located in the United States. In
                            addition, we or our subcontractors, may use cloud technology to store or process personal
                            Information, which may result in storage of data outside Australia. It is not practicable
                            for us to specify in advance which country will have jurisdiction over this type of
                            off-shore activity. All of our subcontractors, however, are required to comply with the
                            Australian Privacy Act in relation to the transfer or storage of personal Information
                            overseas.</p>
                        <p>We ensure that your information is safe by only storing your data on secure servers. We
                            maintain physical security over our paper and electronic data and premises, by using locks
                            and security systems.</p>
                        <h3 className="f-color_purple">Will we disclose the information we collect to anyone?</h3>
                        <p>We do not sell, trade, or rent your personal information to others. We may disclose your
                            information to credit reporting agencies in the case of default, and may need to provide
                            your information to contractors who supply services to us, e.g. to handle mailings on our
                            behalf, external data storage providers or to other companies in the event of a corporate
                            sale, merger, reorganisation, dissolution or similar event. However, we will take all
                            reasonable steps to ensure that they protect your information in the same way that we
                            do.</p>
                        <p>We may also provide your information to others if we are required to do so by law or under
                            some unusual other circumstances which the Privacy Act permits.</p>
                        <p>We will not provide your information or disclose it to overseas recipients.</p>
                        <p>Information related to any negative activity on your Holipay account (including late
                            payments, missed payments, defaults or chargebacks) may be reported to Equifax Pty Ltd, whom
                            may be used by Holipay to both assess repayment risk and report.</p>
                        <h3 className="f-color_purple">Cookies and third party analytical services</h3>
                        <p>When you visit our websites we automatically log information about your computer, such as the
                            IP address, browser type and access times. We utilise this information to conduct site
                            performance evaluations, to see where visitors are coming from and to keep track of how
                            people use our websites. This data help us to determine what content our subscribers find
                            most appealing so that we can maximize your enjoyment of our websites.</p>
                        <p>Users who do not register or log in as subscribers may browse the Websites without providing
                            any personally identifiable information. However, users' non-personally identifiable
                            information may nevertheless be tracked for the purposes outlined above.</p>
                        <p>When you access our Websites or use Holipay’s Services, we (including our Partners and
                            companies we work with) may place small data files on your computer or other device. These
                            data files may be cookies, pixel tags or other local storage provided by your browser or
                            associated applications (collectively “Cookies”). We use Cookies to ascertain which web
                            pages are visited and how often, to make our websites more user friendly, to give you a
                            better experience when you return to a website and to target advertising to you that we
                            think you may be interested in.</p>
                        <p>For example, Cookies allow us to save your password so you do not have to re-enter it every
                            time you visit our site. Most web browsers automatically accept Cookies. You can find
                            information specific to your browser under the ‘Help’ menu. You are free to decline our
                            Cookies if your browser or browser add-on permits, unless our Cookies are required to
                            prevent fraud or ensure the security of websites we control. However, declining our Cookies
                            may interfere with your use of our Websites and Holipay Services.</p>
                        <p>We may use Google Analytics and other third parties to collect and process data.</p>
                        <h3 className="f-color_purple">How can you check, update or change the information we are
                            holding?</h3>
                        <p>Upon receipt of your written request and enough information to allow us to identify the
                            information, we will disclose to you the personal and credit information we hold about you.
                            We will also correct, amend or delete any personal information that we agree is inaccurate,
                            irrelevant, out of date or incomplete.</p>
                        <p>If you wish to access or correct your personal or credit information please write to The
                            Privacy Officer at info@holipay.com.au.</p>
                        <p>We do not charge for receiving a request for access to personal or credit information or for
                            complying with a correction request. We do not charge for providing access to personal or
                            credit information.</p>
                        <p>In some limited cases, we may need to refuse access to your information or refuse a request
                            for correction. We will advise you as soon as possible after your request if this is the
                            case and the reasons for our refusal.</p>
                        <h3 className="f-color_purple">Links</h3>
                        <p>Our website may contain links to websites operated by third parties. Those links are provided
                            for convenience and may not remain current or be maintained. Unless expressly stated
                            otherwise, we are not responsible for the privacy practices of, or any content on, those
                            linked websites, and have no control over or rights in those linked websites. The privacy
                            policies that apply to those other websites may differ substantially from our Privacy
                            Policy, so we encourage individuals to read them before using those websites.</p>
                        <h3 className="f-color_purple">What happens if you want to complain?</h3>
                        <p>If you have any concerns about this Privacy Policy or whether we have complied with the
                            Privacy Act when collecting or handling your personal information, please write to our The
                            Privacy Officer at info@holipay.com.au.</p>
                        <p>Holipay will provide written acknowledgement of your complaint within 7 days of receipt. Then
                            we will consider your complaint through our internal complaints resolution process and we
                            will try to respond with a decision within 21 days of you making the complaint.</p>
                        <h3 className="f-color_purple">Your consent</h3>
                        <p>By asking us to assist with your holiday payment needs and using Holipay’s Services, you
                            consent to the collection and use of the information you have provided to us for the
                            purposes described above.</p>
                        <h3 className="f-color_purple">Tell us what you think</h3>
                        <p>We welcome your questions and comments about privacy. If you have any concerns or complaints,
                            please contact The Privacy Officer at info@holipay.com.au. If you are unsatisfied with our
                            response to a privacy matter then you may consult either an independent advisor or contact
                            the Office of the Australian Information Commissioner for additional help. We will provide
                            our full cooperation if you pursue this course of action.</p>
                    </div>
                </section>
                <Footer/>
            </StickyContainer>
        );
    }
}

const mapStateToProps = state => selector(state);

export default connect(mapStateToProps)(Privacy);
