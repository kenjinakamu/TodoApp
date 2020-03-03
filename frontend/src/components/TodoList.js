import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from '@material-ui/core';
import {createTodo, getTodoList} from '../actions/TodoAction';
import {Field, reduxForm} from "redux-form";

class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: false
    }
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getTodoList();
  }

  async onSubmit(values) {
    await this.props.createTodo(values);
    this.props.getTodoList();
    this.handleClose();
  }

  handleOpen = () => {
    this.setState({
      isOpened: true
    })
  }

  handleClose = () => {
    this.setState({
      isOpened: false
    })
  }

  renderField(field) {
    const {input, label, type, meta: {touched, invalid, error}, rows} = field;
    return (
        <TextField
            style={{margin: 12}}
            label={label}
            type={type}
            multiline
            rows={rows}
            error={touched && invalid}
            helperText={touched && invalid && error}
            {...input}
            fullWidth={true}
            variant="outlined"
        />
    )
  }

  render() {
    const {handleSubmit, pristine, submitting, invalid} = this.props;
    const {todoList} = this.props.events;
    const {isOpened} = this.state;
    const addStyle = {
      float: "right",
      marginTop: 16,
      marginRight: 16
    }
    const dialogStyle = {
      marginRight: 24
    }

    return (
        <>
          <div style={{position: "fixed", left: 24, bottom: 24}}>
            <a href="http://localhost:8080/swagger-ui.html#/" target="_blank" rel="noopener noreferrer">Swagger UI</a>
          </div>

          <Fab size="medium" aria-label="add" style={addStyle} onClick={this.handleOpen}>
            <AddIcon/>
          </Fab>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>件名</TableCell>
                <TableCell>詳細</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                (todoList) ?
                    todoList.map(todo => (
                        <TableRow key={todo.id}>
                          <TableCell>
                            <Link to={`/detail/${todo.id}`}>
                              {todo.title}
                            </Link>
                          </TableCell>
                          <TableCell>{todo.detail}</TableCell>
                        </TableRow>
                    ))
                    : null
              }
            </TableBody>
          </Table>

          <Dialog onClose={this.handleClose} open={isOpened}>
            <DialogTitle>新規登録</DialogTitle>
            <DialogContent style={dialogStyle}>
              <form onSubmit={handleSubmit(this.onSubmit)}>
                <div>
                  <Field label="件名" name="title" type="text" rows="" component={this.renderField}/>
                  <Field label="詳細" name="detail" type="text" rows="4" component={this.renderField}/>
                </div>
                <DialogActions>
                  <Button variant="outlined" type="submit"
                          disabled={pristine || submitting || invalid}>登録</Button>
                  <Button variant="outlined" onClick={this.handleClose}>キャンセル</Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>

        </>
    )
  }
}

const validate = values => {
  const errors = {}

  if (!values.title) errors.title = "件名を入力してください。"
  if (!values.detail) errors.detail = "詳細を入力してください。"

  return errors
}

const mapStateToProps = state => ({events: state.events})

const mapDispatchToProps = ({getTodoList, createTodo})

export default connect(mapStateToProps, mapDispatchToProps)(
    reduxForm({validate, form: 'todoCreateForm'})(TodoList)
);