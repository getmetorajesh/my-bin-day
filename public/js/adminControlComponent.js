var AdminControl = React.createClass({
  getInitialState:function(){
    return {}
  },
  handleLogout:function(){
    window.localStorage.clear();
    window.location.replace('/admin');
  },
  render:function(){
    return (
      <div className="container-fluid">
        <div className=''>
          <a href='#' ref='logout' onClick={this.handleLogout}>Logout</a>
        </div>
      </div>
    )
  }
});
