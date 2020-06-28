import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import moment from 'moment';
import { getOperation } from '../helper.js';

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
        text: 'Component Name',
        classes: 'text-nowrap'
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
        dataField: 'status',
        text: 'Status'
      },
      {
        dataField: 'recordDate',
        text: 'Record Date',
        headerAlign: 'center',
        align: 'center',
        formatter: cell => moment(cell, 'YYYYMMDD').format('DD/MM/YYYY')
      },
      {
        dataField: 'recordTime',
        text: 'Record Time',
        headerAlign: 'center',
        align: 'center',
        formatter: cell => moment(cell, 'HHmmss').format('HH:mm:ss')
      },
      {
        dataField: 'operation',
        text: 'Operation',
        headerAlign: 'center',
        align: 'center',
        formatter: cell => getOperation(cell)
      },
      {
        dataField: 'recordCounter',
        text: 'Record Counter',
        headerAlign: 'center',
        align: 'center'
      },
      {
        dataField: 'accessedby',
        text: 'Permission',
        classes: 'text-nowrap',
        formatter: (cell) => {
          let data = [];
          cell.forEach((permit, index) => {
            const functions = permit.function.map(fn => fn).join(', ');
            data.push(
              <div className="d-inline-block mr-4" key={index}>
                <p className="font-weight-bold m-0">{permit.permission}</p>
                <p className="text-muted m-0">{functions}</p>
              </div>
            )
          })
          return data;
        }
      }
    ];
  }
  
  render() {
    const { data, selectedData, selectData } = this.props;
    const selectRow = {
      mode: 'radio',
      clickToSelect: true,
      hideSelectColumn: !selectedData,
      onSelect: (row, isSelect, rowIndex, e) => {
        selectData(row)
      }
    };
    return (
      <BootstrapTable
        bootstrap4
        keyField='key'
        data={ data } 
        columns={ this.columns }
        striped
        hover
        bordered={ false }
        wrapperClasses="table-responsive"
        rowEvents={this.rowEvents}
        selectRow={selectRow} 
        pagination={ paginationFactory({
          showTotal: true,
        }) }      
      />
    );
  }
}

export default Table;