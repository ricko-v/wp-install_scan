const req = require("request");
const fs = require("fs");
const readline = require("readline");
const colors = require("colors");
const p = readline.createInterface({
 input: process.stdin,
 output: process.stdout
});

p.question("[+] Masukan path list : ", (path) => {
 fs.readFile(path,'utf-8', (e,d) => {
  let list = d.split("\n");
  let i = 1;
  let k = list.length-1;

  function cek(n){
   req.get("http://"+n+"/wp-admin/install.php", (err,res,body) => {
    if(!err){
     let str = body +"";
     let cek = str.search(`Installation</title>`);
     let ck = str.search("Installed");
     let la = str.search("Déjà installé");

     if(cek !== -1 && ck == -1 && la == -1){
      console.log("["+i+"/"+k+"] "+n+" ==> "+"vuln!!".green);
      fs.appendFile("install.txt",n+"/wp-admin/install.php\n", (er) => {
       if(er) throw er;
      });
      i++;
     }
     else {
      console.log("["+i+"/"+k+"] "+n+" ==> "+"not vuln!".red);
      i++;
     }
    }
    else {
     console.log("["+i+"/"+k+"] "+n+" ==> "+err.message.red);
     i++;
    }
    if(i == k){
     p.close();
    }
   });
  }
  for(b=0; b<list.length-1; b++){
   cek(list[b]);
  }
 });

});
