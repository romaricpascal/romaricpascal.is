<?php

  $base_url = "https://old.romaricpascal.is";
  $error_redirect = '';
  $error_document = '';
  $error_message = 'Not found';

  if (!empty($base_url)) {
    $url = "$base_url$_SERVER[REQUEST_URI]";
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_NOBODY, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    $response = curl_exec($ch);
    $response_code = curl_getinfo($ch,CURLINFO_RESPONSE_CODE);
    curl_close($ch);

    if ($response_code >= 200 && $response_code < 300) {
      header("Location: $url", true, 302);
      die();
    }
  }

  if (!empty($error_redirect)) {
    header("Location: $error_redirect", true, 302);
    die();
  } else if (!empty($error_document)) {
    include $error_document;
  } else {
    echo $error_message;
  }
