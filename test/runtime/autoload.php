<?php

date_default_timezone_set('Asia/Shanghai');
error_reporting(E_ALL & ~E_NOTICE); // error_reporting(E_ALL & ~E_WARNING & ~E_NOTICE );

function my_autoloader($classname) {
    $runtimeDir = __DIR__ .  '/../../src/runtime/';
    $rumtimeClassMap = array (
        'Ts2Php_Date' => 'Ts2Php_Helper.php',
        'Ts2Php_Helper' => 'Ts2Php_Helper.php',
    );

    if (isset($smartyClassMap[$classname])) {
        require_once ($smartyClassMap[$classname]);
    }
}

spl_autoload_register('my_autoloader');
