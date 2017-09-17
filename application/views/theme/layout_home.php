<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><?= $bio->name ?>  </title>
    <!--Bootstrap 4.0 CSS  -->
    <link rel="stylesheet" href="<?= base_url() ?>assets/site/css/bootstrap.min.css">
    <!--Fontawesome 4.7.0-->
    <link rel="stylesheet" href="<?= base_url() ?>assets/site/css/font-awesome.min.css">
    <!--Camera Js Css-->
    <link href="<?= base_url() ?>assets/site/css/camera.css" rel="stylesheet" type="text/css">
    <!--Animate Css-->
    <link rel="stylesheet" href="<?= base_url() ?>assets/site/css/animate.css">
    <!--SKL Style Css-->
    <link rel="stylesheet" href="<?= base_url() ?>assets/site/css/style.css">

</head>
<body>
<div class="container-fluid">
    <div class="row">
        <div class="col-md-12 padding-zero">
            <div class="logo animated slideInDown">
                <img src="<?= base_url() ?>assets/site/images/template/logo.png" alt="">
            </div>

            <!-- MAIN HOME SLIDER START -->
            <?php if (!empty($home_slider)) : ?>
                <div class="slider camera_wrap camera_white_skin " id="camera_wrap_1">
                    <?php foreach ($home_slider->slides as $index => $slide) : ?>
                        <div data-src="<?= loc($slide, 'slide_photo') ?>">
                            <?php if (loc($slide, 'slide_title') != "") : ?>
                                <div class="camera_caption fadeFromLeft">
                                    <div class="in-caption">
                                        <h2>
                                            <?php echo loc($slide, 'slide_title'); ?>
                                        </h2>
                                        <?php if (loc($slide, 'slide_description')) : ?>
                                            <h3></h3>
                                            <p>
                                                <?php echo loc($slide, 'slide_description'); ?>
                                            </p><br/>
                                        <?php endif; ?>
                                        <a class="" href="<?= $slide->slide_link ?>">
                                            <?php echo lang('see_details'); ?>
                                        </a>
                                    </div>

                                </div>
                            <?php endif; ?>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
            <!--.camerajs-->
            <nav>
                <div class="menu">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-md-7">
                                <ul>
                                    <?php if (!empty($main_menu)) { ?>
                                        <?php foreach ($main_menu->menu_items as $i => $menu_item) {
                                            $hasSubMenu = $menu_item->submenu_id != null;
                                            if ($hasSubMenu) {
                                                ?>
                                                <li><a class="sup-menu-a <?= menu_link_active($menu_item) ?>" href="#">
                                                    <?= loc($menu_item, 'item_name') ?><i
                                                            class="menu-arrow fa fa-angle-down"
                                                            aria-hidden="true"></i>&nbsp;</a>
                                                <ul class="sub-menu">
                                                <?php foreach (menu($menu_item->submenu_id)->menu_items as $sub_menu_item):
                                                    $hasSubMenu2 = $sub_menu_item->submenu_id != null;
                                                    if ($hasSubMenu2) { ?>
                                                        <li class="<?= menu_link_active($sub_menu_item) ?>">
                                                            <a href="#"><?= loc($sub_menu_item, 'item_name') ?></a>
                                                            <ul class="sub-menu">
                                                                <?php foreach (menu($sub_menu_item->submenu_id)->menu_items as $sub_menu_item2): ?>
                                                                    <li class="  <?= menu_link_active($sub_menu_item2) ?>">
                                                                        <a href="<?= menu_link($sub_menu_item2) ?>"><?= loc($sub_menu_item2, 'item_name') ?>  </a>
                                                                    </li>
                                                                <?php endforeach; ?>
                                                            </ul>
                                                        </li>
                                                    <?php } else { ?>
                                                <li class="<?= menu_link_active($sub_menu_item) ?>">
                                                    <a href="<?= menu_link($sub_menu_item) ?>">
                                                        <?= loc($sub_menu_item, 'item_name') ?>
                                                    </a>
                                                </li>
                                            <?php } ?>
                                            <?php endforeach; ?>
                                            </ul>
                                            </li>
                                        <?php }
                                    else { ?>
                                            <li><a class="sup-menu-a <?= menu_link_active($menu_item) ?>"
                                                   href="<?= menu_link($menu_item) ?>"><?= loc($menu_item, 'item_name') ?></a><label>|</label></li>
                                        <?php  }
                                    }
                                    } ?>
                                </ul>
                            </div>
                            <div class="col-md-3">
                                <form class="form-inline" action="<?= site_url('search') ?>" method="post">
                                    <div class="search">
                                        <button>&#xf002;</button>
                                        <input name="keyword" type="text" placeholder="<?= lang('search') ?>">
                                    </div>
                                </form>
                            </div>
                            <div class="col-md-2">
                                <div class="social">
                                    <ul class="social-right">
                                        <li><a href="<?= $bio->facebook ?>">&#xf09a;</a></li>
                                        <li><a href="<?= $bio->instagram ?>">&#xf16d;</a></li>
                                        <li><a href="<?= $bio->twitter ?>">&#xf099;</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
        <!--.col-md-12/slider-->
    </div>
    <!--.row-->
    <section>
        <div class="row">
            <div class="col-md-3 padding-zero">
                <div class="about-left">
                    <h1><?php echo lang('about_kitchen_line'); ?></h1>
                </div>
            </div>
            <!--.col-md-3-->
            <div class="col-md-9 padding-zero">
                <div class="about-right">
                    <?= get_first(loc($bio, 'about', false), '</p>', 3) ?>


                    <div>
                    <a href="<?= site_url('about-us') ?>" class="orange-button pull-right"><?php echo lang('more'); ?></a>
                    </div>

                </div>
                <!--.about-right-->
            </div>
            <!--.col-md-9-->
        </div>
        <!--.row-->
    </section>
    <!--.section-->
    <div class="why">
        <div class="row shadow5">
            <div class="col-md-9 why-left padding-zero">
                <?= get_first( loc($bio,'why_kitchen_line',false),'</ul>',1  )  ?>

                <div>
                <a href="<?= site_url('about-us') ?>" class="orange-button pull-right"><?php echo lang('more'); ?></a>
                </div>
            </div>
            <div class="col-md-3 why-right padding-zero">
                <p><?php echo lang('why_kitchen_line'); ?></p>
            </div>
        </div>
        <!--.row-->
    </div>
    <!--.why-->
    <div class="products">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="product-head">
                        <?php echo lang('top_products'); ?>
                    </div>
                </div>
            </div>
            <!--.row-->
        </div>
        <!--.container-->
        <div class="product-tabs container">
            <div class="row">
                <div class="col-md-1"></div>
                <div class="col-md-10">
                    <ul class="nav nav-tabs">
                        <li class="active">
                            <a href="#1" data-toggle="tab"><?php echo lang('hot_products'); ?></a>
                        </li>
                        <li>
                            <a href="#2" data-toggle="tab"><?php echo lang('new_products'); ?></a>
                        </li>
                        <li>
                            <a href="#3" data-toggle="tab"><?php echo lang('best_sellers'); ?></a>
                        </li>
                    </ul>
                    <!--.nav nav-tabs-->
                </div>
                <!--.col-md-8-->
                <div class="col-md-1"></div>
            </div>
            <!--.row-->
            <div class="row">
                <div class="col-md-1"></div>
                <div class="col-md-10">
                    <div class="tab-content">
                        <div class="tab-pane active" id="1">
                            <div class="regular slider">
                                <div class="product-frame">
                                    <div class="product-content">
                                        <div class="product-image">
                                            <img class="img-fluid"
                                                 src="<?= base_url() ?>assets/site/images/products/cat1.jpg">
                                        </div>
                                        <div class="product-des">
                                            <h5><a href="#">Product</a></h5>
                                            <p> Lorem ipsum dolor sit amet, consectetur!</p>
                                            <span>270.00 SR</span>
                                        </div>
                                    </div>
                                    <div class="product-content">
                                        <div class="product-image">
                                            <img class="img-fluid"
                                                 src="<?= base_url() ?>assets/site/images/products/cat2.jpg">
                                        </div>
                                        <div class="product-des">
                                            <h5><a href="#">Product</a></h5>
                                            <p> Lorem ipsum dolor sit amet, consectetur!</p>
                                            <span>270.00 SR</span>
                                        </div>
                                    </div>
                                </div>
                                <!--.product-frame-->
                                <div class="product-frame">
                                    <div class="product-content">
                                        <div class="product-image">
                                            <img class="img-fluid"
                                                 src="<?= base_url() ?>assets/site/images/products/cat1.jpg">
                                        </div>
                                        <div class="product-des">
                                            <h5><a href="#">Product</a></h5>
                                            <p> Lorem ipsum dolor sit amet, consectetur!</p>
                                            <span>270.00 SR</span>
                                        </div>
                                    </div>
                                    <div class="product-content">
                                        <div class="product-image">
                                            <img class="img-fluid"
                                                 src="<?= base_url() ?>assets/site/images/products/cat2.jpg">
                                        </div>
                                        <div class="product-des">
                                            <h5><a href="#">Product</a></h5>
                                            <p> Lorem ipsum dolor sit amet, consectetur!</p>
                                            <span>270.00 SR</span>
                                        </div>
                                    </div>
                                </div>
                                <!--.product-frame-->
                                <div class="product-frame">
                                    <div class="product-content">
                                        <div class="product-image">
                                            <img class="img-fluid"
                                                 src="<?= base_url() ?>assets/site/images/products/cat3.jpg">
                                        </div>
                                        <div class="product-des">
                                            <h5><a href="#">Product</a></h5>
                                            <p> Lorem ipsum dolor sit amet, consectetur!</p>
                                            <span>270.00 SR</span>
                                        </div>
                                    </div>
                                    <div class="product-content">
                                        <div class="product-image">
                                            <img class="img-fluid"
                                                 src="<?= base_url() ?>assets/site/images/products/cat4.jpg">
                                        </div>
                                        <div class="product-des">
                                            <h5><a href="#">Product</a></h5>
                                            <p> Lorem ipsum dolor sit amet, consectetur!</p>
                                            <span>270.00 SR</span>
                                        </div>
                                    </div>
                                </div>
                                <!--.product-frame-->
                                <div class="product-frame">
                                    <div class="product-content">
                                        <div class="product-image">
                                            <img class="img-fluid"
                                                 src="<?= base_url() ?>assets/site/images/products/cat7.jpg">
                                        </div>
                                        <div class="product-des">
                                            <h5><a href="#">Product</a></h5>
                                            <p> Lorem ipsum dolor sit amet, consectetur!</p>
                                            <span>270.00 SR</span>
                                        </div>
                                    </div>
                                    <div class="product-content">
                                        <div class="product-image">
                                            <img class="img-fluid"
                                                 src="<?= base_url() ?>assets/site/images/products/cat6.jpg">
                                        </div>
                                        <div class="product-des">
                                            <h5><a href="#">Product</a></h5>
                                            <p> Lorem ipsum dolor sit amet, consectetur!</p>
                                            <span>270.00 SR</span>
                                        </div>
                                    </div>
                                </div>
                                <!--.product-frame-->
                                <div class="product-frame">
                                    <div class="product-content">
                                        <div class="product-image">
                                            <img class="img-fluid"
                                                 src="<?= base_url() ?>assets/site/images/products/cat7.jpg">
                                        </div>
                                        <div class="product-des">
                                            <h5><a href="#">Product</a></h5>
                                            <p> Lorem ipsum dolor sit amet, consectetur!</p>
                                            <span>270.00 SR</span>
                                        </div>
                                    </div>
                                    <div class="product-content">
                                        <div class="product-image">
                                            <img class="img-fluid"
                                                 src="<?= base_url() ?>assets/site/images/products/cat6.jpg">
                                        </div>
                                        <div class="product-des">
                                            <h5><a href="#">Product</a></h5>
                                            <p> Lorem ipsum dolor sit amet, consectetur!</p>
                                            <span>270.00 SR</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <!--.regular slider-->
                        </div>
                        <div class="tab-pane" id="2">
                            <div class="regular slider">
                                <div class="product-frame">
                                    <div class="product-content">
                                        <div class="product-image">
                                            <img class="img-fluid"
                                                 src="<?= base_url() ?>assets/site/images/products/cat1.jpg">
                                        </div>
                                        <div class="product-des">
                                            <h5><a href="#">Product</a></h5>
                                            <p> Lorem ipsum dolor sit amet, consectetur!</p>
                                            <span>270.00 SR</span>
                                        </div>
                                    </div>
                                    <div class="product-content">
                                        <div class="product-image">
                                            <img class="img-fluid"
                                                 src="<?= base_url() ?>assets/site/images/products/cat2.jpg">
                                        </div>
                                        <div class="product-des">
                                            <h5><a href="#">Product</a></h5>
                                            <p> Lorem ipsum dolor sit amet, consectetur!</p>
                                            <span>270.00 SR</span>
                                        </div>
                                    </div>
                                </div>
                                <!--.product-frame-->
                                <div class="product-frame">
                                    <div class="product-content">
                                        <div class="product-image">
                                            <img class="img-fluid"
                                                 src="<?= base_url() ?>assets/site/images/products/cat1.jpg">
                                        </div>
                                        <div class="product-des">
                                            <h5><a href="#">Product</a></h5>
                                            <p> Lorem ipsum dolor sit amet, consectetur!</p>
                                            <span>270.00 SR</span>
                                        </div>
                                    </div>
                                    <div class="product-content">
                                        <div class="product-image">
                                            <img class="img-fluid"
                                                 src="<?= base_url() ?>assets/site/images/products/cat2.jpg">
                                        </div>
                                        <div class="product-des">
                                            <h5><a href="#">Product</a></h5>
                                            <p> Lorem ipsum dolor sit amet, consectetur!</p>
                                            <span>270.00 SR</span>
                                        </div>
                                    </div>
                                </div>
                                <!--.product-frame-->
                                <div class="product-frame">
                                    <div class="product-content">
                                        <div class="product-image">
                                            <img class="img-fluid"
                                                 src="<?= base_url() ?>assets/site/images/products/cat3.jpg">
                                        </div>
                                        <div class="product-des">
                                            <h5><a href="#">Product</a></h5>
                                            <p> Lorem ipsum dolor sit amet, consectetur!</p>
                                            <span>270.00 SR</span>
                                        </div>
                                    </div>
                                    <div class="product-content">
                                        <div class="product-image">
                                            <img class="img-fluid"
                                                 src="<?= base_url() ?>assets/site/images/products/cat4.jpg">
                                        </div>
                                        <div class="product-des">
                                            <h5><a href="#">Product</a></h5>
                                            <p> Lorem ipsum dolor sit amet, consectetur!</p>
                                            <span>270.00 SR</span>
                                        </div>
                                    </div>
                                </div>
                                <!--.product-frame-->
                                <div class="product-frame">
                                    <div class="product-content">
                                        <div class="product-image">
                                            <img class="img-fluid"
                                                 src="<?= base_url() ?>assets/site/images/products/cat7.jpg">
                                        </div>
                                        <div class="product-des">
                                            <h5><a href="#">Product</a></h5>
                                            <p> Lorem ipsum dolor sit amet, consectetur!</p>
                                            <span>270.00 SR</span>
                                        </div>
                                    </div>
                                    <div class="product-content">
                                        <div class="product-image">
                                            <img class="img-fluid"
                                                 src="<?= base_url() ?>assets/site/images/products/cat6.jpg">
                                        </div>
                                        <div class="product-des">
                                            <h5><a href="#">Product</a></h5>
                                            <p> Lorem ipsum dolor sit amet, consectetur!</p>
                                            <span>270.00 SR</span>
                                        </div>
                                    </div>
                                </div>
                                <!--.product-frame-->
                                <div class="product-frame">
                                    <div class="product-content">
                                        <div class="product-image">
                                            <img class="img-fluid"
                                                 src="<?= base_url() ?>assets/site/images/products/cat7.jpg">
                                        </div>
                                        <div class="product-des">
                                            <h5><a href="#">Product</a></h5>
                                            <p> Lorem ipsum dolor sit amet, consectetur!</p>
                                            <span>270.00 SR</span>
                                        </div>
                                    </div>
                                    <div class="product-content">
                                        <div class="product-image">
                                            <img class="img-fluid"
                                                 src="<?= base_url() ?>assets/site/images/products/cat6.jpg">
                                        </div>
                                        <div class="product-des">
                                            <h5><a href="#">Product</a></h5>
                                            <p> Lorem ipsum dolor sit amet, consectetur!</p>
                                            <span>270.00 SR</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <!--.regular slider-->
                        </div>
                        <div class="tab-pane" id="3">
                            slider3
                        </div>
                    </div>
                    <!--.product-content-->
                </div>
                <!--.col-md-8-->
                <div class="col-md-1"></div>
            </div>
            <!--.row-->
        </div>
        <!--.container / product-tabs-->
    </div>
    <!--.products-->
    <div class="shadow5">
        <div class="trademarks-back">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <div class="trademarks">
                            <h2><?php echo lang('trademarks'); ?></h2>
                            
                            <?=  loc($bio,'trademarks',false)   ?>

                        </div>
                    </div>
                    <!--.col-md-12-->
                </div>
                <!--.row-->
            </div>
            <!--.container-->
        </div>
        <!--.trademarks-back-->
        <div class="provider-back">
            <div class="container-fluid">
                <div class="row">
                    <div class="provider">
                        <div class="col-md-12 text-center">
                            <ul>
                                <li><img class="img-fluid" src="<?= base_url() ?>assets/site/images/template/1.jpg"
                                         alt=""></li>
                                <li><img class="img-fluid" src="<?= base_url() ?>assets/site/images/template/2.jpg"
                                         alt=""></li>
                                <li><img class="img-fluid" src="<?= base_url() ?>assets/site/images/template/3.jpg"
                                         alt=""></li>
                                <li><img class="img-fluid" src="<?= base_url() ?>assets/site/images/template/4.jpg"
                                         alt=""></li>
                                <li><img class="img-fluid" src="<?= base_url() ?>assets/site/images/template/5.jpg"
                                         alt=""></li>
                                <li><img class="img-fluid" src="<?= base_url() ?>assets/site/images/template/6.jpg"
                                         alt=""></li>
                                <li><img class="img-fluid" src="<?= base_url() ?>assets/site/images/template/7.jpg"
                                         alt=""></li>
                                <li><img class="img-fluid" src="<?= base_url() ?>assets/site/images/template/8.jpg"
                                         alt=""></li>
                            </ul>
                            <!--.col-md-12-->
                        </div>
                        <!--.col-md-12-->
                    </div>
                    <!--.row-->
                </div>
                <!--.provider-->
            </div>
            <!--.container-fluid-->
        </div>
        <!--.provider-back-->
    </div>
    <!--.shadow5-->
    <div class="container offer">
        <div class="row">
            <div class="col-md-6">
                <img class="img-fluid" src="<?= base_url() ?>assets/site/images/template/gift.jpg" alt="">
            </div>
            <!--.col-md-6-->
            <div class="col-md-6">
                <div class="offer-text">
                    <h2 id="offer-head"><?php echo lang('special_offer'); ?></h2>
                    <p id="offer-bottom-head">to the new season</p>
                    <p id="offer-top-description">Very short one or two describing sentences.
                    </p>
                    <p id="offer-bottom-description">portable. beauty. personal.</p>
                    <div id="offer-button">
                        <a href="#" class="orange-button pull-left"><?php echo lang('see_details'); ?></a>
                    </div>
                    <!--.offer-button-->
                </div>
                <!--.offer-text-->
            </div>
            <!--.col-md-6-->
        </div>
        <!--.row-->
    </div>
    <!--.container offer-->
    <div class="offer-coupon-back">
        <div class="container">
            <div class="row">
                <div class="col-md-3">
                    <div class="offer-coupon-circle">
                        <p>GET THE</p>
                        <h1>10 SR</h1>
                        <p>COUPON</p>
                    </div>
                    <!--.offer-coupon-circle-->
                </div>
                <!--.col-md-3-->
                <div class="col-md-3">

                    <div class="offer-coupon-text">
                        <p><?php echo lang('newsletter_message'); ?></p>
                    </div>
                    <!--.offer-coupon-text-->
                </div>
                <!--.col-md-3-->
                <div class="col-md-6">
                    <form action="<?php echo site_url() ?>/home/news_subscriptions" method="post" class="newsletter">
                        <div class="alert alert-success success" style="display:none"></div>
                        <div class=" alert alert-danger alert-error  error" style="display:none"></div>
                        <div class="email-frame">
                            <input id="coupon-email" type="email" name="sender_email"
                                   placeholder="<?php echo lang('newsletter_input_placeholder'); ?>">
                            <button id="coupon-email-button" type="submit">+</button>
                        </div>
                    </form>
                </div>
                <!--.col-md-6-->
            </div>
            <!--.row-->
        </div>
        <!--.container-->
    </div>
    <!--.offer-coupon-back-->
    <footer>
        <div class="footer-back">
            <div class="container">
                <div class="row">
                    <div class="col-md-3">
                        <h5><?php echo lang('kitchens'); ?></h5>
                        <hr>
                        <ul>
                            <li><a href="">Wooden Kitchen</a></li>
                            <li><a href="">Aluminum kitchen</a></li>
                            <li><a href="">Wood & Aluminum</a></li>
                        </ul>
                    </div>
                    <div class="col-md-3">
                        <h5><?php echo lang('products'); ?></h5>
                        <hr>
                        <ul>

                            <li><a href="">Kitchen Appliances</a></li>
                            <li><a href="">hoods</a></li>
                            <li><a href="">Kitchen Accessories</a></li>
                            <li><a href="">Sinks & Faucets</a></li>
                        </ul>
                    </div>
                    <div class="col-md-3">
                        <h5><?php echo lang('about'); ?></h5>
                        <hr>
                        <ul>
                            <li><a href=""><?php echo lang('about_us'); ?></a></li>
                            <li><a href=""><?php echo lang('why_kitchen_line'); ?></a></li>
                            <li><a href=""><?php echo lang('company_activity'); ?></a></li>
                            <li><a href=""><?php echo lang('trademarks'); ?></a></li>
                        </ul>
                    </div>
                    <div class="col-md-3">
                        <h5><?php echo lang('head_office'); ?></h5>
                        <hr>
                        <label>Jeddah Head office & Showroam</label>
                        <label>Madinah Road in front of Sary bridge</label> <label> P.O Box: 118747 Jeddah 21312</label>
                        <label>P.O Box: 118747 Jeddah 21312</label>
                        <label>(+966) 12 6822902</label>
                        <label>(+966) 12 6980343</label>
                        <ul id="social-footer">
                            <li><a href="">&#xf09a;</a></li>
                            <li><a href="">&#xf099;</a></li>
                            <li><a href="">&#xf0e5;</a></li>
                            <li><a href="">&#xf09e;</a></li>
                        </ul>
                    </div>
                </div>
                <!--.row-->
            </div>
            <!--.container-->
        </div>
        <!--.footer-back-->
        <div class="copy-back">
            <hr>
            <div class="container">
                <div class="row">
                    <div class="col-md-8">
                        <div class="copy-text">
                            <p>© <label>KitchenLine 2017.</label>All Rights Reserved.</p>
                            <p>Designed by <label>DAS 360</label></p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="sitemap">
                            <a href="#">Privacy Policy</a>|
                            <a href="#">Terms & Conditions</a>|
                            <a href="#">Sitemap</a>
                        </div>
                        <!--.sitemap-->
                    </div>
                    <!--.col-md-3-->
                </div>
                <!--.row-->
            </div>
            <!--.container-->
        </div>
        <!--.copy-back-->
    </footer>
    <!--.footer-->
</div>
<div id="preloader">
    <div id="status">&nbsp;</div>
</div>

<script src="<?= base_url() ?>assets/site/js/jquery.min.js" type="text/javascript">
</script>
<script src="<?= base_url() ?>assets/site/js/jquery.mobile.customized.min.js" type="text/javascript">
</script>
<script src="<?= base_url() ?>assets/site/js/jquery.easing.1.3.js" type="text/javascript">
</script>
<script src="<?= base_url() ?>assets/site/js/camera.js" type="text/javascript">
</script>
<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
<script src="<?= base_url() ?>assets/site/js/slick.js"></script>
<script>
    $(document).on('ready', function () {
        $(".regular").slick({
            dots: true,
            infinite: true,
            slidesToShow: 4,
            slidesToScroll: 2
        });
    });
    jQuery(function () {
        jQuery('#camera_wrap_1').camera({
            thumbnails: true
        });
    });
    $(window).on('load', function () { // makes sure the whole site is loaded
        $('#status').fadeOut(); // will first fade out the loading animation
        $('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
        $('body').delay(350).css({
            'overflow': 'visible'
        });
    })
</script>
</body>

</html>