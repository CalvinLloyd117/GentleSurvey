import React, { Component } from "react";
import Graph from "./Graph";
import
{
  // Route,
  NavLink,
  HashRouter
} from "react-router-dom";

/*************************************************************************
 * Screen design that is used when only nodes are to be depicted.
 *************************************************************************/
class NodeComponent extends Component
{
  constructor(props)
  {
    super(props);
    this.state = { counter: 0 };
  }

  /*************************************************************************
   * Calls back to Survey component to store data.
   *************************************************************************/
  transferCallBack()
  {
    if (this.props.transferCallBack)
    {
      this.props.transferCallBack();
    }
  }

  /*************************************************************************
   * Sets initial state when component is mounted.
   *************************************************************************/
  componentDidMount()
  {
    this.setState(this.state);
  }

  render()
  {
    return (
      <HashRouter>
        <div>
          <div className="textBox">
            {this.props.textDescription}
          </div>
          <Graph fixed={this.props.fixed}
            lastClickedNodeCallback={this.props.lastClickedNodeCallback.bind(this)}
            lastClickedNode={this.props.lastClickedNode}
            float={(this.props.float ? 1 : 0)}
            opac={(this.props.opac)}
            counter={this.props.counter}
            nodes={this.props.nodes}
            prevNodes={this.props.prevNodes}
            colorOveride={this.props.colorOveride}
            links={this.props.links}
            foci={this.props.foci}
            prevFoci={this.props.prevFoci}
            callBack={this.props.callBackNodes}
            collectHistory={this.props.collectHistory}
            categories={(this.props.categories ? this.props.categories : [])}
            extraHeight={this.props.extraHeight}
          />
          <div className="usrInput">
            {this.props.route ? <NavLink exact to={this.props.route} onClick={() => this.transferCallBack}>
              <button id="confirm_next">Confirm & Next</button>
            </NavLink> : <div />}
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default NodeComponent;