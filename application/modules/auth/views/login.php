<h1  class="text-center"><?php echo lang('login_heading');?></h1>


<p  class="text-center"><?php echo lang('login_subheading');?></p>





<div id="infoMessage" ><?php echo $message;?></div>





<?php echo form_open("auth/login");?>





  <p>


    <?php echo lang('login_identity_label', 'identity');?>


    <?php echo form_input($identity,'','class="form-control"');?>


  </p>





  <p>


    <?php echo lang('login_password_label', 'password');?>


    <?php echo form_input($password,'','class="form-control"');?>


  </p>





  <p>


    <?php echo lang('login_remember_label', 'remember');?>


    <?php echo form_checkbox('remember', '1', FALSE, 'id="remember"');?>


  </p>








  <p class="text-center"><?php echo form_submit('submit', lang('login_submit_btn'), 'class="btn btn-primary"');?></p>





<?php echo form_close();?>





<p  class="text-center"><a href="forgot_password"><?php echo lang('login_forgot_password');?></a></p>
