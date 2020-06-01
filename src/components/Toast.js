import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ToastContainer } from 'react-toastify';
import {toast} from 'react-toastify'
import { clear } from '../store/actions/toastActions'

class Toast extends Component {
	customToastId = 'toastId';
	toastId = null;

    render() {
		const { message, cleanMessage } = this.props;

		if (message) {
			const {messageText, type } = message;
			if (messageText && type) {
				if (!toast.isActive(this.toastId)) {
					this.toastId = toast(messageText, {
					  type,
					  position: toast.POSITION.BOTTOM_CENTER,
					  autoClose: 7000,
					  toastId: this.customToastId,
					});
					cleanMessage();
				}
			}
		}
        return (
            <ToastContainer />
        )
    }
}

const mapStateToProps = (state) => {
	const { message } = state.toast  ;
	return { message };
}

const mapDispatchToProps = (dispatch) => {
	return {
		cleanMessage: () => dispatch(clear())
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Toast);
