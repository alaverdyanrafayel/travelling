import React from 'react';
import { IdentityVerification } from '../app/pages/IdentityVerification';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { Map, fromJS } from 'immutable';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import params from 'configs/params';

configure({ adapter: new Adapter() });

global.greenidUI = {
    setup() {}
};

global.greenidConfig = {
    setOverrides() {}
};

function Router () {
    this.router = [];

    this.push = (a) => {
        this.router.push(a);
    };
}

const props = {
    router: new Router(),
    userMessages: Map({}),
    loggedInUser: fromJS({
        customer: {
            first_name: 'fakeFirstName',
            last_name: 'fakeLastName',
            middle_name: 'fakeMiddleName',
            dob: new Date('20/12/1988'),
        }
    }),
};

const muiTheme = getMuiTheme();
const context = { context: { muiTheme }, childContextTypes: { muiTheme: React.PropTypes.object } };

describe('Component identity Verification', () => {

    let wrapper = 1;

    beforeEach(() => {
        wrapper = mount(<IdentityVerification {...props} />, { ...context });
        wrapper.setState({ confirmedToContinue: true });
    });

    test('Should render the IdentityVerification component', () => {
        expect(wrapper.find(IdentityVerification).length).toBe(1);
    });

    test('Identity Verification component should have accountId input and value is NSW', () => {
        expect(wrapper.find(IdentityVerification).find('input[name="state"][value="NSW"]').length).toBe(1);
    });

    test('Identity Verification component should have state input and value is holipay', () => {
        expect(wrapper.find(IdentityVerification).find('input[name="accountId"][value="holipay"]').length).toBe(1);
    });

    test('Identity Verification component should have given names input and value is fakeFirstName', () => {
        expect(wrapper.find(IdentityVerification).find('input[name="givenNames"][value="fakeFirstName"]').length).toBe(1);
    });

    test('Identity Verification component should have surname input and value is fakeLastName', () => {
        expect(wrapper.find(IdentityVerification).find('input[name="surname"][value="fakeLastName"]').length).toBe(1);
    });

    test('Identity Verification component should have middle name input and value is fakeMiddleName', () => {
        expect(wrapper.find(IdentityVerification).find('input[name="middleNames"][value="fakeMiddleName"]').length).toBe(1);
    });

    test('Identity Verification component should have apiCode input and value is XS4-PpP-7bX-wg9', () => {
        expect(wrapper.find(IdentityVerification).find('input[name="apiCode"][value="' + params.greenId.apiCode + '"]').length).toBe(1);
    });

    test('Identity Verification component should have usethiscountry input and value is AU', () => {
        expect(wrapper.find(IdentityVerification).find('input[name="usethiscountry"][value="AU"]').length).toBe(1);
    });

});
