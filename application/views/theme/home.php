<?php 
theme_data('title',lang('home'));
?>

	<section class="slider">
	  	<div class="container">
	  		<div class="row">
	  			<div class="col-md-12 col-xs-12 col-sm-12">
				
				<?php if(!empty($home_slider)): ?>
	  				<div class="camera_white_skin" id="camera_random">
						  <?php foreach($home_slider->slides as $index=>$slide): ?>
			        	<div data-src="<?= loc($slide,'slide_photo') ?>" >
						</div>
						<?php endforeach;?>   
					</div>
				<?php endif;?>

	  			</div>
	  		</div>
	  	</div>
	</section>
	<section class="text-under-slider">
		<div class="container">
			<div class="row">
				<div class="col-md-12 col-xs-12 col-sm-12">
					<span>
						<img src="<?= base_url() ?>assets/site/images/layer-1.png">
					</span>
					<span>
						<h4><?= lang('about') ?></h4>
					</span>
					<span>
						<img src="<?= base_url() ?>assets/site/images/layer-1.png">
					</span>
					<p><?= loc( $bio ,'about',false) ?></p>
				</div>
			</div>
		</div>
	</section>
<!-- News -->
<?php if(count($news['results'])>0):?>
	<section class="slick-slider">
		<div class="container">
			<div class="row">
				<div class="col-md-12 col-xs-12 col-sm-12">
					<div class="next_prev">
						<h3><?=lang('latest_news_events')?></h3>
					</div>
					<div class="owl-carousel">
						<?php foreach($news['results'] as $new):?>
					  	<div class="card">
					  		<div class="box-card">
					  			<div class="box-img">
					  				<i class="fa fa-eye hideee" aria-hidden="true"></i>
					  				<img class="card-img-top" src="<?=loc($new,'page_image')?>" alt="<?=loc($new,'page_title')?>">
					  			</div>
								<div class="card-block">
								    <h3 class="card-title"><?=loc($new,'page_title')?> </h3>
								    <a href="<?=site_url('page/'.$new->page_slug)?>" class="read_m"><?=lang('read_more')?>  </a>
								    <span><?=$new->created_date?></span>
					  			</div>
					  		</div>
						</div>
						<?php endforeach;?>
					</div>
				</div>
			</div>
		</div>
	</section>
	<?php endif;?>
<!-- End News -->
