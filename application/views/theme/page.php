
<?php 
theme_data('title',loc($page,'page_title')	);
?> 


<section class="page_banner" data-background="<?=base_url()?>assets/img/background.jpg">
	<div class="container-fluid header_page">
		<div class="row">

		</div>
	</div>
</section>
<section class="text-under-slider3">
	<div class="container">
		<div class="row">
			<div class="col-md-12 col-xs-12 col-sm-12">
				<span>
						<img src="<?= base_url() ?>assets/site/images/layer-1.png">
					</span>
				<span>
						<h4> <?= loc($page,'page_title') ?> </h4>
					</span>
				<span>
						<img src="<?= base_url() ?>assets/site/images/layer-1.png">
					</span>

			</div>
		</div>
	</div>
</section>
<section class="page branch-page">
	<div class="container">
		<div class="row">
			<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
				<div class=" bransh-info">
					<div class="b-mask">
						<span class="bransh-img">
						<img src="<?=loc($page,'page_image')?>" class="img-responsive" alt="<?= loc($page,'page_title') ?>" class="img-responsive img_detales" alt="name">
					</span>

					</div>
				</div>

			</div>
			<div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">

				<div class="clearfix page_content content-box">
					<div class="col-lg-10 col-md-8 col-sm-12 col-xs-12">
						<div class="widget links details_shoping">
							<h3><?= loc($page,'page_subtitle') ?></h3>
							<ul>
								<li>
									<?= loc($page,'page_description') ?>
								</li>
							</ul>

							<p>
								<?= loc($page,'page_content',false) ?>
							</p>

						</div>
					</div>



				</div>
			</div>

		</div>
	</div>
</section>




