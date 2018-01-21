import React, { Component } from 'react';

import SxMap from "../components/SxMap"
import ActInfo from "../components/ActInfo"
import AllImage from "../components/AllImage"

import PageIndexDialog from "./PageIndexDialog"

export default class PageIndex extends Component {

  constructor() {
    super()
    this.state = {
      showDialog : true
    }
  }


  render() {
    if (this.state.showDialog) {
      return (
        <div className="PageIndex" >
          <PageIndexDialog
            hideDialog={(() => {
              this.setState({showDialog : false})
            }).bind(this)}
          ></PageIndexDialog>
          <ActInfo {...this.props} ></ActInfo>
          <AllImage {...this.props} ></AllImage>
        </div>
      )
    } else {
      return (
        <div className="PageIndex" >
          <ActInfo {...this.props} ></ActInfo>
          <AllImage {...this.props} ></AllImage>
        </div>
      )
    }
  }

}
