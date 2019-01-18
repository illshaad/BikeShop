var express = require('express');
var router = express.Router();
var stripe = require("stripe")("sk_test_qetAhAiqPai9hKqP91VIttAp");


// This is our new data structure (as an array of objects), to store our bikes info.
var dataBike = [
  {name: 'Model BIKO45', price: 679, url: '/images/bike-1.jpg'},
  {name: 'Model ZOOK7', price: 799, url: '/images/bike-2.jpg'},
  {name: 'Model LIKO89', price: 839, url: '/images/bike-3.jpg'},
  {name: 'Model GEWO', price: 1206, url: '/images/bike-4.jpg'},
  {name: 'Model TITAN5', price: 989, url: '/images/bike-5.jpg'},
  {name: 'Model AMIG39', price: 599, url: '/images/bike-6.jpg'}
];
//var dataCardBike = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("session", req.session.dataCardBike)
  res.render('index', {dataBike : dataBike});
});

/* POST shop page. */
router.post('/shop', function(req, res, next) 
//1ere action : recupérer les informations depuis la page index
{ req.body.bikeNameFromFront , req.body.bikePriceFromFront, req.body.bikeImageFromFront,req.body.bikeQuantityFromFront;

  console.log("req.body depuis index", req.body);
  //2eme action : déverser dans un nouvelle objet (du tableau dataCardBike)
  
  if(req.session.dataCardBike == null ){ //si la session n'est pas crée le panier et forcement vide //
    req.session.dataCardBike = [] //LA CONDITIONS SI LA SESSIOSN ET VIDE, TU VIDE LE PANIER 
   };
    req.session.dataCardBike.push(
    {
      name: req.body.bikeNameFromFront,
      price: req.body.bikePriceFromFront,
      url: req.body.bikeImageFromFront,       ///AJOUT AU PANIERRRRR////
      quantity: req.body.bikeQuantityFromFront
    }
  );
  //3e action : envoyer vers le shop

  console.log(req.session.dataCardBike);
  
 res.render('shop', { dataCardBike : req.session.dataCardBike });
});


/* GET delete shop page. */
router.get('/delete-shop', function(req, res, next) {
  req.session.dataCardBike.splice(req.query.position, 1);
  res.render('shop', {dataCardBike : req.session.dataCardBike });
});


/* POST update shop page. */
router.post('/update-shop', function(req, res, next) {
  req.session.dataCardBike[req.body.position].quantity = req.body.quantity;
  res.render('shop', {dataCardBike : req.session.dataCardBike});
});

/* Post checkout Stripe */
router.post('/checkout', function(req, res, next) {
  var token = req.body.stripeToken;
  
  var total = null;

  for(var i = 0 ; i < req.session.dataCardBike.length; i++){
    var totalRow = req.session.dataCardBike[i].price * req.session.dataCardBike[i].quantity;
    total += totalRow;
  }  //
  console.log(total);

  var charge = stripe.charges.create({
    amount: total,
    currency: 'eur',
    description: 'Shadd test',
    source: token,
  }, function(err, charge){
    res.render('paiement', {amount: total})
  });
});





// // // // // //
// ***BONUS*** //
// // // // // //


//* ***BONUS*** GET shop page. */
// // This bonus aims to give the user the possibity to reach the shop page without clicking on buy
router.get('/shop', function(req, res, next) {
 res.render('shop', {dataCardBike});
});



// /* ***BONUS*** POST update shop page. */
// // This bonus aims to check to check if the requested quantity is 0, then delete the item, otherwise if not 0, then update the quantity
//  router.post('/update-shop', function(req, res, next) {

//    if (req.body.quantity == 0) {
//     dataCardBike.splice(req.body.position, 1);
//   } else {
//     dataCardBike[req.body.position].quantity = req.body.quantity;
//   }

//   res.render('shop', {dataCardBike});
// });




// /* ***BONUS*** POST shop page. */
// // // This bonus aims to check if the requested bike to add already exists in the shop basket, then we want to update the quantity of this bike but we do not want to add it, if not, add it.
// router.post('/shop', function(req, res, next) {
//
//   console.log(req.body)
//
//   var mustbeUpdated = false;
//   for (var i = 0; i < dataCardBike.length; i++) {
//     if (req.body.bikeNameFromFront == dataCardBike[i].name) {
//       mustbeUpdated = true;
//       dataCardBike[i].quantity++
//     }
//   }
//   if (mustbeUpdated == false) {
//     dataCardBike.push(
//       {
//         name: req.body.bikeNameFromFront,
//         price: req.body.bikePriceFromFront,
//         url: req.body.bikeImageFromFront,
//         quantity: req.body.bikeQuantityFromFront
//       }
//     );
//   }
//
//   res.render('shop', {dataCardBike});
// });

module.exports = router;
