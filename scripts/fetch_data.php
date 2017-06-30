<?php
$servername =$_GET['server'];
$username = $_GET['username'];
$password = $_GET['password'];
$dbname = $_GET['database'];
$tbname = $_GET['table'];


// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$sql = "SELECT technology,percentage FROM ".$tbname;
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
         $rows[] = array_map('utf8_encode', $row);
    }
	echo json_encode($rows);


} 
else {
    echo "0 results";
}
$conn->close();
?>