import React from 'react';

export class SignupSteps extends React.Component {

    componentDidMount() {
    }

    render = () => {
        return (
          <div className="wizard">
               <div className="wizard-inner">
                   <div className="connecting-line"></div>
                   <ul className="nav nav-tabs" role="tablist">
                       <li role="presentation" className={this.props.step === 1 ? 'active' : ''}>
                           <a  data-toggle="tab" aria-controls="step1" role="tab" title="Step 1">
                             <span className="round-tab"/>
                           </a>
                       </li>
                        <li role="presentation" className={this.props.step === 2 ? 'active' : ''}>
                           <a  data-toggle="tab" aria-controls="step2" role="tab" title="Step 2">
                             <span className="round-tab"/>
                           </a>
                       </li>
                        <li role="presentation" className={this.props.step === 3 ? 'active' : ''}>
                           <a  data-toggle="tab" aria-controls="step3" role="tab" title="Step 3">
                             <span className="round-tab"/>
                           </a>
                       </li>
                        <li role="presentation" className={this.props.step === 4 ? 'active' : ''}>
                           <a  data-toggle="tab" aria-controls="complete" role="tab" title="Complete">
                             <span className="round-tab"/>
                           </a>
                       </li>
                   </ul>
               </div>
           </div>
        );
    };
}

export default SignupSteps;
