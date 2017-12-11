var fs = require('fs');
var modbus = require('jsmodbus');
var PubNub = require('pubnub');

try{
  var secPubNub=0;
var Fillerct = null,
    Fillerresults = null,
    CntInFiller = null,
    CntOutFiller = null,
    Filleractual = 0,
    Fillertime = 0,
    Fillersec = 0,
    FillerflagStopped = false,
    Fillerstate = 0,
    Fillerspeed = 0,
    FillerspeedTemp = 0,
    FillerflagPrint = 0,
    FillersecStop = 0,
    FillerONS = false,
    FillertimeStop = 60, //NOTE: Timestop
    FillerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    FillerflagRunning = false;
var PBoxFormerct = null,
    PBoxFormerresults = null,
    CntInPBoxFormer = null,
    CntOutPBoxFormer = null,
    PBoxFormeractual = 0,
    PBoxFormertime = 0,
    PBoxFormersec = 0,
    PBoxFormerflagStopped = false,
    PBoxFormerstate = 0,
    PBoxFormerspeed = 0,
    PBoxFormerspeedTemp = 0,
    PBoxFormerflagPrint = 0,
    PBoxFormersecStop = 0,
    PBoxFormerONS = false,
    PBoxFormertimeStop = 60, //NOTE: Timestop
    PBoxFormerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    PBoxFormerflagRunning = false;
var Grouperct = null,
    Grouperresults = null,
    CntInGrouper = null,
    CntOutGrouper = null,
    Grouperactual = 0,
    Groupertime = 0,
    Groupersec = 0,
    GrouperflagStopped = false,
    Grouperstate = 0,
    Grouperspeed = 0,
    GrouperspeedTemp = 0,
    GrouperflagPrint = 0,
    GroupersecStop = 0,
    GrouperONS = false,
    GroupertimeStop = 60, //NOTE: Timestop
    GrouperWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    GrouperflagRunning = false;
var SBoxFormerct = null,
    SBoxFormerresults = null,
    CntInSBoxFormer = null,
    CntOutSBoxFormer = null,
    SBoxFormeractual = 0,
    SBoxFormertime = 0,
    SBoxFormersec = 0,
    SBoxFormerflagStopped = false,
    SBoxFormerstate = 0,
    SBoxFormerspeed = 0,
    SBoxFormerspeedTemp = 0,
    SBoxFormerflagPrint = 0,
    SBoxFormersecStop = 0,
    SBoxFormerONS = false,
    SBoxFormertimeStop = 60, //NOTE: Timestop
    SBoxFormerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    SBoxFormerflagRunning = false;
var CasePackerct = null,
    CasePackerresults = null,
    CntInCasePackerBox = null,
    CntInCasePackerCarton = null,
    CntOutCasePacker = null,
    CasePackeractual = 0,
    CasePackertime = 0,
    CasePackersec = 0,
    CasePackerflagStopped = false,
    CasePackerstate = 0,
    CasePackerspeed = 0,
    CasePackerspeedTemp = 0,
    CasePackerflagPrint = 0,
    CasePackersecStop = 0,
    CasePackerONS = false,
    CasePackertimeStop = 60, //NOTE: Timestop
    CasePackerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    CasePackerflagRunning = false;
var CntOutEOL=null,
    secEOL=0;
var id1,id2,id3;
var files = fs.readdirSync("C:/PULSE/L1_LOGS/"); //Leer documentos
var text2send=[];//Vector a enviar
var i = 0;
  var publishConfig;


  var pubnub = new PubNub({
    publishKey : "pub-c-8d024e5b-23bc-4ce8-ab68-b39b00347dfb",
    subscribeKey : "sub-c-c3b3aa54-b44b-11e7-895e-c6a8ff6a3d85",
    uuid : "ler01-0000-1234"
  });


    var senderData = function (){
        pubnub.publish(publishConfig, function(status, response) {
      });
    };
  }catch(err){
        fs.appendFileSync("error_declarations.log",err + '\n');
    }

try{
var client1 = modbus.client.tcp.complete({
  'host': "192.168.10.93",
  'port': 502,
  'autoReconnect': true,
  'timeout': 60000,
  'logEnabled': true,
  'reconnectTimeout' : 30000
});
var client2 = modbus.client.tcp.complete({
  'host': "192.168.10.94",
  'port': 502,
  'autoReconnect': true,
  'timeout': 60000,
  'logEnabled': true,
  'reconnectTimeout' : 30000
});
var client3 = modbus.client.tcp.complete({
  'host': "192.168.10.95",
  'port': 502,
  'autoReconnect': true,
  'timeout': 60000,
  'logEnabled': true,
  'reconnectTimeout' : 30000
});

try{
  client1.connect();
  client2.connect();
  client3.connect();
}catch(error){
    fs.appendFileSync("error_l1.log",error + '\n');
}



  var joinWord=function(num1, num2) {
    var bits = "00000000000000000000000000000000";
    var bin1 = num1.toString(2),
      bin2 = num2.toString(2),
      newNum = bits.split("");

    for (i = 0; i < bin1.length; i++) {
      newNum[31 - i] = bin1[(bin1.length - 1) - i];
    }
    for (i = 0; i < bin2.length; i++) {
      newNum[15 - i] = bin2[(bin2.length - 1) - i];
    }
    bits = newNum.join("");
    return parseInt(bits, 2);
  };
  var idle=function(){
    i=0;
    text2send=[];
    for (var k=0;k<files.length;k++){//Verificar los archivos
      var stats = fs.statSync("C:/PULSE/L1_LOGS/"+files[k]);
      var mtime = new Date(stats.mtime).getTime();
      if (mtime< (Date.now() - (15*60*1000))&&files[k].indexOf("serialbox")==-1){
        text2send[i]=files[k];
        i++;
      }
    }
  };
//PubNub --------------------------------------------------------------------------------------------------------------------
    setInterval(function(){
      if(secPubNub>=60*5){
          idle();
          secPubNub=0;
          publishConfig = {
            channel : "Lerma_Monitor",
            message : {
                  line: "1",
                  tt: Date.now(),
                  machines:text2send

                }
          };
          senderData();
        }
        secPubNub++;},1000);
//PubNub --------------------------------------------------------------------------------------------------------------------


client1.on('connect', function(err) {
    id1=setInterval(function(){
        client1.readHoldingRegisters(0, 16).then(function(resp) {
          CntInFiller = joinWord(resp.register[0], resp.register[1])*8;
          CntInPBoxFormer = (joinWord(resp.register[2], resp.register[3]) + joinWord(resp.register[4], resp.register[5]) + joinWord(resp.register[6], resp.register[7]) + joinWord(resp.register[8], resp.register[9]))*2;
          CntOutFiller = CntInPBoxFormer;
          CntOutPBoxFormer = Math.floor(CntInPBoxFormer/2);
        //------------------------------------------Filler----------------------------------------------
              Fillerct = CntOutFiller // NOTE: igualar al contador de salida
              if (!FillerONS && Fillerct) {
                FillerspeedTemp = Fillerct
                Fillersec = Date.now()
                FillerONS = true
                Fillertime = Date.now()
              }
              if(Fillerct > Filleractual){
                if(FillerflagStopped){
                  Fillerspeed = Fillerct - FillerspeedTemp
                  FillerspeedTemp = Fillerct
                  Fillersec = Date.now()
                  Fillertime = Date.now()
                }
                FillersecStop = 0
                Fillerstate = 1
                FillerflagStopped = false
                FillerflagRunning = true
              } else if( Fillerct == Filleractual ){
                if(FillersecStop == 0){
                  Fillertime = Date.now()
                  FillersecStop = Date.now()
                }
                if( ( Date.now() - ( FillertimeStop * 1000 ) ) >= FillersecStop ){
                  Fillerspeed = 0
                  Fillerstate = 2
                  FillerspeedTemp = Fillerct
                  FillerflagStopped = true
                  FillerflagRunning = false
                  FillerflagPrint = 1
                }
              }
              Filleractual = Fillerct
              if(Date.now() - 60000 * FillerWorktime >= Fillersec && FillersecStop == 0){
                if(FillerflagRunning && Fillerct){
                  FillerflagPrint = 1
                  FillersecStop = 0
                  Fillerspeed = Fillerct - FillerspeedTemp
                  FillerspeedTemp = Fillerct
                  Fillersec = Date.now()
                }
              }
              Fillerresults = {
                ST: Fillerstate,
                CPQI : CntInFiller,
                CPQO : CntOutFiller,
                SP: Fillerspeed
              }
              if (FillerflagPrint == 1) {
                for (var key in Fillerresults) {
                  if( Fillerresults[key] != null && ! isNaN(Fillerresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L1_LOGS/mex_ler_Filler_l1.log', 'tt=' + Fillertime + ',var=' + key + ',val=' + Fillerresults[key] + '\n')
                }
                FillerflagPrint = 0
                FillersecStop = 0
                Fillertime = Date.now()
              }
        //------------------------------------------Filler----------------------------------------------
        });//Cierre de lectura

      },1000);
  });//Cierre de cliente

      client1.on('error', function(err) {
        clearInterval(id1);
      });
      client1.on('close', function() {
        clearInterval(id1);
      });



client2.on('connect', function(err) {
          id2=setInterval(function(){


              client2.readHoldingRegisters(0, 16).then(function(resp) {
                CntInGrouper = joinWord(resp.register[0], resp.register[1]) + joinWord(resp.register[2], resp.register[3]) + joinWord(resp.register[6], resp.register[7]) + joinWord(resp.register[10], resp.register[11]);
                CntOutPBoxFormer = CntInGrouper;
        //------------------------------------------PBoxFormer----------------------------------------------
              PBoxFormerct = CntOutPBoxFormer // NOTE: igualar al contador de salida
              if (!PBoxFormerONS && PBoxFormerct) {
                PBoxFormerspeedTemp = PBoxFormerct
                PBoxFormersec = Date.now()
                PBoxFormerONS = true
                PBoxFormertime = Date.now()
              }
              if(PBoxFormerct > PBoxFormeractual){
                if(PBoxFormerflagStopped){
                  PBoxFormerspeed = PBoxFormerct - PBoxFormerspeedTemp
                  PBoxFormerspeedTemp = PBoxFormerct
                  PBoxFormersec = Date.now()
                  PBoxFormertime = Date.now()
                }
                PBoxFormersecStop = 0
                PBoxFormerstate = 1
                PBoxFormerflagStopped = false
                PBoxFormerflagRunning = true
              } else if( PBoxFormerct == PBoxFormeractual ){
                if(PBoxFormersecStop == 0){
                  PBoxFormertime = Date.now()
                  PBoxFormersecStop = Date.now()
                }
                if( ( Date.now() - ( PBoxFormertimeStop * 1000 ) ) >= PBoxFormersecStop ){
                  PBoxFormerspeed = 0
                  PBoxFormerstate = 2
                  PBoxFormerspeedTemp = PBoxFormerct
                  PBoxFormerflagStopped = true
                  PBoxFormerflagRunning = false
                  PBoxFormerflagPrint = 1
                }
              }
              PBoxFormeractual = PBoxFormerct
              if(Date.now() - 60000 * PBoxFormerWorktime >= PBoxFormersec && PBoxFormersecStop == 0){
                if(PBoxFormerflagRunning && PBoxFormerct){
                  PBoxFormerflagPrint = 1
                  PBoxFormersecStop = 0
                  PBoxFormerspeed = PBoxFormerct - PBoxFormerspeedTemp
                  PBoxFormerspeedTemp = PBoxFormerct
                  PBoxFormersec = Date.now()
                }
              }
              PBoxFormerresults = {
                ST: PBoxFormerstate,
                CPQICB : CntInPBoxFormer,
                CPQO : CntOutPBoxFormer,
                SP: PBoxFormerspeed
              }
              if (PBoxFormerflagPrint == 1) {
                for (var key in PBoxFormerresults) {
                  if( PBoxFormerresults[key] != null && ! isNaN(PBoxFormerresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L1_LOGS/mex_ler_PBoxFormer_l1.log', 'tt=' + PBoxFormertime + ',var=' + key + ',val=' + PBoxFormerresults[key] + '\n')
                }
                PBoxFormerflagPrint = 0
                PBoxFormersecStop = 0
                PBoxFormertime = Date.now()
              }
        //------------------------------------------PBoxFormer----------------------------------------------
        //------------------------------------------Grouper----------------------------------------------
              Grouperct = CntInGrouper // NOTE: igualar al contador de salida
              if (!GrouperONS && Grouperct) {
                GrouperspeedTemp = Grouperct
                Groupersec = Date.now()
                GrouperONS = true
                Groupertime = Date.now()
              }
              if(Grouperct > Grouperactual){
                if(GrouperflagStopped){
                  Grouperspeed = Grouperct - GrouperspeedTemp
                  GrouperspeedTemp = Grouperct
                  Groupersec = Date.now()
                  Groupertime = Date.now()
                }
                GroupersecStop = 0
                Grouperstate = 1
                GrouperflagStopped = false
                GrouperflagRunning = true
              } else if( Grouperct == Grouperactual ){
                if(GroupersecStop == 0){
                  Groupertime = Date.now()
                  GroupersecStop = Date.now()
                }
                if( ( Date.now() - ( GroupertimeStop * 1000 ) ) >= GroupersecStop ){
                  Grouperspeed = 0
                  Grouperstate = 2
                  GrouperspeedTemp = Grouperct
                  GrouperflagStopped = true
                  GrouperflagRunning = false
                  GrouperflagPrint = 1
                }
              }
              Grouperactual = Grouperct
              if(Date.now() - 60000 * GrouperWorktime >= Groupersec && GroupersecStop == 0){
                if(GrouperflagRunning && Grouperct){
                  GrouperflagPrint = 1
                  GroupersecStop = 0
                  Grouperspeed = Grouperct - GrouperspeedTemp
                  GrouperspeedTemp = Grouperct
                  Groupersec = Date.now()
                }
              }
              Grouperresults = {
                ST: Grouperstate,
                CPQIBX : CntInGrouper,
                SP: Grouperspeed
              }
              if (GrouperflagPrint == 1) {
                for (var key in Grouperresults) {
                  if( Grouperresults[key] != null && ! isNaN(Grouperresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L1_LOGS/mex_ler_Grouper_l1.log', 'tt=' + Groupertime + ',var=' + key + ',val=' + Grouperresults[key] + '\n')
                }
                GrouperflagPrint = 0
                GroupersecStop = 0
                Groupertime = Date.now()
              }
        //------------------------------------------Grouper----------------------------------------------
              });//Cierre de lectura

            },1000);
        });//Cierre de cliente
            client2.on('error', function(err) {
              clearInterval(id2);
            });
            client2.on('close', function() {
              clearInterval(id2);
            });





  client3.on('connect', function(err) {
                id3=setInterval(function(){
                    client3.readHoldingRegisters(0, 16).then(function(resp) {
                      CntInCasePackerBox = joinWord(resp.register[2], resp.register[3]);
                      CntInCasePackerCarton = joinWord(resp.register[4], resp.register[5]);
                      CntOutCasePacker = Math.floor(joinWord(resp.register[6], resp.register[7])/1);
                      CntOutEOL = joinWord(resp.register[8], resp.register[9]);
                      CntInSBoxFormer = joinWord(resp.register[0], resp.register[1]);
                      CntOutSBoxFormer = CntInCasePackerBox;
        //------------------------------------------SBoxFormer----------------------------------------------
              SBoxFormerct = CntOutSBoxFormer // NOTE: igualar al contador de salida
              if (!SBoxFormerONS && SBoxFormerct) {
                SBoxFormerspeedTemp = SBoxFormerct
                SBoxFormersec = Date.now()
                SBoxFormerONS = true
                SBoxFormertime = Date.now()
              }
              if(SBoxFormerct > SBoxFormeractual){
                if(SBoxFormerflagStopped){
                  SBoxFormerspeed = SBoxFormerct - SBoxFormerspeedTemp
                  SBoxFormerspeedTemp = SBoxFormerct
                  SBoxFormersec = Date.now()
                  SBoxFormertime = Date.now()
                }
                SBoxFormersecStop = 0
                SBoxFormerstate = 1
                SBoxFormerflagStopped = false
                SBoxFormerflagRunning = true
              } else if( SBoxFormerct == SBoxFormeractual ){
                if(SBoxFormersecStop == 0){
                  SBoxFormertime = Date.now()
                  SBoxFormersecStop = Date.now()
                }
                if( ( Date.now() - ( SBoxFormertimeStop * 1000 ) ) >= SBoxFormersecStop ){
                  SBoxFormerspeed = 0
                  SBoxFormerstate = 2
                  SBoxFormerspeedTemp = SBoxFormerct
                  SBoxFormerflagStopped = true
                  SBoxFormerflagRunning = false
                  SBoxFormerflagPrint = 1
                }
              }
              SBoxFormeractual = SBoxFormerct
              if(Date.now() - 60000 * SBoxFormerWorktime >= SBoxFormersec && SBoxFormersecStop == 0){
                if(SBoxFormerflagRunning && SBoxFormerct){
                  SBoxFormerflagPrint = 1
                  SBoxFormersecStop = 0
                  SBoxFormerspeed = SBoxFormerct - SBoxFormerspeedTemp
                  SBoxFormerspeedTemp = SBoxFormerct
                  SBoxFormersec = Date.now()
                }
              }
              SBoxFormerresults = {
                ST: SBoxFormerstate,
                CPQI : CntInSBoxFormer,
                CPQO : CntOutSBoxFormer,
                SP: SBoxFormerspeed
              }
              if (SBoxFormerflagPrint == 1) {
                for (var key in SBoxFormerresults) {
                  if( SBoxFormerresults[key] != null && ! isNaN(SBoxFormerresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L1_LOGS/mex_ler_SBoxFormer_l1.log', 'tt=' + SBoxFormertime + ',var=' + key + ',val=' + SBoxFormerresults[key] + '\n')
                }
                SBoxFormerflagPrint = 0
                SBoxFormersecStop = 0
                SBoxFormertime = Date.now()
              }
        //------------------------------------------SBoxFormer----------------------------------------------
        //------------------------------------------CasePacker----------------------------------------------
              CasePackerct = CntOutCasePacker // NOTE: igualar al contador de salida
              if (!CasePackerONS && CasePackerct) {
                CasePackerspeedTemp = CasePackerct
                CasePackersec = Date.now()
                CasePackerONS = true
                CasePackertime = Date.now()
              }
              if(CasePackerct > CasePackeractual){
                if(CasePackerflagStopped){
                  CasePackerspeed = CasePackerct - CasePackerspeedTemp
                  CasePackerspeedTemp = CasePackerct
                  CasePackersec = Date.now()
                  CasePackertime = Date.now()
                }
                CasePackersecStop = 0
                CasePackerstate = 1
                CasePackerflagStopped = false
                CasePackerflagRunning = true
              } else if( CasePackerct == CasePackeractual ){
                if(CasePackersecStop == 0){
                  CasePackertime = Date.now()
                  CasePackersecStop = Date.now()
                }
                if( ( Date.now() - ( CasePackertimeStop * 1000 ) ) >= CasePackersecStop ){
                  CasePackerspeed = 0
                  CasePackerstate = 2
                  CasePackerspeedTemp = CasePackerct
                  CasePackerflagStopped = true
                  CasePackerflagRunning = false
                  CasePackerflagPrint = 1
                }
              }
              CasePackeractual = CasePackerct
              if(Date.now() - 60000 * CasePackerWorktime >= CasePackersec && CasePackersecStop == 0){
                if(CasePackerflagRunning && CasePackerct){
                  CasePackerflagPrint = 1
                  CasePackersecStop = 0
                  CasePackerspeed = CasePackerct - CasePackerspeedTemp
                  CasePackerspeedTemp = CasePackerct
                  CasePackersec = Date.now()
                }
              }
              CasePackerresults = {
                ST: CasePackerstate,
                CPQISBOX: CntInCasePackerBox,
                CPQICARTON: CntInCasePackerCarton,
                CPQO:  CntOutCasePacker,
                SP: CasePackerspeed
              }
              if (CasePackerflagPrint == 1) {
                for (var key in CasePackerresults) {
                  if( CasePackerresults[key] != null && ! isNaN(CasePackerresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L1_LOGS/mex_ler_CasePacker_l1.log', 'tt=' + CasePackertime + ',var=' + key + ',val=' + CasePackerresults[key] + '\n')
                }
                CasePackerflagPrint = 0
                CasePackersecStop = 0
                CasePackertime = Date.now()
              }
        //------------------------------------------CasePacker----------------------------------------------
        /*----------------------------------------------------------------------------------EOL----------------------------------------------------------------------------------*/
              if(secEOL>=60 && CntOutEOL){
                fs.appendFileSync("C:/PULSE/L1_LOGS/mex_ler_EOL_l1.log","tt="+Date.now()+",var=EOL"+",val="+CntOutEOL+"\n");
                secEOL=0;
              }else{
                secEOL++;
              }
        /*----------------------------------------------------------------------------------EOL----------------------------------------------------------------------------------*/


      });//Cierre de lectura

    },1000);
});//Cierre de cliente

    client3.on('error', function(err) {
        clearInterval(id3);
    });

    client3.on('clouse', function(err) {
      clearInterval(id3);

    });

}catch(err){
    fs.appendFileSync("error_l1.log",err + '\n');
}
