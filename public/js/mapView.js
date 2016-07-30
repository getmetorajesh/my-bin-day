var MapView = React.createClass({
  componentDidMount: function() {
    var map = this.map = L.map(this.getDOMNode(), {
          minZoom: 2,
          maxZoom: 20,
          layers: [
              L.tileLayer(
                  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                  {attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'})
          ],
          attributionControl: false, 
      });
      map.on('click', this.onMapClick);
       if (map.scrollWheelZoom.enabled()) {
        map.scrollWheelZoom.disable();
      }
      map.setView([-37,144],5);

      $.get( "boundaries", {}, function( data ) {
        var overlays = L.geoJson(data, {
            style: function(feature){
              return {color: "blue", weight:2}
            },
            onEachFeature: function(feature, layer){

            }
        }).addTo(map);
        overlays.on("click", this.onMapClick);
      }.bind(this));
    },
    componentWillUnmount: function() {
        this.map.off('click', this.onMapClick);
        this.map = null;
    },
    onMapClick: function(e) {
        // Do some wonderful map things...
       // console.log(e.latlng);
        var latitude = e.latlng.lat;
        var longitude = e.latlng.lng;
        this.updateMarker(longitude, latitude);
        this.props.onSubmitGetInfo(longitude, latitude, "","");
    },
    updateMarker:function(longitude, latitude){
      console.log("update mark");
      console.log(longitude, latitude);
       console.log("update mark");
      if (this.map.hasLayer(this.marker)) {
        this.map.removeLayer(this.marker);
      }
      var marker = this.marker = L.marker([latitude, longitude]).addTo(this.map);
    },
  render: function(){

    return(
      <div id="map">

      </div>
    );
  }
});
