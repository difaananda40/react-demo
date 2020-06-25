import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        dataField: 'key',
        text: 'Component ID'
      },
      {
        dataField: 'label',
        text: 'Component Name'
      },
      {
        dataField: 'parentKey',
        text: 'Module'
      },
      {
        dataField: 'url',
        text: 'Url'
      },
      {
        dataField: 'accessedby',
        text: 'Permission',
        formatter: (cell) => cell.map(permit => permit.permission).join(', ')
      }
    ];
    this.selectRow = {
      mode: 'radio',
      clickToSelect: true,
      onSelect: (row, isSelect, rowIndex, e) => {
        this.props.selectData(row)
      }
    };
  }
  
  render() {
    const { data } = this.props;
    return (
      <BootstrapTable
        bootstrap4
        keyField='key'
        data={ data } 
        columns={ this.columns }
        striped
        className="table-flush"
        bordered={ false }
        wrapperClasses="table-responsive"
        rowEvents={this.rowEvents}
        rowStyle={{ 
          cursor: 'pointer'
        }}
        selectRow={this.selectRow}       
      />
    );
  }
}

export default Table;