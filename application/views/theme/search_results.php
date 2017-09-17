
<?php 
theme_data('title',lang('search_results')	);
?> 

<section class="page_banner" data-background="<?= base_url()?>assets/img/background.jpg" >
	<div class="container">
		<div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12 dsFlex">
				<header class="header_page">
					<h1><span><?= lang('search_results') ?></span></h1>
				</header>
			</div>
		</div>
	</div>
</section>

 

<section class="section_page search_page">
<div class="container">
 <div class="row">
	 <div class="col-xs-12 col-sm-12">
		 <div class="search_keyword">
			 <strong>
				 <?=lang('search_keyword')?> 
			 </strong>
			 <span><?=$keyword?></span>
			 <?php if(isset($err_keyword)&&!empty($err_keyword)) echo '<span class="span-danger"> '.$err_keyword.'</span>'; ?>
			 
		 </div>
	 </div>
	 
	 
	<div class="col-md-12 col-sm-12 col-xs-12 search-content">


		<?php if(count($results) <= 0):
			echo '<div class="alert alert-warning" role="alert"><i class="fa fa-search"></i> '.lang('no_results').'</div>';
		else:?>
		
		<?php foreach($results as $res):?>

		<div class="col-md-3 col-sm-4 col-xs-12">
		    <article>
				<div class="article_content">
				   <span class="imgmask">
					   <img src="<?=thumb(loc($res,'image'))?>" class="img img-responsive" alt="...">
				   </span>

				   <?php if($res->type == 'page'):?>
				   <h4><a href="<?=site_url('page/'.$res->id)?>"><?=loc($res,'title')?></a></h4>
				   <?php else:?>
				   <h4><a href="<?=site_url('menu')?>"><?=loc($res,'title')?></a></h4>
				   <?php endif;?>
		       </div>
		    </article>
		</div>
		<?php endforeach;?>
		<?php endif;?>
	</div>

</div>

</div>
</section>
