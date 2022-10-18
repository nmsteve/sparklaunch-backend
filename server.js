var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
require('dotenv').config()

var Sale = require('./model/BNBsale');

mongoose.connect(

  `mongodb+srv://mwaura:${process.env.PASS}@cluster0.1utxg.mongodb.net/Sparklaunch?retryWrites=true&w=majority`,
  //"mongodb://localhost/shop",

  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }
);


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("`open", function () {
  console.log("Connected successfully");
});


//Allow all requests from all domains & localhost
app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/sale', function (request, response) {

  Sale.create(


    {

      saleToken: {
        name: request.body.saleToken.name,
        symbol: request.body.saleToken.symbol,
        address: request.body.saleToken.address,
      },

      saleParams: {
        softCap: request.body.saleParams.softCap,
        hardCap: request.body.saleParams.hardCap,
        price: request.body.saleParams.price,
        startDate: request.body.saleParams.startDate,
        endDate: request.body.saleParams.endDate,
        minBuy: request.body.saleParams.minBuy,
        maxBuy: request.body.saleParams.maxBuy,
        firstRelease: request.body.saleParams.firstRelease,
        eachRelease: request.body.saleParams.eachRelease,
        vestingDays: request.body.saleParams.vestingDays
      },

      saleLinks: {
        logo: request.body.saleLinks.logo,
        fb: request.body.saleLinks.fb,
        git: request.body.saleLinks.git,
        insta: request.body.saleLinks.insta,
        reddit: request.body.saleLinks.reddit,

        web: request.body.saleLinks.web,
        twitter: request.body.saleLinks.twitter,
        telegram: request.body.saleLinks.telegram,
        discord: request.body.saleLinks.discord,
        youtube: request.body.saleLinks.youtube
      },

      saleDetails: {
        saleAddress: request.body.saleDetails.saleAddress,
        saleOwner: request.body.saleDetails.saleOwner,
        description: request.body.saleDetails.description,
      },

    }, function (err, savedSale) {
      if (err) {
        response.status(500).send({ error: err.message });
        console.log(err.message)
      } else {
        response.send(savedSale);

      }
    });
});

app.get('/sale', function (request, response) {

  Sale.find({}, function (err, sale) {
    if (err) {
      response.status(500).send({ error: err.message });
    } else {
      response.send(sale);
    }
  });

});

app.get('/sale/:id', function (request, response) {

  Sale.find({ _id: request.params.id }, function (err, sale) {
    if (err) {
      response.status(500).send({ error: err.message });
    } else {
      response.send(sale);
    }
  });

});

app.get('/sale/name/:nm', function (request, response) {

  Sale.find({ 'saleToken.name': request.params.name }, function (error, sale) {
    if (error) {
      response.status(500).send({ error: error.message });
    } else {
      response.send(sale);
    }

  })

})

app.get('/sale/saleid/:saleid', function (request, response) {

  Sale.find({ 'saleDetails.saleID': request.params.saleid }, function (err, sale) {
    if (err) {
      response.status(500).send({ error: err.message });
    } else {
      response.send(sale);
    }
  });

});

app.get('/sale/deployed/:dpy', function (request, response) {

  Sale.find({ 'saleDetails.deployed': request.params.dpy }, function (err, sale) {
    if (err) {
      response.status(500).send({ error: err.message });
    } else {
      response.send(sale);
    }
  });

});

app.get('/sale/featured/:ftd', function (request, response) {

  Sale.find({ 'saleDetails.featured': request.params.ftd }, function (err, sale) {
    if (err) {
      response.status(500).send({ error: err.message });
    } else {
      response.send(sale);
    }
  });

});

app.delete('/sale', function (request, response) {

  Sale.deleteMany({ 'saleDetails.saleID': request.body.saleID }, function (err, sale) {
    if (err) {
      response.status(500).send({ error: err })
      console.log(err)
    } else {
      response.send(sale)
    }

  }

  )

})

app.put('/sale', function (request, response) {

  Sale.updateOne({ _id: request.body._id },
    {

      token: {
        name: request.body.token.name,
        symbol: request.body.token.symbol,
        address: request.body.token.address,
      },

      params: {
        softCap: request.body.params.softCap,
        hardCap: request.body.params.hardCap,
        startDate: request.body.params.startDate,
        endDate: request.body.params.endDate
      },

      saleLinks: {
        logo: request.body.saleLinks.logo,
        website: request.body.saleLinks.website,
        facebook: request.body.saleLinks.facebook,
        twitter: request.body.saleLinks.twitter,
        gitHub: request.body.saleLinks.gitHub,
        telegram: request.body.saleLinks.telegram,
        instagram: request.body.saleLinks.instagram
      },


      description: request.body.description,
      saleAddress: request.body.saleAddress
    },
    function (err, sale) {
      if (err) {
        response.status(500).send({ error: "Could not update sale" })
      } else {
        response.send(sale)
      }
    }
  )

}
)

app.put('/sale/deploy/:id', function (request, response) {

  Sale.updateOne({ _id: request.params.id },
    {
      'saleDetails.deployed': request.body.deployed,
      'saleDetails.saleAddress': request.body.saleAddress

    },

    function (err, sale) {
      if (err) {
        response.status(500).send({ error: err.message })
      } else {
        response.send(sale)
      }
    }
  )

}
)

port = process.env.PORT || 3001

app.listen(port, function () {
  console.log("SparkLaunch running on port 3001...");
});
