import { push } from "connected-react-router";
import { Path } from "history";
import * as React from "react";
import { connect } from "react-redux";
import { Action, bindActionCreators } from "redux";
import { Grid, Label, Radio } from "semantic-ui-react";
import { AppModel } from "../models/app";
import { StoreState } from "../reducers";
import BatchPane from "./batchpane";
import LivePane from "./livepane";

type TestBoxOwnProps = React.Props<any> & {};
type TestBoxProps = TestBoxOwnProps & {
  app?: AppModel;

  pushRoute: (location: Path) => Action;
};

type TestBoxState = {
  active: "Live" | "Batch";
};

class TestBox extends React.Component<TestBoxProps, TestBoxState> {
  constructor(props) {
    super(props);
    this.state = {
      active: "Live"
    };
  }

  get app(): AppModel { 
    return this.props.app || { _id: "", name: "", type: "RASA" }
  }

  componentWillMount() {
    if (!this.props.app) {
      this.props.pushRoute("/");
    }
  }

  renderContent() {
    var elem = <span />;
    if (this.state.active === "Batch") {
      elem = <BatchPane />;
    }
    if (this.state.active === "Live") {
      elem = <LivePane app={this.app}/>;
    }
    return elem;
  }

  radioColor(item: string) {
    return this.state.active === item ? "violet" : "black";
  }

  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width="7" textAlign="right">
            <Label as="a" basic color={this.radioColor("Live")} onClick={(e,d) => this.setState({ active: 'Live' })}>
              Live
            </Label>
          </Grid.Column>
          <Grid.Column width="2" textAlign="center">
            <Radio
              disabled
              onClick={(e, d) =>
                this.setState({
                  active: this.state.active === "Live" ? "Batch" : "Live"
                })
              }
              slider
              checked={this.state.active === "Batch"}
            />
          </Grid.Column>
          <Grid.Column width="7" textAlign="left">
            <Label as="a" basic color={this.radioColor("Batch")} onClick={(e,d) => console.error("not implemented yet") /** this.setState({ active: 'Batch' }) */}>
              Batch
            </Label>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>{this.renderContent()}</Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = (state: StoreState, ownProps: TestBoxOwnProps) => ({
  app: state.testbox.app
});

const mapDispatcherToProps = dispatch => ({
  pushRoute: bindActionCreators(push, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatcherToProps
)(TestBox);