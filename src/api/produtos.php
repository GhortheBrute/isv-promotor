<?php
// api/produtos.php
header("Access-Control-Allow-Origin: *"); // Permite que o Next.js acesse
header("Content-Type: application/json; charset=UTF-8");


$host = "localhost";
$user = "root";
$password = "";
$dbname = "produtos";
$port = 3306;

$dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";

try {
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}catch(PDOException $e){
    http_response_code(500);
    echo json_encode("Erro ao conectar o banco de dados: " . $e->getMessage());
    exit;
}

$sql = "
    SELECT
        s13.MERC AS sku,
        s13.DESCRICAO AS description,
        s13.EMBALAGEM AS packaging,
        s12.FORNECEDOR AS supplier,
        s13.ESTOQ_EMB1 AS emb1,
        s13.ESTOQ_EMB9 AS emb9,
        s13.IDADE AS age,
        s13.NAO_VENDE AS missSale,
        s12.GRUPO AS sector,
        s12.DATA_GERACAO AS dataStamp
    FROM smg13 s13
    LEFT JOIN smgoi12 s12 ON s13.MERC = s12.MERC
    WHERE
        s13.NAO_VENDE > 1 AND
        s13.ESTOQ_EMB1 > 1 AND
        s12.FORNECEDOR IS NOT NULL
";

try {
    $dados = $pdo->prepare($sql);
    $dados->execute();
    $resultado = $dados->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($resultado);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode("Erro ao buscar os produtos: " . $e->getMessage());
}
?>