import React, { Component } from 'react'
import Loader from 'react-loader-spinner'
import { connect } from 'react-redux'
import './Loading.css'

class Loading extends Component {
    render() {
        const {
            isLoading,
            loadingMessage
        } = this.props;
        const content = isLoading ? 
            <div className="loading-wrapper">
                <h3>{loadingMessage}</h3>
                <Loader
                    type="Watch"
                    color="#00BFFF"
                    height={100}
                    width={100}
                />
            </div>
        : <div></div>
        return content;
    }
}

const mapStateToProps = (state) => {
    return {
        isLoading: state.loading.isLoading,
        loadingMessage: state.loading.loadingMessage
    };
}

export default connect(
    mapStateToProps,
    null
)(Loading);