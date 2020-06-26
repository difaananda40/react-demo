import React from 'react';
import Table from './components/Table';
import Form from './components/Form';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
} from 'react-bootstrap';
import components from './components/Dummy/components.json';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [...components],
      showForm: false,
      selectedData: null,
      mode: null // Mode available: create, edit, view
    }
  }

  handleForm = (event, cb) => {
    const { name } = event.target;
    this.setState({
      mode: name || null,
      selectedData: null,
    }, () => {
      this.setState(prevState => ({
        showForm: !prevState.showForm
      }), () => {
        if(cb !== undefined) setTimeout(() => {cb()});
      })
    })
  }

  submitForm = (data, mode) => {
    if(mode === 'create') {
      this.setState(prev => ({
        data: [
          data,
          ...prev.data
        ]
      }))
    }
    else if(mode === 'edit') {
      let newData = [...this.state.data];
      let editedDataId = newData.findIndex(dt => dt.key === data.key);
      newData[editedDataId] = data;
      this.setState({
        data: newData,
        selectedData: null
      })
    }
    else throw new Error('Mode undefined!')

    this.setState({
      showForm: false
    })
  }

  selectData = (data) => {
    this.setState({
      selectedData: data
    })
  }

  deleteData = () => {
    const { data, selectedData } = this.state;
    const params = {target: {name: 'view'}}
    const deleteConfirm = () => {
      if(window.confirm('Are you sure to delete this data?')) {
        this.setState({
          data: [...data.filter(dt => dt.key !== selectedData.key)],
          selectedData: null
        })
      }
    }
    this.handleForm(params, () => deleteConfirm())
  }

  render() {
    const { data, showForm, selectedData, mode } = this.state;
    return (
      <Container fluid className="p-4" style={{ backgroundColor: '#F2F2F2' }}>
        <Card>
          <Card.Body>
            <Row>
              <Col className="d-flex flex-row align-items-center">
                <h2>Component List</h2>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Button
                  variant="info"
                  size="sm"
                  name="create"
                  onClick={this.handleForm}
                >
                  Create
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="ml-1"
                  name="edit"
                  disabled={!selectedData}
                  onClick={this.handleForm}
                >
                  Edit
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  className="ml-1"
                  name="view"
                  disabled={!selectedData}
                  onClick={this.handleForm}
                >
                  View
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="ml-1"
                  disabled={!selectedData}
                  onClick={this.deleteData}
                >
                  Delete
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <Table
                  data={data}
                  selectData={this.selectData}
                  selectedData={selectedData}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Form
          show={showForm}
          handleForm={this.handleForm}
          submitForm={this.submitForm}
          mode={mode}
          selectedData={selectedData}
        />
      </Container>
    );
  }
}

export default App;