import React, { Component } from "react";
// import Survey from "./Survey";
// import { NavLink, Link, Navigate } from 'react-router-dom'
import {Link} from 'react-router-dom'
// import ReactDOM from "react-dom";
import "./css/bootstrap.css";
import "./css/style.css";
import logo from './ULethLogo.jpg';
class Consent extends Component
{
    /************************************************************************ 
     *  
     * 
     * 
     * References:
     * For further information on forms in React check:
     * https://reactjs.org/docs/forms.html
    *************************************************************************/
    constructor(props)
    {
        super(props);
        this.state = {
            consent: false // Assigning parent value to child state
          };
        // this.state = {consent: false};
        // this.props = super(props)
        
    }

    handleChange = (event) =>
    {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        const name = event.target.name;

        this.setState({
            [name]: value
        });

        console.log("Handling Change")
        this.state.consent = ! this.state.consent
        this.props.updateConsent(this.state.consent)
    }

    
    render()
    {
        return (

            
            <div className="container">
                <img className="ulethLogo" src={logo} ></img>
                {/* <div className="ID_Box"> */}
                <div className="ConsentPopup">
                        <p>
                            <b>Title of the study: </b> 	
                            An investigation of social norm subscription among scientists and graduate students in Alberta.
                        </p>

                        <p>
                            <b>Researchers: </b> 
                            <a href="mailto:holly.kalynbogard@uleth.ca">Holly Kalyn Bogard</a> (PI) and <a href="mailto:louise.barrett@uleth.ca">Dr. Louise Barrett</a> (Supervisor). Department of Psychology, University of Lethbridge, AB
                        </p>

                        <p>
                            <b>Invitation to Participate: </b> 
                            You are invited to participate in our second survey as a current trainee (graduate student or post-doctoral fellow) in a science department at your university. In the first survey you told us about how you think scientists should behave in your research field. 
                        </p>

                        <p>
                            Next, we are interested in learning about the people you interact with most frequently in your academic environment.
                        </p>

                        <p>
                            <b>Purpose of the Study: </b> 
                            Science trainees learn about appropriate professional behaviour from their academic experiences and social environments. How your mentors and peers behave likely informs your normative orientation, or, how you think you should behave as a scientist. Our study is interested in the role that social support may play in developing your normative orientation, and understanding from whom this support is most likely provided. Additionally, we are curious to know if social support changes over different factors (e.g., career stage or department). Our team developed an interactive, online social network analysis tool which allows you to describe details about your personal social network to us. Your participation will provide valued insight we hope can inform and improve graduate student training approaches moving forward. 
                        </p>
                        <p>
                            <b>Participation: </b> 
                            This is an online longitudinal survey, which means you will be asked to participate four times over the next two years. Our first sampling period is now (April 2024). We will contact you via email every six months to update your responses to both the social norms survey and the social network survey (October 2024, April 2025, and October 2025). Full 2-year participation is not mandatory, and you may withdraw from the study at any point before submitting your final responses in October 2025. We are offering an honorarium to the first 125 participants in appreciation of your time (see below). If you wish to participate, please register by following the link below. You will be asked to create a user account with:
                            <ul>
                                <li> <b>the same university email address you provided for this email</b></li>
                                <li> <b>a unique password that contains at least one capitol letter, at least one number, at least one symbol, and be at least 8 characters in length.</b></li>
                            </ul>
                        </p>

                        <p>
                            *Please note that <u>GENTLE does not have password recovery</u>, so it is imperative that you are able to recall your password later. To protect yourself from security breaches, we recommend that you do not reuse old passwords in making your GENTLE account.
                        </p>
                        <p>
                            <b>Risks: </b> 
                            You are very unlikely to experience any risks or discomforts by participating in this survey. 
                            The survey is completely voluntary, and you may choose to withdraw at any point. It is not possible to know all the potential risks incurred during a study, but the researchers have taken all reasonable safeguards to minimize any known risks to a study participant.
                        </p>

                        <p>
                            <b>Confidentiality and Anonymity: </b> 
                            The information that you share will remain strictly confidential and used solely for research purposes. To minimize the risk of online security breaches and to help ensure your confidentiality we recommend that you use standard safety measures such as signing out of your account, closing your browser, and locking your screen or device when you are no longer using them or when you have completed the study. Although collecting your email address is necessary for this survey be assured that this information will be permanently deleted after the data collection period is over to ensure your anonymity. Furthermore, know that all data are pooled (aggregated) to the group level (e.g., career stage, department) for analysis. Absolutely no analysis, results, or descriptions will ever be produced about individuals.
                        </p>

                        <p>
                            <b>Data Storage: </b>
                            We will do everything we can to make sure that all information you provide is kept private and secure. Data from this survey is stored on MongoDB, an online secure and end-to-end encrypted platform. After each sampling period, Holly Kalyn Bogard will remove or re-code any identifying information and export electronic copies of the survey data from MongoDB to an encrypted, password protected personal computer and two external drives for a minimum period of 5 years, as required by the University of Lethbridge. All data repositories on MongoDB will be permanently deleted at this point.  
                        </p>

                        <p>
                            <b>Compensation: </b> We value your contribution to our research. Participants will receive an honorarium of $ 20.00 CAD after successfully completing the below social network survey. Additional honorariums of $15.00 CAD will be offered each time participants update their survey responses for the three scheduled sampling periods (October 2024, April 2025, and October 2025). Honorariums will be paid via an online e-transfer or e-gift card to the participating university email address. Participants who choose to withdraw from the study will not be asked to return their honorarium(s).
                        </p>

                        <p>
                            <b>Voluntary Participation: </b> 
                            Taking part in this study is your choice. You are under no obligation to participate and should you choose to withdraw at any point use the contact information directly below to let us know. We will honour 100% of withdrawal requests. 
                        </p>

                        <p>
                            <b>Contact Information: </b>
                            If you have any questions or require more information about the study itself, you may contact Holly Kalyn Bogard (holly.kalynbogard@uleth.ca) or her supervisor Dr. Louise Barrett (louise.barrett@uleth.ca). Feel free to contact Holly Kalyn Bogard at any time to check on the progress of the research. The data you provide will contribute to a large pool of participant responses and used in scientific publications and presentations at scientific conferences. 
                        </p>

                        <p>
                            The plan for this study has been reviewed by a Research Ethics Board at the University of Alberta (Pro00126969) and University of Calgary (pSite-23-0048).  If you have any questions regarding your rights as a research participant or how the research is being conducted, you may contact the Research Ethics Office at 780-492-2615.
                        </p>

                        <p>
                            Completion of the survey means your consent to participate.
                        </p>

                        <footer>
                            <p> UofA Ethics ID: Pro00126969 / UCalgary Ethic ID: pSite-23-0048	2 </p>
                            <p>Version Date: 15 Jan 2024</p>
                        </footer>

                        <label>
                                <h5>I consent to my data being stored and confirm that I have read the informed consent sheet.  </h5>
                                <input
                                    name="consent"
                                    type="checkbox"
                                    checked={this.props.getConsent()}
                                    onChange={this.handleChange} />
                        </label>
                        <Link to="/Login">
                            <button
                            className={"ConsentPopup"}
                                style={{ opacity: this.props.getConsent() ? 1 : 0.5, cursor: this.props.getConsent() ? 'pointer' : 'not-allowed' }}
                                disabled={!this.props.getConsent()}
                                id="confirm_next">
                                    Continue
                            </button>
                        </Link>
                    </div>
                </div>
            // {/* </div> */}
        );
    }
}
export default Consent;