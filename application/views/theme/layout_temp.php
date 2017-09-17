<!DOCTYPE html>
<html>
<head>
	<title><?= $bio->name?> :: <?= theme_data('title') ?></title>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" type="text/css" href="<?= base_url() ?>assets/site/css/style-<?= lang() == 'ar'? 'ar' : 'en' ?>.css">
	</head>
<body>
  	<header>
		<section class="after-menu">
			<div class="container">
				<div class="row">
					<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
						<ul class="lang">
							<li><a href="<?= base_url(lang() == 'ar' ? 'en' : 'ar') ?>"><p><?= lang('lang_title') ?></p><i class="fa fa-globe" aria-hidden="true"></i></a></li>
							<li><a href="<?=site_url('contact-us')?>"><p><?= lang('Locator') ?></p><i class="fa fa-map-marker" aria-hidden="true"></i></a></li>
							<li><a href=""  data-toggle="modal" data-target="#myModal"><p><?= lang('careers') ?></p><i class="fa fa-id-card-o" aria-hidden="true"></i></a></li>
							<li><a href=""><p><?= lang('Newsletter') ?></p><i class="fa fa-envelope-open" aria-hidden="true"></i></a></li>
						</ul>
					</div>
					<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
						<ul class="list-unstyled social-header">
      						<li>
					            <a href="<?= $bio->facebook ?>" target="_blank">
					                <i class="fa fa-facebook"></i>
					            </a>
					        </li>
					       <li>
					            <a href="<?= $bio->youtube ?>" target="_blank">
					                <i class="fa fa-youtube-play"></i>
					            </a>
					        </li>
					      
					        <li>
					            <a href="<?= $bio->instagram ?>" target="_blank">
					                <i class="fa fa-instagram"></i>
					            </a>
					        </li>
					    </ul>
						<form class="form-inline" action="<?=site_url('search')?>" method="post">
						  <div class="form-group">
						    <div class="input-group">
						      <input type="text" name="keyword" class="form-control" id="exampleInputAmount" placeholder="<?=lang('search')?>">
						       <div class="input-group-addon"><button><i class="fa fa-search" aria-hidden="true"></i></button></div>
						    </div>
						  </div>
						</form>
					</div>
				</div>
			</div>
		</section>
		<section class="menu">

			<div class="container">
				<div class="row">
					<div class="col-md-2">
						<a href="<?=site_url()?>" class="logo"><img src="<?= loc($bio,'logo')?>" class="img-responsive"></a>
					</div>

					<div class="col-md-10">
						<nav class="navbar navbar-default">
					  <div class="container-fluid">
					    <!-- Brand and toggle get grouped for better mobile display -->
					    <div class="navbar-header">
					      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
					        <span class="sr-only">Toggle navigation</span>
					        <span class="icon-bar"></span>
					        <span class="icon-bar"></span>
					        <span class="icon-bar"></span>
					      </button>
					    </div>
					    <!-- Collect the nav links, forms, and other content for toggling -->
					    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					      	<ul class="nav navbar-nav">

					        	  <?php if(!empty($main_menu)) :?>
                    <?php foreach($main_menu->menu_items as $i=>$menu_item) :
                        $hasSubMenu = $menu_item->submenu_id != null;
                        if($hasSubMenu){
                            ?>
                            <li class="dropdown <?= menu_link_active($menu_item) ?>">
                                 <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                                       <?= loc($menu_item,'item_name') ?><span class="caret"></span>
                                 </a>
                                <ul class="dropdown-menu">
                                    <?php foreach(menu($menu_item->submenu_id)->menu_items as $sub_menu_item):

                                        $hasSubMenu2 = $sub_menu_item->submenu_id != null;
                                        if($hasSubMenu2){
                                            ?>

                                            <li class="dropdown <?= menu_link_active($sub_menu_item) ?>"   >
                                                <a href="#"><?= loc($sub_menu_item,'item_name') ?>  </a>
                                                <ul class="sub-menu">
                                                    <?php foreach(menu($sub_menu_item->submenu_id)->menu_items as $sub_menu_item2): ?>
                                                        <li class="  <?= menu_link_active($sub_menu_item2) ?>"  >
                                                            <a href="<?= menu_link($sub_menu_item2) ?>"><?= loc($sub_menu_item2,'item_name') ?>  </a>
                                                        </li>
                                                    <?php endforeach; ?>
                                                </ul>
                                            </li>

                                            <?php
                                        }else{
                                            ?>
                                            <li class="<?= menu_link_active($sub_menu_item) ?>" >
                                                <a href="<?= menu_link($sub_menu_item) ?>">
                                                    <span><?= loc($sub_menu_item,'item_name') ?></span>
                                                </a>

                                            </li>
                                            <?php
                                        }?>
                                    <?php endforeach; ?>
                                </ul>
                            </li>
                            <?php
                        }else{
                            ?>
                            <li class="<?= menu_link_active($menu_item) ?>" >
                                <a href="<?= menu_link($menu_item) ?>">
                                    <span><?= loc($menu_item,'item_name') ?></span>
                                </a>

                            </li>
                            <?php
                        }
                    endforeach; ?>
                <?php endif; ?>

					      	</ul>
					    </div><!-- /.navbar-collapse -->
					  </div><!-- /.container-fluid -->
					</nav>
					</div>
				</div>
			</div>
		</section>
	  </header>
	  


<?= $content ?>



		<footer class="container-fluid footer-links">
			<div class="row">
				<div class="container">
					<div class="col-md-12 col-xs-12 col-sm-12 text-center">
						<ul class="">

                              <?php if(!empty($footer_menu)) :?>
                                  <?php foreach($footer_menu->menu_items as $i=>$menu_item) :?>
                                        <li class="<?= menu_link_active($menu_item) ?>" >
                                             <a href="<?= menu_link($menu_item) ?>">
                                                  <?= loc($menu_item,'item_name') ?> 
                                              </a>
                                        </li>
                                <?php  endforeach; ?>
                           <?php endif; ?>

						</ul>
						
					</div> 
					<div class="col-12 text-center copyrights">
						<p><?=lang('copyright')?>.	<?=lang('development_by')?> : <a href="http://www.das-360.com" target="_blank">DAS 360</a></p>
					</div>
				</div>
			</div>
		</footer>

<script>
	var base_url = '<?= base_url() ?>';
	var lang = '<?=lang()?>';
</script>

<script type="text/javascript" src="<?= base_url() ?>assets/site/js/jquery-3.1.1.min.js"></script>
<script type="text/javascript" src="<?= base_url() ?>assets/site/js/jquery.easing.1.3.js"></script>
<script type="text/javascript" src="<?= base_url() ?>assets/site/js/camera.min.js"></script>
<script type="text/javascript" src="<?= base_url() ?>assets/site/js/bootstrap.min.js"></script>
<script type="text/javascript" src="<?= base_url() ?>assets/site/js/owl.carousel.min.js"></script>
<script type="text/javascript" src="<?= base_url() ?>assets/site/js/slick.min.js"></script>
<script type="text/javascript" src="<?= base_url() ?>assets/site/js/slick.min.js"></script><script type="text/javascript" src="<?= base_url() ?>assets/site/js/tabs.js"></script>
<script type="text/javascript" src="<?= base_url() ?>assets/site/js/scripts.js"></script>

<script type="text/javascript" src="<?= base_url() ?>assets/site/js/scripts-map.js"></script>

<script type="text/javascript" src="<?= base_url() ?>assets/js/ajax-form.js"></script>

<?php 
if(is_array(theme_data('scripts'))):
    foreach (theme_data('scripts') as $script): 
?>
<script src="<?=$script?>"></script>
<?php 
    endforeach;
endif;
?> 



<?php
if(is_array(theme_data('script_files'))):
    foreach (theme_data('script_files') as $script):
 echo "<script type=\"text/javascript\">". $script ."</script>";
    endforeach;
endif;
?>

 



 


</body>
</html>

