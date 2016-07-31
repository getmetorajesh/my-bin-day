var NearbyWasteFacility = React.createClass({
  render:function(){
    var nearestFacility = this.props.data.nearestFacility;
    var name = "";
    var landfill = "";
    var reprocessing, address, owner = "";

    if(nearestFacility != undefined && nearestFacility.properties != undefined) {
      name = nearestFacility.properties.Name;
      landfill = nearestFacility.properties.LANDFILL;
      reprocessing = nearestFacility.properties.REPROCESSING;
      address = nearestFacility.properties.SITEADDRESS + ", "+nearestFacility.properties.SITESUBURB + ", " + nearestFacility.properties.POSTCODE
      owner = nearestFacility.properties.OWNER; 
   }

    return (
      <div className='col-xs-12'>
        <h3> Nearest waste management facility</h3>
        <table className='table'>
          <tr>
            <td>Name</td>
            <td>{name}</td>
          </tr>
          <tr className='success'>
            <td>Landfill</td>
            <td>{landfill}</td>
            </tr>
          <tr className='success'>
            <td>Reprocessing</td>
            <td>{reprocessing}</td>
          </tr>
          <tr className='success'>
            <td>Address</td>
            <td>{address}</td>
          </tr>
          <tr className='success'>
            <td>Owner</td>
            <td>{owner}</td>
          </tr>
        </table>
       </div>
    )
  }

/**
NAME	Imanpa Waste Facility
LANDFILL	Operating
REPROCESSING	Not Applicable
TRANSFERSTATION	Not Applicable
OWNER	Macdonnell Shire Council
SITEID	2376
SITEADDRESS	Address Unknown
SITESUBURB	Imanpa
POSTCODE	872
STATE	NORTHERN TERRITORY
FEATURERELIABILITY	20090101
FEATURESOURCE	ALPSM2P5_ZONE52_2010
ATTRIBUTERELIABILITY	20111001
ATTRIBUTESOURCE	SLAP Mapped landfill
PLANIMETRICACCURACY	9
METADATACOMMENT	Alternate town names; Mt Ebenezer
SPATIALACCURACY	5
REVISED
 */

});