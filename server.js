const express = require('express')
const joyas = require('./data/joyas.js')
const app = express();
app.listen(3000, () => console.log('Your app listening on port 3000'))



const HATEOAS = () => {

  return joyas.results.map((j) => {
    return {
      name: j.name,
      href: `http://localhost:3000/joyas/${j.id}`,
    }
  })

};

const HATEOASV1 = () => {

  return joyas.results.map((j) => {
    return {
      name: j.name,
      href: `http://localhost:3000/joyas/${j.id}`,
    }
  })

};

const HATEOASV2 = () => {

  return joyas.results.map((j) => {
    return {
      model: j.name,
      href: `http://localhost:3000/joyas/${j.id}`,
    }
  })

};

const joya = (id) => {
  return joyas.results.find((j) => j.id == id);
};

const filtrarCategoria = (categoria) => {
  return joyas.results.filter((j) => j.category == categoria);
}

const filtrarUnidad = (joya, campos) => {

  for (propiedad in joya) {
    if (!campos.includes(propiedad)) delete joya[propiedad];
  }
  return joya;

}

const ordenar = (orden) => {
  return orden == "asc"
  ? joyas.results.sort((a, b) => (a.value > b.value ? 1 : -1))
  : orden == "desc"
  ? joyas.results.sort((a, b) => (a.value < b.value ? 1 : -1))
  : false;
  };


app.get('/', (req, res) => {
  res.send(joyas);
})

app.get('/joyas', (req, res) => {

  if (req.query.page) {
    
    const { page } = req.query;
    
    return res.send({ 
      joyas: HATEOAS().slice(page * 2 - 2, page * 2) 
    });
    }

  const { values } = req.query;
  if (values == "asc") return res.send(ordenar("asc"));
  if (values == "desc") return res.send(ordenar("desc"));

  res.send({
    joyas: HATEOAS(),
  })

  ? res.send({
    joyas: joya(id),
  })
  :
  res.status(404).send({
    error: "404 Not Found",
    message: "No existe una joya con ese ID",
  });
});

app.get('/joyas/:id', (req, res) => {

  const id = req.params.id;

  joya(id)

    ? res.send({
      joya: joya(id),
    })
    :
    res.status(404).send({
      error: "404 Not Found",
      message: "No existe una joya con ese ID",
    });

});

app.get('/api/v2/joyas', (req, res) => {
  res.send({
    joyas: HATEOASV2(),
  });
});

app.get('/joyas/categoria/:categoria', (req, res) => {

  const { categoria } = req.params

  filtrarCategoria(categoria).length > 0 ? res.send({
    cantidad: filtrarCategoria(categoria).length,
    joyas: filtrarCategoria(categoria),
  })
    :
    res.status(404).send({
      error: "404 Not Found",
      message: "No existen joyas con esa categoria ",
    });
});

app.get('/joyas/joya/:id', (req, res) => {

  const { id } = req.params;

  const { campos } = req.query;

  if (campos) return res.send({ joya: filtrarUnidad(joya(id), campos.split(",")) });

  joya(id)

    ? res.send({
      joya: joya(id),
    })
    :
    res.status(404).send({
      error: "404 Not Found",
      message: "No existe una joya con ese ID",
    });

});

app.get("/joya/:id", (req, res) => {
  const { id } = req.params;

  joya(id)

    ? res.send({
      joya: joya(id),
    })
    :
    res.status(404).send({
      error: "404 Not Found",
      message: "No existe una joya con ese ID",
    });
});

app.get("/joya", (req, res) => {

  if (req.query.page) {
    
    const { page } = req.query;
    
    return res.send({ joyas: HATEOAS().slice(page * 2 - 2, page * 2) });
    }

  res.send({
    joyas : HATEOAS(),
  });

});

app.get("/cometa", (req, res) => {

  });