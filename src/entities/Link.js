import React, {Component} from "react"
import ReactDOM from "react-dom"
import icons from "../icons"
const styled = require('styled-components').default

export default class Link extends Component {
  constructor(props) {
    super(props);
    this.state = { url: props && props.url || '' }
  }

  setLink(event) {
    let {url} = this.state;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `http://${url}`;
    }

    /* https://gist.github.com/dperini/729294 */
    const expression = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\x{00a1}\-\x{ffff}0-9]+-?)*[a-z\x{00a1}\-\x{ffff}0-9]+)(?:\.(?:[a-z\x{00a1}\-\x{ffff}0-9]+-?)*[a-z\x{00a1}\-\x{ffff}0-9]+)*(?:\.(?:[a-z\x{00a1}\-\x{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/ig;
    const regex = new RegExp(expression);

    if (!url.match(regex)) {
      this.props.setError(("Invalid Link"));
      ReactDOM.findDOMNode(this.refs.textInput).focus()
      return;
    }

    this.props.setEntity({url});
    this.reset();
    event.target.blur();
  }

  reset() {
    this.setState({ url: "" })
    this.props.cancelEntity()
  }

  onLinkChange(event) {
    event.stopPropagation()
    const url = event.target.value

    if (url === "") {
      this.props.cancelError()
    }

    this.setState({url: url})
  }

  onLinkKeyDown(event) {
    if (event.key == "Enter") {
      event.preventDefault()
      this.setLink(event)
    } else if (event.key == "Escape") {
      event.preventDefault()
      this.reset()
    }
  }

  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.textInput).focus()
  }

  render() {
    return (
      <div style={{whiteSpace: "nowrap"}}>
        <ToolbarInput
          ref="textInput"
          type="text"
          onChange={::this.onLinkChange}
          value={this.state.url}
          onKeyDown={::this.onLinkKeyDown}
          placeholder='Type the link and press enter' />
        <ToolbarItem style={{verticalAlign: "bottom"}}>
          <ToolbarButton
            onClick={this.props.removeEntity}
            type="button">
            { this.props.entity ? <icons.UnlinkIcon/> : <icons.CloseIcon /> }
          </ToolbarButton>
        </ToolbarItem>
      </div>
    )
  }
}

const ToolbarInput = styled.input`
  background-color: transparent;
  border: none;
  color: #fafafa !important;
  font-size: 1.2rem;
  height: auto;
  line-height: 1.2rem;
  margin: 0;
  padding: 20px;
  width: 250px;

  &:focus {
    outline: none;
  }
`;

const ToolbarButton = styled.button`
  padding: 0;
  color: inherit;
  cursor: pointer;
  border: 0;
  height: 46px;
  width: 40px;
  background: transparent;
  padding-right: 16px;
`;

const ToolbarItem = styled.span`
  display: inline-block;
  color: #ccc;
  &:hover {
    color: #fff;
  }
`;