var ImportView = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  loadData: function(){
 		$.ajax({
 			url: '/api/council',
 			success: function(data){
 				this.setState({data: data});
      //  this.updateTable();
 			}.bind(this)
 		});
  },
 	componentWillMount: function(){
    this.loadData();
 	},
 	componentDidMount: function(){
    var self = this;
   		$('#mytable').dataTable({
  		  "bDestroy": true,
  		});
   	},
 	componentDidUpdate: function(){
    $('#councilList').dataTable({
		  "bRetrieve": true,
		  "bAutoWidth": false,
		  "bDestroy": true,
		});
 	},
  handleImportClick:function(e){
    e.preventDefault();
    $('#importError').addClass('hide');
    var el = e.target;
    var uniqueName = el.id;
    $.ajax({
      url:"/api/importer/"+uniqueName,
    })
    .done(function(res){
        console.log(res);
        el.text= "Successfuly imported";
      }.bind(el))
    .fail(function(res){
      console.log(res);
      var resp = JSON.parse(res.responseText);
      var el = $('#importError');
        el.removeClass('hide')
        el.text(resp.status+': '+resp.message);
    });
  },
 	render: function(){
 		var x = this.state.data.map(function(d, index){
 			return (
        <tr key={d._id}>
          <td>{index+1}</td>
          <td>{d.uniqueName}</td>
          <td>{d.councilName}</td>
          <td>{d.boundaries.length}</td>
          <td className='date'>{setDateFormat(d.lastImportedAt)}</td>
          <td><a onClick={this.handleImportClick} href="#" id={d.uniqueName}>Import Now</a></td></tr>
        );
 		}, this);
		return (
      <div className=''>
        <div id="importError" className='alert alert-danger hide'></div>
				<table className="table table-bordered" id="councilList">
					<thead>
            <tr className="success">
            <th>Sno</th>
            <th>Unique Name</th>
            <th>Council</th>
            <th>LGA boundaries</th>
            <th>Last imported</th>
            <th>Actions</th>
            </tr>
            </thead>
					<tbody>{x}</tbody>
         </table>
       </div>
		)
 	}
});


React.render(
  <div>
    <AdminControl />
    <ImportView />
  </div>,
  document.getElementById('content')
);
