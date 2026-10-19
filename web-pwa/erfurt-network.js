'use strict';
// Regular network and published construction timetable, verified 2026-10-19.
// Coordinates are schematic; the default two-minute running times are simulation values.
const ERFURT_NETWORK = (() => {
 const split = s => s.split('|');
 const north = split('Europaplatz|Thüringen-Park|Straße der Nationen|Warschauer Straße');
 const rieth = split('Berliner Straße|Vilniuser Straße|Rieth|Mainzer Straße|Mittelhäuser Straße');
 const east = split('Salinenstraße|Ilversgehofener Platz|Wendenstraße|Lutherkirche/SWE|Boyneburgufer|Augustinerkloster|Stadtmuseum/Kaisersaal|Anger');
 const west = split('Riethstraße|Klinikum|Universität|Baumerstraße|Bergstraße|Webergasse/Andreaskirche|Domplatz Nord|Fischmarkt/Rathaus|Anger');
 const south = split('Hauptbahnhof|Robert-Koch-Straße|Tschaikowskistraße|Stadion Ost|Am Schwemmbach|Sozialversicherungszentrum|Blücherstraße|Abzweig Wiesenhügel');
 const airport = split('Bindersleben|Büropark AIRFURT|Flughafen/Airport|Orionstraße|Volkenroder Weg|Am Kreuzchen|Hauptfriedhof|Nibelungenweg|Gamstädter Weg|Bundesarbeitsgericht|Justizzentrum|Gothaer Platz|S-Finanzzentrum|Gorkistraße|Brühler Garten|Karl-Marx-Platz|Hirschgarten|Anger|Krämpfertor|Leipziger Platz|Hanseplatz/FH|Greifswalder Straße|Krämpfer Gärten|Bautzener Weg|Marcel-Breuer-Ring|Wagenfeldstraße|Ringelberg');
 const lines = [
  {line:'1',color:'#d83b48',stops:[...north,...rieth,...east,'Hauptbahnhof','Kaffeetrichter','Landtag/Stadion Nord','Humboldtstraße','Thüringenhalle']},
  {line:'2',color:'#bb7620',stops:[...split('P+R-Platz Messe|Messe|mdr/Kinderkanal|egapark|Gothaer Platz|S-Finanzzentrum|Theater|Domplatz Süd|Fischmarkt/Rathaus|Anger'),...south,'Färberwaidweg','Wiesenhügel']},
  {line:'3',color:'#236cca',stops:[...north,...west,...south,...split('Melchendorf|Melchendorfer Markt|Drosselberg|Katholisches Krankenhaus|Windischholzhausen/X-FAB|Urbicher Kreuz')]},
  {line:'4',color:'#8c4cba',stops:airport},
  {line:'5',color:'#d44889',stops:[...split('Zoopark|Roter Berg|August-Frölich-Straße|Bunsenstraße|An der Lache|Grubenstraße'),...east,'Hauptbahnhof']},
  {line:'6',color:'#228453',stops:['Rieth','Vilniuser Straße','Berliner Straße',...west,'Hauptbahnhof','Kaffeetrichter','Puschkinstraße','Hochheimer Straße','Steigerstraße']}
 ];
 const positions = {};
 const chain = (names,x,y,dx,dy) => names.forEach((n,i)=>positions[n]={x:x+i*dx,y:y+i*dy});
 chain(north,300,35,0,32);
 chain(rieth,380,150,20,32);
 chain(west.slice(0,-1),235,180,18,32);
 chain(east,480,310,0,32);
 positions.Anger={x:480,y:566};
 chain(south,510,620,29,29);
 chain(split('Färberwaidweg|Wiesenhügel'),700,900,0,35);
 chain(split('Melchendorf|Melchendorfer Markt|Drosselberg|Katholisches Krankenhaus|Windischholzhausen/X-FAB|Urbicher Kreuz'),790,850,0,33);
 chain(lines[4].stops.slice(0,6),640,80,0,35);
 chain(split('Kaffeetrichter|Landtag/Stadion Nord|Humboldtstraße|Thüringenhalle'),420,690,0,38);
 chain(split('Puschkinstraße|Hochheimer Straße|Steigerstraße'),290,780,0,40);
 positions.Milchinselstraße={x:240,y:820};positions.Löberwallgraben={x:560,y:660};
 chain(airport.slice(0,13),40,150,0,31);
 chain(split('Gorkistraße|Brühler Garten|Karl-Marx-Platz|Hirschgarten'),130,550,80,5);
 chain(airport.slice(18),600,540,37,-32);
 chain(split('P+R-Platz Messe|Messe|mdr/Kinderkanal|egapark'),70,820,0,-50);
 chain(split('Theater|Domplatz Süd'),180,510,80,-25);
 positions['Angerbrunnen']={x:400,y:610};positions['Lange Brücke']={x:260,y:610};
 positions['Walter-Gropius-Schule']={x:100,y:355};
 const routes={};
 for(const l of lines){
  const forward=l.stops;
  let backward=[...forward].reverse();
  if(l.line==='4'){
   const a=backward.indexOf('Anger');backward.splice(a+1,2,'Angerbrunnen','Lange Brücke');
   backward.splice(backward.indexOf('Hauptfriedhof'),0,'Walter-Gropius-Schule');
  }
  if(l.line==='5')backward.unshift('Löberwallgraben');
  if(l.line==='6')backward[1]='Milchinselstraße';
  for(const [suffix,stops,reverse] of [['H',forward,'R'],['R',backward,'H']]){
   routes['EF'+l.line+suffix]={line:l.line,color:l.color,name:stops[0]+' → '+stops.at(-1),stops,reverse:'EF'+l.line+reverse,official:true,source:'https://www.evag-erfurt.de/evag/haltestellenfahrplaene?linie='+l.line};
  }
 }
 const constructionRoutes={};
 const constructionSource='https://www.evag-erfurt.de/evag/warschauer%2Bstrasse';
 const addConstruction=(line,forward,backward)=>{
  for(const [suffix,stops,reverse]of [['H',forward,'R'],['R',backward,'H']]){
   constructionRoutes['EF'+line+'B'+suffix]={...routes['EF'+line+suffix],stops,name:stops[0]+' → '+stops.at(-1)+' · Baufahrplan',reverse:'EF'+line+'B'+reverse,source:constructionSource,serviceLabel:'Baufahrplan 09.–26.10.2026'};
  }
 };
 const line1=routes.EF1H.stops.slice(routes.EF1H.stops.indexOf('Rieth'));
 addConstruction('1',line1,[...line1].reverse());
 const line6=[...north,...routes.EF6H.stops.slice(3)];
 const line6Back=[...line6].reverse();line6Back[1]='Milchinselstraße';
 addConstruction('6',line6,line6Back);
 // Each mode has both directions. Reverse-only stops are part of the graph too.
 const serviceRoutes={...routes,EF1H:constructionRoutes.EF1BH,EF1R:constructionRoutes.EF1BR,EF6H:constructionRoutes.EF6BH,EF6R:constructionRoutes.EF6BR};
 return {routes,positions,constructionRoutes,serviceRoutes,verifiedOn:'19.10.2026'};
})();
