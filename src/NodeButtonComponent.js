import React, { Component } from "react";
import Graph from "./Graph";
import
{
  NavLink,
  HashRouter
} from "react-router-dom";
import { MAX_ALTERS } from "./Settings";

/*************************************************************************
 * Screen design to generate names for nodes/alters.
 * 
 * References:
 * 
 * For further information on references in React check:
 * https://reactjs.org/docs/refs-and-the-dom.html
 *************************************************************************/
class NodeButtonComponent extends Component
{

  constructor(props)
  {
    super(props);
    this.state = { counter: 0 };
    this.input = React.createRef();
    this.counter = 0;

  }


  /***************************************************************************
   * Calls back to Survey component to store data.
   **************************************************************************/
  transferCallBack()
  {
    if (this.props.transferCallBack)
    {
      this.props.transferCallBack();
    }
  }

  /*************************************************************************
   * Checks whether enough nodes have been generated yet.
   * @param {*} event 
   * @returns {bool} whether to prepare for next route or not
   *************************************************************************/
  checkCondition(event)
  {
    if (this.props.counter > (this.props.max - 1))
    {
      this.props.callBackButton(this.input.current.value);
      this.transferCallBack();
      return true
    } else
    {
      event.preventDefault();
      this.props.callBackButton(this.input.current.value);
    }

  }

  /*************************************************************************
  * Handles usage of the Enter key.
  * see: https://newbedev.com/how-to-submit-a-form-using-enter-key-in-react-js
  * To-Do: the example makes use of .code, which seems to be better.
  * @param {event} event 
  *************************************************************************/
  keypress_handler=(event)=>
  {
    if (event.keyCode === 13)
    {
      document.getElementById("confirm_link").click()
    }
    else if(event.keyCode === 46)
    {
      // this.props.deleteNodeCallback();
      this.toggleDeleteNodeDialog()
    }
  }

  /*************************************************************************
   * Sets initial component state and registers the enter key listener.
   *************************************************************************/
  componentDidMount()
  {
    this.setState(this.state);
    // see: https://reactjs.org/docs/refs-and-the-dom.html
     this.input.current.focus()
    document.addEventListener("keydown", this.keypress_handler);
    if(this.props.nodes.length>25)
    {

      console.log("More than 25 nodes")
      for(var i = 0; i<= (this.props.nodes.length-MAX_ALTERS); i++)
      {
        this.props.nodes.pop()
      }
    }
    else
    {
      this.input.current.focus()
    }
  }

  /*************************************************************************
   * Removes the event listener on unmount
   *************************************************************************/
  componentWillUnmount()
  {
    document.removeEventListener("keydown", this.keypress_handler);
  }

  toggleDeleteNodeDialog=()=>{
    document.getElementById('deleteNodeConfirmation').classList.toggle('hidden');
  }

  conditionalRender=()=>
  {
    if(this.props.nodes.length>=MAX_ALTERS)
    {
      return  <div className="container" id="userInputStd" style={{position: "relative", }}>
      <input id="usr" style={{visibility: "hidden"}}type="text" placeholder="Name" ref={this.input} />
      <NavLink id="confirm_link"
      style={{position: "absolute", width: "250px", left: "50%", transform: "translateX(-50%)"}}
      exact to={this.props.route}>
      <button id="confirm" style={{width: "100%"}}>{"Confirm and Next"}</button>
    </NavLink>
    </div>
    }
    else{
      return  <div className="container" id="userInputStd">
      <input id="usr" type="text" placeholder="Name" ref={this.input} />
      <NavLink id="confirm_link"
        exact to={this.props.route}
        onClick={this.checkCondition.bind(this)}>
        <button id="confirm" >{this.props.nodes.length <= (MAX_ALTERS-1) ? "Confirm and Next" : "Add an Individual"}</button>
      </NavLink>
    </div>
    }
  }

  getNameOfNode=()=>{
    if(this.props.nodes === undefined || this.props.lastClickedNode === undefined)
    {
      return "a node"
    }
    else if(this.props.nodes[this.props.lastClickedNode-1]!==undefined)
    {
      return this.props.nodes[this.props.lastClickedNode-1].name
    }
    else
    {
      return "a node"
    }
  }

  render()
  {
    return (
      <HashRouter>
        <div>
          {/* Instructions for this question/component. */}
          <div className="textBox expanded">
            {this.props.textDescription}
          </div>
          <div className="popupDialog hidden" id="deleteNodeConfirmation">
            <h2>Attention!</h2>
            <p>You are about to delete {this.getNameOfNode()} from your network. Are you sure you wish to proceed?</p>
            <div className="choiceBox">
              <button onClick={()=>this.props.deleteNodeCallback()}>Delete</button>
              <button onClick={()=>this.toggleDeleteNodeDialog()}>Cancel</button>
            </div>
            
          </div>
          <Graph counter={this.props.counter}
            nodes={this.props.nodes}
            prevNodes={this.props.prevNodes}
            links={this.props.links}
            foci={this.props.foci}
            prevFoci={this.props.prevFoci}
            callBack={this.props.callBackNodes}
            collectHistory={this.props.collectHistory} 
            lastClickedNodeCallback = {this.props.lastClickedNodeCallback}
            />

          {/* <div className="container" id="userInputStd">
            <input id="usr" type="text" placeholder="Name" ref={this.input} />
            <NavLink id="confirm_link"
              exact to={this.props.route}
              onClick={this.checkCondition.bind(this)}>
              <button id="confirm" >{this.props.nodes.length <= (MAX_ALTERS-1) ? "Confirm and Next" : "Add an Individual"}</button>
            </NavLink>
          </div> */}
          {this.conditionalRender()}
        </div>
      </HashRouter>
    );
  }
}

export default NodeButtonComponent;