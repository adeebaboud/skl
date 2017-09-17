<?php
theme_data('title',loc($section,'section_title') );
?>

<section class="page_banner" data-background="<?= base_url()?>assets/img/background.jpg" >
				<div class="container">
					<div class="row">
					<div class="col-md-12 col-sm-12 col-xs-12 dsFlex">
						<header class="header_page">
							<h1><span><?= loc($section,'section_title') ?></span></h1>
						</header>
					</div>
					</div>
				</div>
</section>


<section class="section_page">
    <div class="container">
            
            <div class="row" id="sectionlist"  dir="<?= enar('ltr','rtl') ?>">
                <?php foreach($pages['results'] as $page): ?>
            <div class="col-md-3 col-sm-4 col-xs-12 ">
                <div class="section-box">
                    <div class="section_img">
                        <img src="<?= thumb(loc($page,'page_image')) ?>" alt="<?= loc($page,'page_title') ?>" class="img-responsive">
                    </div>
                    <div class="section_info">
                        <h3><a href="<?=page_url($page)?>"><?= loc($page,'page_title') ?></a></h3>
                        <p><?= loc($page,'page_description') ?></p>
                        <a href="<?= page_url($page) ?>" class="goto"><?= lang('read_more');?></a>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>





 <?= theme_data('script_files', 
<<<EOT
	if($('#sectionlist ').find('.section-box').length > 4){
		$('#sectionlist ').addClass('owl-carousel').find('.col-xs-12').removeClass('col-md-3 col-sm-4');

		var dir = $('#sectionlist').attr('dir');
        var navText=(dir == 'rtl') ? ["&#xf061;","&#xf060;"] : ["&#xf060;","&#xf061;"]
		$('#sectionlist').owlCarousel({
			items : 1,
			margin : 5,
			loop : true,
			nav :true,
			rtl:(dir == 'rtl') ? true : false,
			responsiveClass:true,
			navText : navText,
			responsive : {
				480 : {
					items : 1,
					margin : 15
				},
				768 : {
					items : 2
				},
				1000:{
					items : 4,
					margin : 5
				}
			}
		});
	}
EOT
 ,true);
?>










