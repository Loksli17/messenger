const User = require('./../models/UserModel');

function getUniq(users,findedUsers){
    let finded = false;
    for (let i = 0; i < findedUsers.length; i++){
        finded = false;
        for(let j = 0; j < users.length; j++){
            if (users[j]._id+'' == findedUsers[i]._id+''){
                finded = true;
                break;
            }
        }
        if (finded == false){
            users.push(findedUsers[i]);
        }
    }
}

exports.index = async function(req,res){
    let users = [];
    let ages  = [];
    let curDate = new Date();
    let maxDate =  await User.find({}).sort({dateBorn : -1}).limit(1);
    let minDate =  await User.find({}).sort({dateBorn :  1}).limit(1);

    for (let i = minDate[0].dateBorn.getFullYear() ; i < maxDate[0].dateBorn.getFullYear() + 2 ; i ++){
        ages.push(curDate.getFullYear() - i);
    }

    res.render('search/index',{
        ages : ages,
    });
}

exports.actionIndex = async function(req,res){
  let users   = [];
  let ages    = [];
  let body    = req.body;
  let curDate =  new Date();
  let maxDate =  await User.find({}).sort({dateBorn : -1}).limit(1);
  let minDate =  await User.find({}).sort({dateBorn :  1}).limit(1);
  let findedUsers = [];

  for (let i = minDate[0].dateBorn.getFullYear() ; i < maxDate[0].dateBorn.getFullYear() + 2 ; i ++){
      ages.push(curDate.getFullYear() - i);
  }

  if (body.param == undefined){
      if(body.userName.length != 0){
          users = await User.find({$or : [{"name.firstName" : body.userName} , {"name.secondName" : body.userName}] });
      }
      if(body.age != undefined){

          findedUsers =  await User.find({dateBorn : {$gte: curDate.getFullYear() - body.age - 1 + '-'+ (curDate.getMonth()+1)+'-'+curDate.getDate(),
           $lte : curDate.getFullYear() - body.age + '-'+ (curDate.getMonth()+1)+'-'+curDate.getDate()}});
          getUniq(users,findedUsers);

      }
  }else{
      users = await User.find({ $and : [
          {$or : [{"name.firstName" : body.userName} , {"name.secondName" : body.userName}] },
          {dateBorn : {$gte: curDate.getFullYear() - body.age - 1 + '-'+ (curDate.getMonth()+1)+'-'+curDate.getDate(),
           $lte : curDate.getFullYear() - body.age + '-'+ (curDate.getMonth()+1)+'-'+curDate.getDate()}}
      ]})
  }




  res.render('search/index',{
      users : users,
      ages  : ages,
  });
}
