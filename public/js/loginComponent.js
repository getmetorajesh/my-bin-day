var Login = React.createClass({
  getInitialState: function() {
    return {data: [], scheduleInfo: "",geolocation:{"latitude":"","longitude":""}};
  },
  componentDidMount: function() {

  },
  handleLoginClick:function(e){
    e.preventDefault();
    var username = this.refs.username.getDOMNode().value;
    var password = this.refs.password.getDOMNode().value;
    console.log(this.refs.username);
    $.ajax({
      method: "POST",
      url: "admin",
      cache: false,
      data: { username:username,
          password: password
        }
      })
      .done(function(res){
        $("#loginHelp").addClass('hide');
        console.log('Successfuly logged');
        this.storeToken(res);
      }.bind(this))
      .fail(function(err){
        if (err.status === 400) {
          $("#loginHelp").removeClass('hide');
          $("#loginHelp").html(
            err.statusText+": "+JSON.parse(err.responseText).message
          );
        }
        console.log(err);
      }.bind(this));
  },
  storeToken: function(res){
    console.log('storeToken');
    window.localStorage.setItem('token',res.token);
    window.localStorage.setItem('user',res.user.username);
    window.localStorage.setItem('userRole',res.user.role);
    window.location.replace("admin/import");
  },
  render: function() {
    return (
      <div className="container">
        <h1>Login</h1>
        <form id="login" method="post" action="admin" className="form">
          <div id="loginHelp" className="alert alert-danger hide"></div>
           <div className="form-group">
          <label className="">Username </label>
          <input ref='username' className="form-control input-md" type="text" placeholder="Username" name="username"/>
          </div>
           <div className="form-group">
      <label className="">Password</label>
        <input  className="form-control input-md" ref='password' type="password" placeholder="Password" name="password"/>
        </div>
          <input type="submit" onClick={this.handleLoginClick} className="btn btn-primary" value="Login"/>
        </form>
      </div>
    );
  }
});


React.render(
  <Login />,
  document.getElementById('content')
);
