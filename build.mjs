import {Parcel} from '@parcel/core';
import campaigns from './active-campaigns.js'
import {copyLibFiles} from '@builder.io/partytown/utils'
import * as fs from 'fs'
/**
 * Build Script for Procuction
 */

let time = 0

// Clear old files
fs.rmdir('./web',function(){})

// Build each folder
campaigns.forEach( async (campaign) =>  {
   let bundler = new Parcel({
         entries: './public/'+ campaign + '/index.html',
         mode: "production",
         defaultConfig: '@parcel/config-default',  
         defaultTargetOptions : {
            distDir : './web/'+ campaign ,
            publicUrl: "/" + campaign + "/"
         }
      });
   
   try {
      let {bundleGraph, buildTime} = await bundler.run();
      inlineCssFile(campaign)
      console.log(`Built ${campaign} campaign having ${bundleGraph.getBundles().length} bundles  in ${buildTime}ms!`);
      time += buildTime
   } catch (err) {
      console.error(err);
      process.exit(1);
   }
})

async function inlineCssFile(campaign){
   let cssFile = ""
   let htmlFile = ""
   fs.readdirSync('./web/'+ campaign ).forEach(file=>{
      if(file.endsWith(".css")){
         cssFile = file
      } else if (file.endsWith(".html")){
         htmlFile = file
      }
   })
   const minifiedCss = fs.readFileSync('./web/'+ campaign +"/"+cssFile,'utf-8');
   let minifiedHtlm = fs.readFileSync('./web/'+ campaign +"/"+htmlFile,'utf-8');
   minifiedHtlm = minifiedHtlm.replace('<link rel="stylesheet" href="/'+campaign+'/'+cssFile+'">',"<style>"+minifiedCss+"</style>")
   fs.writeFile('./web/'+ campaign +"/"+htmlFile,minifiedHtlm,()=>{})
}
/** 
 *  partytown.js
 *  forward any JS scripts to a seperate webworker
 * */
async function partyTownSetup() {
   try {
      console.log('Preparing PartyTown!')
      await copyLibFiles("./web/~partytown");
   } catch (err) {
      console.error(err);
      process.exit(1);
   }
}

partyTownSetup();