import React, { Component } from 'react';
import jquery from "jquery"
import config from "../config"
import { Card, WingBlank, WhiteSpace, Button  } from 'antd-mobile';

const PageAuditItem = (props) => {
  return (
    <WingBlank size="lg" className={"audit_item_" + props.item.id} >
      <WhiteSpace size="lg" />
        <Card>
          <Card.Header
            title=""
            thumb={props.item.imgid}
            thumbStyle={{width : "100%"}}
            extra={<span>{props.item.iname}</span>}
          />
          <Card.Body>
            <div>{props.item.itext}</div>
          </Card.Body>
          <Card.Footer content={props.item.igpswhere} extra={
            <div style={{}}>
              <Button type="warning" inline size="small" style={{ marginRight: '4px' }}
                onClick={(() => {
                  jquery.ajax({
                    url : config.apiBase + "audit?id=" + props.item.id + "&status=2",
                    dataType : 'json',
                    success : function(json) {
                    }
                  });
                  jquery(".audit_item_" + props.item.id).remove();
                }).bind(this)}
                >驳回</Button>
              <Button type="primary" inline size="small" style={{ marginRight: '4px' }}
                onClick={(() => {
                  jquery.ajax({
                    url : config.apiBase + "audit?id=" + props.item.id + "&status=1",
                    dataType : 'json',
                    success : function(json) {
                    }
                  });
                  jquery(".audit_item_" + props.item.id).remove();
                }).bind(this)}
                >通过</Button>
            </div>
          } />
        </Card>
    </WingBlank>
  )
}

export default class PageAudit extends Component {

  constructor() {
    super()
    this.state = {
      list : undefined
    }
  }

  updateList() {
    let comp = this;
    jquery.ajax({
      url : config.apiBase + "list?page=50&audit=0",
      dataType : 'json',
      success : function(json) {
        comp.setState({
          list : json
        })
      }
    });
  }

  componentDidMount() {
    this.updateList();
    let comp = this;
    window.setInterval(() => {
      this.updateList.bind(comp)()
    }, 1000 * 20)
  }

  render() {
    let items = [];
    if (this.state.list) {
      this.state.list.forEach(item => {
        items.push(<PageAuditItem item={item} ></PageAuditItem>)
      })
    }
    return (
      <div className="PageAudit" >
        {items}
      </div>
    )
  }

}
