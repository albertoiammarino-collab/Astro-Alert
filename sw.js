var V='astroalert-v1';
var SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(SHELL);}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==V;}).map(function(x){return caches.delete(x);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){
  var r=e.request;
  if(r.method!=='GET')return;
  var u=new URL(r.url);
  if(/open-meteo\.com|noaa\.gov/.test(u.hostname))return;
  if(r.mode==='navigate'){
    e.respondWith(fetch(r).then(function(res){var c=res.clone();caches.open(V).then(function(x){x.put('index.html',c);});return res;}).catch(function(){return caches.match('index.html');}));
    return;
  }
  e.respondWith(caches.match(r).then(function(hit){
    var net=fetch(r).then(function(res){if(res&&(res.ok||res.type==='opaque')){var c=res.clone();caches.open(V).then(function(x){x.put(r,c);});}return res;}).catch(function(){return hit;});
    return hit||net;
  }));
});
