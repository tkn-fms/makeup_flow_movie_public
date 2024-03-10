<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Methods: GET, GET, PUT');
header('Content-Type: application/json; charset=utf-8');

$dsn = 'mysql:host=localhost;dbname=takano_db;charset=utf8';
$user = 'nakamura-lab';
$password = 'n1k2m3r4fms';
try {
  $pdo = new PDO($dsn, $user, $password);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  exit($e->GETMessage());
}
$statement = $_GET['statement'];

$sql = $statement;
$stmt = $pdo->prepare($sql);
$stmt->execute();
$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($result);
?>
