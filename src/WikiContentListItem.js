import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import IconDocument from "@instructure/ui-icons/lib/Line/IconDocument";
import IconUnpublished from "@instructure/ui-icons/lib/Line/IconUnpublished";
import IconPublish from "@instructure/ui-icons/lib/Solid/IconPublish";
import Link from "@instructure/ui-elements/lib/components/Link";
import { getTextFromEntry } from "./utils.js";
import { basename } from "path";

export default class WikiContentListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      title: null,
      workflowState: null
    };
  }

  async componentDidMount() {
    const parser = new DOMParser();

    const path = this.props.href.substr(1);

    const entry = this.props.entryMap.get(path);

    const xml = await getTextFromEntry(entry);

    const doc = parser.parseFromString(xml, "text/html");

    const title =
      doc.querySelector("title") && doc.querySelector("title").textContent;

    const workflowStateNode = doc.querySelector('meta[name="workflow_state"]');

    const workflowState =
      workflowStateNode && workflowStateNode.getAttribute("content");

    this.setState({
      isLoading: false,
      title,
      workflowState
    });
  }

  render() {
    if (this.state.isLoading) {
      return null;
    }

    const iconColor = ["published", "active"].includes(this.state.workflowState)
      ? "success"
      : "secondary";

    return (
      <li className="ExpandCollapseList-item">
        <div className="ExpandCollapseList-item-inner">
          <span className="resource-icon">
            <IconDocument color={iconColor} />
          </span>
          <div style={{ flex: 1 }}>
            <Link as={RouterLink} to={`${this.props.href}`}>
              {this.state.title || basename(this.props.href)}
            </Link>
          </div>
          {this.state.workflowState != null && (
            <div className="ExpandCollapseList-item-workflow-state">
              {this.state.workflowState === "unpublished" && (
                <IconUnpublished color={iconColor} />
              )}
              {["published", "active"].includes(this.state.workflowState) && (
                <IconPublish color={iconColor} />
              )}
            </div>
          )}
        </div>
      </li>
    );
  }
}