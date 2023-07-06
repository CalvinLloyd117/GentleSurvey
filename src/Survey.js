import React, { Component } from "react";
import
{
  Route,
  NavLink,
  HashRouter,
} from "react-router-dom";
import NodeButtonComponent from "./NodeButtonComponent";
import NodeComponent from "./NodeComponent";
// import NodeSliderComponent from "./NodeSliderComponent";
import NodeCategoriesComponent from "./NodeCategoriesComponent";
import Thanks from "./Thanks";
import Introduction from "./Introduction"
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import $ from "jquery";

// Constant imports
import
{
  SVG_HEIGHT,
  SVG_WIDTH,
  MOBILE,
  NODE_RADIUS,
  AVB_WIDTH,
} from "./Graph";

// Descriptions & Layout functions
import
{
  rect_layout,
  box_layout,
  recalculate_foci,
  recalculate_nodes,
  hasLink,
  hasLinkAt,
  updateNodeRenderProps,
  removeNodeAt,
  doesNameOverlap,
  filterNodes
} from "./Utils";

import 
{
  returnYouTemplate,
  returnTemplateNode,
  INTRODUCTION_TEXT,
  END_OF_SURVEY_STATEMENT,
  ACADEMIC_BOXES,
  LAB_MEMBER_BOX,
  GENDER_SETTINGS,
  // CATEGORIES,
  // SEPARATOR,
  MAX_ALTERS,
  MIN_ALTERS,
  SURVEY_QUESTIONS,
  DELETE_WARNING,
  DUPLICATE_WARNING,
  SLIDER_WARNING,
  CATEGORY_WARNING,
  ACADEMIC_SUBCATEGORIES,
  AGE_CATEGORIES,
  CULTURAL_CATEGORIES,
  NONACADEMIC_SUBCATEGORIES,
  COLLABORATOR_BOXES,
  PROVIDES_ME_TECHNICAL_SUPPORT,
  WOULD_LIKE_MORE_TECHNICAL_SUPPORT,
  I_PROVIDE_TECHNICAL_SUPPORT,
  PROVIDES_ME_SUPPORT_ACADEMIC,
  I_PROVIDE_SUPPORT_ACADEMIC,
  I_AM_COMFORTABLE_NONACADEMIC,
  DIFFICULT_INTERACTION_BOXES,
  I_PROVIDE_SUPPORT_NONACADEMIC,
  SIMILAR_ANSWER_BOXES,
  IS_LABMEMBER_SETTINGS,
  COLLABORATION_SETTINGS,
  WOULD_ANSWER_SIMILAR_TO_ME_SETTINGS,
  IS_DIFFICULT_TO_INTERACT_WITH

} from "./Settings"

const STORAGEURL = "/ajax";

/*************************************************************************
 * Survey class, acting as the router and logical interface between
 * the different components.
 * 
 * Here callbacks are defined and passed down to the different components.
 * 
 * References:
 * Screen layouts are partially inspired from and based on:
 * http://www.tobiasstark.nl/GENSI/GENSI.htm
 *************************************************************************/
class Survey extends Component
{

  /*************************************************************************
   * The constructor inherits formally from component.
   * Thus it is possible to fetch existing user data from an
   * external source and pass that data along via props.
   * 
   * e.g. nodes:this.props.nodes could be used to fetch existing nodes.
   * @param {*} props 
   *************************************************************************/
  constructor(props)
  {
    super(props);
    //  this.ID = this.props.ID;
    this.state = {
      id: this.props.ID,
      nodes: [],
      links: [],
      foci: [],
      source: -1,
      correction: 0,
      lastClickedNode: 1
    };
    this.prevNodes = [];
    this.prevFoci = [];
  }
  componentDidUpdate()
  {
    console.log("Survey Update", this.state)
    this.transferData()
  }
  //Callback functions

  componentDidMount()
  {
    console.log("Survey Mounted: ", this.state)
    var sessionNodeData = JSON.parse(sessionStorage.getItem('nodeData'));
    var sessionAuthData = JSON.parse(sessionStorage.getItem('authData'));
    if (!sessionNodeData === null)
    {
      this.setState({
        id: sessionAuthData.id,
        nodes: sessionNodeData.nodes,
        links: sessionNodeData.links,
        foci: sessionNodeData.foci
      })
    }
    else
    {
      this.setState({
        nodes: (this.props.nodes.length === 0 ? [returnYouTemplate()] :
          recalculate_nodes(this.props.nodes, recalculate_foci(this.props.foci))),
        links: this.props.links,
        foci: (this.props.foci.length === 0 ? [{ key: 0, x: SVG_WIDTH / 2, y: SVG_HEIGHT / 2 }] : recalculate_foci(this.props.foci)),
      })
    }

  }
  /**************************************************************************
   * Transfer callback. Called by the individual components once a screen is complet ed.
   *************************************************************************/
  transferData = () =>
  {
    sessionStorage.setItem("nodeData", JSON.stringify({ nodes: this.state.nodes, links: this.state.links, foci: this.state.foci }));
    $.ajax({
      url: STORAGEURL,
      method: "Post",
      data: { "ID": this.state.id, "data": JSON.stringify({ nodes: this.state.nodes, links: this.state.links }) },
    })
  }

  //Callback functions

  /*************************************************************************
   * collects previous nodes + positions used to decide type of render
   * @param {[nodes]} nodes PRIOR array of nodes used to decide re-rendering
   * @param {[foci]} foci PRIOR array of foci used to decide re-rendering
   *************************************************************************/
  collectHistory = (nodes, foci) =>
  {
    this.prevNodes = JSON.parse(JSON.stringify(nodes));
    this.prevFoci = JSON.parse(JSON.stringify(foci));
  }

  /*************************************************************************
   * Returns the number of nodes + 1 which have a different value at
   * a specific criterion than the default value.
   * @param {string} key criterion at which to check the default value
   * @param {any} criterion default value for that specific criterion
   * @returns {int} output The next node which still has a default value
   *************************************************************************/
  determineCounterReturn = (nodes, key, criterion) =>
  {
    if (nodes.length === 0 || nodes === null || nodes === undefined)
    {
      console.log("Nodes are null or undefined")
      return;
    }
    else
    {
      let output = nodes[0].key // Skip "You" node
      //  let nodes = this.state.nodes.slice(1);

      if (this.state.correction !== 0)
      {
        return this.state.correction
      }

      for (let i = 0; i < nodes.length; i++)
      {
        if (nodes[i][key] !== criterion)
        {
          var current = nodes[i].key
          if (nodes[i + 1])
          {
            var inc = nodes[i + 1].key
            output = output + (inc - current);
          }
          else
          {
            inc = 0
            output = output + (inc - current);
          }
        }
      }

      return output
    }
  }

  /*************************************************************************
   * Handles changes to existing nodes in the name generator screen.
   * Included cases are: re-naming and deletion of existing node.
   * @param {string} name 
   * @param {[nodes]} nodes 
   * @param {[foci]} foci 
   *************************************************************************/
  handleNodeChange = (name, nodes, foci) =>
  {
    //received edit callback previously
    if (!name)
    {
      // Plan to delete
      if (this.state.links.length > 0)
      {
        alert(DELETE_WARNING);
        this.setState({ correction: 0 });
      } else
      {
        let splicedObjs = removeNodeAt(nodes, foci, this.state.correction);
        foci = splicedObjs.foci;
        nodes = splicedObjs.nodes;
        this.setState({ nodes: nodes, foci: foci, counter: this.state.nodes.length, correction: 0 });
      }
    } else
    {
      //Just rename selected node
      nodes[this.state.correction].name = name;
      this.setState({ nodes: nodes, counter: this.state.nodes.length, correction: 0 });
    }
  }

  deleteNodeCallback = () =>
  {
    console.log("Deleting Node at ", this.state.lastClickedNode)
    let nodes = JSON.parse(JSON.stringify(this.state.nodes));
    let foci = JSON.parse(JSON.stringify(this.state.foci));
    // var name = nodes[this.state.lastClickedNode].name
    if (this.state.correction !== 0)
    {
      let splicedObjs = removeNodeAt(nodes, foci, this.state.correction);
      foci = splicedObjs.foci;
      nodes = splicedObjs.nodes;
      this.setState({ nodes: nodes, foci: foci, counter: this.state.nodes.length, correction: 0 });
      this.pruneLinks(this.state.lastClickedNode)
    }
  }

  renameNodeCallback = (newName) =>
  {
    console.log("Renaming: ", newName)
    let nodes = JSON.parse(JSON.stringify(this.state.nodes));
    if (this.state.correction !== 0)
    {
      if (doesNameOverlap(newName, nodes))
      {
        alert(DUPLICATE_WARNING);
      }
      else if (newName === "")
      {
        alert("A node's name cannot be empty. Please try a valid name.")
      }
      else
      {
        nodes[this.state.lastClickedNode].name = newName
      }
    }
    this.setState({ nodes: nodes, correction: 0 });
  }

  pruneLinks = (nodeID) =>
  {
    var oldLinks = this.state.links
    var newLinks = [];
    for (var i = 0; i < oldLinks.length; i++)
    {
      oldLinks[i].key = i + 1;
    }
    for (var i = 0; i < oldLinks.length; i++)
    {
      if (oldLinks[i].source !== nodeID && oldLinks[i].target !== nodeID)
      {
        newLinks.push(oldLinks[i])
      }
    }
    for (var i = 0; i < newLinks.length; i++)
    {
      if (newLinks[i].source > nodeID)
      {
        newLinks[i].source = newLinks[i].source - 1;
      }
      if (newLinks[i].target > nodeID)
      {
        newLinks[i].target = newLinks[i].target - 1;
      }
    }
    for (var i = 0; i < newLinks.length; i++)
    {
      newLinks[i].key = i + 1;
    }
    this.setState({ links: newLinks })
    this.transferData();
  }

  /*************************************************************************
   * Receives name from lower components and creates a node
   * with all relevant properties
   * @param {String} name passed from NodeButtonComponent
   *************************************************************************/
  createNodesButtonCallback = (name) =>
  {
    let nodes = JSON.parse(JSON.stringify(this.state.nodes));
    let foci = JSON.parse(JSON.stringify(this.state.foci));
    // if (this.state.correction !== 0)
    // {
    //   this.handleNodeChange(name, nodes, foci);
    // }
    // else
    // {
    // Generate new node if name does not exist
    let counter = this.state.nodes.length;
    if (doesNameOverlap(name, nodes))
    {
      alert(DUPLICATE_WARNING);
      return;
    }
    else
    {
      nodes.push(returnTemplateNode(counter, name));
      let coords = rect_layout(counter);

      foci.push({
        key: counter,
        x: coords[0],
        y: coords[1]
      })
      // Push state
      this.setState({ nodes: nodes, foci: foci });
    }
    // }
  }

  /*************************************************************************
   * Keeps track of number of created nodes
   * @param {number} counter to keep track of nodes
   *************************************************************************/
  genericNodesCallback = (counter) =>
  {
    this.setState({ correction: counter });
  }

  /************************************************************************
   * Callback to change the "sex" of a node at a specific index that is 
   * provided.
   * @param {number} counter index for the node
   * Gender settings including the representing color, and the name can be 
   * changed by modifying the GENDERSETTINGS object found in the Utils.js 
   * file.
   ************************************************************************/
  changeSexNodeCallback = (counter) =>
  {
    let nodes = this.state.nodes;

    if (nodes[counter].sex === GENDER_SETTINGS.female.name)
    {
      nodes[counter].sex = GENDER_SETTINGS.male.name;
      nodes[counter].color = GENDER_SETTINGS.male.color;
    }
    else if (nodes[counter].sex === GENDER_SETTINGS.male.name)
    {
      nodes[counter].sex = GENDER_SETTINGS.other.name;
      nodes[counter].color = GENDER_SETTINGS.other.color;
    }
    else
    {
      nodes[counter].sex = GENDER_SETTINGS.female.name;
      nodes[counter].color = GENDER_SETTINGS.female.color;
    }
    this.setState({ nodes: nodes });
  }

  assignLabMemberNodeCallback = (counter) =>
  {
    let nodes = this.state.nodes;

    if (nodes[counter].isLabMember === IS_LABMEMBER_SETTINGS.notLabMember.name || nodes[counter].isLabMember === -1)
    {
      nodes[counter].isLabMember = IS_LABMEMBER_SETTINGS.isLabMember.name;
      nodes[counter].labMemberColor = IS_LABMEMBER_SETTINGS.isLabMember.color;
    }
    else if (nodes[counter].isLabMember === IS_LABMEMBER_SETTINGS.isLabMember.name)
    {
      nodes[counter].isLabMember = IS_LABMEMBER_SETTINGS.notLabMember.name;
      nodes[counter].labMemberColor = IS_LABMEMBER_SETTINGS.notLabMember.color;
    }
    this.setState({ nodes: nodes });
  }

  assignCollaboratorNodeCallback = (counter) =>
  {
    let nodes = this.state.nodes;

    if (nodes[counter].collaboration === COLLABORATION_SETTINGS.supervisor.name)
    {
      nodes[counter].collaboration = COLLABORATION_SETTINGS.committeeMember.name;
      nodes[counter].collaborationColor = COLLABORATION_SETTINGS.committeeMember.color;
    }
    else if (nodes[counter].collaboration === COLLABORATION_SETTINGS.committeeMember.name)
    {
      nodes[counter].collaboration = COLLABORATION_SETTINGS.none.name;
      nodes[counter].collaborationColor = COLLABORATION_SETTINGS.none.color;
    }
    else
    {
      nodes[counter].collaboration = COLLABORATION_SETTINGS.supervisor.name;
      nodes[counter].collaborationColor = COLLABORATION_SETTINGS.supervisor.color;
    }
    this.setState({ nodes: nodes });
  }

  similarAnswersNodeCallback = (counter) =>
  {
    let nodes = this.state.nodes;

    if (nodes[counter].wouldAnswerSimilarToMe === WOULD_ANSWER_SIMILAR_TO_ME_SETTINGS.verySimilar.name)
    {
      nodes[counter].wouldAnswerSimilarToMe = WOULD_ANSWER_SIMILAR_TO_ME_SETTINGS.somewhatSimilar.name;
      nodes[counter].wouldAnswerSimilarToMeColor = WOULD_ANSWER_SIMILAR_TO_ME_SETTINGS.somewhatSimilar.color;
    }
    else if (nodes[counter].wouldAnswerSimilarToMe === WOULD_ANSWER_SIMILAR_TO_ME_SETTINGS.somewhatSimilar.name)
    {
      nodes[counter].wouldAnswerSimilarToMe = WOULD_ANSWER_SIMILAR_TO_ME_SETTINGS.notSimilar.name;
      nodes[counter].wouldAnswerSimilarToMeColor = WOULD_ANSWER_SIMILAR_TO_ME_SETTINGS.notSimilar.color;
    }
    else if (nodes[counter].wouldAnswerSimilarToMe === WOULD_ANSWER_SIMILAR_TO_ME_SETTINGS.notSimilar.name)
    {
      nodes[counter].wouldAnswerSimilarToMe = WOULD_ANSWER_SIMILAR_TO_ME_SETTINGS.noResponse.name;
      nodes[counter].wouldAnswerSimilarToMeColor = WOULD_ANSWER_SIMILAR_TO_ME_SETTINGS.noResponse.color;
    }
    else
    {
      nodes[counter].wouldAnswerSimilarToMe = WOULD_ANSWER_SIMILAR_TO_ME_SETTINGS.verySimilar.name;
      nodes[counter].wouldAnswerSimilarToMeColor = WOULD_ANSWER_SIMILAR_TO_ME_SETTINGS.verySimilar.color;
    }
    this.setState({ nodes: nodes });
  }

  difficultInteractionsNodeCallback = (counter) =>
  {
    let nodes = this.state.nodes;

    if (nodes[counter].difficultToInteractWith === IS_DIFFICULT_TO_INTERACT_WITH.veryDifficult.name)
    {
      nodes[counter].difficultToInteractWith = IS_DIFFICULT_TO_INTERACT_WITH.aLittleDifficult.name;
      nodes[counter].difficultToInteractWithColor = IS_DIFFICULT_TO_INTERACT_WITH.aLittleDifficult.color;
    }
    else if (nodes[counter].difficultToInteractWith === IS_DIFFICULT_TO_INTERACT_WITH.aLittleDifficult.name)
    {
      nodes[counter].difficultToInteractWith = IS_DIFFICULT_TO_INTERACT_WITH.noResponse.name;
      nodes[counter].difficultToInteractWithColor = IS_DIFFICULT_TO_INTERACT_WITH.noResponse.color;
    }
    else
    {
      nodes[counter].difficultToInteractWith = IS_DIFFICULT_TO_INTERACT_WITH.veryDifficult.name;
      nodes[counter].difficultToInteractWithColor = IS_DIFFICULT_TO_INTERACT_WITH.veryDifficult.color;
    }
    this.setState({ nodes: nodes });
  }


  /************************************************************************
   * Determines value displayed next to node on slider screen
   * @param {string} key the key of node found in the Utils.js nodeTemplate
   * @param {number} counter that identifies node
   ************************************************************************/
  sliderUpdateValue = (key, counter) =>
  {
    let value = 1;
    if (counter < this.state.nodes.length)
    {
      if (this.state.nodes[counter][key] !== "")
      {
        value = parseInt(this.state.nodes[counter][key]);
      }
    }
    return value;
  }

  /*************************************************************************
   * Changes specific slider key of a node
   * @param {string} key key of node property
   * @param {number} counter that identifies node
   * @param {number} value
   *************************************************************************/
  changeSliderButtonCallback = (key, counter, value) =>
  {
    //updates background associated with node
    if (counter >= this.state.nodes.length)
    {
      alert(SLIDER_WARNING);
    } else
    {
      let nodes = JSON.parse(JSON.stringify(this.state.nodes));
      nodes[counter][key] = value;
      this.setState({ nodes: nodes, correction: 0 });
    }
  }

  /*************************************************************************
   * Changes specific category key of a node
   * @param {string} key key of node property
   * @param {string} keyColor color key of node property
   * @param {object} categories object containing categories and colors  
   * @param {number} counter that identifies node
   * @param {number} id of category
   * @param {string} category category name
   *************************************************************************/
  changeCategoryButtonCallback = (key, keyColor, categories, counter, id, category) =>
  {
    //updates background associated with node
    if (counter >= this.state.nodes.length)
    {
      alert(CATEGORY_WARNING);
    } else
    {
      let nodes = JSON.parse(JSON.stringify(this.state.nodes));
      nodes[counter][key] = category;
      nodes[counter][keyColor] = categories[id].color;
      this.setState({ nodes: nodes, correction: 0 });
    }
  }

  /*************************************************************************
 * Changes specific category key of a node
 * @param {string} key key of node property
 * @param {object} categories object containing categories and colors  
 * @param {number} counter that identifies node
 * @param {number} id of category
 * @param {string} category category name
 *************************************************************************/
  changeAgeCategoryButtonCallback = (key, keyColor, categories, counter, id, category) =>
  {
    //updates background associated with node
    if (counter >= this.state.nodes.length)
    {
      alert(CATEGORY_WARNING);
    } else
    {
      let nodes = JSON.parse(JSON.stringify(this.state.nodes));
      nodes[counter][key] = category;
      // nodes[counter][keyColor] = categories[id].color;
      this.setState({ nodes: nodes, correction: 0 });
    }
  }

  /*************************************************************************
* Changes specific category key of a node
* @param {string} key key of node property
* @param {object} categories object containing categories and colors  
* @param {number} counter that identifies node
* @param {number} id of category
* @param {string} category category name
*************************************************************************/
  multiCategoryButtonCallback = (key, keyColor, categories, counter, id, category) =>
  {
    //updates background associated with node
    if (counter >= this.state.nodes.length)
    {
      alert(CATEGORY_WARNING);
    } else
    {
      let nodes = JSON.parse(JSON.stringify(this.state.nodes));
      if (nodes[counter][key] !== undefined)
      {
        if (nodes[counter][key].includes(category))
        {
          var index = nodes[counter][key].indexOf(category);
          if (index !== -1)
          {
            nodes[counter][key].splice(index, 1);
          }
        }
        else
        {
          var temp = nodes[counter][key]
          temp.push(category);
          nodes[counter][key] = temp
        }
      }
      // nodes[counter][keyColor] = categories[id].color;
      this.setState({ nodes: nodes, correction: 0 });
    }
  }
  /*************************************************************************
   * Changes specific continuous key of a node
   * @param {string} key key of node property
   * @param {number} id of node
   * @param {number} x coordinate
   * @param {number} y coordinate
   *************************************************************************/
  continuousGenericCallback = (key, id, x, y) =>
  {
    //collects final placement when drag has ended

    let value = (x - NODE_RADIUS) / AVB_WIDTH;
    value = Math.max(0.00, value);
    value = Math.min(1.00, value);
    let nodes = this.state.nodes;
    nodes[id].fixedPosX = x;
    nodes[id][key] = value;
    this.setState({ nodes: nodes });
  }

  /*************************************************************************
   * Switches a boolean property of a specific node.
   * @param {string} key property/criterion of a node
   * @param {number} counter index of a node
   *************************************************************************/
  booleanNodeCallback = (key, counter) =>
  {
    let nodes = this.state.nodes;

    if (nodes[counter][key])
    {
      nodes[counter][key] = false;
    } else
    {
      nodes[counter][key] = true;
    }
    this.setState({ nodes: nodes });
  }

  /*************************************************************************
  * Calculates links between nodes and sets properties for static/dynamic 
  * rendering
  * When a source is set below, a snapshot of the network is created
  *  and the nodes are fixed using foci. When a link is popped or created
  *  the nodes are allowed to float to find their position again.
  * @param {number} counter received from Graph
  * @param {[nodes]} callBackNodes received from Graph - copy of nodes
    for rendering purposes of the network constant position
    information is necessary for X and Y coordinates. They are
    stored in floatX and floatY respectively and are used by the
    network/node view render defined below to update the foci.
   *************************************************************************/
  networkNodesCallback = (counter, callBackNodes) =>
  {

    let links = JSON.parse(JSON.stringify(this.state.links));
    let nodes = JSON.parse(JSON.stringify(this.state.nodes));
    let forceNodes = callBackNodes;

    if (MOBILE)
    {
      // Mobile handling
      forceNodes = [returnYouTemplate()].concat(callBackNodes);
    }

    let source = this.state.source;

    if (source === 0 || counter === 0)
    {
      // prevent connections to anchor "you" node
      source = -1;
      this.setState({ source: source })
    } else
    {

      if (source === -1)
      {
        // Initializing source

        for (let i = 0; i < nodes.length; ++i)
        {
          nodes[i].floatX = forceNodes[i].x;
          nodes[i].floatY = forceNodes[i].y;
          nodes[i].shouldFloat = false;
        }
        this.setState({ source: counter, nodes: nodes });
      } else
      {
        // Source exists check for links
        if (source !== counter)
        {

          let linkTest = hasLinkAt(links, source, counter);

          if (linkTest.hasLink)
          {
            // has link - break
            links.splice(linkTest.linkAt, 1);
            nodes[source].link -= 1;
            nodes[counter].link -= 1;

          } else
          {
            // has no link - create
            links.push({
              key: (links[links.length - 1] ? links[links.length - 1].key + 1 : 1),
              source: source,
              target: counter
            });
            nodes[source].link += 1;
            nodes[counter].link += 1;

          }
          // determine properties for rendering decision e.g. static vs. dynamic
          updateNodeRenderProps(nodes, forceNodes);
        }

        // reset source
        if (MOBILE)
        {
          source = (source === counter ? -1 : source);
        } else
        {
          source = -1;
        }
        this.setState({ source: source, nodes: nodes, links: links });
      }
    }
  }

  /*************************************************************************
   * Callback used for determining the final placement of a node after being 
   * dragged
   * @param {key}: The Node state key that you want to update
   * @param {id}: The node id that you would like to update the key of.
   * @param {x}: The x coordinate of the nodes final dragged position.
   * @param {y}: The y coodrinate of the Nodes final dragged position.
   *************************************************************************/
  continuousGenericCallback = (key, id, x, y) =>
  {
    //collects final placement when drag has ended
    let value = (x - NODE_RADIUS) / AVB_WIDTH;
    value = Math.max(0.00, value);
    value = Math.min(1.00, value);
    let nodes = this.state.nodes;
    nodes[id].fixedPosX = x;
    nodes[id][key] = value;
    this.setState({ nodes: nodes });
  }

  /*************************************************************************
   * Function handles the cllback for node drag-and-drop functionality for
   * boxes.
   * @param {array} params: an array that should contain two elements:
   *    a node key: The key you wish to change the value of when dragging a 
   *    node into a box.
   *    a Boxes object: The boxes should be a defined object in Settings.js
   * @param {number} id: the Node ID that is being dragged.
   * @param {number} x: the node X coordinate.
   * @param {number} y: the node Y coordinate.
   *************************************************************************/
  placeBoxDragCallback = (params, id, x, y) =>
  {
    let key = params[0]
    let boxes = params[1]
    let dependencies = params[2]

    //collects final placement when drag has ended
    // let nodes = JSON.parse(JSON.stringify(this.state.nodes));
    let nodes = this.state.nodes

    var initialKeyVal = nodes[id][key]
    for (let i = 0; i < boxes.length; ++i)
    {
      if (x >= boxes[i].x &&
        x <= boxes[i].x + boxes[i].width &&
        y >= boxes[i].y &&
        y <= boxes[i].y + boxes[i].height)
      {

        nodes[id].fixedPosX = x;
        nodes[id].fixedPosY = y;
        if (boxes[i].value)
        {
          nodes[id][key] = boxes[i].value;
          nodes[id].border = boxes[i].color
        }
        else
        {
          nodes[id][key] = boxes[i].text;
          nodes[id].border = boxes[i].color
        }

        // If a node with an existing Key is set, any dependant fields should be cleared. 
        // For example, If a node is changed from academic to non-academic, it should lose the academicSubCategory
        if (initialKeyVal !== "")
        {
          if (nodes[id][key] !== initialKeyVal)
          {
            for (let i = 0; i < dependencies.length; i++)
            {
              nodes[id][dependencies[i]] = ''
              nodes[id]['categoryColor'] = "#FFFFFF"
            }
          }
        }

        // this.sendData(id, "node", nodes, ajax);
        this.transferData()
        this.setState({ nodes: nodes });
        return;
      }
    }
    console.log("Not in a box", nodes[id])
    nodes[id].fixedPosX = x;
    nodes[id].fixedPosY = y;
    nodes[id].border = "#FFFFFF"
    this.setState({ nodes: nodes });
  }

  setLastClickedNode = (val) =>
  {
    console.log("setting last Clicked Node: ", typeof (Number(val)))

    this.setState({ lastClickedNode: Number(val) })
  }
  render()
  {
    return (
      <HashRouter basename="/">
        <div>
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="/">Gentle-1.1</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
                <NavItem title="Introduction">
                  <NavLink className="nav-link" exact to="/">
                    Introduction
                  </NavLink>
                </NavItem>
                <NavItem title="Question 1">
                  <NavLink className="nav-link" exact to="/Question_1">
                    Q1. Name Generation Example Screen.
                  </NavLink>
                </NavItem>
                <NavItem title={this.state.nodes.length > MIN_ALTERS ? "Question 2" : "Please add " + MIN_ALTERS + " individuals to access this question."}>
                  <NavLink className={this.state.nodes.length > MIN_ALTERS ? "nav-link" : "nav-link unavailable"} exact to="/Question_2" style={{ color: "red !important" }}>
                    Q2. Select a Gender For Each Individual
                  </NavLink>
                </NavItem>
                <NavItem title={this.state.nodes.length > MIN_ALTERS ? "Question 3" : "Please add " + MIN_ALTERS + " individuals to access this question."}>
                  <NavLink className={this.state.nodes.length > MIN_ALTERS ? "nav-link" : "nav-link unavailable"} exact to="/Question_3">
                    Q3. Assign an Age for Each Individual
                  </NavLink>
                </NavItem>
                <NavItem title={this.state.nodes.length > MIN_ALTERS ? "Question 4" : "Please add " + MIN_ALTERS + " individuals to access this question."}>
                  <NavLink className={this.state.nodes.length > MIN_ALTERS ? "nav-link" : "nav-link unavailable"} exact to="/Question_4">
                    Q4. Assign Individual's Cultural Background
                  </NavLink>
                </NavItem>
                {/* <NavItem title={this.state.nodes.length > MIN_ALTERS ? "Question 5a" : "Please add " + MIN_ALTERS + " individuals to access this question."}>
                  <NavLink className={this.state.nodes.length > MIN_ALTERS ? "nav-link" : "nav-link unavailable"} exact to="/Question_5_a">
                    Q5. a) Assign Alters Academic or Non-academic
                  </NavLink>
                </NavItem> */}
                <NavItem title={this.state.nodes.length > MIN_ALTERS ? "Question 5" : "Please add " + MIN_ALTERS + " individuals to access this question."}>
                  <NavLink className={this.state.nodes.length > MIN_ALTERS ? "nav-link" : "nav-link unavailable"} exact to="/Question_5">
                    Q5. Assign Academic Role
                  </NavLink>
                </NavItem>
                {/* <NavItem title={this.state.nodes.length > MIN_ALTERS ? "Question 5c" : "Please add " + MIN_ALTERS + " individuals to access this question."}>
                  <NavLink className={this.state.nodes.length > MIN_ALTERS ? "nav-link" : "nav-link unavailable"} exact to="/Question_5_c">
                    Q5. c) Assign Categories for Non-Academics
                  </NavLink>
                </NavItem> */}
                <NavItem title={this.state.nodes.length > MIN_ALTERS ? "Question 6" : "Please add " + MIN_ALTERS + " individuals to access this question."}>
                  <NavLink className={this.state.nodes.length > MIN_ALTERS ? "nav-link" : "nav-link unavailable"} exact to="/Question_6">
                    Q6. Select Lab Members
                  </NavLink>
                </NavItem>
                <NavItem title={this.state.nodes.length > MIN_ALTERS ? "Question 7" : "Please add " + MIN_ALTERS + " individuals to access this question."}>
                  <NavLink className={this.state.nodes.length > MIN_ALTERS ? "nav-link" : "nav-link unavailable"} exact to="/Question_7">
                    Q7. Select Supervisor(s)/Committee Member(s)
                  </NavLink>
                </NavItem>
                <NavItem title={this.state.nodes.length > MIN_ALTERS ? "Question 8" : "Please add " + MIN_ALTERS + " individuals to access this question."}>
                  <NavLink className={this.state.nodes.length > MIN_ALTERS ? "nav-link" : "nav-link unavailable"} exact to="/Question_8">
                    Q8. Is There Anyone You Feel Comfortable Talking With About Personal Non-Academic Matters?
                  </NavLink>
                </NavItem>
                <NavItem title={this.state.nodes.length > MIN_ALTERS ? "Question 9" : "Please add " + MIN_ALTERS + " individuals to access this question."}>
                  <NavLink className={this.state.nodes.length > MIN_ALTERS ? "nav-link" : "nav-link unavailable"} exact to="/Question_9">
                    Q9. Do You Provide Support To Help Others With Personal Non-Academic Matters?
                  </NavLink>
                </NavItem>
                <NavItem title={this.state.nodes.length > MIN_ALTERS ? "Question 10" : "Please add " + MIN_ALTERS + " individuals to access this question."}>
                  <NavLink className={this.state.nodes.length > MIN_ALTERS ? "nav-link" : "nav-link unavailable"} exact to="/Question_10">
                    Q10. Comfort Level Discussing Your Personal Life With Others
                  </NavLink>
                </NavItem>
                {/* <NavItem title={this.state.nodes.length > MIN_ALTERS ? "Question 9" : "Please add " + MIN_ALTERS + " individuals to access this question."}>
                  <NavLink className={this.state.nodes.length > MIN_ALTERS ? "nav-link" : "nav-link unavailable"} exact to="/Question_9">
                    Q9. Select Individuals Who You Would Like More Technical Support From
                  </NavLink>
                </NavItem> */}
                <NavItem title={this.state.nodes.length > MIN_ALTERS ? "Question 11" : "Please add " + MIN_ALTERS + " individuals to access this question."}>
                  <NavLink className={this.state.nodes.length > MIN_ALTERS ? "nav-link" : "nav-link unavailable"} exact to="/Question_11">
                    Q11. Do You Provide Support To Individuals About Personal Failure, Disappointment, or Struggle in Their Academic Work?
                  </NavLink>
                </NavItem>
                <NavItem title={this.state.nodes.length > MIN_ALTERS ? "Question 12" : "Please add " + MIN_ALTERS + " individuals to access this question."}>
                  <NavLink className={this.state.nodes.length > MIN_ALTERS ? "nav-link" : "nav-link unavailable"} exact to="/Question_12">
                    Q12. Does Anyone Below Provide Or Would Be Willing To Provide Academic Support To You?
                  </NavLink>
                </NavItem>
                <NavItem title={this.state.nodes.length > MIN_ALTERS ? "Question 13" : "Please add " + MIN_ALTERS + " individuals to access this question."}>
                  <NavLink className={this.state.nodes.length > MIN_ALTERS ? "nav-link" : "nav-link unavailable"} exact to="/Question_13">
                    Q13. Do You Provide Or Would Be Willing To Provide Academic Support To Anyone Below?
                  </NavLink>
                </NavItem>
                <NavItem title={this.state.nodes.length > MIN_ALTERS ? "Question 14" : "Please add " + MIN_ALTERS + " individuals to access this question."}>
                  <NavLink className={this.state.nodes.length > MIN_ALTERS ? "nav-link" : "nav-link unavailable"} exact to="/Question_14">
                    Q14. Who Do You Find It Difficult Interacting With?
                  </NavLink>
                </NavItem>
                <NavItem title={this.state.nodes.length > MIN_ALTERS ? "Question 15" : "Please add " + MIN_ALTERS + " individuals to access this question."}>
                  <NavLink className={this.state.nodes.length > MIN_ALTERS ? "nav-link" : "nav-link unavailable"} exact to="/Question_15">
                    Q15. Who Do You Think Would Closely Match Your Responses To This Survey?
                  </NavLink>
                </NavItem>
                <NavItem title={this.state.nodes.length > MIN_ALTERS ? "Question 16" : "Please add " + MIN_ALTERS + " individuals to access this question."}>
                  <NavLink className={this.state.nodes.length > MIN_ALTERS ? "nav-link" : "nav-link unavailable"} exact to="/Question_16">
                    Q16. Assign Social Network Connections
                  </NavLink>
                </NavItem>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <div id="content" className="content container">
            <Route exact path="/" component={
              () => <Introduction textDescription={INTRODUCTION_TEXT}
                route={"Question_1"}
              />
            } />
            {/* Route for question 1: Creating alters */}
            <Route exact path="/Question_1" component={
              () => <NodeButtonComponent nodes={this.state.nodes.slice(1)}
                route={"/Question_2"}
                max={MAX_ALTERS}
                prevNodes={this.prevNodes}
                counter={this.state.nodes.length}
                links={[]}
                foci={this.state.foci.slice(1)}
                prevFoci={this.prevFoci}
                callBackNodes={this.genericNodesCallback.bind(this)}
                callBackButton={this.createNodesButtonCallback.bind(this)}
                collectHistory={this.collectHistory.bind(this)}
                textDescription={SURVEY_QUESTIONS[0]}
                transferCallBack={this.transferData.bind(this)}
                lastClickedNodeCallback={this.setLastClickedNode.bind(this)}
                lastClickedNode={this.state.lastClickedNode}
                deleteNodeCallback={this.deleteNodeCallback.bind(this)}
                renameNodeCallback={this.renameNodeCallback.bind(this)}
                correction={this.state.correction}
              />
            } />
            {/* Route for question 2: Selecting gender for your alters.
            */}
            {this.state.nodes.length > MIN_ALTERS ?
              <div>
                <Route exact path="/Question_2" component={
                  () => <NodeComponent nodes={this.state.nodes.slice(1)}
                    route={"/Question_3"}
                    prevNodes={this.prevNodes}
                    counter={-1}
                    links={[]}
                    foci={this.state.foci.slice(1)}
                    prevFoci={this.prevFoci}
                    callBackNodes={this.changeSexNodeCallback.bind(this)}
                    collectHistory={this.collectHistory.bind(this)}
                    textDescription={SURVEY_QUESTIONS[1]}
                    transferCallBack={this.transferData.bind(this)}
                    legend={
                      null
                    }
                    lastClickedNodeCallback={this.setLastClickedNode.bind(this)}
                    lastClickedNode={this.state.lastClickedNode}
                  />
                } />
                {/* Route for Question 3: Assigning Age */}
                {/* <Route exact path="/survey/Question_3" component={
                  () => <NodeSliderComponent nodes={this.state.nodes.slice(1)}
                    route={"/survey/Question_4_a"}
                    prevNodes={this.prevNodes}
                    counter={this.determineCounterReturn(this.state.nodes.slice(1), "age", "")}
                    sliderUpdateValue={this.sliderUpdateValue("age", 1)}
                    links={[]}
                    foci={this.state.foci.slice(1)}
                    prevFoci={this.prevFoci}
                    callBackNodes={this.genericNodesCallback.bind(this)}
                    callBackButton={[this.changeSliderButtonCallback.bind(this), "age"]}
                    collectHistory={this.collectHistory.bind(this)}
                    textDescription={SURVEY_QUESTIONS[2]}
                    transferCallBack={this.transferData.bind(this)}
                    lastClickedNodeCallback={this.setLastClickedNode.bind(this)}
                  />
                } /> */}
                <Route exact path="/Question_3" component={
                  () =>
                    <NodeCategoriesComponent nodes={this.state.nodes.slice(1)}
                      route={"/Question_4"}
                      prevNodes={this.prevNodes}
                      counter={this.determineCounterReturn(this.state.nodes.slice(1), "age", "")}
                      // sliderUpdateValue={this.sliderUpdateValue("age", 1)}
                      links={[]}
                      categories={AGE_CATEGORIES}
                      foci={this.state.foci.slice(1)}
                      prevFoci={this.prevFoci}
                      callBackNodes={this.genericNodesCallback.bind(this)}
                      callBackButton={[this.changeAgeCategoryButtonCallback.bind(this), "age", null, AGE_CATEGORIES]}
                      // callBackButton={[this.changeSliderButtonCallback.bind(this), "age"]}
                      collectHistory={this.collectHistory.bind(this)}
                      textDescription={SURVEY_QUESTIONS[2]}
                      transferCallBack={this.transferData.bind(this)}
                      lastClickedNodeCallback={this.setLastClickedNode.bind(this)}
                      textToApply={'age'}
                    />
                } />
                {/* Question 3 has been re-done to use the category components to assign age, rather than an input field. 
                  Now matches the question format for GENTLE_question_format_v5
                */}
                <Route exact path="/Question_4" component={
                  () =>
                    <NodeCategoriesComponent nodes={this.state.nodes.slice(1)}
                      route={"/Question_5"}
                      prevNodes={this.prevNodes}
                      counter={this.determineCounterReturn(this.state.nodes.slice(1), "culture", "")}
                      sliderUpdateValue={this.sliderUpdateValue("culture", 1)}
                      links={[]}
                      categories={CULTURAL_CATEGORIES}
                      foci={this.state.foci.slice(1)}
                      prevFoci={this.prevFoci}
                      callBackNodes={this.genericNodesCallback.bind(this)}
                      callBackButton={[this.multiCategoryButtonCallback.bind(this), "culture", null, CULTURAL_CATEGORIES]}
                      // callBackButton={[this.changeSliderButtonCallback.bind(this), "age"]}
                      collectHistory={this.collectHistory.bind(this)}
                      textDescription={SURVEY_QUESTIONS[3]}
                      transferCallBack={this.transferData.bind(this)}
                      lastClickedNodeCallback={this.setLastClickedNode.bind(this)}
                      textToApply={'culture'}
                      multiText={true}
                    // graphMultiCategory={true}
                    />
                } />


                {/* Route for Question 4a: Assigning academic/non-academic */}
                {/* <Route exact path="/Question_5_a" component={
                  () => <NodeComponent fixed={1}
                    nodes={this.state.nodes.slice(1).map((node, i) => (
                      {
                        key: node.key,
                        name: node.name,
                        size: node.size,
                        fixed: true,
                        color: node.color,
                        sex: node.sex,
                        age: node.age,
                        categoryColor: node.categoryColor,
                        border: node.academic === -1 ? "#FFFFFF" : node.border,
                        fixedPosY: node.y,
                        x: node.academic === -1 ? (SVG_WIDTH * 0.1 - NODE_RADIUS) + ((NODE_RADIUS * 2) + ((SVG_WIDTH * 0.8 / 4) * ((node.key - 1) % 5))) : node.fixedPosX,
                        y: node.academic === -1 ? ((Math.floor((node.key - 1) / 5) * (NODE_RADIUS * 2)) + (NODE_RADIUS)) : node.fixedPosY,
                      }
                    ))}

                    route={"/Question_5"}
                    prevNodes={this.prevNodes}
                    counter={-1}
                    // counter={this.determineCounterReturn(this.state.nodes.slice(1), "academic", "")}
                    links={[]}
                    foci={this.state.foci.slice(1)}
                    prevFoci={this.prevFoci}
                    callBackNodes={[this.placeBoxDragCallback.bind(this), ['academic', ACADEMIC_BOXES, ["academicSubCategory"]]]}
                    collectHistory={this.collectHistory.bind(this)}
                    textDescription={SURVEY_QUESTIONS[4]}
                    transferCallBack={this.transferData.bind(this)}
                    legend={null}
                    categories={ACADEMIC_BOXES}
                    lastClickedNodeCallback={this.setLastClickedNode.bind(this)}
                    lastClickedNode={this.state.lastClickedNode}
                  />
                } /> */}
                {/* Route for Question 4 b, Academic Subcategory */}
                <Route exact path="/Question_5" component={
                  () =>
                    // <NodeCategoriesComponent nodes={filterNodes(this.state.nodes, 'academic', "academic")}
                    <NodeCategoriesComponent nodes={this.state.nodes.slice(1)}
                      route={"/Question_6"}
                      prevNodes={this.prevNodes}
                      // counter={this.determineCounterReturn(filterNodes(this.state.nodes, 'academic', "academic"), "academicSubCategory", "")}
                      counter={this.determineCounterReturn(this.state.nodes, 'academic', "")}
                      links={[]}
                      categories={ACADEMIC_SUBCATEGORIES}
                      foci={this.state.foci.slice(1)}
                      prevFoci={this.prevFoci}
                      callBackNodes={this.genericNodesCallback.bind(this)}
                      callBackButton={[this.changeCategoryButtonCallback.bind(this), "academicSubCategory", "categoryColor", ACADEMIC_SUBCATEGORIES]}
                      collectHistory={this.collectHistory.bind(this)}
                      textDescription={SURVEY_QUESTIONS[5]}
                      transferCallBack={this.transferData.bind(this)}
                      lastClickedNodeCallback={this.setLastClickedNode.bind(this)}
                      textToApply={'academicSubCategory'}
                    />
                } />
                {/* Route for Question 4 c, non-academic subcategory */}
                {/* <Route exact path="/Question_5_c" component={
                  () => <NodeCategoriesComponent nodes={filterNodes(this.state.nodes, 'academic', "non-academic")}
                    route={"/Question_6"}
                    prevNodes={this.prevNodes}
                    counter={this.determineCounterReturn(filterNodes(this.state.nodes, 'academic', "non-academic"), "nonAcademicSubCategory", "")}
                    links={[]}
                    categories={NONACADEMIC_SUBCATEGORIES}
                    foci={this.state.foci.slice(1)}
                    prevFoci={this.prevFoci}
                    callBackNodes={this.genericNodesCallback.bind(this)}
                    callBackButton={[this.changeCategoryButtonCallback.bind(this), "nonAcademicSubCategory", "categoryColor", NONACADEMIC_SUBCATEGORIES]}
                    collectHistory={this.collectHistory.bind(this)}
                    textDescription={SURVEY_QUESTIONS[6]}
                    transferCallBack={this.transferData.bind(this)}
                    lastClickedNodeCallback={this.setLastClickedNode.bind(this)}
                  />
                } /> */}
                {/* Route for Question 5: Assigning Lab Members */}
                {/* <Route exact path="/Question_6" component={
                  () => <NodeComponent fixed={1}
                    nodes={this.state.nodes.slice(1).map((node, i) => (
                      {
                        key: node.key,
                        name: node.name,
                        size: node.size,
                        fixed: true,
                        color: node.color,
                        sex: node.sex,
                        age: node.age,
                        categoryColor: node.categoryColor,
                        border: node.isLabMember === -1 ? "#FFFFFF" : node.border,
                        fixedPosY: node.y,
                        x: node.isLabMember === -1 ? (SVG_WIDTH * 0.1 - NODE_RADIUS) + ((NODE_RADIUS * 2) + ((SVG_WIDTH * 0.8 / 4) * ((node.key - 1) % 5))) : node.fixedPosX,
                        y: node.isLabMember === -1 ? ((Math.floor((node.key - 1) / 5) * (NODE_RADIUS * 2)) + (NODE_RADIUS)) : node.fixedPosY,
                      }
                    ))}
                    route={"/Question_7"}
                    prevNodes={this.prevNodes}
                    counter={-1}
                    // counter={this.determineCounterReturn(this.state.nodes.slice(1), "academic", "")}
                    links={[]}
                    foci={this.state.foci.slice(1)}
                    prevFoci={this.prevFoci}
                    callBackNodes={[this.placeBoxDragCallback.bind(this), ['isLabMember', LAB_MEMBER_BOX, []]]}
                    collectHistory={this.collectHistory.bind(this)}
                    textDescription={SURVEY_QUESTIONS[7]}
                    transferCallBack={this.transferData.bind(this)}
                    legend={null}
                    categories={LAB_MEMBER_BOX}
                    lastClickedNodeCallback={this.setLastClickedNode.bind(this)}
                    lastClickedNode={this.state.lastClickedNode}
                  />
                } /> */}
                <Route exact path="/Question_6" component={
                  () => <NodeComponent nodes={this.state.nodes.slice(1)}
                    route={"/Question_7"}
                    prevNodes={this.prevNodes}
                    counter={-1}
                    links={[]}
                    foci={this.state.foci.slice(1)}
                    prevFoci={this.prevFoci}
                    callBackNodes={this.assignLabMemberNodeCallback.bind(this)}
                    collectHistory={this.collectHistory.bind(this)}
                    textDescription={SURVEY_QUESTIONS[7]}
                    transferCallBack={this.transferData.bind(this)}
                    legend={
                      null
                    }
                    colorOveride={"labMemberColor"}
                    lastClickedNodeCallback={this.setLastClickedNode.bind(this)}
                    lastClickedNode={this.state.lastClickedNode}
                  />
                } />
                {/* Route for Question 6: Who would you like to colaborate with */}
                {/* <Route exact path="/Question_7" component={
                  () => <NodeComponent fixed={1}
                    nodes={this.state.nodes.slice(1).map((node, i) => (
                      {
                        key: node.key,
                        name: node.name,
                        size: node.size,
                        fixed: true,
                        color: node.color,
                        sex: node.sex,
                        age: node.age,
                        categoryColor: node.categoryColor,
                        border: node.collaboration === -1 ? "#FFFFFF" : node.border,
                        fixedPosY: node.y,
                        x: node.collaboration === -1 ? (SVG_WIDTH * 0.1 - NODE_RADIUS) + ((NODE_RADIUS * 2) + ((SVG_WIDTH * 0.8 / 4) * ((node.key - 1) % 5))) : node.fixedPosX,
                        y: node.collaboration === -1 ? ((Math.floor((node.key - 1) / 5) * (NODE_RADIUS * 2)) + (NODE_RADIUS)) : node.fixedPosY,
                      }
                    ))}
                    route={"/Question_8"}
                    prevNodes={this.prevNodes}
                    counter={-1}
                    // counter={this.determineCounterReturn(this.state.nodes.slice(1), "academic", "")}
                    links={[]}
                    foci={this.state.foci.slice(1)}
                    prevFoci={this.prevFoci}
                    callBackNodes={[this.placeBoxDragCallback.bind(this), ['collaboration', COLLABORATOR_BOXES, []]]}
                    collectHistory={this.collectHistory.bind(this)}
                    textDescription={SURVEY_QUESTIONS[8]}
                    transferCallBack={this.transferData.bind(this)}
                    legend={null}
                    categories={COLLABORATOR_BOXES}
                    lastClickedNodeCallback={this.setLastClickedNode.bind(this)}
                    lastClickedNode={this.state.lastClickedNode}
                  />
                } /> */}

                <Route exact path="/Question_7" component={
                  () => <NodeComponent nodes={this.state.nodes.slice(1)}
                    route={"/Question_8"}
                    prevNodes={this.prevNodes}
                    counter={-1}
                    links={[]}
                    foci={this.state.foci.slice(1)}
                    prevFoci={this.prevFoci}
                    callBackNodes={this.assignCollaboratorNodeCallback.bind(this)}
                    collectHistory={this.collectHistory.bind(this)}
                    textDescription={SURVEY_QUESTIONS[8]}
                    transferCallBack={this.transferData.bind(this)}
                    legend={
                      null
                    }
                    colorOveride={"collaborationColor"}
                    lastClickedNodeCallback={this.setLastClickedNode.bind(this)}
                    lastClickedNode={this.state.lastClickedNode}
                  />
                } />

                                {/* Question 12: Is there anyone below that you feel comfortable talking with about personal, non-academic matters? */}
                                <Route exact path="/Question_8" component={
                  () => <NodeComponent fixed={1}
                    nodes={this.state.nodes.slice(1).map((node, i) => (
                      {
                        key: node.key,
                        name: node.name,
                        size: node.size,
                        fixed: true,
                        color: node.color,
                        sex: node.sex,
                        age: node.age,
                        categoryColor: node.categoryColor,
                        border: node.iAmComfortable_Personal_NonAcademic === -1 ? "#FFFFFF" : node.border,
                        fixedPosY: node.y,
                        x: node.iAmComfortable_Personal_NonAcademic === -1 ? (SVG_WIDTH * 0.1 - NODE_RADIUS) + ((NODE_RADIUS * 2) + ((SVG_WIDTH * 0.8 / 4) * ((node.key - 1) % 5))) : node.fixedPosX,
                        y: node.iAmComfortable_Personal_NonAcademic === -1 ? ((Math.floor((node.key - 1) / 5) * (NODE_RADIUS * 2)) + (NODE_RADIUS)) : node.fixedPosY,
                      }
                    ))}
                    route={"/Question_9"}
                    prevNodes={this.prevNodes}
                    counter={-1}
                    // counter={this.determineCounterReturn(this.state.nodes.slice(1), "academic", "")}
                    links={[]}
                    foci={this.state.foci.slice(1)}
                    prevFoci={this.prevFoci}
                    callBackNodes={[this.placeBoxDragCallback.bind(this), ['iAmComfortable_Personal_NonAcademic', I_AM_COMFORTABLE_NONACADEMIC, []]]}
                    collectHistory={this.collectHistory.bind(this)}
                    textDescription={SURVEY_QUESTIONS[9]}
                    transferCallBack={this.transferData.bind(this)}
                    legend={null}
                    categories={I_AM_COMFORTABLE_NONACADEMIC}
                    lastClickedNodeCallback={this.setLastClickedNode.bind(this)}
                    lastClickedNode={this.state.lastClickedNode}
                  />
                } />
                {/* Question 13: Do you provide (or would be willing to provide) support to help others with personal, non-academic matters? */}
                <Route exact path="/Question_9" component={
                  () => <NodeComponent fixed={1}
                    nodes={this.state.nodes.slice(1).map((node, i) => (
                      {
                        key: node.key,
                        name: node.name,
                        size: node.size,
                        fixed: true,
                        color: node.color,
                        sex: node.sex,
                        age: node.age,
                        categoryColor: node.categoryColor,
                        border: node.iProvideSupport_Personal_NonAcademic === -1 ? "#FFFFFF" : node.border,
                        fixedPosY: node.y,
                        x: node.iProvideSupport_Personal_NonAcademic === -1 ? (SVG_WIDTH * 0.1 - NODE_RADIUS) + ((NODE_RADIUS * 2) + ((SVG_WIDTH * 0.8 / 4) * ((node.key - 1) % 5))) : node.fixedPosX,
                        y: node.iProvideSupport_Personal_NonAcademic === -1 ? ((Math.floor((node.key - 1) / 5) * (NODE_RADIUS * 2)) + (NODE_RADIUS)) : node.fixedPosY,
                      }
                    ))}
                    route={"/Question_10"}
                    prevNodes={this.prevNodes}
                    counter={-1}
                    // counter={this.determineCounterReturn(this.state.nodes.slice(1), "academic", "")}
                    links={[]}
                    foci={this.state.foci.slice(1)}
                    prevFoci={this.prevFoci}
                    callBackNodes={[this.placeBoxDragCallback.bind(this), ['iProvideSupport_Personal_NonAcademic', I_PROVIDE_SUPPORT_NONACADEMIC, []]]}
                    collectHistory={this.collectHistory.bind(this)}
                    textDescription={SURVEY_QUESTIONS[10]}
                    transferCallBack={this.transferData.bind(this)}
                    legend={null}
                    categories={I_PROVIDE_SUPPORT_NONACADEMIC}
                    lastClickedNodeCallback={this.setLastClickedNode.bind(this)}
                    lastClickedNode={this.state.lastClickedNode}
                  />
                } />
                {/* Question 7: Who Provides you with Technical Support */}
                <Route exact path="/Question_10" component={
                  () => <NodeComponent fixed={1}
                    nodes={this.state.nodes.slice(1).map((node, i) => (
                      {
                        key: node.key,
                        name: node.name,
                        size: node.size,
                        fixed: true,
                        color: node.color,
                        sex: node.sex,
                        age: node.age,
                        categoryColor: node.categoryColor,
                        border: node.providesMeSupport_Technical === -1 ? "#FFFFFF" : node.border,
                        fixedPosY: node.y,
                        x: node.providesMeSupport_Technical === -1 ? (SVG_WIDTH * 0.1 - NODE_RADIUS) + ((NODE_RADIUS * 2) + ((SVG_WIDTH * 0.8 / 4) * ((node.key - 1) % 5))) : node.fixedPosX,
                        y: node.providesMeSupport_Technical === -1 ? ((Math.floor((node.key - 1) / 5) * (NODE_RADIUS * 2)) + (NODE_RADIUS)) : node.fixedPosY,
                      }
                    ))}
                    route={"/Question_11"}
                    prevNodes={this.prevNodes}
                    counter={-1}
                    // counter={this.determineCounterReturn(this.state.nodes.slice(1), "academic", "")}
                    links={[]}
                    foci={this.state.foci.slice(1)}
                    prevFoci={this.prevFoci}
                    callBackNodes={[this.placeBoxDragCallback.bind(this), ['providesMeSupport_Technical', PROVIDES_ME_TECHNICAL_SUPPORT, []]]}
                    collectHistory={this.collectHistory.bind(this)}
                    textDescription={SURVEY_QUESTIONS[11]}
                    transferCallBack={this.transferData.bind(this)}
                    legend={null}
                    lastClickedNodeCallback={this.setLastClickedNode.bind(this)}
                    lastClickedNode={this.state.lastClickedNode}
                    categories={PROVIDES_ME_TECHNICAL_SUPPORT}
                  />
                } />
                {/* Question 8: Who would you like more support from? */}
                {/* <Route exact path="/Question_9" component={
                  () => <NodeComponent fixed={1}
                    nodes={this.state.nodes.slice(1).map((node, i) => (
                      {
                        key: node.key,
                        name: node.name,
                        size: node.size,
                        fixed: true,
                        color: node.color,
                        sex: node.sex,
                        age: node.age,
                        categoryColor: node.categoryColor,
                        border: node.iWouldLikeMoreTechnicalSupport === -1 ? "#FFFFFF" : node.border,
                        fixedPosY: node.y,
                        x: node.iWouldLikeMoreTechnicalSupport === -1 ? (SVG_WIDTH * 0.1 - NODE_RADIUS) + ((NODE_RADIUS * 2) + ((SVG_WIDTH * 0.8 / 4) * ((node.key - 1) % 5))) : node.fixedPosX,
                        y: node.iWouldLikeMoreTechnicalSupport === -1 ? ((Math.floor((node.key - 1) / 5) * (NODE_RADIUS * 2)) + (NODE_RADIUS)) : node.fixedPosY,
                      }
                    ))}
                    route={"/Question_10"}
                    prevNodes={this.prevNodes}
                    counter={-1}
                    // counter={this.determineCounterReturn(this.state.nodes.slice(1), "academic", "")}
                    links={[]}
                    foci={this.state.foci.slice(1)}
                    prevFoci={this.prevFoci}
                    callBackNodes={[this.placeBoxDragCallback.bind(this), ['iWouldLikeMoreTechnicalSupport', WOULD_LIKE_MORE_TECHNICAL_SUPPORT, []]]}
                    collectHistory={this.collectHistory.bind(this)}
                    textDescription={SURVEY_QUESTIONS[10]}
                    transferCallBack={this.transferData.bind(this)}
                    legend={null}
                    categories={WOULD_LIKE_MORE_TECHNICAL_SUPPORT}
                    lastClickedNodeCallback={this.setLastClickedNode.bind(this)}
                    lastClickedNode={this.state.lastClickedNode}
                  />
                } /> */}
                {/* Question 9: Who do you provide technical support for? */}
                <Route exact path="/Question_11" component={
                  () => <NodeComponent fixed={1}
                    nodes={this.state.nodes.slice(1).map((node, i) => (
                      {
                        key: node.key,
                        name: node.name,
                        size: node.size,
                        fixed: true,
                        color: node.color,
                        sex: node.sex,
                        age: node.age,
                        categoryColor: node.categoryColor,
                        border: node.iProvideSupport_Technical === -1 ? "#FFFFFF" : node.border,
                        fixedPosY: node.y,
                        x: node.iProvideSupport_Technical === -1 ? (SVG_WIDTH * 0.1 - NODE_RADIUS) + ((NODE_RADIUS * 2) + ((SVG_WIDTH * 0.8 / 4) * ((node.key - 1) % 5))) : node.fixedPosX,
                        y: node.iProvideSupport_Technical === -1 ? ((Math.floor((node.key - 1) / 5) * (NODE_RADIUS * 2)) + (NODE_RADIUS)) : node.fixedPosY,
                      }
                    ))}
                    route={"/Question_12"}
                    prevNodes={this.prevNodes}
                    counter={-1}
                    // counter={this.determineCounterReturn(this.state.nodes.slice(1), "academic", "")}
                    links={[]}
                    foci={this.state.foci.slice(1)}
                    prevFoci={this.prevFoci}
                    callBackNodes={[this.placeBoxDragCallback.bind(this), ['iProvideSupport_Technical', I_PROVIDE_TECHNICAL_SUPPORT, []]]}
                    collectHistory={this.collectHistory.bind(this)}
                    textDescription={SURVEY_QUESTIONS[13]}
                    transferCallBack={this.transferData.bind(this)}
                    legend={null}
                    categories={I_PROVIDE_TECHNICAL_SUPPORT}
                    lastClickedNodeCallback={this.setLastClickedNode.bind(this)}
                    lastClickedNode={this.state.lastClickedNode}
                  />
                } />
                {/* Question 10: Do you feel comfortable talking with anyone below about personal failure, disappointment, or struggle in your academic work?  */}
                <Route exact path="/Question_12" component={
                  () => <NodeComponent fixed={1}
                    nodes={this.state.nodes.slice(1).map((node, i) => (
                      {
                        key: node.key,
                        name: node.name,
                        size: node.size,
                        fixed: true,
                        color: node.color,
                        sex: node.sex,
                        age: node.age,
                        categoryColor: node.categoryColor,
                        border: node.iAmComfortable_Failure_Disappointment_Struggle_Academic === -1 ? "#FFFFFF" : node.border,
                        fixedPosY: node.y,
                        x: node.iAmComfortable_Failure_Disappointment_Struggle_Academic === -1 ? (SVG_WIDTH * 0.1 - NODE_RADIUS) + ((NODE_RADIUS * 2) + ((SVG_WIDTH * 0.8 / 4) * ((node.key - 1) % 5))) : node.fixedPosX,
                        y: node.iAmComfortable_Failure_Disappointment_Struggle_Academic === -1 ? ((Math.floor((node.key - 1) / 5) * (NODE_RADIUS * 2)) + (NODE_RADIUS)) : node.fixedPosY,
                      }
                    ))}
                    route={"/Question_13"}
                    prevNodes={this.prevNodes}
                    counter={-1}
                    // counter={this.determineCounterReturn(this.state.nodes.slice(1), "academic", "")}
                    links={[]}
                    foci={this.state.foci.slice(1)}
                    prevFoci={this.prevFoci}
                    callBackNodes={[this.placeBoxDragCallback.bind(this), ['iAmComfortable_Failure_Disappointment_Struggle_Academic', PROVIDES_ME_SUPPORT_ACADEMIC, []]]}
                    collectHistory={this.collectHistory.bind(this)}
                    textDescription={SURVEY_QUESTIONS[14]}
                    transferCallBack={this.transferData.bind(this)}
                    legend={null}
                    categories={PROVIDES_ME_SUPPORT_ACADEMIC}
                    lastClickedNodeCallback={this.setLastClickedNode.bind(this)}
                    lastClickedNode={this.state.lastClickedNode}
                  />
                } />
                {/* Question 11: Do you provide support for individuals regarding personal failure, disappointment, or struggle in their
            academic work? */}
                <Route exact path="/Question_13" component={
                  () => <NodeComponent fixed={1}
                    nodes={this.state.nodes.slice(1).map((node, i) => (
                      {
                        key: node.key,
                        name: node.name,
                        size: node.size,
                        fixed: true,
                        color: node.color,
                        sex: node.sex,
                        age: node.age,
                        categoryColor: node.categoryColor,
                        border: node.iProvideSupport_Failure_Disappointment_Struggle_Academic === -1 ? "#FFFFFF" : node.border,
                        fixedPosY: node.y,
                        x: node.iProvideSupport_Failure_Disappointment_Struggle_Academic === -1 ? (SVG_WIDTH * 0.1 - NODE_RADIUS) + ((NODE_RADIUS * 2) + ((SVG_WIDTH * 0.8 / 4) * ((node.key - 1) % 5))) : node.fixedPosX,
                        y: node.iProvideSupport_Failure_Disappointment_Struggle_Academic === -1 ? ((Math.floor((node.key - 1) / 5) * (NODE_RADIUS * 2)) + (NODE_RADIUS)) : node.fixedPosY,
                      }
                    ))}
                    route={"/Question_14"}
                    prevNodes={this.prevNodes}
                    counter={-1}
                    // counter={this.determineCounterReturn(this.state.nodes.slice(1), "academic", "")}
                    links={[]}
                    foci={this.state.foci.slice(1)}
                    prevFoci={this.prevFoci}
                    callBackNodes={[this.placeBoxDragCallback.bind(this), ['iProvideSupport_Failure_Disappointment_Struggle_Academic', I_PROVIDE_SUPPORT_ACADEMIC, []]]}
                    collectHistory={this.collectHistory.bind(this)}
                    textDescription={SURVEY_QUESTIONS[15]}
                    transferCallBack={this.transferData.bind(this)}
                    legend={null}
                    categories={I_PROVIDE_SUPPORT_ACADEMIC}
                    lastClickedNodeCallback={this.setLastClickedNode.bind(this)}
                    lastClickedNode={this.state.lastClickedNode}
                  />
                } />

                {/* Question 14: Is there anyone below with whom you find it difficult to interact? */}
                {/* <Route exact path="/Question_15" component={
                  () => <NodeComponent fixed={1}
                    nodes={this.state.nodes.slice(1).map((node, i) => (
                      {
                        key: node.key,
                        name: node.name,
                        size: node.size,
                        fixed: true,
                        color: node.color,
                        sex: node.sex,
                        age: node.age,
                        categoryColor: node.categoryColor,
                        border: node.difficultToInteractWith === -1 ? "#FFFFFF" : node.border,
                        fixedPosY: node.y,
                        x: node.difficultToInteractWith === -1 ? (SVG_WIDTH * 0.1 - NODE_RADIUS) + ((NODE_RADIUS * 2) + ((SVG_WIDTH * 0.8 / 4) * ((node.key - 1) % 5))) : node.fixedPosX,
                        y: node.difficultToInteractWith === -1 ? ((Math.floor((node.key - 1) / 5) * (NODE_RADIUS * 2)) + (NODE_RADIUS)) : node.fixedPosY,
                      }
                    ))}
                    route={"/Question_16"}
                    prevNodes={this.prevNodes}
                    counter={-1}
                    // counter={this.determineCounterReturn(this.state.nodes.slice(1), "academic", "")}
                    links={[]}
                    foci={this.state.foci.slice(1)}
                    prevFoci={this.prevFoci}
                    callBackNodes={[this.placeBoxDragCallback.bind(this), ['difficultToInteractWith', DIFFICULT_INTERACTION_BOXES, []]]}
                    collectHistory={this.collectHistory.bind(this)}
                    textDescription={SURVEY_QUESTIONS[16]}
                    transferCallBack={this.transferData.bind(this)}
                    legend={null}
                    categories={DIFFICULT_INTERACTION_BOXES}
                    lastClickedNodeCallback={this.setLastClickedNode.bind(this)}
                    lastClickedNode={this.state.lastClickedNode}
                  />
                } /> */}
                <Route exact path="/Question_14" component={
                  () => <NodeComponent nodes={this.state.nodes.slice(1)}
                    route={"/Question_15"}
                    prevNodes={this.prevNodes}
                    counter={-1}
                    links={[]}
                    foci={this.state.foci.slice(1)}
                    prevFoci={this.prevFoci}
                    callBackNodes={this.difficultInteractionsNodeCallback.bind(this)}
                    collectHistory={this.collectHistory.bind(this)}
                    textDescription={SURVEY_QUESTIONS[16]}
                    transferCallBack={this.transferData.bind(this)}
                    colorOveride={"difficultToInteractWithColor"}
                    legend={
                      null
                    }
                    lastClickedNodeCallback={this.setLastClickedNode.bind(this)}
                    lastClickedNode={this.state.lastClickedNode}
                  />
                } />

                {/* Question 16: If the individuals below also took the norm survey, do you think they would answer the norm statements in a similar way as you? */}
                {/* <Route exact path="/Question_16" component={
                  () => <NodeComponent fixed={1}
                    nodes={this.state.nodes.slice(1).map((node, i) => (
                      {
                        key: node.key,
                        name: node.name,
                        size: node.size,
                        fixed: true,
                        color: node.color,
                        sex: node.sex,
                        age: node.age,
                        categoryColor: node.categoryColor,
                        border: node.wouldAnswerSimilarToMe === -1 ? "#FFFFFF" : node.border,
                        fixedPosY: node.y,
                        x: node.wouldAnswerSimilarToMe === -1 ? (SVG_WIDTH * 0.1 - NODE_RADIUS) + ((NODE_RADIUS * 2) + ((SVG_WIDTH * 0.8 / 4) * ((node.key - 1) % 5))) : node.fixedPosX,
                        y: node.wouldAnswerSimilarToMe === -1 ? ((Math.floor((node.key - 1) / 5) * (NODE_RADIUS * 2)) + (NODE_RADIUS)) : node.fixedPosY,
                      }
                    ))}
                    route={"/Question_17"}
                    prevNodes={this.prevNodes}
                    counter={-1}
                    // counter={this.determineCounterReturn(this.state.nodes.slice(1), "academic", "")}
                    links={[]}
                    foci={this.state.foci.slice(1)}
                    prevFoci={this.prevFoci}
                    callBackNodes={[this.placeBoxDragCallback.bind(this), ['wouldAnswerSimilarToMe', SIMILAR_ANSWER_BOXES, []]]}
                    collectHistory={this.collectHistory.bind(this)}
                    textDescription={SURVEY_QUESTIONS[17]}
                    transferCallBack={this.transferData.bind(this)}
                    legend={null}
                    categories={SIMILAR_ANSWER_BOXES}
                    lastClickedNodeCallback={this.setLastClickedNode.bind(this)}
                    lastClickedNode={this.state.lastClickedNode}
                  />
                } /> */}
                <Route exact path="/Question_15" component={
                  () => <NodeComponent nodes={this.state.nodes.slice(1)}
                    route={"/Question_16"}
                    prevNodes={this.prevNodes} similarAnswersNodeCallback
                    counter={-1}
                    links={[]}
                    foci={this.state.foci.slice(1)}
                    prevFoci={this.prevFoci}
                    callBackNodes={this.similarAnswersNodeCallback.bind(this)}
                    collectHistory={this.collectHistory.bind(this)}
                    textDescription={SURVEY_QUESTIONS[17]}
                    transferCallBack={this.transferData.bind(this)}
                    legend={
                      null
                    }
                    lastClickedNodeCallback={this.setLastClickedNode.bind(this)}
                    lastClickedNode={this.state.lastClickedNode}
                    colorOveride={"wouldAnswerSimilarToMeColor"}
                  />
                } />
                {/* <Route exact path="/Boolean" component={
              () => <NodeComponent nodes={this.state.nodes.slice(1).map((node, i) => (
                {
                  key: node.key,
                  name: node.name,
                  size: node.size,
                  fixed: false,
                  color: node.color,
                  sex: node.sex,
                  age: node.age,
                  categoryColor: node.categoryColor,
                  border: node.border,
                  x: node.fixedPosX,
                  y: node.fixedPosY,
                  opac: (node.booleanCondition ? true : false)
                }
              ))}
                route={"/Continuous1"}
                opac={"conditional"}
                prevNodes={this.prevNodes}
                counter={-1}
                links={[]}
                foci={this.state.foci.slice(1)}
                prevFoci={this.prevFoci}
                callBackNodes={[this.booleanNodeCallback.bind(this), "booleanCondition"]}
                collectHistory={this.collectHistory.bind(this)}
                textDescription={SURVEY_QUESTIONS[4]}
                transferCallBack={this.transferData.bind(this)} />
            } />

            <Route exact path="/Continuous1" component={
              () => <NodeComponent fixed={1}
                opac={"dynamic"}
                nodes={this.state.nodes.slice(1, this.determineCounterReturn(this.state.nodes.slice(1), "continuous1", -1) + 1).map((node, i) => (
                  {
                    key: node.key,
                    name: node.name,
                    size: node.size,
                    fixed: true,
                    color: node.color,
                    sex: node.sex,
                    age: (node.continuous1 !== -1 ? node.continuous1.toFixed(2) : 0.5),
                    categoryColor: node.categoryColor,
                    border: node.border,
                    x: (node.continuous1 !== -1 ? node.continuous1 * AVB_WIDTH + NODE_RADIUS : SVG_WIDTH / 2),
                    y: node.fixedPosY
                  }
                ))}
                prevNodes={this.prevNodes}
                route={"/Continuous2"}
                counter={-1}
                links={[]}
                foci={this.state.foci.slice(1)}
                prevFoci={this.prevFoci}
                categories={SEPARATOR}
                callBackNodes={[this.continuousGenericCallback.bind(this), "continuous1"]}
                collectHistory={this.collectHistory.bind(this)}
                textDescription={SURVEY_QUESTIONS[5]}
                transferCallBack={this.transferData.bind(this)} />
            } />


            <Route exact path="/Continuous2" component={
              () => <NodeComponent fixed={1}
                opac={"dynamic"}
                nodes={this.state.nodes.slice(1, this.determineCounterReturn(this.state.nodes, "continuous2", -1) + 1).map((node, i) => (
                  {
                    key: node.key,
                    name: node.name,
                    size: node.size,
                    fixed: true,
                    color: node.color,
                    sex: node.sex,
                    age: (node.continuous2 !== -1 ? node.continuous2.toFixed(2) : 0.5),
                    categoryColor: node.categoryColor,
                    border: node.border,
                    x: (node.continuous2 !== -1 ? node.continuous2 * AVB_WIDTH + NODE_RADIUS : SVG_WIDTH / 2),
                    y: node.fixedPosY
                  }
                ))}
                prevNodes={this.prevNodes}
                route={"/Interconnection"}
                counter={-1}
                links={[]}
                foci={this.state.foci.slice(1)}
                prevFoci={this.prevFoci}
                callBackNodes={[this.continuousGenericCallback.bind(this), "continuous2"]}
                collectHistory={this.collectHistory.bind(this)}
                textDescription={SURVEY_QUESTIONS[6]}
                transferCallBack={this.transferData.bind(this)} />
            } /> */}
                <Route exact path="/Question_16" component={
                  () => (MOBILE ? <NodeComponent nodes={this.state.nodes.slice(1).map((node, i) => (
                    {
                      key: node.key,
                      name: node.name,
                      size: node.size,
                      fixed: false,
                      color: (this.state.source === node.key ? "#00ff00" : node.color),
                      sex: node.sex,
                      age: node.age,
                      categoryColor: node.categoryColor,
                      border: node.border,
                      x: node.fixedPosX,
                      y: node.fixedPosY,
                      opac: (this.state.source === -1 ? node.link > 0 : hasLink(this.state.links, this.state.source, node.key)),
                      float: false,
                      link: node.link,
                      floatX: node.floatX,
                      floatY: node.floatY,
                    }
                  ))}
                    route={"/End_of_Study"}
                    opac={"conditional"}
                    prevNodes={this.prevNodes}
                    counter={-1}
                    links={[]}
                    foci={this.state.foci.slice(1)}
                    prevFoci={this.prevFoci}
                    lastClickedNodeCallback={this.setLastClickedNode.bind(this)}
                    lastClickedNode={this.state.lastClickedNode}
                    callBackNodes={this.networkNodesCallback.bind(this)}
                    collectHistory={this.collectHistory.bind(this)}
                    textDescription={SURVEY_QUESTIONS[18]}
                    extraHeight={true}
                    transferCallBack={this.transferData.bind(this)} />

                    :

                    <NodeComponent nodes={this.state.nodes.map((node, i) => (
                      {
                        key: node.key,
                        name: "",
                        size: (MOBILE ? 10 : 12),
                        fixed: false,
                        float: (node.shouldFloat ? true : false),
                        color: node.color,
                        sex: node.sex,
                        age: node.name,
                        categoryColor: node.categoryColor,
                        border: node.border,
                        x: node.floatX,
                        y: node.floatY,
                        link: node.link,
                        floatX: node.floatX,
                        floatY: node.floatY,

                      }
                    ))}
                      prevNodes={this.prevNodes}
                      route={"/End_of_Study"}
                      counter={-1}
                      float={1}
                      links={this.state.links}
                      lastClickedNodeCallback={this.setLastClickedNode}
                      lastClickedNode={this.state.lastClickedNode}
                      foci={this.state.foci.map((focus, i) => (
                        {
                          key: focus.key,
                          x: (this.state.nodes[i].floatX ? this.state.nodes[i].floatX : box_layout(i)[0]),
                          y: (this.state.nodes[i].floatY ? this.state.nodes[i].floatY : box_layout(i)[1])
                        }
                      ))}
                      prevFoci={this.prevFoci}
                      callBackNodes={this.networkNodesCallback.bind(this)}
                      collectHistory={this.collectHistory.bind(this)}
                      textDescription={SURVEY_QUESTIONS[18]}
                      transferCallBack={this.transferData.bind(this)}
                      extraHeight={true}
                    />
                  )} />

                <Route exact path="/End_of_Study" component={() => <Thanks textDescription={END_OF_SURVEY_STATEMENT} transferCallBack={this.transferData.bind(this)} />} />
              </div>
              :
              <></>
            }
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default Survey;
