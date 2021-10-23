const express = require('express');
const cors = require('cors');
const models = require('./models');
const { response } = require('express');
const { sequelize} = require('./models');
const app = express();

app.use(cors());
app.use(express.json());

let cliente = models.Cliente;
let itempedido = models.ItemPedido;
let pedido = models.Pedido;
let servico = models.Servico;
let compra = models.Compra;
let itemcompra = models.ItemCompra;
let produto = models.Produto;


app.get('/', function(req, res){
    res.send('Ola, mundo deu certo!')
});



app.post('/clientes', async(req, res) =>{
    await cliente.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Seja bem-vindo(a) a ServicesTi."
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Cliente nao encontrado!"
        })
    });
});



app.get('/clientes/lista', async(req, res) => {
    await cliente.findAll({
        order: [['clienteDesde', 'ASC']]
    }).then(function(clientes) {
        res.json({
            error: false,
            clientes
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao listar os clientes."
        });
    });
});



app.get('/excluir-cliente/:id', async(req, res)=>{
    await cliente.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Cliente foi excluido com sucesso."
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Nao foi possivel excluir o cliente da base."
        });
    });
});



app.post('/cliente/:id/pedido', async(req, res)=>{
   const ped ={
    data: req.body.data,
    ClienteId: req.params.id
  }
  if(!await cliente.findByPk(req.params.id)){
      return res.status(400).json({
          error: true,
          message: "Cliente nao existe."
      });
  };
  await pedido.create(ped)
  .then(order =>{
      return res.json({
          error: false,
          message: "Pedido foi inserido com sucesso.",
          order
      });
  }).catch(erro =>{
      return res.json({
          error: true,
          message: "Nao foi possivel inserir o pedido."
      });
  });
})



app.post('/servicos', async(req, res) =>{
    await servico.create(
       req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Servico criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossivel se conectar."
        })
    });
}); 



app.get('/listaServicos', async(req, res)=>{
    await servico.findAll({
        //raw: true
        order:[['nome', 'ASC']]
    }).then(function(servicos){
        res.json({servicos})
    });
});



app.get('/ofertaservicos', async(req, res)=>{
    await servico.count('id').then(function(servicos){
        res.json({servicos});
    });
});



app.get('/servico/:id', async(req, res)=>{
    await servico.findByPk(req.params.id)
    .then(serv =>{
        return res.json({
            error: false,
            serv
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "erro: nao foi possivel conectar!"
        });
        
    });
});



app.put('/atualizaservico', async(req, res)=>{
    await servico.update(req.body,{
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Servico foi alterado com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro na alteracao do servico."
        });
    });
});



app.get('/clientes', async(req, res)=>{
    await cliente.findAll({include: [{all: true}]})
    .then(cli =>{
        return res.json({
            error: false,
            cli
        });
    }).catch(erro =>{
        return res.json({
            error: true,
            message: "Nao foi possivel retornar nenhum cliente."
        });
    });
});



app.put('/cliente/:id/pedido', async(req, res)=>{
    const ped = {
        data: req.body.data,
        ClienteId: req.params.id
      };
      if(!await cliente.findByPk(req.params.id)){
          return res.status(400).json({
              error: true,
              message: "Cliente nao existe."
          });
      };
      
      await pedido.update(ped,{
          where: sequelize.and(
              {ClienteId: req.params.id},
              {id: req.body.id}
          )
      }).then(pedidos=>{
          return res.json({
              error: false,
              message: "Pedido foi alterado com sucesso!",
              pedidos
          });
      }).catch(erro=>{
          return res.status(400).json({
              error: true,
              message: "Nao foi possivel alterar o pedido."
          });
      });
});



app.get('/pedidos/:id', async(req, res)=>{
    await pedido.findByPk(req, params.id, {include:[{all: true}]})
    .then(ped=>{
        return res.json({ped});
    })
})



app.put('/pedidos/:id/editaritem', async(req, res)=>{
   const item = {
       quantidade: req.body.quantidade,
       valor: req.body.valor
   };
   if (!await pedido.findByPk(req.params.id)){
       return res.status(400).json({
           error: true,
           message: "Pedido nao foi encontrado."
       });
   };
   if (!await servico.findByPk(req.body.ServicoId)){
       return res.status(400).json({
           error: true,
           message: "Servico nao foi encontrado."
       });
   };
   await itempedido.update(item, {
       where: Sequelize.and({ServicoId: req.body.ServicoId},
        {PedidoId: req.params.id})
   }).then(function(itens){
       return res.json({
           error: false,
           message: "Pedido foi alterado com sucesso!",
           itens
       });
   }).catch(function(erro){
       return res.status(400).json({
           error: true,
           message: "Erro: nao foi possivel alterar."
       });
   });
});



app.post('/compra', async(req, res)=>{
    await compra.create(
        req.body
    );
    res.send("Compra inserida com sucesso")
});



app.put('/atualizarcompra/:id', async(req,res)=>{         
    if(!await compra.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: "Nao foi possivel identificar compra"
        });
    };
    await compra.update(req.body,{
        where: {id: req.params.id}
    }).then(compra=>{
        return res.json({
            message: "Compra atualizada com sucesso",
            compra
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Problemas com registro compra"
        });
    });
});



app.get('/excluircompra/:id', async(req,res)=>{         
    if(!await compra.findByPk(req.params.id,)){
        return res.status(400).json({
            error: true,
            message: "Nao foi possivel identificar compra"
        });
    }
    await compra.destroy({
        where:{id: req.params.id}
    }).then(compra=>{
        return res.json({
            message: "Compra excluida"
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Problemas com registro Compra"
        });
    });
});



app.post('/compra/:id/itemcompra', async(req,res)=>{   
    const itemcompra = {
        ProdutoId: req.body.ProdutoId,
        CompraId: req.params.id,
        quantidade: req.body.quantidade,
        valor: req.body.valor
    } 
    if(!await produto.findByPk(req.body.ProdutoId)){
        return res.status(400).json({
            error: true,
            message: "Produto não identificado"
        });
    };
    await itemcompra.create(
        itemcompra
    ).then(item=>{
        return res.json({
            message: "Item adicionado com sucesso",
            item
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Problemas com registro item compra"
        });
    });
});


app.get('/listaritem', async(req,res)=>{
    await itemcompra.findAll({
        raw: true
    }).then(itens=>{
        return res.json({itens});
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Problemas com registro item compra"
        });
    });
});





app.get('/excluiritemcompra/:id', async(req,res)=>{
    if(!await compra.findByPk(req.params.id)){         
        return res.status(400).json({
            error: true,
            message:'Compra não encontrada'
        });     
    };
    await itemcompra.destroy({
        where: Sequelize.and({CompraId: req.params.id},
            {ProdutoId: req.body.ProdutoId})  
    }).then(item=>{
        return res.json({
            message: 'Item excluido'
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: 'Problemas com registro item compra'
        });
    });
});



app.post('/inserirproduto', async(req, res)=>{
    await produto.create(
        req.body
    );
    res.send("Produto inserido com sucesso")
});



app.put('/atualizarproduto/:id', async(req,res)=>{         
    if(!await produto.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: "Nao foi possivel identificar produto"
        });
    };
    await produto.update(req.body,{
        where: {id: req.params.id}
    }).then(produto=>{
        return res.json({
            message: "Produto atualizada com sucesso",
            produto
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Problemas com registro produto"
        });
    });
});



app.get('/listarproduto', async(req,res)=>{
    await produto.findAll({
        raw: true
    }).then(produto=>{
        return res.json({produto});
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Problemas com registro produto"
        });
    });
});



app.get('/excluirproduto/:id', async(req,res)=>{         
    if(!await compra.findByPk(req.params.id)){          
        return res.status(400).json({
            error: true,
            message:"Compra não identificada"
        });    
    };
    await produto.destroy({
        where:{id: req.params.id}
    }).then(produto=>{
        return res.json({
            message: "Produto excluido"
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Problemas com registro produto"
        });
    });
});



let port = process.env.PORT || 3001;

app.listen(port,(req, res)=>{
    console.log('Servidor ativo: http://localhost:3001');
});
