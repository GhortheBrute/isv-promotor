<?php
// 1. Ativa a compressão para transferir o JSON mais rápido
ob_start("ob_gzhandler");

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

//...configurações de conexão...

$dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";

try{
    $pdo = new PDO($dsn,$user,$password, [
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_STRINGIFY_FETCHES => false,
    ]);

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
             s12.FORNECEDOR IS NOT NULL AND
             s12.FORNECEDOR != ''
    ";

    $stmt = $pdo->query($sql);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
} catch(PDOException $e){
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}

