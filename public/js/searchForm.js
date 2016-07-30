var SearchForm = React.createClass({
  getInitialState:function(){
    return {
      autocomplete:null
    }
  },
  componentDidMount:function(){
    var input = React.findDOMNode(this.refs.address);//.value.trim();
    var options = {componentRestrictions: {country: 'au'}};
    this.props.autocomplete = new google.maps.places.Autocomplete(input, options);
  },
  onFocus:function(){
    autocomplete = new google.maps.places.Autocomplete(
            (document.getElementById('autocomplete')),
    { types: ['geocode'] });
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = new google.maps.LatLng(
          position.coords.latitude, position.coords.longitude);
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
  },
  handleSubmit:function(e){
    e.preventDefault();
    var address = React.findDOMNode(this.refs.address).value.trim();
    var gaddress = autocomplete.getPlace();
    if(!address){
      return;
    }
    var latitude  = gaddress.geometry.location.lat;
    var longitude = gaddress.geometry.location.lng;
    this.props.onSubmitGetInfo(longitude, latitude, address, gaddress);
    //this.getBinInfo(address, gaddress);
    //React.findDOMNode(this.refs.address).value ='';
    return;
  },

  render: function(){
    return (
      <form onSubmit={this.handleSubmit} className="container">
         <div className="">
            <div className="input-group">
              <input id="autocomplete" className="form-control" type='text' onFocus={this.onFocus} ref="address" placeholder="45 Princes Highway"/>
              <span className="input-group-btn">
                <button type="submit" className="btn btn-primary">Find my bin day</button>
              </span>
            </div>
          </div>
      </form>
      
    );
  }
})
