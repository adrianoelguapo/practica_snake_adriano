<?php
require 'vendor/autoload.php';

// URI de conexión a MongoDB Atlas
$uri = 'mongodb+srv://admin:123@cluster0.tz018.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Crear un cliente de MongoDB
$client = new MongoDB\Client($uri);

// Seleccionar la base de datos y la colección
$collection = $client->snake->scores; 

// Obtener los datos del JSON POST
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

if ($input) {
    // Crear el documento para la puntuación
    $newScore = [
        'name' => $input['name'],
        'score' => $input['score'],
    ];

    try {
        // Insertar el nuevo documento en la colección
        $result = $collection->insertOne($newScore);

        echo json_encode([
            'message' => 'Puntuación guardada correctamente.',
            'insertedId' => $result->getInsertedId()
        ]);
    } catch (Exception $e) {
        // Mostrar mensaje de error al guardar el documento
        echo json_encode([
            'message' => 'Error al guardar la puntuación: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'message' => 'Datos de entrada no válidos.'
    ]);
}
?>