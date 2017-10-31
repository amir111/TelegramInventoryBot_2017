/* JavaScript Script Notes '

require is like 'import' in Java

arr.pop() pops off last elt in arr
arr.shift() deletes the first elt in the arr 
arr.unshift() add smthg to beg of the arr 
arr.push() add smth to the end of the arr 

var has all 8 definitions in it (#'s, strings, etc)

function functionName() {
	//do smthg
}

functionName() //call a function

function ourFunctionWithArgs(a, b) { //this accepts 2 args 
	console.log(a - b); 
}
ourFunctionWithArgs(10, 5); //this passes two args

var is global if declared outside of a function, if inside a function you do not have to put var in front of the declartion

if (condition){}

= assign 
== equals? 
=== strict equals and is same datatype

!= not equal 
!== strictly not equal (opposite of strict equal)

  if (val !== 17) {
    return "Not Equal"; //kinda confused about this one 
    }
  return "Equal";

*/

// for (i = 0; i <= 1000; i++){
// 	console.log(i)
// }


/*
Express sees functions as 'middleware' when it has the following 
signature: function(request, response, next) 

Middleware is a general term for software that serves to "glue together" so app.use is a method to configure the middleware for example to parse and handle the body of request: 

express.static() is a function that takes a path, and returns a middleware that servers all files in that path to /
(If you wanted to prefix it with /public or whatever, you'd write app.use('/public', express.static(path.join(__dirname, 'public'))), 
where the first /public is the web path and the second is the filesystem path of the files being served).
*/

/*
  We still need to make a DB. Damir said "zabei"
*/

/*
Did some stuff with the database 
*/

var express = require( 'express' );
var app = express();
var path = require( 'path' );
var logger = require( 'morgan' );
var bodyParser = require( 'body-parser' );
var mongoose = require( 'mongoose' );
// for auth 
var crypto = require( 'crypto' );
var cookieParser = require( 'cookie-parser' );
var session = require( 'express-session' )   
var MongoStore = require( 'connect-mongo' )( session );
mongoose.connect( 'mongodb://127.0.0.1:27017/tmd' );

var User = require( './Schema/User.js' );
var Pt = require( './Schema/Pt.js' );
var Inventory = require( './Schema/Inventory.js' )

var kolichestvo = 0; 

var array1 = [ {
  type: "Органайзер", // finish addressing id and type to the rest of list
  id: '001'
}, {
  type: "Блокнот",
  id: '002'
}, {
  type: "А4",
  id: '003'
}, {
  type: "Папка-регистратор",
  id: '004'
}, {
  type: "Карандаш простой",
  id: '005'
}, {
  type: "Ручка",
  id: '006',
  photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/03-BICcristal2008-03-26.jpg/220px-03-BICcristal2008-03-26.jpg'
}, {
  type: "Стикеры",
  id: '007'
}, {
  type: "Степлеры",
  id: '008',
  photo: 'https://www.staples-3p.com/s7/is/image/Staples/s0569226_sc7?$splssku$'
}, {
  type: "Скобы",
  id: '009'
}, {
  type: "Отвертки",
  id: '010'
}, {
  type: "Ножницы",
  id: '011'
}, {
  type: "Корректор",
  id: '012'
}, {
  type: "Канцелярский нож",
  id: '013'
}, {
  type: "Точилки",
  id: '014'
}, {
  type: "Резинка стерательная",
  id: '015'
}, {
  type: "Файлы",
  id: '016'
}, {
  type: "Коверты",
  id: '017'
}, {
  type: "Батарейки",
  id: '018'
}, {
  type: "Антистеплер",
  id: '019'
}, {
  type: "Настольные ручки",
  id: '020'
}, {
  type: "Линейки",
  id: '021'
}, {
  type: "Разделители",
  id: '022'
}, {
  type: "Скотч",
  id: '023'
}, {
  type: "Маркер",
  id: '024'
} ];

var allUsers = [{
  //my admin number: 304300465
  name: "Amir Auto", 
  chat_id: 304300465, 
  lb: [],
  zapros: []
}];
var allInv = [];

function UpdateDB() {
  User.find( {}, function ( err, users ) {
    allUsers = users;
  } )

  Inventory.find( {}, function ( err, inv ) {
    allInv = inv;
  } )
  console.log( 'All DBs Are Loaded.' );
}
function SaveDB() { //created a DB 0.93456765434567
  array1.forEach(function(inve){
    var inv = new Inventory({ //new scheme
    name: inve.type,
    code: inve.id,
    img: '',
    open:false,
    kanc: (Math.random()*10 > 5) ? true : false //false means it's inventory, if true, it's konc, randomizing 
})
  inv.save(); //save the scheme we just created

  })

 

  console.log( 'All DBs Are Loaded.' );
}
  
// SaveDB();

UpdateDB();
var allUsers = [{
  //my admin number: 304300465
  name: "Amir Auto", 
  chat_id: 304300465, 
  lb: [],
  zapros: []
}];
////////////////////
var TelegramBot = require( 'node-telegram-bot-api' );

// replace the value below with the Telegram token you receive from @BotFather
var token = '310123554:AAHb5H73xT7pzsNjxLjs3_UD3jnIFnAYOf8';

// Create a bot that uses 'polling' to fetch new updates
var bot = new TelegramBot( token, {
  polling: true
} );
var notes = [];
var admin = 304300465; // = 362814495;

//////////////////////MOVED THIS FROM THE BOTTOM
var app = express();

app.set( 'port', process.env.PORT || 3000 );

app.use( logger( 'dev' ) );
app.use( bodyParser.json( {
  limit: '50mb'
} ) );
app.use( bodyParser.urlencoded( {
  limit: '50mb',
  extended: true
} ) );
app.use( express.static( path.join( __dirname, 'public' ), {
  maxAge: 1
} ) );
// for auth
app.use( cookieParser() );

app.use( session( {
  secret: 'your secret here',
  resave: true,
  saveUninitialized: true,
  key: 'jsessionid',
  store: new MongoStore( {
    mongooseConnection: mongoose.connection
  } )
} ) );

var server = app.listen( app.get( 'port' ), function () {
  console.log( 'Express server listening on port ' + app.get( 'port' ) );
} );

function setArr( arr, elt, what ) {
  if ( arr.length - 1 < elt ) {
    for ( var i = arr.length - 1; i < elt; i++ ) {
      arr.push( what );
    }
  } else {
    arr[ elt ] = what;
  }
  return arr;
}

//                          Тут ещё нет админки, поэтому нет базы с Канц товарами. А вещи из меню - это для наглядности.
bot.onText( /\/(.+)/i, function ( msg, match ) {
  var userId = msg.from.id;
  var cmd = match[ 1 ].toLowerCase();
  var nlb = [];
  var stage = 0;

  // User.findOne({chat_id: userId}, function(err, user){
  allUsers.forEach( function ( user ) {

    if (( user.chat_id == userId ) && (userId != admin) ) {

      if (cmd == 'назад' ) {
        stage = user.lb.length;
        if ( stage <= 0 ) {
          stage = 1;
        }
        user.lb.splice( user.lb.length - 1, 1 );
      }
      nlb = user.lb;
      
      if ( user.lb[ 0 ] == 2 && user.lb[ 1 ] == 1 ) { // Если нажали Инвентарь, затем список
        var found = false;
        allInv.forEach( function ( inv ) {
          if ( cmd == inv.name ) {
            found = true;
            var img = JSON.parse( inv.img ).
            bot.sendPhoto( userId, img, {
                caption: 'Название: ' + objs.name + '\n Код: ' + objs.code
              } )
              //
          } // cmd == inv
        } );
        if ( !found ) {
          bot.sendMessage( userId, 'Такой вещи в базе нет' );
        }
      } //if lb[0] == 2
      //
                console.log(user.lb[ 0 ] + '\n'+user.lb[ 1 ])

      if ( user.lb[ 0 ] == 1 && user.lb[ 1 ] == 2 ) { // Если нажали Канц товары , затем Заказать NE DOHODIT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        allInv.forEach( function ( inv ) {
          if ( cmd.toLowerCase() == inv.name.toLowerCase() ) {
            kolichestvo = msg.from.id; 
            user.lb = setArr( nlb, 2, (inv.code*1) );

            if(kolichestvo == userId||kolichestvo==0){
              kolichestvo = userId;
              bot.sendMessage(msg.from.id,"Напишите количество, которое вы хотите заказать."); 

            }else {
              bot.sendMessage(msg.from.id,"Пожалуйста подождите пока другой человек закажет товары."); 

            }

          }


        } );
      } //if lb[0] == 2
      //
      if ( user.lb[ 0 ] == 2 && user.lb[ 1 ] == 2 ) { // Если нажали Инвентарь , затем Заказать
        ////
        allInv.forEach( function ( inv ) {
          if ( cmd.toLowerCase() == inv.name.toLowerCase() ) {
            kolichestvo = msg.from.id; 
            user.lb = setArr(nlb, 2, (inv.code*1) );

            if(kolichestvo == userId||kolichestvo==0){
              kolichestvo = userId;
              bot.sendMessage(msg.from.id,"Напишите количество, которое вы хотите заказать."); 

            }else {
              bot.sendMessage(msg.from.id,"Пожалуйста подождите пока другой человек закажет товары."); 

            } 
          }
        } );
      } //if lb[0] == 2

      if ( (( cmd == "канц.товары" ) || ( stage == 2 && user.lb[ 0 ] == 1 )) && (userId != admin) ) {
        console.log( cmd );
        user.lb = setArr( nlb, 0, 1 );
        var buttons = [
          [ {
            text: '/назад',
            callback_data: ''
          } ],
          [ {
            text: '/заказать',
            callback_data: ''
          } ]
        ];
        var options = { // variable options is declared
          reply_markup: JSON.stringify( { //Still don't know what JSON.stringify does but I should read up on it
            keyboard: buttons // CHANGED!!! Dobavlyaem knopki, kotorie est vo vosprose
          } )
        }

        bot.sendMessage( userId, 'Выберите ', options ); //display the msg recieved [from.id] attached to options

      }

      if ( ( cmd == "инвентарь" ) || ( stage == 2 && user.lb[ 0 ] == 2 ) ) {
        user.lb = setArr( nlb, 0, 2 );;
        var buttons = [
          [ {
            text: '/назад',
            callback_data: ''
          } ],
          [ {
            text: '/список',
            callback_data: ''
          } ],
          [ {
            text: '/заказать',
            callback_data: ''
          } ]
        ];
        var options = { // variable options is declared
          reply_markup: JSON.stringify( { //Still don't know what JSON.stringify does but I should read up on it
            keyboard: buttons // CHANGED!!! Dobavlyaem knopki, kotorie est vo vosprose
          } )
        }

        bot.sendMessage( userId, 'Выберите2 ', options ); //display the msg recieved [from.id] attached to options

      }

      if ( cmd == "список" ) {
        if ( user.lb[ 0 ] == 1 ) { //if kantztovar, will never reach, not needed
          user.lb = setArr( nlb, 1, 1 );;
          var buttons = [
            [ {
              text: '/назад',
              callback_data: ''
            } ]
          ];
           allInv.forEach( function ( element ) { // array1 with for loop is started
            buttons.push( [ {
                text: '/' + element.type,
                callback_data: element.id
              } ] ) // .push adds a new elt to the end of the array
          } )
          var options = { // variable options is declared
            reply_markup: JSON.stringify( { //Still don't know what JSON.stringify does but I should read up on it
              keyboard: buttons // CHANGED!!! Dobavlyaem knopki, kotorie est vo vosprose
            } )
          }
          bot.sendMessage( userId, 'Выберите Товары:', options ); //display the msg recieved [from.id] attached to options
        } // if kanctovar

        if ( user.lb[ 0 ] == 2 ) { //if inventory
          user.lb = setArr( nlb, 1, 1 );;
          var buttons = [
            [ {
              text: '/назад',
              callback_data: ''
            } ]
          ];

          //replace to inventory
          array1.forEach( function ( element ) { // array1 with for loop is started
            buttons.push( [ {
                text: '/' + element.type,
                callback_data: element.id
              } ] ) // .push adds a new elt to the end of the array
          } )
          var options = { // variable options is declared
            reply_markup: JSON.stringify( { //Still don't know what JSON.stringify does but I should read up on it
              keyboard: buttons // CHANGED!!! Dobavlyaem knopki, kotorie est vo vosprose
            } )
          }
          bot.sendMessage( userId, 'Выберите Товары:2', options ); //display the msg recieved [from.id] attached to options
        }

      }

      if ( cmd == "заказать" ) {
        if ( user.lb[ 0 ] == 1 ) {
          user.lb = setArr( nlb, 1, 2 );;
          var buttons = [
            [ {
              text: '/назад',
              callback_data: ''
            } ]
          ];
          array1.forEach( function ( element ) { // array1 with for loop is started
            buttons.push( [ {
                text: '/' + element.type,
                callback_data: element.id
              } ] ) // .push adds a new elt to the end of the array
          } )
          var options = { // variable options is declared
            reply_markup: JSON.stringify( { //Still don't know what JSON.stringify does but I should read up on it
              keyboard: buttons // CHANGED!!! Dobavlyaem knopki, kotorie est vo vosprose
            } )
          }
          bot.sendMessage( userId, 'Выберите Товары:', options ); //display the msg recieved [from.id] attached to options
        } // if kanctovar

        if ( user.lb[ 0 ] == 2 ) {
          user.lb = setArr( nlb, 1, 2 );;
          var buttons = [
            [ {
              text: '/назад',
              callback_data: ''
            } ]
          ];

          //replace to inventory
          array1.forEach( function ( element ) { // array1 with for loop is started
            buttons.push( [ {
                text: '/' + element.type,
                callback_data: element.id
              } ] ) // .push adds a new elt to the end of the array
          } )
          var options = { // variable options is declared
            reply_markup: JSON.stringify( { //Still don't know what JSON.stringify does but I should read up on it
              keyboard: buttons // CHANGED!!! Dobavlyaem knopki, kotorie est vo vosprose
            } )
          }
          bot.sendMessage( userId, 'Выберите Товары2:', options ); //display the msg recieved [from.id] attached to options
        }
      }

    } // end of if user.chat == userID && userID is NOT a_dmin 
  } )

  if (( cmd == 'start' || stage == 1 ) && (userId != admin) ) {
    var uname = msg.from.first_name;
    var user = new User( {
      name: uname,
      chat_id: userId
    } )
    var buttons = [
      [ {
        text: '/канц.товары',
        callback_data: ''
      } ],
      [ {
        text: '/инвентарь',
        callback_data: ''
      } ]
    ];
    var options = { // variable options is declared
      reply_markup: JSON.stringify( { //Still don't know what JSON.stringify does but I should read up on it
        keyboard: buttons // CHANGED!!! Dobavlyaem knopki, kotorie est vo vosprose
      } )
    }
    user.save( function ( err, res ) {
      if ( err ) {
        // console.log("Вы уже зарегистрированы");
        bot.sendMessage( userId, "Выберите", options );
      } else {
        bot.sendMessage( userId, "теперь вы зарегистрированы", options );
        bot.sendMessage( admin, "Новый пользователь!!!!\n" + "ID " +
          userId + "\n" + " Имя " + uname );
        bot.sendMessage( userId,
          "Добро пожаловать в MD Office, список доступных вам команд:" +
          "\n" + "/канц.товары  - список вещей на покупку" + "\n" +
          "/купить ***** в количестве: *  - запрос админу о покупке нужной вещи" +
          "\n" + '/help' );
        UpdateDB();
      }

    } )

  } // end of non-@dmin if cmd == start
  // console.log(nlb);


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//                                                                      A D M I N  T I M E  B I A T C H                                                         

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if (( user.chat_id == userId ) && (userId == admin) ) {

      if (cmd == 'назад' ) {
        stage = user.lb.length;
        if ( stage <= 0 ) {
          stage = 1;
        }
        user.lb.splice( user.lb.length - 1, 1 );
      }
      nlb = user.lb;
      
      if ( user.lb[ 0 ] == 4 && user.lb[ 1 ] == 1 ) { // Если нажали Инвентарь, затем список
        var found = false;
        allInv.forEach( function ( inv ) {
          if ( cmd == inv.name ) {
            found = true;
            var img = JSON.parse( inv.img ).
            bot.sendPhoto( userId, img, {
                caption: 'Название: ' + objs.name + '\n Код: ' + objs.code
              } )
              //
          } // cmd == inv
        } );
        if ( !found ) {
          bot.sendMessage( userId, 'Такой вещи в базе нет' );
        }
      } //if lb[0] == 2
      //
                console.log(user.lb[ 0 ] + '\n'+user.lb[ 1 ])

      if ( user.lb[ 0 ] == 1) { // Если нажали SOTRUDNIKI 
        allInv.forEach( function ( inv ) {
          if ( cmd.toLowerCase() == inv.name.toLowerCase() ) {
            kolichestvo = msg.from.id; 
            user.lb = setArr( nlb, 2, (inv.code*1) );

            if(kolichestvo == userId||kolichestvo==0){
              kolichestvo = userId;
              bot.sendMessage(msg.from.id,"Напишите количество, которое вы хотите заказать."); 

            }else {
              bot.sendMessage(msg.from.id,"Пожалуйста подождите пока другой человек закажет товары."); 

            }

          }


        } );
      } //endof Если нажали SOTRUDNIKI
      if ( user.lb[ 0 ] == 2) { // Если нажали ZAKAZ
        allInv.forEach( function ( inv ) {
          if ( cmd.toLowerCase() == inv.name.toLowerCase() ) {
            kolichestvo = msg.from.id; 
            user.lb = setArr( nlb, 2, (inv.code*1) );

            if(kolichestvo == userId||kolichestvo==0){
              kolichestvo = userId;
              bot.sendMessage(msg.from.id,"Напишите количество, которое вы хотите заказать."); 

            }else {
              bot.sendMessage(msg.from.id,"Пожалуйста подождите пока другой человек закажет товары."); 

            }

          }


        } );
      } //endof Если нажали ZAKAZ
      //
      if ( user.lb[ 0 ] == 3 && user.lb[ 1 ] == 2 ) { // Если нажали Инвентарь , затем DOBAVIT (a_dmin side)
        ////
        allInv.forEach( function ( inv ) {
          if ( cmd.toLowerCase() == inv.name.toLowerCase() ) {
            kolichestvo = msg.from.id; 
            user.lb = setArr(nlb, 2, (inv.code*1) );

            if(kolichestvo == userId||kolichestvo==0){
              kolichestvo = userId;
              bot.sendMessage(msg.from.id,"Напишите количество, которое вы хотите DOBAVIT."); 

            }else {
              bot.sendMessage(msg.from.id,"Пожалуйста подождите пока другой человек закажет товары."); 

            } 
          }
        } );
      } //if lb[0] == 2

      if ( (( cmd == "канц.товары" ) || ( stage == 2 && user.lb[ 0 ] == 3 )) && (userId == admin) ) {
        console.log( cmd );
        user.lb = setArr( nlb, 0, 1 );
        var buttons = [
          [ {
            text: '/назад',
            callback_data: ''
          } ],
          [ {
            text: '/dobavit',
            callback_data: ''
          } ]
        ];
        var options = { // variable options is declared
          reply_markup: JSON.stringify( { //Still don't know what JSON.stringify does but I should read up on it
            keyboard: buttons // CHANGED!!! Dobavlyaem knopki, kotorie est vo vosprose
          } )
        }

        bot.sendMessage( userId, 'Выберите ', options ); //display the msg recieved [from.id] attached to options

      }

      if ( ( cmd == "инвентарь" ) || ( stage == 2 && user.lb[ 0 ] == 4 ) ) {
        user.lb = setArr( nlb, 0, 2 );;
        var buttons = [
          [ {
            text: '/назад',
            callback_data: ''
          } ],
          [ {
            text: '/список',
            callback_data: ''
          } ],
          [ {
            text: '/dobavit',
            callback_data: ''
          } ]
        ];
        var options = { // variable options is declared
          reply_markup: JSON.stringify( { //Still don't know what JSON.stringify does but I should read up on it
            keyboard: buttons // CHANGED!!! Dobavlyaem knopki, kotorie est vo vosprose
          } )
        }

        bot.sendMessage( userId, 'Выберите2 ', options ); //display the msg recieved [from.id] attached to options

      }

      if ( cmd == "список" ) {
        if ( user.lb[ 0 ] == 3 ) { //if kantztovar, will never reach, not needed
          user.lb = setArr( nlb, 1, 1 );;
          var buttons = [
            [ {
              text: '/назад',
              callback_data: ''
            } ]
          ];
           allInv.forEach( function ( element ) { // array1 with for loop is started
            buttons.push( [ {
                text: '/' + element.type,
                callback_data: element.id
              } ] ) // .push adds a new elt to the end of the array
          } )
          var options = { // variable options is declared
            reply_markup: JSON.stringify( { //Still don't know what JSON.stringify does but I should read up on it
              keyboard: buttons // CHANGED!!! Dobavlyaem knopki, kotorie est vo vosprose
            } )
          }
          bot.sendMessage( userId, 'Выберите Товары:', options ); //display the msg recieved [from.id] attached to options
        } // if kanctovar

        if ( user.lb[ 0 ] == 4 ) { //if inventory
          user.lb = setArr( nlb, 1, 1 );;
          var buttons = [
            [ {
              text: '/назад',
              callback_data: ''
            } ]
          ];

          //replace to inventory
          array1.forEach( function ( element ) { // array1 with for loop is started
            buttons.push( [ {
                text: '/' + element.type,
                callback_data: element.id
              } ] ) // .push adds a new elt to the end of the array
          } )
          var options = { // variable options is declared
            reply_markup: JSON.stringify( { //Still don't know what JSON.stringify does but I should read up on it
              keyboard: buttons // CHANGED!!! Dobavlyaem knopki, kotorie est vo vosprose
            } )
          }
          bot.sendMessage( userId, 'Выберите Товары:2', options ); //display the msg recieved [from.id] attached to options
        }

      }

      if ( cmd == "dobavit" ) {
        if ( user.lb[ 0 ] == 1 ) {
          user.lb = setArr( nlb, 1, 2 );;
          var buttons = [
            [ {
              text: '/назад',
              callback_data: ''
            } ]
          ];
          array1.forEach( function ( element ) { // array1 with for loop is started
            buttons.push( [ {
                text: '/' + element.type,
                callback_data: element.id
              } ] ) // .push adds a new elt to the end of the array
          } )
          var options = { // variable options is declared
            reply_markup: JSON.stringify( { //Still don't know what JSON.stringify does but I should read up on it
              keyboard: buttons // CHANGED!!! Dobavlyaem knopki, kotorie est vo vosprose
            } )
          }
          bot.sendMessage( userId, 'Выберите Товары:', options ); //display the msg recieved [from.id] attached to options
        } // if kanctovar

        if ( user.lb[ 0 ] == 2 ) {
          user.lb = setArr( nlb, 1, 2 );;
          var buttons = [
            [ {
              text: '/назад',
              callback_data: ''
            } ]
          ];

          //replace to inventory
          array1.forEach( function ( element ) { // array1 with for loop is started
            buttons.push( [ {
                text: '/' + element.type,
                callback_data: element.id
              } ] ) // .push adds a new elt to the end of the array
          } )
          var options = { // variable options is declared
            reply_markup: JSON.stringify( { //Still don't know what JSON.stringify does but I should read up on it
              keyboard: buttons // CHANGED!!! Dobavlyaem knopki, kotorie est vo vosprose
            } )
          }
          bot.sendMessage( userId, 'Выберите Товары2:', options ); //display the msg recieved [from.id] attached to options
        }
      }

    } // end of if user.chat == userID && userID is a_dmin 


  if (( cmd == 'start' || stage == 1 ) && (userId == admin) ) {
    var uname = msg.from.first_name;
    var user = new User( {
      name: uname,
      chat_id: userId
    } )
    var buttons = [
          [{
            text: '/назад',
            callback_data: ''
          }],
          [{
            text: '/сотрудники', //must add a few names for display 
            callback_data: ''
          }],
          [{
            text: '/заказать', 
            callback_data: ''
          }],
          [{
            text: '/канц.товары', 
            callback_data: ''
          }],
          [{
            text: '/инвентарь', 
            callback_data: ''
          }],
          ];
    var options = { // variable options is declared
      reply_markup: JSON.stringify( { //Still don't know what JSON.stringify does but I should read up on it
        keyboard: buttons // CHANGED!!! Dobavlyaem knopki, kotorie est vo vosprose
      } )
    }
    user.save( function ( err, res ) {
      if ( err ) {
        // console.log("Вы уже зарегистрированы");
        bot.sendMessage( userId, "Выберите", options );
      } else {
        bot.sendMessage( userId, "теперь вы зарегистрированы", options );
        bot.sendMessage( admin, "Новый пользователь!!!!\n" + "ID " +
          userId + "\n" + " Имя " + uname );
        bot.sendMessage( userId,
          "Добро пожаловать в MD Office, список доступных вам команд:" +
          "\n" + "/канц.товары  - список вещей на покупку" + "\n" +
          "/купить ***** в количестве: *  - запрос админу о покупке нужной вещи" +
          "\n" + '/help' );
        UpdateDB();
      }
    })
  } //END OF if cmd == start and userId == admin

  //end of bot.onText(.+) (both a_dmin and user side)
} 
bot.on( 'message' , function ( msg ) { // 
  var stuffCode = 0;
  var kolvo = msg.text;
  if(kolichestvo== msg.from.id){
    allUsers.forEach(function(au){
      if (au.chat_id == kolichestvo) {
        stuffCode = au.lb[2];
      }
    })
    bot.sendMessage(kolichestvo,'Ты заказал товар с ID ' + stuffCode + ' в количестве ' + kolvo);
        kolichestvo = 0; 
        stuffCode = 0;

  }

}); 

bot.onText( /www/i, function ( msg, match ) { // type www to Check your ID...304300465
  bot.sendMessage(msg.from.id,msg.from.id)
});
//                                                        A D M I N   _             _
//                                                                    _             _ 
//                                                                    _   S I D E   _ 
//                                                                    _             _ 
//                                                                    _             _   S T A R T I N G


// var array2 = [ { //why can't I use array2? this is admin side problems
//  nname: "Alimbetov, Kairat",
//  theid: '001'
// }, {
//  nname: "Dunaeva, Alua",
//  theid: '002'
// }, { 
//  nname: "Sakurai, Maira"
//  theid: '003'
// // } ];

// if ((userId == admin ) && ( cmd == 'канц.товары')) { //Created Admin side
//           console.log('YOU ARE THE ADMIN <><><><><><><><>');
//           console.log(cmd); 
//           user.lb = setArr(nlb, 0, 1 ); //user.lb ='s nlb, 0th place in array and its choice, 1th place in array and its choice
//           var buttons = [
//           [{
//             text: '/назад',
//             callback_data: ''
//           }],
//           [{
//             text: '/сотрудники', //must add a few names for display 
//             callback_data: ''
//           }],
//           [{
//             text: '/заказать', 
//             callback_data: ''
//           }],
//           [{
//             text: '/канц.товары', 
//             callback_data: ''
//           }],
//           [{
//             text: '/инвентарь', 
//             callback_data: ''
//           }],
//           ];

//             var options = { // variable options is declared
//               reply_markup: JSON.stringify( { //Still don't know what JSON.stringify does but I should read up on it
//               keyboard: buttons // CHANGED!!! Dobavlyaem knopki, kotorie est vo vosprose
//           } )
//             }

//           bot.sendMessage( userId, 'Выберите ', options ); //display the msg recieved [from.id] attached to options

//     }; //end of Admin 

// if (( cmd == 'start' || stage == 1 ) && (userId == admin) ) {
//   console.log('YOU ARE THE ADMIN <><><><><><><><>');
//     var uname = msg.from.first_name;
//     var user = new User( {
//       name: uname,
//       chat_id: userId
//     } )

//     var buttons = [
//           [{
//             text: '/назад',
//             callback_data: ''
//           }],
//           [{
//             text: '/сотрудники', //must add a few names for display 
//             callback_data: ''
//           }],
//           [{
//             text: '/заказать', 
//             callback_data: ''
//           }],
//           [{
//             text: '/канц.товары', 
//             callback_data: ''
//           }],
//           [{
//             text: '/инвентарь', 
//             callback_data: ''
//           }],
//           ];

