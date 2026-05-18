import google from '../img/google.png';
import facebook from '../img/communication.png';

const SocialLogin = () => {
    return (
        <div className="social-login">
            <button className="social-button">
                <img src={google} alt="google" className="social-icon" />
                Google
            </button>
            <button className="social-button">
                <img src={facebook} alt="facebook" className="social-icon" />
                Facebook
            </button>
        </div>
    )
}

export default SocialLogin