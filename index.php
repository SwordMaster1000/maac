<?php

$_request_url = $_SERVER['REQUEST_URI'];
$partial = isset($_GET['partial']);

preg_match('/^([^\?]*)/', $_request_url, $matches);
$slash = preg_match('/^(.*)\/$/', $matches[1], $matches2);
if (!$slash) {
    $request_url = $matches[1];
}else {
    $request_url = $matches2[1];
}

if ($request_url === '/favicon.ico') {
    header('Content-Type:image/ico');
    include '/static/imgs/favicons/favicon.ico';
    exit;
}

header('cache-control: public, no-cache');

if ($request_url === '/' || $request_url === '/index.php') {
    $request_url = '/home';
}

$partial_page =  __DIR__.'/static/inc/pages'.$request_url.'/partial.php';
if (!file_exists($partial_page)) {
    echo '<!-- Page not found at '.$request_url.' (a.k.a '.$partial_page.')-->';
    $partial_page =  __DIR__.'/static/inc/pages/home/partial.php';
}

if ($partial) {
    include $partial_page;
}else {
    include __DIR__.'/static/inc/top.partial.php';
    include $partial_page;
    include __DIR__.'/static/inc/bottom.partial.php';
}
?>