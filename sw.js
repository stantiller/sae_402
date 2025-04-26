/******************
	Pour mieux comprendre ce script, voir : https://css-tricks.com/serviceworker-for-offline/
*******************/

var version = 'v1:0:1';

self.addEventListener("install", function(event) {
	self.skipWaiting();
	event.waitUntil(
	caches.open(version + 'fundamentals')
      .then(function(cache) {
        return cache.addAll([
          '/',
          'index.html',
		  'jeux/jeu1.html',
		  'jeux/jeu2.html',
		  'jeux/jeu3.html',
          'manifest.json',

		  'js/main.js',
		  'js/jeu1.js',
		  'js/jeu2.js',
		  'js/jeu3.js',

		  'styles/style.css',
		  'styles/styleJeu1.css',
		  'styles/styleJeu2.css',
		  'styles/styleJeu3.css',

		  'img/game2/24968.jpg',
		  'img/game2/bullet_sprite_sheet.png',
		  'img/game2/enemy1.png',
		  'img/game2/sprite.png',

		  'img/game3/spirte/sprite.png',
		  'img/game3/background.jpg',
		  'img/game3/collision.jpg',
		  'img/game3/tableau1.jpg',
		  'img/game3/tableau2.jpg',
		  'img/game3/tableau3.jpg',
		  'img/game3/tableau4.jpg',
		  'img/game3/tableaux.png',

		  'img/siteImg/fondaccueil.jpg',
		  'img/siteImg/fondbanc.jpg',
		  'img/siteImg/fondmussée.jpg',
		  'img/siteImg/fondportail.jpg',
		  'img/siteImg/player.png',
		  'img/siteImg/staff.png',
		  'img/siteImg/thief.png',

		  'sounds/game2/damage00.wav',
		  'sounds/game2/pldead00.wav',
		  'sounds/game2/tan02.wav',

		  'sounds/game3/artpiece.mp3',
		  'sounds/game3/colission.mp3',
		  'sounds/game3/depot.mp3',
		  'sounds/game3/pas.mp3',
		  'sounds/game3/rigth.mp3',
		  'sounds/game3/tableau1.mp3',
		  'sounds/game3/tableau2.mp3',
		  'sounds/game3/tableau3.mp3',
		  'sounds/game3/tableau4.mp3',
		  'sounds/game3/wrong.mp3',
		  'sounds/game3/reward.mp3',
		  'sounds/game3/victory.mp3'
        ]);
      })
	);
});

self.addEventListener("fetch", function(event) {
  if (event.request.url.indexOf('http') === 0 && event.request.method == 'GET') {
	  event.respondWith(
		caches
		  .match(event.request)
		  .then(function(cached) {
			var networked = fetch(event.request)
			  .then(fetchedFromNetwork, unableToResolve)
			  .catch(unableToResolve);
			return cached || networked;

			function fetchedFromNetwork(response) {
			  var cacheCopy = response.clone();
			  caches.open(version + 'pages')
					.then(function add(cache) {
						cache.put(event.request, cacheCopy);
					});
			  return response;
			}

			function unableToResolve () {
			 
			  return new Response("<h1>Cette ressource n'est pas disponible hors ligne</h1>", {
				status: 503,
				statusText: 'Service Unavailable',
				headers: new Headers({
				  'Content-Type': 'text/html'
				})
			  });
			}
		  })
	  );
  }
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) {
              return !key.startsWith(version);
            })
            .map(function (key) {
              return caches.delete(key);
            })
        );
      })
  );
});