const express = require("express");
const app = express();
const port = 3000;
const { Pool } = require("pg");

const config = {
    user: "postgres",
    host: "localhost",
    password: "Marogedon2023@$",
    port: 5432,
    database: "bancosolar",
  };

const pool = new Pool(config);

app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/usuarios", async (req, res) => {
    try{
        const result = await pool.query(`SELECT * FROM usuarios`);
        res.status(200).send(result.rows);
    }catch(error){
        res.status(500).send("Error 500");
    }
});

app.post("/usuario", async (req, res) => {
    try{    
        const result = await pool.query(
            `INSERT INTO usuarios(nombre, balance) VALUES('${req.body.nombre}','${req.body.balance}')  RETURNING *`
        );
        res.status(200).send(result.rows);
    }catch(error){
        res.status(500).send("Error 500");
    }
});

app.put("/usuario", async (req, res) => {
    try {
      const result = await pool.query(  
        `UPDATE usuarios SET nombre='${req.body.name}', balance='${req.body.balance}' WHERE id='${req.query.id}' RETURNING *`
      );
      console.log(result.rows[0]);
      res.status(200).send("Actualizado");
    } catch (error) {
      res.status(500).send("Error 500");
    }
});

app.delete("/usuario", async (req, res) => {    
    try {
        const result = await pool.query(`DELETE FROM usuarios WHERE id='${req.query.id}' RETURNING *`);
        if(result.rowCount==0){
            console.log("El usuario no ha podido ser eliminado");
            res.status(200).send("El usuario no ha podido ser eliminado");
        }else{
            console.log("Usuario eliminado exitosamente");
            res.status(200).send("Usuario eliminado exitosamente");
        }
        
    } catch (error) {
        res.status(500).send("Error 500");
    }
});

app.get("/transferencias", async (req, res) => {
    try{
        const result = await pool.query(`SELECT a.fecha, b.nombre as emisor, c.nombre as receptor, a.monto
                                            FROM transferencias a
                                            INNER JOIN usuarios b
                                            ON a.emisor = b.id
                                            INNER JOIN usuarios c
                                            ON a.receptor = c.id`);
        console.log(' ');
        console.log('TEST');
        result.rows.forEach( row => {
            console.log(row);
        });        
        console.log(' ');
        res.status(200).send(result.rows);
    }catch(error){
        res.status(500).send("Error 500");
    }
});

app.post("/transferencia", async (req, res) => {
    console.log(req.body.emisor);
    console.log(req.body.receptor);
    console.log(req.body.monto);
    console.log(req.body.fecha);
    try{    
        await pool.query("BEGIN");   

        const idEmisor = await pool.query(`SELECT id FROM usuarios WHERE nombre = '${req.body.emisor}'`);
        const idReceptor = await pool.query(`SELECT id FROM usuarios WHERE nombre = '${req.body.receptor}'`);

        const preMontoEmisor = await pool.query(`SELECT balance FROM usuarios WHERE nombre = '${req.body.emisor}' AND id = '${idEmisor.rows[0].id}'`);
        //console.log('Balance preEmisor'); console.log(preMontoEmisor.rows[0].balance);

        const preMontoReceptor = await pool.query(`SELECT balance FROM usuarios WHERE nombre = '${req.body.receptor}' AND id = '${idReceptor.rows[0].id}'`);        
        //console.log('Balance preReceptor'); console.log(preMontoReceptor.rows[0].balance);

        const nuevoBalanceEmisor = parseInt(preMontoEmisor.rows[0].balance) - parseInt(req.body.monto);       
        const nuevoBalanceReceptor = parseInt(preMontoReceptor.rows[0].balance) + parseInt(req.body.monto);      

        const preUpdateEmisorResult = `UPDATE usuarios SET balance = '${nuevoBalanceEmisor}' WHERE id = '${idEmisor.rows[0].id}' RETURNING *`;          
        const preUpdateReceptorResult = `UPDATE usuarios SET balance = '${nuevoBalanceReceptor}' WHERE id = '${idReceptor.rows[0].id}' RETURNING *`;
        const preInsertTransFerenciaResult = `INSERT INTO transferencias(emisor, receptor, monto, fecha) VALUES('${idEmisor.rows[0].id}','${idReceptor.rows[0].id}', '${req.body.monto}', '${req.body.fecha}')  RETURNING *`;

        const balanceFinalEmisor = await pool.query(preUpdateEmisorResult);
        const balanceFinalReceptor = await pool.query(preUpdateReceptorResult);    
        const transferenciaResult = await pool.query(preInsertTransFerenciaResult);

        //console.log('EMISOR BALANCE RESULT IS'); console.log(balanceFinalEmisor.rows[0]); console.log('RECEPTOR BALANCE RESULT IS'); console.log(balanceFinalReceptor.rows[0]); console.log('TRANSFERER RESULT IS'); console.log(transferenciaResult.rows[0]);
        
        transferenciaResult.rows[0].emisor = req.body.emisor;
        transferenciaResult.rows[0].receptor = req.body.receptor;
        //console.log(transferenciaResult.rows[0]);
        await pool.query("COMMIT");
        res.status(200).send(transferenciaResult.rows[0]);
    }catch(error){
        await pool.query("ROLLBACK");
        res.status(500).send("Error 500");
    }
});

app.listen(port, () => console.log(`App corriendo en el puerto escucha !`));
