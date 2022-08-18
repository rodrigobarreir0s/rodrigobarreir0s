const { MongoClient } = require("mongodb");
const express = require("express")
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

const url ="mongodb://localhost:27017"
const dbName ="rodrigo"

async function main() {
const client = await MongoClient.connect(url);
const db = client.db(dbName);
const collection = db.collection("jornada");

console.log("Banco de dados conectado com sucesso!");

// const lista = [
//   {
//     id: 1,
//     nome: "Paulo",
//     pontos: 21,
//   },
//   {
//     id: 2,
//     nome: "Daniel",
//     pontos: 52,
//   },
//   {
//     id: 3,
//     nome: "Beatriz",
//     pontos: 97,
//   },
// ];

app.get("/", async (req, res) => {
const itens = await collection
  .find()
  .toArray()
res.send(itens)
})

app.get("/nomes", async (req, res) => {
  const itens = await collection
    .find()
    .toArray()
    
    var filter = itens.map(item => {
      var obj = Object()

      obj.nomeCompleto = item.nome.split(" ")[0]
      obj.pontuacao = item.pontos
      return obj
    })
    res.send(filter)
  })

app.post("/pontuacoes", async(req, res) => {
  const item = req.body;
  const inserted = await collection.insertOne(item)
  const pontuacao = await collection.findOne({_id : inserted.insertedId})

  if(pontuacao == null){
    res.send("nenhuma informacao encontrada")
  } else {
    res.send(pontuacao)
  }
})


app.listen(3000);
}
main()