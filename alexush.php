<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
    <title>Google Search API Sample</title>
    <script src="https://www.google.com/jsapi"></script>
    <script type="text/javascript">

      google.load('search', '1');

      var imageSearch;

      function addPaginationLinks() {

        // To paginate search results, use the cursor function.
        var cursor = imageSearch.cursor;
        var curPage = cursor.currentPageIndex; // check what page the app is on
        var pagesDiv = document.createElement('div');
        for (var i = 0; i < cursor.pages.length; i++) {
          var page = cursor.pages[i];
          if (curPage == i) {

          // If we are on the current page, then don't make a link.
            var label = document.createTextNode(' ' + page.label + ' ');
            pagesDiv.appendChild(label);
          } else {

            // Create links to other pages using gotoPage() on the searcher.
            var link = document.createElement('a');
            link.href="/image-search/v1/javascript:imageSearch.gotoPage("+i+');';
            link.innerHTML = page.label;
            link.style.marginRight = '2px';
            pagesDiv.appendChild(link);
          }
        }

        var contentDiv = document.getElementById('content');
        contentDiv.appendChild(pagesDiv);
      }

      function searchComplete() {

        // Check that we got results
        if (imageSearch.results && imageSearch.results.length > 0) {

          // Grab our content div, clear it.
          var contentDiv = document.getElementById('content');
          contentDiv.innerHTML = '';

          // Loop through our results, printing them to the page.
          var results = imageSearch.results;
          for (var i = 0; i < results.length; i++) {
            // For each result write it's title and image to the screen
            var result = results[i];
            var imgContainer = document.createElement('div');
            var title = document.createElement('div');

            // We use titleNoFormatting so that no HTML tags are left in the
            // title
            title.innerHTML = result.titleNoFormatting;
            var newImg = document.createElement('img');

            // There is also a result.url property which has the escaped version
            newImg.src=result.tbUrl;
            imgContainer.appendChild(title);
            imgContainer.appendChild(newImg);

            // Put our title + image in the content
            contentDiv.appendChild(imgContainer);
          }

          // Now add links to additional pages of search results.
          addPaginationLinks(imageSearch);
        }
      }

      function OnLoad() {

        // Create an Image Search instance.
        imageSearch = new google.search.ImageSearch();

        // Set searchComplete as the callback function when a search is
        // complete.  The imageSearch object will have results in it.
        imageSearch.setSearchCompleteCallback(this, searchComplete, null);

        // Find me a beautiful car.
        imageSearch.execute("Subaru STI");

        // Include the required Google branding
        google.search.Search.getBranding('branding');
      }
      google.setOnLoadCallback(OnLoad);
    </script>

  </head>
  <body style="font-family: Arial;border: 0 none;">
    <div id="branding"  style="float: left;"></div><br />
    <div id="content">Loading...</div>
  </body>
</html>













<?php
exit();
?>

















<?php

set_time_limit(0);

try {
    $conn = new PDO('mysql:host=localhost;dbname=aluxian_android', base64_decode('YWx1eGlhbl9hbmRyb2lk'), base64_decode('YW5kcm9pZHBhc3M='));
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $q1 = $conn->query("SELECT id, name FROM cm_robotzi ORDER BY id DESC LIMIT 1;");
    $q2 = $conn->query("SELECT regID FROM cm_robotzi_gcm;");
} catch(PDOException $e) {
    echo 'ERROR: ' . $e->getMessage();
    error_log($e->getMessage());
}

$q1 = $q1->fetch();
print_r($q1);

$ep_id = $q1[0];
$title = $q1[1];
$array = $q2->fetchAll();

echo count($array);

for ($i = 0; $i < 1800; $i += 900) { // count($array)
	$batch = array_slice($array, $i, 900);

	$headers = array(
		'Authorization: key=AIzaSyDnaZIdnDvmmB12NG74j5Gxd3xKyeAFAIw',
		'Content-Type: application/json'
	);

	$fields = array(
		'time_to_live' => 3 * 24 * 60 * 60,
		'registration_ids' => $batch,
		'data' => array("title" => $title, "id" => $ep_id)
	);

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, 'https://android.googleapis.com/gcm/send');
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
	$result = curl_exec($ch);
	curl_close($ch);
	error_log("RAW RESULTS: ".$result);
	echo $result;

	for ($i = 0; $i < 900; $i++) {
		$json = json_decode($result);

		if (isset($json->results[$i]->registration_id)) {
			try {
			    $stmt = $conn->prepare('INSERT INTO cm_robotzi_gcm_new (regID) VALUES (:regID);');
		    	$stmt->execute(array("regID" => $json->results[$i]->registration_id));
			} catch(PDOException $e) {
			    echo 'ERROR: ' . $e->getMessage();
			    error_log($e->getMessage());
			}
		}

		else if (!isset($json->results[$i]->error)) {
			try {
			    $stmt = $conn->prepare('INSERT INTO cm_robotzi_gcm_new (regID) VALUES (:regID);');
		    	$stmt->execute(array("regID" => $batch[$i]));
			} catch(PDOException $e) {
			    echo 'ERROR: ' . $e->getMessage();
			    error_log($e->getMessage());
			}
		}
	}
}

?>