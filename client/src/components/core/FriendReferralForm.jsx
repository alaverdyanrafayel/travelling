import React from 'react';
import { REQUIRED, INVALID_EMAIL_MSG } from 'configs/constants';
import { isEmail, isEmpty } from 'validator';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { selector } from '../../app/services';
import converter from 'helpers/form/inputDetails';
import { Form } from 'components/form-elements';
import { clone, cloneDeep, isEqual } from 'lodash';
import { attemptSendReferral } from '../../app/modules/auth-user/AuthUserActions';
import { ToastContainer, toast } from 'react-toastify';
import { Button } from 'reactstrap';

const referralState = {
    fields: {
        email: '',
    },
    errors: {
        email: '',
    },
    loading: false
};

export class FriendReferralForm extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = cloneDeep(referralState);
    }

  componentDidUpdate(prevProps) {
    const { userFields, userMessages } = this.props;

    if ((userFields &&  !userFields.equals(prevProps.userFields)) || (userMessages && userMessages !== prevProps.userMessages)) {
          this.setState({ loading: false });
          toast.success(userMessages[0], {
              position: toast.POSITION.TOP_CENTER
          });
      }
  }
  validate(name, value) {
      switch (name) {
              case 'email':
                  if (isEmpty(value)) {
                      return REQUIRED('Email');
                  } else if (!isEmail(value)) {
                      return INVALID_EMAIL_MSG;
                  } else {
                      return '';
                  }
      }
  }

  handleSubmit = (ev) => {
    ev.preventDefault();
    this.setState({ loading: true });
    const { attemptSendReferral } = this.props,
    fields = clone(this.state.fields);

    let validationErrors = {};
    Object.keys(fields).map(name => {
        const error = this.validate(name, fields[name]);
        if (error && error.length > 0) {
            validationErrors[name] = error;
        }
    });

    if (Object.keys(validationErrors).length > 0) {
        this.setState({ errors: validationErrors });
    }

    attemptSendReferral(fields['email']);

  }

  handleChange = (proxy) => {
    let { value, name } = proxy.target;

      let val = value;

      let newState = cloneDeep(this.state);

      newState.errors[name] = this.validate(name, value);
      newState.fields[name] = val;

      if (!isEqual(this.state, newState)) {
          this.setState(newState);
      }

      if(!this.state.loading){
         this.setState({ loading: false });
      }
  }
    render = () => {

      let inputs = [
          {
              name: 'email',
              label: "Enter your friend's email",
              type: 'email',
              error: 'test@gmail.com',
              tooltip: 'Email message',
              colSize: 12,
          }
      ];
      inputs.map(input=> input.error = converter(cloneDeep(this.state.errors), input.name));

        return (
          <div className="panel panel-default dashboard_panel_refer">
            <ToastContainer autoClose={5000} className="toast-container"/>
              <div className="panel-heading dashboard_panel_heading">
                  Refer a friend
              </div>
              <div className="panel-body text-center">
                <div>Want a friend to join you on a holiday?</div>
                <div>Enter their email below to invite them to Holipay!</div>
                <form onSubmit={(ev) => this.handleSubmit(ev)} method="post">
                    <Form
                        inputs={inputs}
                        fields={clone(this.state.fields)}
                        eventHandler={this.handleChange}
                        noLabel
                    />
                    <Button className="f-btn f-btn_default f-color_white menu__btn dashboard_btn"
                      type="submit"
                      style={this.state.loading === true ? { background: '#BABABA' } : {}}
                      disabled={this.state.loading}
                            onClick={this.handleSubmit}>
                        <span>INVITE</span>
                      </Button>
                </form>
              </div>
          </div>
        );
    };
}

const mapStateToProps = state => selector(state, false, ['auth-user']);

const mapDispatchToProps = dispatch => {
    return {
        attemptSendReferral: data => dispatch(attemptSendReferral(data))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FriendReferralForm));
