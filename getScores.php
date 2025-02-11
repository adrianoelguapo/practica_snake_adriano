<?php
require 'vendor/autoload.php';

$client = new MongoDB\Client("mongodb+srv://admin:123@cluster0.tz018.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
$collection = $client->snake->scores;

$options = [
    'sort' => ['score' => -1],
    'limit' => 5
];

$scores = $collection->find([], $options);
$result = [];

foreach ($scores as $score) {
    $result[] = [
        'name' => $score['name'],
        'score' => $score['score']
    ];
}

echo json_encode($result);
?>