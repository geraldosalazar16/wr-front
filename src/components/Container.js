import React, {Component} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'

import Login from './Login/Login'
import Dashboard from './Dashboard/Dashboard'
import BranchManagement from './BranchManagement'
import MySideNav from './SideNav'
import TopNav from './TopNav'
import ForgotPassword from './ForgotPassword'
import VerifyAccount from './VerifyAccount'
import ChangePassword from './ChangePassword'
import UserProfile from './UserProfile'
import BranchEdit from './BranchEdit'
import BranchCreate from './BranchCreate'
import BranchUsers from './BranchUsers'
import BranchUserCreate from './BranchUserCreate'
import BranchUserEdit from './BranchUserEdit'
import CustomerCreate from './CustomerCreate'
import CustomerEdit from './CustomerEdit'
import CustomerDetails from './CustomerDetails'
import BranchUserProfile from './BranchUserProfile'
import {connect} from 'react-redux'
import EmployeeList from './EmployeeList'
import EmployeeCreate from './EmployeeCreate'
import EmployeeEdit from './EmployeeEdit'

import './Container.css';
import {CustomerManagement} from "./CustomerManagement";

class Container extends Component {
    render() {
        const { authenticated, isLoading } = this.props;
        const authenticatedContent = (
            <div className="authenticated-content">
                <Switch>
                    <Route exact path='/' component={Dashboard} />
                    <Route path='/dashboard' component={Dashboard} />
                    <Route path='/branch-customers/:branch_id' component={CustomerManagement} />
                    <Route path='/branch-management' component={BranchManagement} />
                    <Route path='/branch-edit/:branch_id' component={BranchEdit} />
                    <Route path='/branch-create' component={BranchCreate} />
                    <Route path='/branch-users/:branch_id' component={BranchUsers} />
                    <Route path='/branch-user-create/:branch_id' component={BranchUserCreate} />
                    <Route path='/branch-user-edit/:branch_id/:user_id' component={BranchUserEdit} />
                    <Route path='/customer-create/:branch_id' component={CustomerCreate} />
                    <Route path='/customer-edit/:customer_id/:branch_id' component={CustomerEdit} />
                    <Route path='/customer-details/:customer_id/:branch_id' component={CustomerDetails} />
                    <Route path='/user-profile' component={UserProfile} />
                    <Route path='/branch-user-profile' component={BranchUserProfile} />
                    <Route path='/employee-list' component={EmployeeList} />
                    <Route path='/employee-create' component={EmployeeCreate} />
                    <Route path='/employee-edit/:user_id' component={EmployeeEdit} />

                    <Redirect to="/dashboard" />
                </Switch>
            </div>
        );
        const nonAuthContent = (
            <Switch>
                <Route exact path='/' component={Login} />
                <Route path='/forgot-password' component={ForgotPassword} />
                <Route path='/verify-email/:token' component={VerifyAccount} />
                <Route path='/change-password/:token' component={ChangePassword} />
                <Route path='/login' component={Login} />
                <Redirect to="/login" />
            </Switch>
        );
        const content = !authenticated ?
            <div className={isLoading ? 'layout hidden' : 'layout'}>
                {nonAuthContent}
            </div>
            :
            <div className={isLoading ? 'layout hidden' : 'root'}>
                <div className="content"> 
                    <TopNav />
                    <main className="main-content">                    
                        <MySideNav />
                        {authenticatedContent}
                    </main>
                </div>
            </div>
        return content;
    }
}

const mapStateToProps = (state) => {
    return {
        authenticated: state.auth.user ? true : false,
        isLoading: state.loading.isLoading,
    };
}

export default connect(
    mapStateToProps,
    null
)(Container);
