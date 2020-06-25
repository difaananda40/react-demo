import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

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
        formatter: (cell) => {
          let data = [];
          cell.forEach((permit, index) => {
            const functions = permit.function.map(fn => fn).join(', ');
            data.push(
              <div key={index}>
                <p className="font-weight-bold m-0">{permit.permission}</p>
                <p className="text-muted mb-1">{functions}</p>
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