import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import { verifyAccount } from '../store/actions/authActions'

class VerifyAccount extends Component {
    componentDidMount() {
        const { verifyAccountError, verifyAccountMessage } = this.props;
        if (!verifyAccountError && !verifyAccountMessage) {
            const token = this.props.match.params.token;
            this.props.verifyToken(token);
        }
    }
    
    render() {
        // https://stackoverflow.com/questions/35352638/react-how-to-get-parameter-value-from-query-string
        /**
         * Location of the params might change depending of the react-dom 
         * Console log props and search for it
         * console.log('VA props', this.props);
         */
        const { verifyAccountError, verifyAccountMessage } = this.props;
        
        if (verifyAccountError) {
			if (!toast.isActive(this.toastId)) {
				this.toastId = toast(verifyAccountError, {
					type: 'error',
					position: toast.POSITION.BOTTOM_CENTER,
					autoClose: 7000,
					toastId: this.customToastId
				});
			}
		} else if (verifyAccountMessage) {
			if (!toast.isActive(this.toastId)) {
				this.toastId = toast(verifyAccountMessage, {
					type: 'success',
					position: toast.POSITION.BOTTOM_CENTER,
					autoClose: 7000,
					toastId: this.customToastId
				});
			}
        }
        const userMessage = verifyAccountError !== undefined 
        ? verifyAccountError
        : verifyAccountMessage;
        return (
            <div className="main-container">
                <h1>
                    {userMessage}
                </h1>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
	const { verifyAccountError, verifyAccountMessage } = state.auth;
	return {
		verifyAccountError,
		verifyAccountMessage
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		verifyToken: (token) => dispatch(verifyAccount(token))
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(VerifyAccount);
