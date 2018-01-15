import React, { Component } from 'react';

import Button from 'antd-mobile/lib/button';
import Card from 'antd-mobile/lib/card';
import WhiteSpace from 'antd-mobile/lib/white-space';
import List from "antd-mobile/lib/list"
import Picker from "antd-mobile/lib/picker"
import WingBlank from "antd-mobile/lib/wing-blank"
import ImagePicker from "antd-mobile/lib/image-picker"

import CompHeader from "./CompHeader"
import CompUploadForm from "./CompUploadForm"
import CompUploadHistory from "./CompUploadHistory"

export default (props) => {
  return (
    <div className="PageUpload" >
      <CompHeader {...this.props} ></CompHeader>
      <CompUploadForm {...this.props} ></CompUploadForm>
      <CompUploadHistory {...this.props} ></CompUploadHistory>
      <div style={{marginTop : "20px"}} ></div>
    </div>
  )
}
