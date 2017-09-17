<!DOCTYPE html>
<html ng-app="dasApp">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>skl | Dashboard</title>
    <!-- Tell the browser to be responsive to screen width -->
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    
	<link rel="stylesheet" href="<?= base_url('assets') ?>/css/style-min.css">

    <link rel="stylesheet" href="<?= base_url('assets') ?>/css/dashboard-min.css">
	
	
    <link rel="stylesheet" href="<?= base_url('assets') ?>/css/skins/dashboard-colors.css">

    <link rel="stylesheet" href="<?= base_url('assets') ?>/css/colorpicker.min.css">
	<link rel="stylesheet" href="<?= base_url('assets') ?>/css/toaster.min.css">
	
	<link rel="stylesheet" href="<?= base_url('assets') ?>/css/fullcalendar.min.css">
  	<link rel="stylesheet" href="<?= base_url('assets') ?>/css/datetimepicker.css">
	
	

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
        <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body ng-controller="MainController" class=" skin-blue  sidebar-mini  ">
    <div class="wrapper">

      <header class="main-header fixedTop">
        <!-- Logo -->
        <a href="#/" class="logo">
          <!-- logo for regular state and mobile devices -->
           <span class="logo-mini">
            <img src="<?= base_url() ?>/assets/img/log-icon.png">
           </span>
          <span class="logo-lg">
            <img  style="height:47px;margin:0;"  src="<?= base_url() ?>/assets/img/logo-white.png">
            <b>skl</b>
          </span>

        </a>
        <!-- Header Navbar: style can be found in header.less -->
        <nav class="navbar navbar-static-top " role="navigation">
          <!-- Sidebar toggle button-->
          <a href="#" class="sidebar-toggle tran" data-toggle="offcanvas" role="button">
            <span class="sr-only">Toggle navigation</span>
          </a>
          <div class="navbar-custom-menu">
            <ul class="nav navbar-nav">
              <!-- Messages: style can be found in dropdown.less-->

              <li uib-dropdown is-open="dropdowns.messages_isopen" class="dropdown messages-menu" ng-show="user.is_admin">
                <a href="#" class="dropdown-toggle tran" uib-dropdown-toggle >
                  <i class="fa fa-envelope-o"></i>
                  <span class="label label-success" ng-show="messages.length > 0">{{messages.length}}</span>
                </a>
                <ul class="dropdown-menu" uib-dropdown-menu>
                  <li class="header" ng-show="messages.length > 0">You have {{messages.length}} new messages</li>
                  <li class="header" ng-show="messages.length == 0">No new messages</li>
                  <li>
                    <!-- inner menu: contains the actual data -->
                    <ul class="menu">
                      <li ng-repeat="message in messages"><!-- start message -->
                        <a href="#/contactus">
                          
                          <h4>
							<i class="fa fa-user"></i> {{message.sender_name}}
                            <small><i class="fa fa-clock-o"></i> {{message.contact_date}}</small>
                          </h4>
                          <p> {{message.title}}</p>
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li class="footer"><a href="#/contactus">See All Messages</a></li>
                </ul>
              </li>

              <!-- User Account: style can be found in dropdown.less -->
              <li uib-dropdown is-open="dropdowns.userbox_isopen" class="dropdown user user-menu">
                <a href="#" class="dropdown-toggle tran" uib-dropdown-toggle >
                  <img src="<?= base_url() ?>/assets/img/sample.png" class="user-image" alt="User Image">
                  <span class="hidden-xs">{{user.name}}</span>
                </a>
                <ul uib-dropdown-menu class="dropdown-menu">
                  <!-- User image -->
                  <li class="user-header">
                  
                    <p>
                      {{user.name}} - {{user.groups[0].description}}
                      <small>Member since Nov. 2016</small>
                    </p>
                  </li>
                  <li class="user-footer">
					<div class="center">
                      <a href="<?= site_url('auth/edit_user')?>/{{user.id}}" class="btn btn-info btn-flat btn-block">Profile</a>
                    </div>
					<div class="center">
                      <a href="<?= site_url('auth/change_password')?>" class="btn btn-warning btn-flat btn-block">Change Password</a>
                    </div>
                    <div class="center">
                      <a href="<?= site_url('auth/logout')?>" class="btn btn-default btn-flat btn-block">Sign out</a>
                    </div>
                  </li>
                </ul>
              </li> 
            </ul>
          </div>
        </nav>
      </header>
      <!-- Left side column. contains the logo and sidebar -->
      <aside class="main-sidebar fixed">
        <!-- sidebar: style can be found in sidebar.less -->
        <div data-secroll data-maxheight="95vh">
            <div ng-include="base_url + 'assets/dashboard/views/partials/leftmenu.html'"></div>
        </div>
        <!-- /.sidebar -->
      </aside>

      <!-- Content Wrapper. Contains page content -->
      <div class="content-wrapper" ng-view>
			
      </div><!-- /.content-wrapper -->
	  <toaster-container toaster-options="{'close-button': true,'position-class': 'toast-bottom-left'}"></toaster-container>
      <footer class="main-footer">
        <div class="pull-right hidden-xs">
          <b>Version</b> 0.3.0
        </div>
        <strong>Copyright &copy; 2016 <a href="http://das-360.com">DAS-360</a>.</strong> All rights reserved.
      </footer> 
      <!-- /.control-sidebar -->
    </div><!-- ./wrapper -->

	
    <script src="<?= base_url('assets') ?>/js/pkg.js"></script>
 

    <script src="<?= base_url('assets') ?>/js/app.js"></script>
	
	<script src="<?= base_url('assets') ?>/js/toaster.min.js"></script>
	
	
	 <script>
	 var base_url = '<?= base_url() ?>';
     var dasAppUser = <?= json_encode($user) ?>  ;
     var sessionId = '<?= $this->session->session_id ?>';
	 </script>
	 

    <script src="<?= base_url('assets') ?>/js/ngapp.js"></script>
	
	<script src="<?= base_url('assets') ?>/js/script.js"></script>
	
	<script src="<?= base_url('assets') ?>/js/bootstrap-colorpicker-module.min.js"></script> 
  <script src="<?= base_url('assets') ?>/plugins/datetimepicker.js"></script>
	<script src="<?= base_url('assets') ?>/plugins/datetimepicker.templates.js"></script>
	

  </body>
</html>
