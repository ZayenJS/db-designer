import { connect } from 'react-redux';
import { actionsTemplate } from '../../store/actions';
import App from '../../App/App';
import { Dispatch } from 'react';
import { State } from '../../store/reducers';

interface StateToProps {}

interface ownProps {}

interface DispatchToProps {}

const mapStateToProps = (state: State, ownProps: ownProps): StateToProps => ({});

const mapDispatchToProps = (
      dispatch: Dispatch<actionsTemplate.ActionTemplateActions>,
      ): DispatchToProps => ({});

export type AppPropsFromRedux = StateToProps & DispatchToProps & ownProps;

export default connect(mapStateToProps, mapDispatchToProps)(App);