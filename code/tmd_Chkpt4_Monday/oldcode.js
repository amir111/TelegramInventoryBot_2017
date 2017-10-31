var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// for auth 
var crypto = require('crypto');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
mongoose.connect('mongodb://127.0.0.1:27017/tmd');



var User = require('./Schema/User.js');
var Pt = require('./Schema/Pt.js');
var Inventory = require('./Schema/Inventory.js')
var array1 = [  
      	{type: "Органайзер",                 // finish addressing id and type to the rest of list 
        id:'001'},
        {type: "Блокнот", 
        id:'002'},
        {type: "А4", 
        id:'003'},
        {type: "Папка-регистратор",
        id:'004'},
        {type: "Карандаш простой",
        id: '005'}, 
        {type: "Ручка",
        id: '006'},
        {type: "Стикеры",
        id: '007'},
        {type: "Степлеры",
        id: '008'},
        {type: "Скобы", 
        id: '009'},
        {type: "Отвертки", 
        id: '010'},
        {type: "Ножницы", 
        id: '011'},
        {type: "Корректор", 
        id: '012'},
        {type: "Канц", 
        id: '013'},
        {type: "Точилки",
        id: '014'},
        {type: "Резинка",
        id: '015'},
        {type: "Файлы",
        id: '016'},
        {type: "Коверты",
        id: '017'},
        {type: "Батарейки",
        id: '018'},
        {type: "Антистеплер",
        id: '019'},
        {type: "Настольные ручки",
        id: '020'},
        {type: "Линейки",
        id: '021'},
        {type: "Разделители",
        id: '022'},
        {type: "Скотч",
        id: '023'},
        {type: "Маркер", 
        id: '024'}
        ];
//         array1.forEach(function (e){
//         	var thing = new Pt({
//         		name: e
//         	})
//         	thing.save(function(err, res){
// 		if(err)	console.log(err);
// 			console.log(res);	

// 	})

//         	console.log(e);
//         })
        

// var MongoClient = require('mongodb').MongoClient;
// var url = 'mongodb://127.0.0.1:27017/tmd';

// MongoClient.connect(url, function(err, db) {

    
//     Thing.find(({}).toArray, function(err, objs){
//     		console.log(objs[0]);
//     })
// }); 

var TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
var token = '310123554:AAHb5H73xT7pzsNjxLjs3_UD3jnIFnAYOf8';

// Create a bot that uses 'polling' to fetch new updates
var bot = new TelegramBot(token, {polling: true});




 var notes = [];

 var admin = 362814495;


 // bot.onText(/\/напомни (.+) в (.+)/, function (msg, match) {
 //      var userId = msg.from.id;
 //      var text = match[1];
 //      var time = match[2];

 //      notes.push( { 'uid':userId, 'time':time, 'text':text } );

 //      bot.sendMessage(userId, 'Отлично! Я обязательно напомню, если не сдохну :)');
 //    });
	console.log('www');
	bot.onText(/\/start/, function(msg, match){
  var fromId = msg.from.id;
  var uname = msg.from.first_name;
	var user = new User({
		name: msg.from.first_name,
    chat_id: msg.from.id
	})
	
	user.save(function(err, res){
		if(err){
			console.log("Вы уже зарегались!!!");	
		}
		else{
			bot.sendMessage(fromId,"Вы успешно зарегались!!!!\n" + "Ваш chat ID " + fromId + "\n"+" Ваше имя " + uname);
		  bot.sendMessage(admin, "Новый пользователь!!!!\n" + "ID " + fromId + "\n"+" Имя " + uname);
      bot.sendMessage(fromId,"Добро пожаловать в MD Office, список доступных вам команд:" + "\n" + "/канцтовары  - список вещей на покупку" + "\n" + "/купить ***** в количестве: *  - запрос админу о покупке нужной вещи" + "\n" + '/help');

    
    }


	})

});
//
//
//
bot.onText(/\/help/, function(msg, match){
    console.log('www');
   var fromId = msg.from.id;
	 bot.sendMessage(fromId,"Забыли команды, не беда:" + "\n" + "/канцтовары  - полный список вещей в базе" + "\n" + "/купить ***** в количестве: *  - запрос админу о покупке нужной вещи");
});

//
//
//
bot.onText(/\/канцтовары/, function(msg, match) {
  var fromId = msg.from.id;
	Pt.find({}, function(err, objs){
		console.log(objs);
		var h ='Канцтовары:';
		objs.forEach(function(it){
			h = h +'\n -'+it.name;
		})
		bot.sendMessage(fromId, h);
    })
});
bot.onText(/\/проверка (.+)/i, function(msg, match){
	var fromId = msg.from.id;
	var thingName = match[1].toLowerCase();

	Pt.findOne({'name': thingName}, function(err, objs){
    if(objs){  
		console.log(objs);
		bot.sendMessage(fromId, 'название: ' + objs.name + '\n' +' запросил(и): ' + objs.users);
    }
    else if(!objs){
      bot.sendMessage(fromId, 'такой вещи в базе нет');

    }
    });
//
//

// bot.sendPhoto({
//     chat_id: 362814495,
//     caption: 'This is my test image',
 
//     // you can also send file_id here as string (as described in telegram bot api documentation)
//     photo: '/user.png'
// })
// .then(function(data)
// {
//     console.log(util.inspect(data, false, null));
// });
//
//    
})
// bot.onText(/\/отправить/, function(msg, match) {
//   var fromId = msg.from.id;
//   console.log(msg);
//   bot.sendPhoto(fromId, msg.photo[0].file_id).then(function(sended){
//     bot.sendMessage(admin,'asdasdasd');
//   }) 
// });



//Will this ADVANCED FOR LOOP still work fine if an I place it under the MD Main Menu Office by order? 
//  ADVANCED FOR LOOP, which 
//.on is listening constantly, if it hears, the function right next to it will deploy 
bot.on('callback_query', function(msg) {    //if callback_query is found (callback_query is a button that has been clicked on)...then funtion(msg) is executed
  console.log(msg);  //display msg? from where???? The message here is from the choice that the user has choosen                 
  var buttons = [];        
  console.log(msg);                 // initially array buttons[] is empty 
  if(msg.data == "1"){                      // if the msg.data recieved is == to 1, then it means you have chosen Konctovary
    array1.forEach(function(element){       // array1 with for loop is started 
      buttons.push([{text: element.type, callback_data:element.id}]) // .push adds a new elt to the end of the array 
    }) 
    console.log("21111111111111");                   //console.log() basically prints out stuff, in this case buttons 
    var options = {                         // variable options is declared 
      reply_markup: JSON.stringify({        //Still don't know what JSON.stringify does but I should read up on it 
      keyboard: buttons // CHANGED!!! Dobavlyaem knopki, kotorie est vo vosprose 
      })
    } 
    // console.log()                    //console.log() basically prints out stuff, in this case buttons 
    bot.sendMessage(msg.from.id, 'Выберите Товары:', options); //display the msg recieved [from.id] attached to options 
  } 
  else {
  if(msg.data == "2"){  // if the msg.data recieved is == to 2, then it means you have chosen Inventory 

    array2.forEach(function(element){
          buttons.push([{text: element.type, callback_data:element.id}])
      })
    console.log("buttons"); 
    var options = {
      reply_markup: JSON.stringify({
        keyboard: buttons //CHANGED!!!
      })
    }
    // console.log() //prints out options
    bot.sendMessage(msg.from.id, 'Выберите Inventory:', options); 
  }
}
}) 



bot.onText(/\/Konctovar/i, function(msg) {
  var fromId = msg.from.id;
 var buttons = [];        
  console.log(msg);                 // initially array buttons[] is empty 
                    // if the msg.data recieved is == to 1, then it means you have chosen Konctovary
    array1.forEach(function(element){       // array1 with for loop is started 
      buttons.push([{text: '/'+element.type, callback_data:element.id}]) // .push adds a new elt to the end of the array 
    }) 
    console.log("21111111111111");                   //console.log() basically prints out stuff, in this case buttons 
    var options = {                         // variable options is declared 
      reply_markup: JSON.stringify({        //Still don't know what JSON.stringify does but I should read up on it 
      keyboard: buttons // CHANGED!!! Dobavlyaem knopki, kotorie est vo vosprose 
      })
    } 
    // console.log()                    //console.log() basically prints out stuff, in this case buttons 
    bot.sendMessage(msg.from.id, 'Выберите Товары:', options); //display the msg recieved [from.id] attached to options 


});


//  This is the MD OFFICE Main Menu
//  Here there will be displayed two choices for the user in the form of buttons (Konctovary and Inventory)
bot.on('message', function(msg){
console.log(msg);
 //bot.on is listening for any keyboard input into the telegram 
var buttons = [ //array buttons has two following elements inside of it, which are buttons (Konctovary and Invertory)
[{text: '/Konctovar', callback_data:'1'}], //this is the first buttton, called koncetovary, and the callback_data number specified to it is 1 
[{text: '/Inventory', callback_data:'2'}]  //this is the second button, called inventory, and the callback_data number for it is 2 
]
if(msg){
var options = {  //our options are buttons, (line 223) -> (inline_keyboard: buttons)
      reply_markup: JSON.stringify({
      keyboard: buttons                  // CHANGED!!! Dobavlyaem knopki, kotorie est vo vosprose 
      })
};
// console.log() //displays the two options that we have 
bot.sendMessage(msg.from.id, 'Please select either of the two button choices available', options); //displays message to the certain ID that is using the options 
}
})




bot.onText(/\/регистрация/, function(msg) {
  var bbb=0;
  var fromId = msg.from.id;
  if(bbb==0){ 
    bbb++;
    bot.sendMessage(fromId, 'напишите название продукта');
  }
  bot.on('message', function(msg1){
           if(bbb==1){ 
      bbb++;
        bot.sendMessage(fromId, 'Напишите код продукта');}
          bot.on('message', function(mag){
              if(bbb==2){ 
      bbb++;
            bot.sendMessage(fromId, 'Скиньте фото');}
              bot.on('message', function(pho){
                console.log(pho);
          var inventory = new Inventory({
          name: msg1.text,
          code: mag.text,
          img: JSON.stringify(pho.photo[0])
        })
          inventory.save(function(err, res){
    if(err){
      console.log(err);  
    }
    else{   
      bot.sendMessage(fromId,"зарегались!!!!").then(function(e){
          console.log('все');
      });
      
    }
  })
          bot.sendMessage(fromId, 'конец');

             });

        })
    

    });

});




        // /поиск ручка шорты
bot.onText(/\/поиск (.+)/, function(msg, match) {
  var fromId = msg.from.id;
  var sname = match[1];
  Inventory.findOne({'name': sname}, function(err, objs){
    if(objs){
    console.log(objs);
    var img = JSON.parse(objs.img).file_id

    bot.sendPhoto(fromId, img, {caption: objs.name + objs.code});
    // bot.sendMessage(fromId, 'Название: ' + objs.name +'\n' + 'Код: '+ objs.code);
  }
  else if(!objs){
    bot.sendMessage(fromId, 'такой вещи в базе нет');
  }
  })
  

 
});

bot.onText(/\/(.+)/i, function(msg, match) {
  var fromId = msg.from.id;
  var tovar = match[1].toLowerCase(); 
  
  array1.forEach(function(t){
    if(tovar==t.type.toLowerCase()){
      bot.sendMessage(fromId, t.type + '\n' + t.id);
    }  
  })
});

bot.onText(/\/взял (.+)/i, function(msg, match) {
  console.log('polpolpolpo')
  console.log(msg);
  console.log('0====(*_*)====0')
  var fromId = msg.from.id;

  bot.sendMessage(fromId, msg.text + ' 2e3wrwqrwe');

});



bot.onText(/\/отдал (.+)/i, function(msg, match) {
  var fromId = msg.from.id;
  
  bot.sendMessage(admin, "This " + fromId + " id choose to suicide himself by " + chosenSuicide);

});




// bot.on('message', function(msg){
//   var fromId = msg.from.id;
//   console.log(msg.text);

// })

// bot.on('message', function(msg){
//   var fromId = msg.from.id;
//   bot.sendPhoto(admin, msg.photo[0].file_id).then(function(sended){
//     bot.sendMessage(admin, 'asdasd');
//   })
//   console.log(msg);
// });
bot.onText(/\/купить (.+) (.+) (.+)/i , function(msg, match){
  var fromId = msg.from.id;
  var thingName = match[1].toLowerCase();
  var amount = match[2];
  var slovo = match[3];

  Pt.findOne({'name': thingName}, function(err, objs){
    if(objs && objs.id){
    if (err) return next(err);
    User.findOne({chat_id: msg.from.id}, function(err, user){
          user.zapros.push(objs.id)
           user.save(function(err) {
          if (err) return next(err);

          objs.users.push(msg.from.first_name),
            objs.save(function(err){
              if(err) return next(err);
            })
      })
            
           console.log(user.zapros);
    bot.sendMessage(fromId,  " Вы запросили " + objs.name +' в количестве ' + amount + "\n" +'ваш запрос отправлен админу, ожидайте');
  
    bot.sendMessage(admin,   user.name + " хочет купить  " + objs.name +' в количестве:' + amount);

    })
  }
  else if(!objs){
    bot.sendMessage(fromId, 'Такой вещи в базе нет, пишите правильно');
  }
    
  
    })  
})

bot.onText(/\/suicide/, function(msg, match) {
  var fromId = msg.from.id;
  var suicides = ["GunShot","JumpingFromTower","Poisoning","DrugAlcoholOverdosing"];
  var chosenSuicide = suicides[Math.floor(Math.random() * suicides.length)];
  bot.sendMessage(fromId, chosenSuicide);
  
  bot.sendMessage(admin, "This " + fromId + " id choose to suicide himself by " + chosenSuicide);

});





  // setInterval(function(){
  //       for (var i = 0; i < notes.length; i++){
  //           var curDate = new Date().getHours() + ':' + new Date().getMinutes();
  //               if ( notes[i]['time'] == curDate ) {
  //                   bot.sendMessage(notes[i]['uid'], 'Напоминаю, что вы должны: '+ notes[i]['text'] + ' сейчас.');
  //                   notes.splice(i,1);
  //               }
  //           }
  //   },1000);




// Matches "/echo [whatever]"
// bot.onText(/\/qwerty (.+)/, (msg, match) => {
//   // 'msg' is the received Message from Telegram
//   // 'match' is the result of executing the regexp above on the text content
//   // of the message

//   var chatId = msg.chat.id;
//   var resp = match[1]; // the captured "whatever"

//   // send back the matched "whatever" to the chat
//   bot.sendMessage(chatId, resp);
// });

// // Listen for any kind of message. There are different kinds of
// // messages.
// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;

//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(chatId, 'Received your message');
// });


var app = express();



app.set('port', process.env.PORT || 3000);

app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 1 }));
// for auth
app.use(cookieParser());
app.use(session({ secret: 'your secret here',
	resave:  true,
	saveUninitialized: true,
	key: 'jsessionid',
	store: new MongoStore({ mongooseConnection: mongoose.connection })
}));


// app.use(require('./server/routes'));




// // Matches "/echo [whatever]"
// bot.onText(/\/echo (.+)/, (msg, match) => {
//   // 'msg' is the received Message from Telegram
//   // 'match' is the result of executing the regexp above on the text content
//   // of the message

//   var chatId = msg.chat.id;
//   var resp = match[1]; // the captured "whatever"

//   // send back the matched "whatever" to the chat
//   bot.sendMessage(chatId, resp);
// });

// Listen for any kind of message. There are different kinds of
// messages.

// bot.onText(/help/i, function(msg, match){
// 	bot.sendMessage(msg.chat.id, 'asdasdwq help');
// });




var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});




// var io = require("socket.io")();
// io.attach(server);
// var socketEvents = require('./server/socket');
// socketEvents(io);