var ScheduleView = React.createClass({
  render:function(){
    var greenWasteDay = this.props.data.green;
    var recycleWasteDay = this.props.data.recycle;
    var landfillWasteDay = this.props.data.landfill;
    return (
      <div className='col-xs-12'>
        <h3> Next collection schedule</h3>
        <table className='table'>
          <tr>
            <th>Type</th>
            <th>Next collection date</th>
          </tr>
          <tr>
            <td>Landfill</td>
            <td>{landfillWasteDay}</td>
          </tr>
          <tr className='success'>
            <td>Green</td>
            <td>{greenWasteDay}</td>
            </tr>
          <tr className='warning'>
            <td >Recycle</td>
            <td>{recycleWasteDay}</td>
          </tr>
        </table>
       </div>
    )
  }
});
