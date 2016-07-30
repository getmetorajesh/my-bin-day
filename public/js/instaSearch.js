var InstaSearch = React.createClass({
  getInitialState: function() {
    return {data: [], scheduleInfo: "",geolocation:{"latitude":"","longitude":""}};
  },
  getScheduleInfo: function(longitude, latitude, address, gaddress){
    console.log(address);
    console.log(gaddress);
      var lat = latitude;
      var lng = longitude;

    if(gaddress != undefined && gaddress != "") {
      lat = gaddress.geometry.location.lat();
      lng = gaddress.geometry.location.lng();
    }
    $.ajax({
      method: "POST",
      url: "collectionSchedule",
      cache: false,
      data: { longitude: lng,
          latitude: lat,
          actualAddress: address,
          gaddress:  JSON.stringify(gaddress) }
    })
    .done(function(scheduleInfo){
      this.setState({"scheduleInfo": scheduleInfo,
                      "geolocation":{
                        "latitude": lat,
                        "longitude": lng }
                      });

      this.refs.mapEl.updateMarker(lng, lat);
    }.bind(this));
  },
  componentDidMount: function() {

  },
  render: function() {
console.log("rerender");
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
