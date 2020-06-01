import React from 'react'
import logo from '../assets/images/logo.png'

export default function NotFound() {
    return (
        <div className="loginbody">
				<div className="loginpage">
					<div className="container">
						<div className="row">
							<div className="col col-md-8 col-md-push-2">
								<div className="loginbox">

									<div className="loginbox_logo">
										<img src={logo} alt="" />
									</div>

									<div className="form-body">
										<div className="tab-content">
											<div id="sectionA" className="tab-pane fade in active">
												<div className="loginpage_whitebox_bodywork">
													<ul>
														<li className="title">Page Not Found</li>
													</ul>
												</div>

												<div className="clearfix"></div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
    )
}
