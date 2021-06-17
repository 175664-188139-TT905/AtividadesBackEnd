const express = require("express");
const app = express();
app.use(express.json());

var cors = require('cors');
app.use(cors());

app.listen(process.env.PORT || 3000);

/* Para adicionar um registro de jogo, utilizar a seguinte sintaxe JSON no request do Thunder Client:

{"game":{
    "Nome": "XXXXXXXXXX",
    "Genero": "XXXXXXXXX",
    "Produtora": "XXXXXXXX"
  }
}

*/

gameslib = [{"Nome":"Fallout","Genero":"RPG","Produtora":"Bethesda"},
{"Nome":"Minecraft","Genero":"Survival","Produtora":"Mojang"}];

app.get('/gameslib',
    function(req, res){
        res.send(gameslib.filter(String));
    }
);

app.get('/gameslib/:id',
    function(req, res){
        const id = req.params.id - 1;
        const game = gameslib[id];

        if (!game){
            res.send("Jogo não encontrado.");
        } else {
            res.send(game);
        }
    }
)

app.post('/gameslib', 
    (req, res) => {
        console.log(req.body.game);
        const game = req.body.game;
        gameslib.push(game);
        res.send("Jogo adicionado aos registros.")
    }
);

app.put('/gameslib/:id',
    (req, res) => {
        const id = req.params.id - 1;
        const game = req.body.game;
        gameslib[id] = game;        
        res.send("Registro do jogo atualizado com sucesso.")
    }
)

app.delete('/gameslib/:id', 
    (req, res) => {
        const id = req.params.id - 1;
        delete gameslib[id];

        res.send("Jogo removido.");
    }
);

/* código para o banco de dados MongoDB */

const mongodb = require('mongodb')
const password = process.env.PASSWORD || "greeAT9V39BhbmQ";
console.log(password);

const connectionString = `mongodb+srv://user0:<password>@cluster0.vat2u.mongodb.net/library?retryWrites=true&w=majority`;

const options = { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
};

(async()=>{
    const client = await mongodb.MongoClient.connect(connectionString, options);
    const db = client.db('library');
    const gameslib = db.collection('gameslib');
    console.log(await gameslib.find({}).toArray());

    app.get('/database',
        async function(req, res){
        // res.send(mensagens);
        res.send(await gameslib.find({}).toArray());
    }
);

app.get('/database/:id',
    async function(req, res){
        const id = req.params.id;
        const game = await gameslib.findOne(
            {_id : mongodb.ObjectID(id)}
        );
        console.log(game);
        if (!game){
            res.send("Jogo não encontrado");
        } else {
            res.send(game);
        }
    }
);

app.post('/database', 
    async (req, res) => {
        console.log(req.body);
        const game = req.body;
        
        delete game["_id"];

        gameslib.insertOne(game);        
        res.send("Adicionar um game");
    }
);

app.put('/database/:id',
    async (req, res) => {
        const id = req.params.id;
        const game = req.body;

        console.log(game);

        delete game["_id"];

        const num_game = await gameslib.countDocuments({_id : mongodb.ObjectID(id)});

        if (num_game !== 1) {
            res.send('Ocorreu um erro por conta do número de mensagens');
            return;
        }

        await gameslib.updateOne(
            {_id : mongodb.ObjectID(id)},
            {$set : game}
        );
        
        res.send("Jogo atualizado com sucesso.")
    }
)

app.delete('/database/:id', 
    async (req, res) => {
        const id = req.params.id;
        
        await gameslib.deleteOne({_id : mongodb.ObjectID(id)});

        res.send("Jogo removido com sucesso");
    }
);

})(); 