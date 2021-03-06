<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitc872848ff4f7534610009d3bb71294b0
{
    public static $prefixLengthsPsr4 = array (
        'R' => 
        array (
            'ReCaptcha\\' => 10,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'ReCaptcha\\' => 
        array (
            0 => __DIR__ . '/..' . '/google/recaptcha/src/ReCaptcha',
        ),
    );

    public static $prefixesPsr0 = array (
        'o' => 
        array (
            'org\\bovigo\\vfs' => 
            array (
                0 => __DIR__ . '/..' . '/mikey179/vfsStream/src/main/php',
            ),
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitc872848ff4f7534610009d3bb71294b0::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitc872848ff4f7534610009d3bb71294b0::$prefixDirsPsr4;
            $loader->prefixesPsr0 = ComposerStaticInitc872848ff4f7534610009d3bb71294b0::$prefixesPsr0;

        }, null, ClassLoader::class);
    }
}
