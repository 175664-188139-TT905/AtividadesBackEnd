const express = require("express");
const app = express();
app.use(express.json());

var cors = require('cors');
app.use(cors());

app.listen(process.env.PORT || 3000);

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