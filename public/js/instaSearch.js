var InstaSearch = React.createClass({
  getInitialState: function() {
    return {data: [], scheduleInfo: "",geolocation:{"latitude":"","longitude":""}};
  },
  getScheduleInfo: function(longitude, latitude, address, gaddress){
    console.log(address);
    console.log(gaddress);
    $.ajax({
      method: "POST",
      url: "collectionSchedule",
      cache: false,
      data: { longitude:longitude,
          latitude: latitude,
          actualAddress: address,
          gaddress:  JSON.stringify(gaddress) }
    })
    .done(function(scheduleInfo){
      console.log(gaddress);
      this.setState({"scheduleInfo": scheduleInfo,
                      "geolocation":{
                        "latitude": latitude,
                        "longitude": longitude }
                      });

      this.refs.mapEl.updateMarker(longitude, latitude);
    }.bind(this));
  },
  componentDidMount: function() {

  },
  render: function() {
    return (
     <div className=''>
        <div className="">
              <MapView onSubmitGetInfo={this.getScheduleInfo} className="col-xs-6" ref="mapEl"/>
            </div>
        <div id='searchContainer' className="col-xs-12">
          <SearchForm onSubmitGetInfo={this.getScheduleInfo} />
        </div>
          <div id="scheduleView" className="col-xs-12">
              <ScheduleView data={this.state.scheduleInfo}/>
            </div>
      </div>
    );
  }
});


React.render(
  <InstaSearch url="comments.json" />,
  document.getElementById('content')
);
