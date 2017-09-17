<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><?= $bio->name?> :: <?= theme_data('title') ?></title>

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
<div class="container-fluid shadow2">
    <div class="row">
        <div class="col-md-12 padding-zero">
            <div class="logo animated slideInDown">
                <img src="<?= base_url() ?>assets/site/images/template/logo.png" alt="">
            </div>
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
            <div class="content-about-image">

            </div>
            <!--.camerajs-->

        </div>
        <!--.col-md-12/slider-->
    </div>
    <!--.row-->
</div>

<?= $content ?>

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