import React from 'react';
import {
  Modal,
  Button,
  Card,
  Row,
  Col,
  Form,
} from 'react-bootstrap';
import accessorsData from '../Dummy/user-group.json';
import modulesData from '../Dummy/modules.json';
import moduleStatusData from '../Dummy/module-status.json'

class FormContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accessors: [...accessorsData.data],
      info: {
        component_id: '',
        component_name: '',
        module: '',
        icon: '',
        url: '',
        status: '',
      },
      isFormValidate: false,
      permissions: []
    }
    this.modules = [...modulesData]
    this.moduleStatus = [...moduleStatusData]
  }

  componentDidUpdate(prevProps, prevState) {
    const { mode, selectedData } = this.props;
    const setForm = () => {
      let currentAccessors = [...this.state.accessors];
      currentAccessors.forEach(ca => {
        ca.selected = false;
      })
      let newAccessors = [...currentAccessors];
      const newPermissions = [...selectedData.accessedby.map(dt => {
        newAccessors.forEach(acc => {
          if(!acc.selected) {
            acc.selected = dt.permission === acc.group_id
          }
        });
        let newFunction = {
          create: false,
          view: false,
          edit: false,
          delete: false,
          restore: false
        }
        dt.function.forEach(func => {
          newFunction = {
            ...newFunction,
            [func]: true
          }
        })
        return {
          accessor: dt.permission,
          function: newFunction
        }
      })];
      this.setState({
        info: {
          component_id: selectedData.key,
          component_name: selectedData.label,
          module: selectedData.parentKey,
          icon: selectedData.icon,
          url: selectedData.url,
          status: selectedData.status,
        },
        permissions: newPermissions,
        accessors: newAccessors,
      })
    }
    if((selectedData && prevProps.selectedData !== selectedData)) {
      setForm();
    }
    if(mode !== prevProps.mode && mode === 'create') this.resetState();
  }

  resetState = () => {
    this.setState({
      accessors: [...accessorsData.data],
      info: {
        component_id: '',
        component_name: '',
        module: '',
        icon: '',
        url: '',
        status: '',
      },
      isFormValidate: false,
      permissions: []
    });
  }

  handleChangeInfo = event => {
    const { name, value } = event.target;
    this.setState(prev => ({
      info: {
        ...prev.info,
        [name]: value
      }
    }))
  }

  addPermission = () => {
    // New permission format
    const newPermit = {
      accessor: '',
      function: {
        create: false,
        view: false,
        edit: false,
        delete: false,
        restore: false
      }
    }

    // Add new permission to state
    this.setState(prev => ({
      permissions: [
        ...prev.permissions,
        newPermit
      ]
    }))
  }

  deletePermission = index => {
    // Delete permission / input
    const newPermissons = [...this.state.permissions.filter((permit, pIndex) => index !== pIndex)];

    // Set previous selected accessor to false
    const prevSelectedAccessorId = this.state.permissions[index].accessor;
    let newAccessors = [...this.state.accessors];
    if(prevSelectedAccessorId) {
      let prevSelectedAccessor = newAccessors.find(acc => acc.group_id === prevSelectedAccessorId);
      prevSelectedAccessor.selected = false;
    }
    this.setState({
      accessors: newAccessors,
      permissions: newPermissons
    })
  };

  handleChangeAccessor = (event, index) => {
    const { value } = event.target;
    // Change permissions / input state
    let newPermissions = [...this.state.permissions];
    let selectedPermission = newPermissions[index];
    let prevSelectedAccessorId = selectedPermission.accessor; // This is selector for previous selected accessor
    selectedPermission.accessor = value;
    // Change permission functions to false
    selectedPermission.function = {
      create: false,
      view: false,
      edit: false,
      delete: false,
      restore: false
    }

    // Change accessors status
    let newAccessors = [...this.state.accessors];
    let newSelectedAccessor = newAccessors.find(acc => acc.group_id === value);
    if(newSelectedAccessor) {
      newSelectedAccessor.selected = true;
    }
    if(prevSelectedAccessorId) {
      let prevSelectedAccessor = newAccessors.find(acc => acc.group_id === prevSelectedAccessorId);
      prevSelectedAccessor.selected = false;
    }
    this.setState({
      accessors: newAccessors,
      permissions: newPermissions
    })
  }

  handleChangeFunction = (event, index) => {
    const { name, checked } = event.target;
    let newPermissions = [...this.state.permissions];
    let selectedPermission = newPermissions[index];
    selectedPermission.function[name] = checked;
    this.setState({
      permissions: newPermissions
    })
  }

  handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      isFormValidate: true
    })
    if (form.checkValidity()) {
      const { info, permissions } = this.state;
      let accessedBy = [];
      permissions.forEach(permit => {
        let newFunction = [];
        for(const func in permit.function) {
          if(permit.function[func]) {
            newFunction = [...newFunction, func]
          }
        }
        accessedBy = [...accessedBy, {
          permission: permit.accessor,
          function: newFunction
        }]
      })
      const data = {
        key: info.component_id,
        label: info.component_name,
        parentKey: info.module,
        icon: info.icon,
        url: info.url,
        status: info.status,
        accessedby: accessedBy,
      }
      this.props.submitForm(data, this.props.mode)
      this.resetState();
    }
  } 

  render() {
    const { show, handleForm, mode } = this.props;
    const { accessors, permissions, info, isFormValidate } = this.state;
    return (
      <Modal
        show={show}
        onHide={handleForm}
        backdrop="static"
        keyboard={false}
        dialogClassName="modal-90w"
        size="xl"
      >
        <Form noValidate validated={isFormValidate} onSubmit={this.handleSubmit}>
          <Modal.Header style={{ backgroundColor: '#8C00FF' }}>
            <Modal.Title className="text-capitalize">{mode} Components</Modal.Title>
            <div>
              <Button
                type="submit"
                variant="info"
                className="border border-white"
                size="sm"
                disabled={mode === 'view'}
              >
                Save
              </Button>
              <Button
                variant="success"
                size="sm"
                className="border border-white ml-1"
                onClick={handleForm}
              >
                Cancel
              </Button>
              <Button variant="danger" className="border border-white ml-1" size="sm">Help</Button>
            </div>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#F2F2F2' }}>
            <Card className="border-0">
              <Card.Header className="font-weight-bold" style={{ backgroundColor: '#FFC107' }}>Component Info</Card.Header>
              <Card.Body>
                <Row>
                  <Col>
                    <Form.Group as={Row} controlId="component_id">
                      <Form.Label column sm="4">
                        Component ID*
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          type="text"
                          name="component_id"
                          value={info.component_id}
                          onChange={this.handleChangeInfo}
                          required
                          disabled={mode === 'edit' || mode === 'view'}
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter component id!
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group as={Row} controlId="component_name">
                      <Form.Label column sm="4">
                        Component Name*
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          type="text"
                          name="component_name"
                          value={info.component_name}
                          onChange={this.handleChangeInfo}
                          required
                          disabled={mode === 'view'}
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter component name!
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group as={Row} controlId="module">
                      <Form.Label column sm="4">
                        Module*
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          as="select"
                          name="module"
                          value={info.module}
                          onChange={this.handleChangeInfo}
                          required
                          disabled={mode === 'view'}
                        >
                          <option value="">Choose...</option>
                          {this.modules.map(md => (<option key={md.key} value={md.key}>{md.label}</option>))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          Please select module!
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group as={Row} controlId="icon">
                      <Form.Label column sm="4">
                        Icon
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          type="text"
                          name="icon"
                          value={info.icon}
                          onChange={this.handleChangeInfo}
                          disabled={mode === 'view'}
                        />
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group as={Row} controlId="url">
                      <Form.Label column sm="4">
                        URL*
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          type="text"
                          name="url"
                          value={info.url}
                          onChange={this.handleChangeInfo}
                          required
                          disabled={mode === 'view'}
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter url!
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group as={Row} controlId="status">
                      <Form.Label column sm="4">
                        Status*
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          as="select"
                          name="status"
                          value={info.status}
                          onChange={this.handleChangeInfo}
                          required
                          disabled={mode === 'view'}
                        >
                          <option value="">Choose...</option>
                          {this.moduleStatus.map(ms => (<option key={ms.MODULES_STATUS} value={ms.MODULES_STATUS}>{ms.MODULES_STATUS}</option>))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          Please select status!
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
                <Card>
                  <Card.Header className="font-weight-bold text-white" style={{ backgroundColor: '#2196F3' }}>Component Permission</Card.Header>
                  <Card.Body>
                    {permissions.map((permit, index) => (
                      <Form.Group key={index} as={Row}>
                        <Col xs="2"><Form.Label>Accessor {index+1}*</Form.Label></Col>
                        <Col xs="8">
                          <Row>
                            <Col xs="12" className="mb-2">
                              <Form.Control
                                as="select"
                                value={permit.accessor}
                                onChange={event => this.handleChangeAccessor(event, index)}
                                required
                                disabled={mode === 'view'}
                              >
                                <option value=''>Choose...</option>
                                {accessors.map(acc => (
                                    <option disabled={acc.selected} key={acc.group_id} value={acc.group_id}>
                                      {acc.group_name}
                                    </option>
                                  ))}
                              </Form.Control>
                              <Form.Control.Feedback type="invalid">
                                Please select accessor!
                              </Form.Control.Feedback>
                            </Col>
                            <Col xs="12">
                              <Form.Check
                                type="checkbox" inline label="create"
                                id={`check-create-${index}`}
                                name="create"
                                checked={permit.function.create}
                                disabled={!permit.accessor || mode === 'view'}
                                onChange={event => this.handleChangeFunction(event, index)}
                              />
                              <Form.Check
                                type="checkbox" inline label="view"
                                id={`check-view-${index}`}
                                name="view"
                                checked={permit.function.view}
                                disabled={!permit.accessor || mode === 'view'}
                                onChange={event => this.handleChangeFunction(event, index)}
                              />
                              <Form.Check
                                type="checkbox" inline label="edit"
                                id={`check-edit-${index}`}
                                name="edit"
                                checked={permit.function.edit}
                                disabled={!permit.accessor || mode === 'view'}
                                onChange={event => this.handleChangeFunction(event, index)}
                              />
                              <Form.Check
                                type="checkbox" inline label="delete"
                                id={`check-delete-${index}`}
                                name="delete"
                                checked={permit.function.delete}
                                disabled={!permit.accessor || mode === 'view'}
                                onChange={event => this.handleChangeFunction(event, index)}
                              />
                              <Form.Check
                                type="checkbox" inline label="restore"
                                id={`check-restore-${index}`}
                                name="restore"
                                checked={permit.function.restore}
                                disabled={!permit.accessor || mode === 'view'}
                                onChange={event => this.handleChangeFunction(event, index)}
                              />
                            </Col>
                          </Row>
                        </Col>
                        {mode !== 'view' && (
                          <Col>
                            <Button variant="danger" onClick={() => this.deletePermission(index)}>
                              Delete
                            </Button>
                          </Col>
                        )}
                      </Form.Group>
                    ))}
                    {mode !== 'view' && (
                      <Button variant="primary" onClick={this.addPermission}>Add Accessor</Button>
                    )}                  
                  </Card.Body>
                </Card>
              </Card.Body>
            </Card>
          </Modal.Body>
        </Form>
      </Modal>
    )
  }
}

export default FormContainer;