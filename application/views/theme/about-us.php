<?php
theme_data('title',lang('about_us'));
?>
<main>
    <div class="about-us">
        <h2 class="text-center" id="heading-1"><?php echo lang('about_us'); ?></h2>
        <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                <div class="box" id="first">
                    <img src="<?php echo base_url()?>assets/site/images/about/about-1.png" alt="About image #1" class="img-fluid">
                </div>
                <div id="vision" class="mt-3">
                    <h2 id="heading-2"><?php echo lang('vision_mission_values'); ?></h2>
                    <strong><?php echo lang('our_vision'); ?></strong>
                    <?=  loc($bio,'vision',false)   ?>

                    <strong><?php echo lang('our_mission'); ?></strong>
                    <?=  loc($bio,'mission',false)   ?>

                    <strong><?php echo lang('our_values'); ?></strong>
                    <?=  loc($bio,'values',false)   ?>

                </div>

                <div id="why" class="mt-3">
                    <h2 id="heading-3"><?php echo lang('why_kitchen_line'); ?></h2>
                    <?=  loc($bio,'why_kitchen_line',false)   ?>
                </div>
                <div id="activities" class="mt-3">
                    <h2 id="heading-4"><?php echo lang('company_activity'); ?></h2>
                    <?=  loc($bio,'company_activity',false)   ?>

                </div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                <div id="about">
                    <?=  loc($bio,'about',false)   ?>
                    <div class="box">
                        <img src="<?php echo base_url()?>assets/site/images/about/about-2.png" alt="About image #2" class="img-fluid">
                    </div>
                </div>
                <div id="trademarks" class="mt-3 pb-3">
                    <h2 id="heading-5"><?php echo lang('trademarks'); ?></h2>

                    <?=  loc($bio,'trademarks',false)   ?>


                    <div class="box">
                        <img src="<?php echo base_url()?>assets/site/images/about/about-3.png" alt="About Image #3" class="img-fluid">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <section>
        <div class="provider-back">
            <div class="container-fluid">
                <div class="row">
                    <div class="provider">
                        <div class="col-md-12 text-center">
                            <ul>
                                <li><img class="img-fluid" src="<?= base_url() ?>assets/site/images/template/1.jpg" alt=""></li>
                                <li><img class="img-fluid" src="<?= base_url() ?>assets/site/images/template/2.jpg" alt=""></li>
                                <li><img class="img-fluid" src="<?= base_url() ?>assets/site/images/template/3.jpg" alt=""></li>
                                <li><img class="img-fluid" src="<?= base_url() ?>assets/site/images/template/4.jpg" alt=""></li>
                                <li><img class="img-fluid" src="<?= base_url() ?>assets/site/images/template/5.jpg" alt=""></li>
                                <li><img class="img-fluid" src="<?= base_url() ?>assets/site/images/template/6.jpg" alt=""></li>
                                <li><img class="img-fluid" src="<?= base_url() ?>assets/site/images/template/7.jpg" alt=""></li>
                                <li><img class="img-fluid" src="<?= base_url() ?>assets/site/images/template/8.jpg" alt=""></li>
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
                                <p>Sign in to our newsletter and
                                    receive a ten Riyal coupon !!!</p>
                            </div>
                            <!--.offer-coupon-text-->
                        </div>
                        <!--.col-md-3-->
                        <div class="col-md-6">
                            <div class="email-frame"><input id="coupon-email" type="email"
                                                            placeholder="Enter here your email adress">
                                <button id="coupon-email-button">+</button>
                            </div>
                        </div>
                        <!--.col-md-6-->
                    </div>
                    <!--.row-->
                </div>
                <!--.container-->
            </div>
            <!--.offer-coupon-back-->
        </div>
        <!--.provider-back-->
    </section>
</main>

