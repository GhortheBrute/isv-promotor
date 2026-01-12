<?php
// api/produtos.php
header("Access-Control-Allow-Origin: *"); // Permite que o Next.js acesse
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");


$host = "localhost";
$user = "root";
$password = "root";
$dbname = "mocks";
$port = 3306;

$dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";

try {
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "
            SELECT
                s13.sku AS sku,
                s13.description AS description,
                s13.packaging AS packaging,
                s13.supplier AS supplier,
                s13.emb1 AS emb1,
                s13.emb9 AS emb9,
                s13.age AS age,
                s13.missSale AS missSale,
                s13.sector AS sector,
                s13.dataStamp AS dataStamp
            FROM MOCK_DATA s13
            WHERE
                s13.missSale > 1 AND
                s13.emb1 > 1 AND
                s13.supplier IS NOT NULL
        ";

//     $sql = "
//         SELECT
//             s13.MERC AS sku,
//             s13.DESCRICAO AS description,
//             s13.EMBALAGEM AS packaging,
//             s12.FORNECEDOR AS supplier,
//             s13.ESTOQ_EMB1 AS emb1,
//             s13.ESTOQ_EMB9 AS emb9,
//             s13.IDADE AS age,
//             s13.NAO_VENDE AS missSale,
//             s12.GRUPO AS sector,
//             s12.DATA_GERACAO AS dataStamp
//         FROM smg13 s13
//         LEFT JOIN smgoi12 s12 ON s13.MERC = s12.MERC
//         WHERE
//             s13.NAO_VENDE > 1 AND
//             s13.ESTOQ_EMB1 > 1 AND
//             s12.FORNECEDOR IS NOT NULL
//     ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($result as $row) {
        $row['sku'] = (int)$row['sku'];
        $row['emb1'] = (float)$row['emb1'];
        $row['emb9'] = (float)$row['emb9'];
        $row['age'] = (int)$row['age'];
        $row['missSale'] = (int)$row['missSale'];
    }

    echo json_encode($result);
}catch(PDOException $e){
    http_response_code(500);
    echo json_encode(["erro" => "Erro ao conectar o banco de dados: " . $e->getMessage()]);
    exit;
}
?>