import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import {Link} from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import {deleteTodo, getTodo, updateTodo} from '../actions/todoAction';

class EventsShow extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
  }

  componentDidMount() {
    const {id} = this.props.match.params;
    if (id) this.props.getTodo(id)
  }

  renderField(field) {
    const {input, label, type, meta: {touched, error}} = field;
    return (
        <TextField
            hintText={label}
            floatingLabelText={label}
            type={type}
            errorText={touched && error}
            {...input}
            fullWidth={true}
        />
    )
  }

  async onDeleteClick() {
    const {id} = this.props.match.params;
    await this.props.deleteTodo(id)
    this.props.history.push('/')
  }

  async onSubmit(values) {
    await this.props.updateTodo(values)
    this.props.history.push('/')
  }

  render() {
    const {handleSubmit, pristine, submitting, invalid} = this.props;
    const style = {margin: 12}

    return (
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <div>
            <Field label="Title" name="title" type="text" component={this.renderField}/>
            <Field label="Detail" name="detail" type="text" component={this.renderField}/>
          </div>

          <div>
            <RaisedButton label="Submit" type="submit" style={style} disabled={pristine || submitting || invalid}/>
            <RaisedButton label="Cancel" style={style} containerElement={<Link to="/"></Link>}/>
            <RaisedButton label="Delete" style={style} onClick={this.onDeleteClick}/>
          </div>
        </form>
    )
  }
}

const validate = values => {
  const errors = {}

  if (!values.title) errors.title = "Enter a title, please."
  if (!values.detail) errors.detail = "Enter a detail, please."

  return errors
}

const mapStateToProps = (state, ownProps) => {
  const event = state.events[ownProps.match.params.id]
  return {initialValues: event, event}
}

const mapDispatchToProps = ({deleteTodo, getTodo, updateTodo});

export default connect(mapStateToProps, mapDispatchToProps)(
    reduxForm({validate, form: 'eventShowForm', enableReinitialize: true})(EventsShow)
);