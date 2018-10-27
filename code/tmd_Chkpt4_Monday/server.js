/*

1. Need to fix admin side, the konctovar spisok is not displaying, but Inventory, spisok is working and showing everything.  FIXED!!!! 

2. Pri najitie "sotrudnikov", nujno chtoby bylo pokazanno: "Chto, za kem, prikleplen "
Znachit eshe nado dobavit knopki "vzyat\vernul?"

3. there are no queues in this program ...

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
var Zakaz = require( './Schema/Zakaz.js' );
var Inventory = require( './Schema/Inventory.js' )
var allZak = [];
var kolichestvo = 0;
//
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
var noPhoto = 'AgADAgAD7acxG7sLwUrLjG9sLOpLYQQ4Sw0ABNIjRrkeKwI8jYcKAAEC'
var addinv = ['0','','','','',noPhoto]; // 0 id ; 1 name; 2 code ; 3 kanc ; 4 amount ; 5 photo;


////////////////////////////////////////////////////////////////////////////////////////////////////////////    E  X  P  
function modifyDBS(sch, obj) { //modifying the database 
  if (sch == 1) { //what is sch? 
    Users.findOne({
      id: obj.id
    }, function(err, u) { //what is u here? 
      if (!u)
        console.log(err);
      else {
        // do your updates here
        u.inQuest = obj.inQuest;
        u.done = obj.done;
        u.que = obj.que;
        u.stamp = obj.stamp;
        u.puns = obj.puns;
        u.lf = obj.lf;
        u.level = obj.level;
        u.lastPhoto = obj.lastPhoto;
        u.voted = obj.voted;
        u.save(function(err) {
          if (err)
            console.log('error')
        });
      }
    });
  }
  if (sch == 2) {
    Quests.findOne({
      id: obj.id
    }, function(err, q) {
      if (!q) {
      } else {
        // do your updates here
        q.quest = obj.quest;
        q.inUse = obj.inUse;
        q.level = obj.level;
        q.save(function(err) {
          if (err)
            console.log('error')
        });
      }
    });
  }
  if (sch == 3) {
    Punish.findOne({
      id: obj.id
    }, function(err, p) {
      if (!p)

        console.log(err);
      else {
        // do your updates here
        p.pun = obj.pun;
        p.inUse = obj.inUse;
        p.save(function(err) {
          if (err)
            console.log('error')

        });
      }
    });
  }

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////    E  X  P 
function UpdateDBS(sch, obj) {
  // 1 - users; 2 - quests; 3 - puns; 4 -all
  if (sch == 1) {

    var newUser = new Users(obj);
    newUser.save(function(err, saved) {
      if (err) {
      } else {
      }
    });
  }
  if (sch == 2) {
    var newQuest = new Quests(obj);
    newQuest.save(function(err, saved) {
      if (err) {
      } else {
      }
    });
  }
  if (sch == 3) {
    var newPunish = new Punish(obj);
    newPunish.save(function(err, saved) {
      if (err) {
      } else {
      }
    });
  }
  console.log('Updated');
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////    E  X  P 
function ReloadDBS(sch) {
  // 1 - users; 2 - quests; 3 - puns; 4 -all
  console.log('Reloading DBS.');
  if (sch == 0) {
    Admins.find({}, function(err, found) {
      if (err) {
        console.log('Error loading Admins DB')
      }
      if (found.length > 0) {
        admin = found;
      } else {
        admin = [];
      }
    })
  }
  if (sch == 1) {
    Users.find({}, function(err, found) {
      if (err) {
        console.log('Error loading Users DB')
      }
      if (found.length > 0) {
        users = found;
      // SortById(users)
      } else {
        users = [];
      }
    // done=true;
    }) //exec

  }
  if (sch == 2) {
    Quests.find({}, function(err, found) {
      if (err) {
        console.log('Error loading Quests DB')
      }
      if (found.length > 0) {
        quests = found;
        quests = SortById(quests);
      } else {
        quests = [];
      }
    // done=true;
    }) //exec
  }
  if (sch == 3) {
    Punish.find({}, function(err, found) {
      if (err) {
        console.log('Error loading Punish DB')
      }
      if (found.length > 0) {
        punish = found;
        punish = SortById(punish)
      } else {
        punish = [];
      }
    // done=true;
    }) //exec
  }
  if (sch == 4) {
    Users.find({}, function(err, found) {
      if (err) {
        console.log('Error loading Users DB')
      }
      if (found.length > 0) {
        users = found;
      } else {
        users = [];
      }
    })

    Quests.find({}, function(err, found) { 					// QUESTS ? there are no quests ...
      if (err) {
        console.log('Error loading Quests DB')
      }
      if (found.length > 0) {
        quests = found;
        quests = SortById(quests)
      } else {
        quests = [];
      }
    })
    Punish.find({}, function(err, found) {
      if (err) {
        console.log('Error loading Punish DB')
      }
      if (found.length > 0) {
        punish = found;
        punish = SortById(punish)
      } else {
        punish = [];
      }
    })
    Admins.find({}, function(err, found) {
      if (err) {
        console.log('Error loading Admins DB')
      }
      if (found.length > 0) {
        admin = found;
      } else {
        admin = [];
      }
    })

  }
  console.log('DBS Are Reloaded.');
}

var array2 = [ { //why can't I use array2? this is admin side problems
 name: "Alimbetov, Kairat",
 id: '001'
}, {
 name: "Dunaeva, Alua",
 id: '002'
}, {
 name: "Sakurai, Maira",
 id: '003'
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

  Zakaz.find({}, function(err, zak){
    allZak = zak;
  })
  console.log( 'All DBs Are Loaded.' );
}
function SaveDB() { //created a DB 0.93456765434567
  array1.forEach(function(inve){
    var inv = new Inventory({ //new scheme
    name: inve.type,
    code: inve.id,
    img: 'AgADAgAD7acxG7sLwUrLjG9sLOpLYQQ4Sw0ABNIjRrkeKwI8jYcKAAEC',
    open:false,
    amount:0,
    kanc: (Math.random() * 10 > 5) ? true : false //false means it's inventory, if true, it's konc, randomizing
})

  inv.save(); //save the scheme we just created

  })

  console.log( 'All DBs Are Loaded.' );
}

SaveDB();              // RARARA!
setTimeout(UpdateDB,3000)
UpdateDB();
var allUsers = [{
  //my admin number: 304300465
  name: "Amir Auto",
  chat_id: 304300465,
  lb: [],
  zapros: []
}]; //end of var allUsers = []

////////////////////
var TelegramBot = require( 'node-telegram-bot-api' );

// replace the value below with the Telegram token you receive from @BotFather
var token = '310123554:AAHb5H73xT7pzsNjxLjs3_UD3jnIFnAYOf8';

// Create a bot that uses 'polling' to fetch new updates
var bot = new TelegramBot( token, {
  polling: true
} );
var notes = [];
var admin = 304300465; //304300465; // = 362814495;

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

//

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


//                                Тут ещё нет админки, поэтому нет базы с Канц товарами. А вещи из меню - это для наглядности.
bot.onText( /\/(.+)/i, function ( msg, match )  {
  var userId = msg.from.id;
  var cmd = match[ 1 ].toLowerCase();
  var nlb = [];
  var stage = 0;
if (userId != admin) {
  // User.findOne({chat_id: userId}, function(err, user){
  allUsers.forEach( function ( user ) {

    if ( user.chat_id == userId ) {

      if (( cmd == 'назад' ) && (userId != admin) ) {
        stage = user.lb.length;
        if ( stage <= 0 ) {
          stage = 1;
        }
        user.lb.splice( user.lb.length - 1, 1 );
      }
      nlb = user.lb;

      if (( user.lb[ 0 ] == 2 && user.lb[ 1 ] == 1 ) && (userId != admin) ) { // Если нажали Инвентарь, затем список
        var found = false;
        allInv.forEach( function ( inv ) {
          if ( cmd.toLowerCase() == inv.name.toLowerCase() ) {
            found = true;
            var img = inv.img;
            bot.sendPhoto( userId, img, {
                caption: 'Название: ' + inv.name + '\n Код: ' + inv.code
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

      if (( user.lb[ 0 ] == 1 && user.lb[ 1 ] == 2 ) && (userId != admin) ) { // Если нажали Канц товары , затем Заказать NE DOHODIT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
      if (( user.lb[ 0 ] == 2 && user.lb[ 1 ] == 2) && (userId != admin) ) { // Если нажали Инвентарь , затем Заказать
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

      if (( ( cmd == "инвентарь" ) || ( stage == 2 && user.lb[ 0 ] == 2 ) ) && (userId != admin) ) {
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
                text: '/' + element.name,
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
          allInv.forEach( function ( element ) { // array1 with for loop is started
            buttons.push( [ {
                text: '/' + element.name,
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
          allInv.forEach( function ( element ) { // array1 with for loop is started
          if(element.kanc) buttons.push( [ {
                text: '/' + element.name,
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
          allInv.forEach( function ( element ) { // array1 with for loop is started
            buttons.push( [ {
                text: '/' + element.name,
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

    }
  } )

  if ( cmd == 'start' || stage == 1 ) {
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

    } ) //end of user.save

  } // end of cmd == start
  // console.log(nlb);
}
} )
// AgADAgAD7acxG7sLwUrLjG9sLOpLYQQ4Sw0ABNIjRrkeKwI8jYcKAAEC

var startphoto = false;
bot.on( 'message' , function ( msg ) { // type www to Check your ID...304300465

  if(startphoto){
    noPhoto = msg.photo[0].file_id
    bot.sendMessage(msg.from.id, noPhoto);
  }
  var stuffCode = 0;
  var kolvo = msg.text;
  if(kolichestvo== msg.from.id){
    allUsers.forEach(function(au){
      if (au.chat_id == kolichestvo) {
        stuffCode = au.lb[2];
      }
    })
    //f***bookmark HOTIM CHOTBY ZAKAZ ZAPISISOVALSYA V db
    Zakaz.findOne({
      code:stuffCode
    }, function(err, zz) {
      console.log(zz)
        if(!zz){
          var z = new Zakaz({
            code:stuffCode,
            amount: kolvo,
            users: [msg.from.id]
          })
          z.save();
          console.log(z)
        } else {
          zz.amount = (zz.amount * 1 + kolvo * 1) * 1;
          if(zz.users.indexOf(msg.from.id)<0){zz.users.push(msg.from.id)}
          zz.save();
        }
    })
    // zakaz.push({id:stuffCode,count:kolvo});
    // Zakaz.find()
    // var z = new Zakaz({
    //   code:stuffCode,
    //   count: kolvo
    // })
    // z.save();
    bot.sendMessage(msg.from.id, 'Ты заказал товар с ID ' + stuffCode + ' в количестве ' + kolvo);
    bot.sendMessage(admin, 'Кто-то заказал товар с ID ' + stuffCode + ' в количестве ' + kolvo);

        kolichestvo = 0;
        // stuffCode = 0;

  }

}) //bot.on( 'message', function msg

bot.onText( /www/i, function ( msg, match ) { // type www to Check your ID...304300465
  bot.sendMessage(msg.from.id,msg.from.id)
}) //end of bot.onText /www/i


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//                                                                     A D M I N   T I M E  			                                                                     //

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

bot.onText( /\/(.+)/i, function ( msg, match )  {
  var userId = msg.from.id;
  var cmd = match[ 1 ].toLowerCase();
  var nlb = [];
  var stage = 0;

if (userId == admin) {

  // User.findOne({chat_id: userId}, function(err, user){
  allUsers.forEach( function ( user ) {
console.log('wwwwww' + user.lb);
    if ( user.chat_id == userId ) {

      if (( cmd == 'назад' ) && (userId == admin) ) {
        stage = user.lb.length;
        if ( stage <= 0 ) {
          stage = 1;
        }
        user.lb.splice( user.lb.length - 1, 1 );
      }
      nlb = user.lb;
      // заказ
      if (cmd == 'заказы' || user.lb[0] == 2){
        user.lb = setArr( nlb, 0, 2 );
        console.log('wwww');
        //there should be KTO CHTO HOCHET
        var h = '';
        Zakaz.find({},function(err,z){
          if(z){
            h = 'Текущие заказы: \n'
            var who = ''
            z.forEach(function (zz,i) {
              zz.users.forEach(function (u) {
                who = who + u + ', '
              })
              h = h + (i+1) + ')'
              h = h + who + '\n'
              h = h +'Код товара: ' + zz.code + '\n'
              h = h +'Количество: ' + zz.amount + '\n-------------------\n'
            })
            bot.sendMessage(msg.from.id,h)
          }else {
            bot.sendMessage(msg.from.id,'На текущий момент нет заказов!')
          }
        })
      }
      if (( user.lb[ 0 ] == 4 && user.lb[ 1 ] == 1 ) ) { // Если нажали Инвентарь, затем список admin side
        var found = false;
        allInv.forEach( function ( inv ) {
          if ( cmd == inv.name ) {
            found = true;
            var img = inv.img
            bot.sendPhoto( userId, img, {
                caption: 'Название: ' + inv.name + '\n Код: ' + inv.code + '\n Количество: ' + inv.amount
              } )
              //
          } // cmd == inv
        } );
        if ( !found ) {
          bot.sendMessage( userId, 'Такой вещи в базе нет' );
        }
      } //if lb[0] == 4
      if (( user.lb[ 0 ] == 3 && user.lb[ 1 ] == 1 ) ) { // Если нажали Konctovar, затем список admin side
        var found = false;
        allInv.forEach( function ( inv ) {
          if ( cmd == inv.name ) {
            found = true;
            var img = inv.img
            bot.sendPhoto( userId, img, {
                caption: 'Название: ' + inv.name + '\n Код: ' + inv.code + '\n Количество: ' + inv.amount
              } )
              //
          } // cmd == inv
        } );
        if ( !found ) {
          bot.sendMessage( userId, 'Такой вещи в базе нет' );
        }
      } //if lb[0] == 3
      //
                console.log(user.lb[ 0 ] + '\n' + user.lb[ 1 ])

      if ( user.lb[ 0 ] == 3 && user.lb[ 1 ] == 2 ) { // Если нажали Канц товары , затем DOBAVIT NE DOHODIT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        allInv.forEach( function ( inv ) {
          if ( cmd.toLowerCase() == inv.name.toLowerCase() ) {
            kolichestvo = msg.from.id;
            user.lb = setArr( nlb, 2, (inv.code * 1) );

            if (kolichestvo == userId || kolichestvo == 0){
              kolichestvo = userId;
              bot.sendMessage(msg.from.id,"Напишите количество, которое вы хотите заказать.");

            } else {
              bot.sendMessage(msg.from.id,"Пожалуйста подождите пока другой человек закажет товары.");

            }

          }


        } );
      } //if lb[0] == 3
      //
      if (user.lb[ 0 ] == 4 && user.lb[ 1 ] == 2) { // Если нажали Инвентарь , затем DOBAVIT
        ////
        allInv.forEach( function ( inv ) {
          if ( cmd.toLowerCase() == inv.name.toLowerCase() ) {
            // addinv[0] = userId;
            user.lb = setArr(nlb, 2, (inv.code * 1) );
            var f = true;
            if(addinv[0] == userId || addinv[0] == '0'){
              addinv[0] = userId;
              addinv[1] = inv.name;
              addinv[2] = inv.code;
              addinv[3] = inv.kanc;
              addinv[5] = inv.img;
              bot.sendMessage(msg.from.id,"Сколько вы купили? ");

            } else {
              bot.sendMessage(msg.from.id,"Пожалуйста подождите пока другой человек Добавит товар.");

            }
          }
        } );



      } //if lb[0] == 2

      if ((( cmd == "канц.товары" ||  stage == 2 && user.lb[ 0 ] == 3  )) && (userId == admin)) {
        console.log( cmd );
        user.lb = setArr( nlb, 0, 4 );
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
            text: '/обновить',
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

      if (( ( cmd == "инвентарь" ) || ( stage == 2 && user.lb[ 0 ] == 4 ) ) && (userId == admin) ) {
        user.lb = setArr( nlb, 0, 4 );;
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
            text: '/обновить',
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
        // UpdateDB();
        if ( user.lb[ 0 ] == 3 ) { //if kantztovar, will never reach, not needed
          user.lb = setArr( nlb, 1, 1 );;
          var buttons = [
            [ {
              text: '/назад',
              callback_data: ''
            } ]
          ];
           allInv.forEach( function ( element ) { // array1 with for loop is started
          if(element.kanc)  buttons.push( [ {
                text: '/' + element.name,
                callback_data: element.id
              } ] ) // .push adds a new elt to the end of the array
          } )
          var options = { // variable options is declared
            reply_markup: JSON.stringify( { //Still don't know what JSON.stringify does but I should read up on it
              keyboard: buttons // CHANGED!!! Dobavlyaem knopki, kotorie est vo vosprose
            } )
          }
          bot.sendMessage( userId, 'Список Канц. Товаров:', options ); //display the msg recieved [from.id] attached to options
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
          allInv.forEach( function ( element ) { // array1 with for loop is started
            buttons.push( [ {
                text: '/' + element.name,
                callback_data: element.id
              } ] ) // .push adds a new elt to the end of the array
          } )
          var options = { // variable options is declared
            reply_markup: JSON.stringify( { //Still don't know what JSON.stringify does but I should read up on it
              keyboard: buttons // CHANGED!!! Dobavlyaem knopki, kotorie est vo vosprose
            } )
          }
          bot.sendMessage( userId, 'Выберите Товары:', options ); //display the msg recieved [from.id] attached to options
        }

      }

      if ( cmd == "обновить" ) {
        if ( user.lb[ 0 ] == 3 ) { //if we pressed konc, (ad min side)  NNNEEEE DOHODIT AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
          user.lb = setArr( nlb, 1, 2 );;
          var buttons = [
            [ {
              text: '/назад',
              callback_data: ''
            } ]
          ];
          allInv.forEach( function ( element ) { // array1 with for loop is started
            buttons.push( [ {
                text: '/' + element.name,
                callback_data: element.id
              } ] ) // .push adds a new elt to the end of the array
          } )
          var options = { // variable options is declared
            reply_markup: JSON.stringify( { //Still don't know what JSON.stringify does but I should read up on it
              keyboard: buttons // CHANGED!!! Dobavlyaem knopki, kotorie est vo vosprose
            } )
          }
          bot.sendMessage( userId, 'Выберите Товары:', options ); //display the msg recieved [from.id] attached to options
        } // end of if kanctovar/ad min side 

        if ( user.lb[ 0 ] == 4 ) { //if inventory, (ad min side) 
          user.lb = setArr( nlb, 1, 2 );;
          var buttons = [
            [ {
              text: '/назад',
              callback_data: ''
            } ]
          ];

          //replace to inventory
          allInv.forEach( function ( element ) { // array1 with for loop is started
            buttons.push( [ {
                text: '/' + element.name,
                callback_data: element.id
              } ] ) // .push adds a new elt to the end of the array
          } )
          var options = { // variable options is declared
            reply_markup: JSON.stringify( { //Still don't know what JSON.stringify does but I should read up on it
              keyboard: buttons // CHANGED!!! Dobavlyaem knopki, kotorie est vo vosprose
            } )
          }
          bot.sendMessage( userId, 'Выберите Товары2:', options ); //display the msg recieved [from.id] attached to options
        } //end of inventory, (ad min side)
      }

      if ( cmd == "сотрудники" ) {

          user.lb = setArr( nlb, 0, 1 );;
          var buttons = [
            [ {
              text: '/назад',
              callback_data: ''
            } ]
          ];
          array2.forEach( function ( element ) { // array1 with for loop is started
            buttons.push( [ {
                text: '/' + element.name,
                callback_data: element.id
              } ] ) // .push adds a new elt to the end of the array
          } )
          var options = { // variable options is declared
            reply_markup: JSON.stringify( { //Still don't know what JSON.stringify does but I should read up on it
              keyboard: buttons // CHANGED!!! Dobavlyaem knopki, kotorie est vo vosprose
            } )
          }
          bot.sendMessage( userId, 'Список сотрудников: ', options ); //display the msg recieved [from.id] attached to options
         // if kanctovar


      }
    }
  } )

  if ( cmd == 'start' || stage == 1 ) {
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
        text: '/заказы',
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

    } ) //end of user.save

  } // end of cmd == start
  // console.log(nlb);
}

} )


bot.on( 'message' , function ( msg ) { // 
if(msg.from.id == admin && msg.from.id == addinv[0]){
  if(addinv[1] != '' && addinv[2] != '' && addinv[3] != ''){

    Inventory.findOne({code:addinv[2]}, function (err,inv) {
      if( !inv ){

      } else {
        inv.amount = (inv.amount *1 + msg.text * 1) * 1;
        inv.save();
        addinv[0] = '0';
        addinv[1] = '';
        addinv[2] = '';
        addinv[3] = '';
        addinv[4] = '';
        bot.sendMessage(msg.from.id,'OK')
        UpdateDB() 
      }
    })
  }
}

}) //bot.on( 'message', function msg
